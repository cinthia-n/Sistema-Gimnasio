import { useState, useRef } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { getErrorMessage } from '../../utils/getErrorMessage';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import TableToolbar from '../../components/table/TableToolbar';
import DataTable from '../../components/table/DataTable';
import FormDialog from '../../components/common/FormDialog';

import EnrollmentForm from './components/EnrollmentForm';

import { useCancelEnrollment } from "../../hooks/useCancelEnrollment";
import CancelActionDialog from "../../components/common/CancelActionDialog";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify"; // o useNotification, según cuál uses en este archivo

import type {
  EnrollmentFormRef,
} from './components/EnrollmentForm';

import {
  useEnrollments,
  useCreateEnrollment,
} from '../../hooks/useEnrollments';

export default function EnrollmentsPage() {
  const [search, setSearch] = useState('');

  const formRef =
    useRef<EnrollmentFormRef>(null);

  const [open, setOpen] =
    useState(false);

  const {
    data = [],
  } = useEnrollments();

  const { showSuccess, showError } = useNotification();


  const createEnrollment =
    useCreateEnrollment();

  //--------------------------------------------------
  // Registrar inscripción
  //--------------------------------------------------

  const handleRegister = async () => {
    const dto =
      formRef.current?.submit();

    if (!dto) {
      return;
    }

    try {
      await createEnrollment.mutateAsync(dto);
      showSuccess('Inscripción registrada correctamente');
      setOpen(false);
    } catch (error) {
      console.error('Error al registrar inscripción:', error);
      showError(getErrorMessage(error, 'Error al registrar la inscripción'));
    }
  }; 

  //--------------------------------------------------
  // Columnas
  //--------------------------------------------------

  const columns = [
    {
      field: 'membershipCode',
      headerName: 'Código',
    },

    {
      field: 'client',
      headerName: 'Cliente',
    },

    {
      field: 'service',
      headerName: 'Servicio / Promoción',
    },

    {
      field: 'startDate',
      headerName: 'Inicio',
    },

    {
      field: 'endDate',
      headerName: 'Fin',
    },

    {
      field: 'total',
      headerName: 'Total',
    },

    {
      field: 'paid',
      headerName: 'Pagado',
    },

    {
      field: 'balance',
      headerName: 'Saldo',
    },

    {
      field: 'status',
      headerName: 'Estado',
    },
  ];

  //--------------------------------------------------
  // Filtrar y preparar filas
  //--------------------------------------------------

  const normalizedSearch =
    search.trim().toLowerCase();

  const rows = data
    .map((item: any) => {
      /*
       * Una inscripción puede ser:
       *
       * 1. Servicio
       *    service != null
       *    promotion == null
       *
       * 2. Promoción
       *    service == null
       *    promotion != null
       */

      const serviceName =
        item.service?.name ??
        item.promotion?.name ??
        'Sin servicio / promoción';

      const clientName =
        item.client?.fullName ??
        'Cliente no disponible';

      return {

        id: item.id,
        membershipCode:
          item.membershipCode,

        client:
          clientName,

        service:
          serviceName,

        startDate:
          item.startDate
            ? new Date(
                item.startDate,
              ).toLocaleDateString()
            : '-',

        endDate:
          item.endDate
            ? new Date(
                item.endDate,
              ).toLocaleDateString()
            : '-',

        total:
          `Bs ${Number(
            item.finalPrice ?? 0,
          ).toFixed(2)}`,

        paid:
          `Bs ${Number(
            item.paidAmount ?? 0,
          ).toFixed(2)}`,

        balance:
          `Bs ${Number(
            item.balanceDue ?? 0,
          ).toFixed(2)}`,

        status: (
          <Chip
            label={
              item.status === 'CANCELLED'
                ? 'Anulada'
                : Number(item.balanceDue ?? 0) === 0
                    ? 'Pagado'
                    : 'Saldo pendiente'
            }
            color={
              item.status === 'CANCELLED'
                ? 'default'
                : Number(item.balanceDue ?? 0) === 0
                    ? 'success'
                    : 'warning'
            }
            size="small"
          />
        ),
      };
    })
    .filter((row: any) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        String(
          row.membershipCode,
        )
          .toLowerCase()
          .includes(normalizedSearch) ||

        String(
          row.client,
        )
          .toLowerCase()
          .includes(normalizedSearch) ||

        String(
          row.service,
        )
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const cancelEnrollment = useCancelEnrollment();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [enrollmentToCancel, setEnrollmentToCancel] = useState<number | null>(null);

  const handleCancelEnrollment = async (reason: string) => {

    if (!enrollmentToCancel) return;

    try {

        await cancelEnrollment.mutateAsync({ id: enrollmentToCancel, reason });

        toast.success("Inscripción anulada correctamente");

        setCancelDialogOpen(false);
        setEnrollmentToCancel(null);

    } catch (error) {

        console.error(error);
        toast.error(getErrorMessage(error, "No se pudo anular la inscripción"));

    }

  }; 
  
  const canCancel = (enrollment: any) => {

    if (isAdmin) return true;

    const registeredByUser = enrollment.payments?.some(
        (p: any) => p.userId === user?.id,
    );

    if (!registeredByUser) return false;

    const created = new Date(enrollment.createdAt);
    const today = new Date();

    return (
        created.getFullYear() === today.getFullYear() &&
        created.getMonth() === today.getMonth() &&
        created.getDate() === today.getDate()
    );
  };
  //--------------------------------------------------
  // Render
  //--------------------------------------------------

  return (
    <>
      <Typography
        variant="h4"
        mb={3}
      >
        Inscripciones
      </Typography>

      <TableToolbar
        title="inscripciones"
        search={search}
        onSearchChange={setSearch}
        onNew={() => setOpen(true)}
      />

      <DataTable
        columns={columns}
        rows={rows}
        onCancel={(row: any) => {

            const enrollment = data.find((e: any) => e.id === row.id);

            if (enrollment?.status === 'CANCELLED') {
                showError("Esta inscripción ya fue anulada");
                return;
            }

            if (!canCancel(enrollment)) {
                showError("Solo puede anular inscripciones que usted registró el día de hoy");
                return;
            }

            setEnrollmentToCancel(row.id);
            setCancelDialogOpen(true);
        }}
      />

      <FormDialog
        open={open}
        title="Nueva Inscripción"
        onClose={() => setOpen(false)}
        onSave={handleRegister}
      >
        <EnrollmentForm
          ref={formRef}
        />
      </FormDialog>

      <CancelActionDialog
        open={cancelDialogOpen}
        title={`Anular Inscripción`}
        description="Esta acción revertirá los pagos registrados para esta inscripción."
        onClose={() => {
            setCancelDialogOpen(false);
            setEnrollmentToCancel(null);
        }}
        onConfirm={handleCancelEnrollment}
      />
    </>
  );
}


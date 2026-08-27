
import { useState, useRef } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { getErrorMessage } from '../../utils/getErrorMessage';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import TableToolbar from '../../components/table/TableToolbar';
import DataTable from '../../components/table/DataTable';
import FormDialog from '../../components/common/FormDialog';

import EnrollmentForm from './components/EnrollmentForm';

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
              Number(
                item.balanceDue ?? 0,
              ) === 0
                ? 'Pagado'
                : 'Saldo pendiente'
            }
            color={
              Number(
                item.balanceDue ?? 0,
              ) === 0
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
    </>
  );
}


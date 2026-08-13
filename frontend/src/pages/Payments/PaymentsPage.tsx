import { useState } from 'react';

import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import TableToolbar from '../../components/table/TableToolbar';
import DataTable from '../../components/table/DataTable';
import FormDialog from '../../components/common/FormDialog';

import PaymentForm from './components/PaymentForm';

import { usePendingPayments } from '../../hooks/usePendingPayments';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentsPage() {
  //--------------------------------------------------
  // Estados
  //--------------------------------------------------

  const [search, setSearch] =
    useState('');

  const [open, setOpen] =
    useState(false);

  const queryClient =
    useQueryClient();

  //--------------------------------------------------
  // Pagos pendientes
  //--------------------------------------------------

  const {
    data = [],
  } = usePendingPayments();

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
      field: 'price',
      headerName: 'Precio',
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
  // Preparar filas
  //--------------------------------------------------

  const normalizedSearch =
    search.trim().toLowerCase();

  const rows = data
    .map((item: any) => {
      /*
       * Una inscripción puede corresponder
       * a un servicio o a una promoción.
       *
       * Servicio:
       *   service != null
       *   promotion == null
       *
       * Promoción:
       *   service == null
       *   promotion != null
       */

      const serviceOrPromotion =
        item.service?.name ??
        item.promotion?.name ??
        'Sin servicio / promoción';

      const clientName =
        item.client?.fullName ??
        'Cliente no disponible';

      const finalPrice =
        Number(
          item.finalPrice ?? 0,
        );

      const paidAmount =
        Number(
          item.paidAmount ?? 0,
        );

      const balanceDue =
        Number(
          item.balanceDue ?? 0,
        );

      return {
        id: item.id,

        membershipCode:
          item.membershipCode,

        client:
          clientName,

        service:
          serviceOrPromotion,

        price:
          `Bs ${finalPrice.toFixed(2)}`,

        paid:
          `Bs ${paidAmount.toFixed(2)}`,

        balance:
          `Bs ${balanceDue.toFixed(2)}`,

        status: (
          <Chip
            label={
              balanceDue > 0
                ? 'Pendiente'
                : 'Pagado'
            }
            color={
              balanceDue > 0
                ? 'warning'
                : 'success'
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
        Pagos
      </Typography>

      <TableToolbar
        title="Pagos"
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
        title="Registrar Pago"
        onClose={() => setOpen(false)}
        onSave={() => {}}
      >
        <PaymentForm
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: [
                'pending-payments',
              ],
            });

            setOpen(false);
          }}
        />
      </FormDialog>
    </>
  );
}


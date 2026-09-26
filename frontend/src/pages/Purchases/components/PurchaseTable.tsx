import DataTable from "../../../components/table/DataTable";
import Chip from "@mui/material/Chip";

interface Props {
  rows: any[];
  onView: (row: any) => void;
  onCancel?: (row: any) => void;
}

export default function PurchaseTable({
  rows,
  onView,
  onCancel,
}: Props) {

  const columns = [

    {
      field: "purchaseDate",
      headerName: "Fecha",
      render: (row: any) =>
        new Date(row.purchaseDate).toLocaleDateString(),
    },

    {
      field: "supplier",
      headerName: "Proveedor",
    },

    {
      field: "invoiceNumber",
      headerName: "Factura",
      render: (row: any) =>
        row.invoiceNumber || "-",
    },

    {
      field: "paymentMethod",
      headerName: "Pago",
    },

    {
      field: "total",
      headerName: "Total",
      render: (row: any) =>
        `Bs ${Number(row.total).toFixed(2)}`,
    },

    {
      field: "status",
      headerName: "Estado",
      render: (row: any) => (
        <Chip
          label={row.status === "CANCELLED" ? "Anulada" : "Activa"}
          color={row.status === "CANCELLED" ? "default" : "success"}
          size="small"
        />
      ),
    },

  ];

  return (

    <DataTable
      columns={columns}
      rows={rows}
      onView={onView}
      onCancel={onCancel}
    />

  );

}
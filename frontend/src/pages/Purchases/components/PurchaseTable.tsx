import DataTable from "../../../components/table/DataTable";

interface Props {

  rows: any[];

  onView: (row: any) => void;

}

export default function PurchaseTable({

  rows,

  onView,

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
      field: "view",
      headerName: "Detalle",

      render: (row: any) => (

        <button
          type="button"
          onClick={(e) => {

            e.preventDefault();

            e.stopPropagation();

            onView(row);

          }}
        >

          Ver

        </button>

      ),

    },

  ];

  return (

    <DataTable

      columns={columns}

      rows={rows}

    />

  );

}
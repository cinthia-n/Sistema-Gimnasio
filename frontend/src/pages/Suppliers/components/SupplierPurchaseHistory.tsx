import DataTable from "../../../components/table/DataTable";

interface Props {

    purchases: any[];

}

export default function SupplierPurchaseHistory({

    purchases,

}: Props) {

    const rows = purchases.map((purchase) => ({

        id: purchase.id,

        date: new Date(

            purchase.purchaseDate,

        ).toLocaleDateString(),

        invoice: purchase.invoiceNumber,

        paymentMethod: purchase.paymentMethod,

        total: `Bs ${Number(

            purchase.total,

        ).toFixed(2)}`,

    }));

    const columns = [

        {

            field: "date",

            headerName: "Fecha",

        },

        {

            field: "invoice",

            headerName: "Factura",

        },

        {

            field: "paymentMethod",

            headerName: "Pago",

        },

        {

            field: "total",

            headerName: "Total",

        },

    ];

    return (

        <DataTable

            columns={columns}

            rows={rows}

        />

    );

}
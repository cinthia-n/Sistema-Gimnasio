import DataTable from "../../../components/table/DataTable";

interface Props {

    rows: any[];

}

export default function CashMovementsTable({

    rows,

}: Props) {

    const columns = [

        {

            field: "movementDate",

            headerName: "Fecha",

        },

        {

            field: "type",

            headerName: "Tipo",

        },

        {

            field: "concept",

            headerName: "Concepto",

        },

        {

            field: "paymentMethod",

            headerName: "Método",

        },

        {

            field: "amount",

            headerName: "Monto",

        },

        {

            field: "user",

            headerName: "Usuario",

        },

    ];

    return (

        <DataTable

            columns={columns}

            rows={rows}

        />

    );

}
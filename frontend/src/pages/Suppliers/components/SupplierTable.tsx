import DataTable from "../../../components/table/DataTable";

interface Props {

    rows: any[];

    onView: (row: any) => void;

    onEdit: (row: any) => void;

}

export default function SupplierTable({

    rows,

    onView,

    onEdit,

}: Props) {

    const columns = [

        {

            field: "name",

            headerName: "Proveedor",

        },

        {

            field: "contactPerson",

            headerName: "Contacto",

        },

        {

            field: "phone",

            headerName: "Teléfono",

        },

        {

            field: "purchases",

            headerName: "Compras",

        },

        {

            field: "status",

            headerName: "Estado",

        },

    ];

    return (

        <DataTable

            columns={columns}

            rows={rows}

            onView={onView}

            onEdit={onEdit}

        />

    );

}
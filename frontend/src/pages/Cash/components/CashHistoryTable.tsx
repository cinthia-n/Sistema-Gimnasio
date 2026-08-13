import DataTable from "../../../components/table/DataTable";
import { Button } from "@mui/material";

interface Props {
    rows: any[];
    onView: (id: number) => void;
}

export default function CashHistoryTable({
    rows,
    onView,
}: Props) {

    const columns = [

        {
            field: "openingDate",
            headerName: "Apertura",
            flex: 1,
        },

        {
            field: "closingDate",
            headerName: "Cierre",
            flex: 1,
        },

        {
            field: "openingCash",
            headerName: "Caja inicial",
            flex: 1,
        },

        {
            field: "expectedCash",
            headerName: "Saldo esperado",
            flex: 1,
        },

        {
            field: "countedCash",
            headerName: "Dinero contado",
            flex: 1,
        },

        {
            field: "difference",
            headerName: "Diferencia",
            flex: 1,
        },

        {
            field: "status",
            headerName: "Estado",
            flex: 1,
        },

        {
            field: "openedBy",
            headerName: "Abrió",
            flex: 1,
        },

        {
            field: "closedBy",
            headerName: "Cerró",
            flex: 1,
        },

        {
            field: "actions",
            headerName: "Acciones",
            flex: 1,
            render: (row: any) => (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onView(row.id)}
                >
                    Ver
                </Button>
            ),
            
        },

    ];

    return (

        <DataTable
            rows={rows}
            columns={columns}
        />

    );

}
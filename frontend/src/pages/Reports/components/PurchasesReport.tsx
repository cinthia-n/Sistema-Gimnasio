import {
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

import DataTable from "../../../components/table/DataTable";

interface Props {
    data: any;
    loading: boolean;
}

export default function PurchasesReport({
    data,
    loading,
}: Props) {

    if (loading) return <Typography>Cargando...</Typography>;

    if (!data) return null;

    const columns = [

        {
            field: "date",
            headerName: "Fecha",
            flex: 1,
        },

        {
            field: "supplier",
            headerName: "Proveedor",
            flex: 2,
        },

        {
            field: "user",
            headerName: "Registrado por",
            flex: 2,
        },

        {
            field: "invoice",
            headerName: "Factura",
            flex: 1,
        },

        {
            field: "total",
            headerName: "Total",
            flex: 1,
        },

    ];

    const rows = data.purchases.map((purchase: any) => ({

        id: purchase.id,

        date: new Date(
            purchase.purchaseDate,
        ).toLocaleDateString(),

        supplier: purchase.supplier.name,

        user:
            purchase.createdBy?.fullName ?? "-",

        invoice:
            purchase.invoiceNumber ?? "-",

        total: Number(
            purchase.total,
        ),

    }));

    return (

        <>

            <Grid
                container
                spacing={2}
                mb={3}
            >

                <Grid size={6}>

                    <Card>

                        <CardContent>

                            <Typography variant="h6">

                                Total comprado

                            </Typography>

                            <Typography variant="h4">

                                Bs. {Number(data.total).toFixed(2)}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid size={6}>

                    <Card>

                        <CardContent>

                            <Typography variant="h6">

                                Compras realizadas

                            </Typography>

                            <Typography variant="h4">

                                {data.count}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            <DataTable

                rows={rows}

                columns={columns}

            />

        </>

    );

}
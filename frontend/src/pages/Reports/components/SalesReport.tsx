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

export default function SalesReport({

    data,
    loading,

}: Props) {

    if (loading) {

        return <Typography>Cargando...</Typography>;

    }

    if (!data) {

        return null;

    }

    const columns = [

        {
            field: "date",
            headerName: "Fecha",
            flex: 1,
        },

        {
            field: "client",
            headerName: "Cliente",
            flex: 2,
        },

        {
            field: "user",
            headerName: "Atendido por",
            flex: 2,
        },

        {
            field: "paymentMethod",
            headerName: "Pago",
            flex: 1,
        },

        {
            field: "total",
            headerName: "Total",
            flex: 1,
        },

    ];

    const rows = data.sales.map((sale: any) => ({

        id: sale.id,

        date: new Date(sale.saleDate)
            .toLocaleDateString(),

        client:
            sale.client?.fullName ??
            "Consumidor Final",

        user: sale.user.fullName,

        paymentMethod: sale.paymentMethod,

        total: Number(sale.total),

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

                            <Typography
                                variant="h6"
                            >

                                Total vendido

                            </Typography>

                            <Typography
                                variant="h4"
                            >

                                Bs. {Number(data.total).toFixed(2)}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid size={6}>

                    <Card>

                        <CardContent>

                            <Typography
                                variant="h6"
                            >

                                Ventas realizadas

                            </Typography>

                            <Typography
                                variant="h4"
                            >

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
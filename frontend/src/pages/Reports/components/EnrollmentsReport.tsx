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

export default function EnrollmentsReport({

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
            field: "service",
            headerName: "Servicio",
            flex: 2,
        },

        {
            field: "startDate",
            headerName: "Inicio",
            flex: 1,
        },

        {
            field: "endDate",
            headerName: "Vencimiento",
            flex: 1,
        },

        {
            field: "price",
            headerName: "Importe",
            flex: 1,
        },

    ];

    const rows = data.enrollments.map((item: any) => ({

        id: item.id,

        date: new Date(
            item.createdAt,
        ).toLocaleDateString(),

        client: item.client?.fullName ?? 'Cliente no registrado',

        service: item.service?.name ?? 'Servicio no especificado',

        startDate: new Date(
            item.startDate,
        ).toLocaleDateString(),

        endDate: new Date(
            item.endDate,
        ).toLocaleDateString(),

        price: Number(
            item.finalPrice,
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

                                Total recaudado

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

                                Inscripciones

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
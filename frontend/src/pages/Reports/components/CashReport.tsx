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

export default function CashReport({

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

            field: "concept",

            headerName: "Concepto",

            flex: 2,

        },

        {

            field: "type",

            headerName: "Tipo",

            flex: 1,

        },

        {

            field: "paymentMethod",

            headerName: "Método",

            flex: 1,

        },

        {

            field: "amount",

            headerName: "Monto",

            flex: 1,

        },

    ];

    const rows = data.movements.map((movement: any) => ({

        id: movement.id,

        date: new Date(

            movement.movementDate,

        ).toLocaleDateString(),

        concept: movement.concept,

        type: movement.type,

        paymentMethod:

            movement.paymentMethod ?? "-",

        amount: Number(

            movement.amount,

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

                                Ingresos

                            </Typography>

                            <Typography variant="h4">

                                Bs. {Number(data.income).toFixed(2)}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid size={6}>

                    <Card>

                        <CardContent>

                            <Typography variant="h6">

                                Egresos

                            </Typography>

                            <Typography variant="h4">

                                Bs. {Number(data.expense).toFixed(2)}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography variant="h5">

                        Saldo

                    </Typography>

                    <Typography variant="h3">

                        Bs. {Number(data.balance).toFixed(2)}

                    </Typography>

                </CardContent>

            </Card>

            <DataTable

                rows={rows}

                columns={columns}

            />

        </>

    );

}
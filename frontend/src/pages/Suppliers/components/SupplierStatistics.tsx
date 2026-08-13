import {
    Grid,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

interface Props {

    statistics: any;

}

export default function SupplierStatistics({

    statistics,

}: Props) {

    if (!statistics) return null;

    console.log("Statistics:", statistics);
    console.log("Last Purchase:", statistics.lastPurchase);

    return (

        <Grid container spacing={2} mb={3}>

            <Grid size={{ xs: 12, md: 3 }}>

                <Card>

                    <CardContent>

                        <Typography variant="subtitle2">

                            Compras

                        </Typography>

                        <Typography variant="h5">

                            {statistics.totalPurchases}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <Card>

                    <CardContent>

                        <Typography variant="subtitle2">

                            Total comprado

                        </Typography>

                        <Typography variant="h5">

                            Bs {(Number(statistics.totalAmount || 0)).toFixed(2)}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <Card>

                    <CardContent>

                        <Typography variant="subtitle2">

                            Promedio

                        </Typography>

                        <Typography variant="h5">

                            Bs {(Number(statistics.totalAmount || 0)).toFixed(2)}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <Card>

                    <CardContent>

                        <Typography variant="subtitle2">

                            Última compra

                        </Typography>

                        <Typography>
                            
                            {
                                
                                statistics.lastPurchase

                                    ? new Date(statistics.lastPurchase

                                                ).toLocaleDateString()

                                    : "-"

                            }

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>

    );

}
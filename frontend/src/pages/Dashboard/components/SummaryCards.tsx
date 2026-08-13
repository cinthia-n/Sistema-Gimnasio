import Grid from "@mui/material/Grid";

import DashboardCard from "./DashboardCard";

interface Props {

    cards: {

        activeClients: number;

        todayEnrollments: number;

        salesToday: {

            total: number;

            count: number;

        };

        purchasesToday: {

            total: number;

            count: number;

        };

    };

}

export default function SummaryCards({

    cards,

}: Props) {

    return (

        <Grid
            container
            spacing={2}
            mb={3}
        >

            <Grid size={{ xs: 12, md: 3 }}>

                <DashboardCard

                    title="Clientes activos"

                    value={cards.activeClients}

                />

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <DashboardCard

                    title="Inscripciones hoy"

                    value={cards.todayEnrollments}

                />

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <DashboardCard

                    title="Ventas hoy"

                    value={`Bs ${cards.salesToday.total}`}

                />

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <DashboardCard

                    title="Compras hoy"

                    value={`Bs ${cards.purchasesToday.total}`}

                />

            </Grid>

        </Grid>

    );

}
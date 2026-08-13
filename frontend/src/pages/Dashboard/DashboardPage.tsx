import Typography from "@mui/material/Typography";

import { useDashboard } from "../../hooks/useDashboard";

import SummaryCards from "./components/SummaryCards";

import Grid from "@mui/material/Grid";
import ExpiringMemberships from "./components/ExpiringMemberships";
import LowStockTable from "./components/LowStockTable";

export default function DashboardPage() {

    const {

        data,

        isLoading,

    } = useDashboard();

    if (isLoading) {

        return <Typography>Cargando...</Typography>;

    }

    return (

        <>

            <Typography
                variant="h4"
                mb={3}
            >

                Dashboard

            </Typography>

            <SummaryCards

                cards={data.cards}

            />

            <Grid
              container
              spacing={2}
            >

              <Grid
                size={{ xs: 12, md: 6 }}
              >

                <ExpiringMemberships

                  memberships={data.expiringMemberships}

                />

              </Grid>

              <Grid
                size={{ xs: 12, md: 6 }}
              >

                <LowStockTable

                  products={data.lowStockProducts}

                />

              </Grid>

            </Grid>

        </>

    );

}
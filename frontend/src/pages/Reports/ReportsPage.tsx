import { useState } from "react";

import {
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Tabs,
    Tab,
} from "@mui/material";

import { useSalesReport } from "../../hooks/useSalesReport";
import { usePurchasesReport } from "../../hooks/usePurchasesReport";
import { useEnrollmentsReport } from "../../hooks/useEnrollmentsReport";
import { useCashReport } from "../../hooks/useCashReport";
import SalesReport from "./components/SalesReport";
import PurchasesReport from "./components/PurchasesReport";
import EnrollmentsReport from "./components/EnrollmentsReport";
import CashReport from "./components/CashReport";

export default function ReportsPage() {

    const today = new Date();

    const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
    );

    const [filter, setFilter] = useState({

        startDate: firstDay
            .toISOString()
            .substring(0, 10),

        endDate: today
            .toISOString()
            .substring(0, 10),

    });

    const [searchFilter, setSearchFilter] =
        useState(filter);

    const [tab, setTab] = useState(0);

    //----------------------------------
    // Queries
    //----------------------------------

    const sales =
        useSalesReport(searchFilter);

    const purchases =
        usePurchasesReport(searchFilter);

    const enrollments =
        useEnrollmentsReport(searchFilter);

    const cash =
        useCashReport(searchFilter);

    //----------------------------------

    return (

        <>

            <Typography
                variant="h4"
                mb={3}
            >

                Reportes

            </Typography>

            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={4}>

                        <TextField

                            fullWidth

                            label="Desde"

                            type="date"

                            InputLabelProps={{
                                shrink: true,
                            }}

                            value={filter.startDate}

                            onChange={(e) =>

                                setFilter({

                                    ...filter,

                                    startDate:
                                        e.target.value,

                                })

                            }

                        />

                    </Grid>

                    <Grid size={4}>

                        <TextField

                            fullWidth

                            label="Hasta"

                            type="date"

                            InputLabelProps={{
                                shrink: true,
                            }}

                            value={filter.endDate}

                            onChange={(e) =>

                                setFilter({

                                    ...filter,

                                    endDate:
                                        e.target.value,

                                })

                            }

                        />

                    </Grid>

                    <Grid
                        size={4}
                        display="flex"
                        alignItems="center"
                    >

                        <Button

                            fullWidth

                            variant="contained"

                            onClick={() =>

                                setSearchFilter(
                                    filter,
                                )

                            }

                        >

                            Buscar

                        </Button>

                    </Grid>

                </Grid>

            </Paper>

            <Paper>

                <Tabs

                    value={tab}

                    onChange={(_, value) =>

                        setTab(value)

                    }

                >

                    <Tab label="Ventas" />

                    <Tab label="Compras" />

                    <Tab label="Inscripciones" />

                    <Tab label="Caja" />

                </Tabs>

                <Paper sx={{ mt: 3, p: 2 }}>

                    {tab === 0 && (

                        <SalesReport

                            data={sales.data}

                            loading={sales.isLoading}

                        />

                    )}

                    {tab === 1 && (

                        <PurchasesReport

                            data={purchases.data}

                            loading={purchases.isLoading}

                        />

                    )}

                    {tab === 2 && (

                        <EnrollmentsReport

                            data={enrollments.data}

                            loading={enrollments.isLoading}

                        />

                    )}

                    {tab === 3 && (

                        <CashReport

                            data={cash.data}

                            loading={cash.isLoading}

                        />

                    )}

                </Paper>

            </Paper>

        </>

    );

}
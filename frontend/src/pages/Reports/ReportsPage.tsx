import { useRef, useState } from "react";

import {
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Tabs,
    Tab,
    Box,
} from "@mui/material";

import { useSalesReport } from "../../hooks/useSalesReport";
import { usePurchasesReport } from "../../hooks/usePurchasesReport";
import { useEnrollmentsReport } from "../../hooks/useEnrollmentsReport";
import { useCashReport } from "../../hooks/useCashReport";
import SalesReport from "./components/SalesReport";
import PurchasesReport from "./components/PurchasesReport";
import EnrollmentsReport from "./components/EnrollmentsReport";
import CashReport from "./components/CashReport";

import { exportElementToPdf } from "../../utils/exportPdf";
import { useNotification } from "../../context/NotificationContext";
import { getErrorMessage } from "../../utils/getErrorMessage";

// Usa el MISMO logo que ya usa el reporte de cierre de caja
// (copia el import desde ese archivo y ajusta la ruta si es distinta)
import logo from "../../assets/logo/edra-logo.png";

const TAB_NAMES = ["Ventas", "Compras", "Inscripciones", "Caja"];

// "2026-09-28" -> "28/09/2026" (sin pasar por Date, para evitar
// el corrimiento de zona horaria)
const formatDate = (iso: string) => {
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
};

export default function ReportsPage() {

    const today = new Date();

    const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
    );

    const [filter, setFilter] = useState({
        startDate: firstDay.toISOString().substring(0, 10),
        endDate: today.toISOString().substring(0, 10),
    });

    const [searchFilter, setSearchFilter] = useState(filter);

    const [tab, setTab] = useState(0);

    const reportRef = useRef<HTMLDivElement>(null);

    const [exporting, setExporting] = useState(false);

    const { showError } = useNotification();

    //----------------------------------
    // Queries
    //----------------------------------

    const sales = useSalesReport(searchFilter);
    const purchases = usePurchasesReport(searchFilter);
    const enrollments = useEnrollmentsReport(searchFilter);
    const cash = useCashReport(searchFilter);

    //----------------------------------
    // Exportar PDF
    //----------------------------------

    const handleExport = async () => {

        if (!reportRef.current) return;

        try {

            setExporting(true);

            await exportElementToPdf(
                reportRef.current,
                `Reporte-${TAB_NAMES[tab]}-${searchFilter.startDate}_${searchFilter.endDate}`,
            );

        } catch (error) {

            console.error(error);
            showError(getErrorMessage(error, "No se pudo generar el PDF"));

        } finally {

            setExporting(false);

        }

    };

    //----------------------------------

    return (

        <>

            <Typography variant="h4" mb={3}>
                Reportes
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>

                <Grid container spacing={2}>

                    <Grid size={4}>
                        <TextField
                            fullWidth
                            label="Desde"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filter.startDate}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    startDate: e.target.value,
                                })
                            }
                        />
                    </Grid>

                    <Grid size={4}>
                        <TextField
                            fullWidth
                            label="Hasta"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filter.endDate}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    endDate: e.target.value,
                                })
                            }
                        />
                    </Grid>

                    <Grid size={4} display="flex" alignItems="center">
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setSearchFilter(filter)}
                        >
                            Buscar
                        </Button>
                    </Grid>

                </Grid>

            </Paper>

            <Paper>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    pr={2}
                >

                    <Tabs
                        value={tab}
                        onChange={(_, value) => setTab(value)}
                    >
                        {TAB_NAMES.map((name) => (
                            <Tab key={name} label={name} />
                        ))}
                    </Tabs>

                    <Button
                        variant="outlined"
                        onClick={handleExport}
                        disabled={exporting}
                    >
                        {exporting ? "Generando PDF..." : "Exportar PDF"}
                    </Button>

                </Box>

                <Paper
                    ref={reportRef}
                    elevation={0}
                    sx={{ mt: 3, p: 2 }}
                >

                    <Box textAlign="center" mb={3}>

                        <img
                            src={logo}
                            alt="EDRA Gym"
                            style={{ height: 70 }}
                        />

                        <Typography variant="h5" fontWeight="bold">
                            REPORTE DE {TAB_NAMES[tab].toUpperCase()}
                        </Typography>

                        <Typography color="text.secondary">
                            EDRA Gym
                        </Typography>

                        <Typography color="text.secondary">
                            Período: {formatDate(searchFilter.startDate)} al {formatDate(searchFilter.endDate)}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Generado el {new Date().toLocaleString()}
                        </Typography>

                    </Box>

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
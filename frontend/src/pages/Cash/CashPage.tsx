import Typography from "@mui/material/Typography";

import { useCashMovements } from "../../hooks/useCashMovements";

import CashMovementsTable from "./components/CashMovementsTable";

import { useState } from "react";
import CashDetailDialog from "./components/CashDetailDialog";

import {

    Button,

    Card,

    CardContent,

    Grid,

    Box

    
} from "@mui/material";

import FormDialog from "../../components/common/FormDialog";

import OpenCashForm from "./components/OpenCashForm";

import CloseCashForm from "./components/CloseCashForm";

import { useCashSummary } from "../../hooks/useCashSummary";

import { useOpenCash } from "../../hooks/useOpenCash";

import { useCloseCash } from "../../hooks/useCloseCash";

import { useCurrentCash } from "../../hooks/useCurrentCash";

import CashHistoryTable from "./components/CashHistoryTable";

import { useCashHistory } from "../../hooks/useCashHistory";
import { useCashHistoryDetail } from "../../hooks/useCashHistoryDetail";

export default function CashPage() {

    const {

        data = [],

    } = useCashMovements();

    const {
        data: history = [],
    } = useCashHistory();
    
    const [openDialog, setOpenDialog] = useState(false);

    const [closeDialog, setCloseDialog] = useState(false);

    const [opening, setOpening] =
        useState({

            openingCash: 0,

            observations: "",

        });

    const [closing, setClosing] =
        useState({

            countedCash: 0,

            observations: "",

        });
    
    const [selectedCashId, setSelectedCashId] =
        useState<number | null>(null);

    const [detailOpen, setDetailOpen] =
        useState(false);

    const {

        data: summary,

    } = useCashSummary();

    const {

        data: currentCash,

    } = useCurrentCash();

    const {

        data: detail,

    } = useCashHistoryDetail(

        selectedCashId ?? undefined,

    );

    const openCash = useOpenCash();

    const closeCash = useCloseCash();

    const income = data

        .filter((m: any) => m.type === "INCOME")

        .reduce(

            (sum: number, m: any) =>

                sum + Number(m.amount),

            0,

        );

    const expense = data

        .filter((m: any) => m.type === "EXPENSE")

        .reduce(

            (sum: number, m: any) =>

                sum + Number(m.amount),

            0,

        );

    const rows = data.map((m: any) => ({

        movementDate:

            new Date(

                m.movementDate,

            ).toLocaleString(),

        type:

            m.type === "INCOME"

                ? "Ingreso"

                : "Egreso",

        concept: m.concept,

        paymentMethod:

            m.paymentMethod ?? "-",

        amount:

            `Bs ${m.amount}`,

        user:

            m.createdBy.fullName,

    }));

    const historyRows = history.map((c: any) => ({

        id: c.id,

        openingDate: new Date(
            c.openingDate,
        ).toLocaleString(),

        closingDate: c.closingDate
            ? new Date(
                c.closingDate,
            ).toLocaleString()
            : "-",

        openingCash: `Bs ${c.openingCash}`,

        expectedCash: `Bs ${c.expectedCash}`,

        countedCash: c.countedCash
            ? `Bs ${c.countedCash}`
            : "-",

        difference: c.difference
            ? `Bs ${c.difference}`
            : "-",

        status:
            c.status === "OPEN"
                ? "Abierta"
                : "Cerrada",

        openedBy:
            c.openedBy?.fullName,

        closedBy:
            c.closedBy?.fullName ?? "-",

    }));

    const handleOpenCash =
        async () => {

            await openCash.mutateAsync({

             openingCash:

                opening.openingCash,

            observations:

                opening.observations,

            openedById: 1,

        });

        setOpenDialog(false);

    };

    const handleCloseCash =
    async () => {

        await closeCash.mutateAsync({

            countedCash:

                closing.countedCash,

            observations:

                closing.observations,

            closedById: 1,

        });

        setCloseDialog(false);

    };

    return (

        <>

            <Typography

                variant="h4"

                mb={3}

            >

                Caja

            </Typography>

            {currentCash ? (

                <Button

                    variant="contained"

                    color="error"

                    onClick={() =>

                        setCloseDialog(true)

                    }

                >

                        Cerrar Caja

                </Button>

                ) : (

                    <Button

                        variant="contained"

                        onClick={() =>

                        setOpenDialog(true)

                        }

                    >

                        Abrir Caja

                    </Button>

                )}

            <FormDialog

                open={openDialog}

                title="Abrir Caja"

                onClose={() =>

                setOpenDialog(false)

                }

                onSave={handleOpenCash}

            >

            <OpenCashForm

                    value={opening}

                    onChange={setOpening}

            />

            </FormDialog>

            <FormDialog

                open={closeDialog}

                title="Cerrar Caja"

                onClose={() =>

                    setCloseDialog(false)

                }

                onSave={handleCloseCash}

            >

                <CloseCashForm

                    expectedCash={

                        summary?.expectedCash ?? 0

                    }

                    value={closing}

                    onChange={setClosing}

                />

            </FormDialog>



            <Box
                mb={3}
            >
                <Typography
                    color={
                        currentCash
                            ? "success.main"
                            : "error.main"
                    }
                    fontWeight="bold"
                >

                    {

                        currentCash
                            ? "🟢 Caja abierta"
                            : "🔴 Caja cerrada"

                    }

                </Typography>

            </Box>

            
        <Grid container spacing={2} mb={3}>

            <Grid size={{ xs: 12, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography color="primary">
                            Caja inicial
                        </Typography>

                        <Typography variant="h5">
                            Bs {summary?.openingCash ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography color="success.main">
                             Membresías (Efectivo)
                        </Typography>

                        <Typography variant="h5">
                            Bs {summary?.membershipCash ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography color="success.main">
                            Ventas (Efectivo)
                        </Typography>

                        <Typography variant="h5">
                            Bs {summary?.salesCash ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography color="secondary">
                            Efectivo total
                        </Typography>

                        <Typography variant="h5">
                            Bs {summary?.totalCashIncome ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography color="primary">
                            Membresías (QR)
                        </Typography>

                        <Typography variant="h5">
                            Bs {summary?.membershipQr ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography color="primary">
                            Ventas (QR)
                        </Typography>

                        <Typography variant="h5">
                            Bs {summary?.salesQr ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography color="secondary">
                            QR total
                        </Typography>

                        <Typography variant="h5">
                            Bs {summary?.totalQrIncome ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography color="error.main">
                         Egresos
                        </Typography>

                        <Typography variant="h5">
                            Bs {summary?.expenses ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
                <Card>
                    <CardContent>

                        <Typography
                            color="success.main"
                            variant="h6"
                        >
                            Saldo esperado
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            Bs {summary?.expectedCash ?? 0}
                        </Typography>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>  


            <CashMovementsTable

                rows={rows}

            />

            <Typography
                variant="h5"
                mt={5}
                mb={2}
            >
                Historial de Cajas
            </Typography>

            <CashHistoryTable

                rows={historyRows}

                onView={(id) => {

                    setSelectedCashId(id);

                    setDetailOpen(true);

                }}

            />

            <CashDetailDialog

                open={detailOpen}

                onClose={() => setDetailOpen(false)}

                detail={detail}

            />

            
        </>


    );

}
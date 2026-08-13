import { forwardRef } from "react";
import logo from "../../../assets/logo/edra-logo.png"
import {
    Box,
    Divider,
    Grid,
    Typography,
} from "@mui/material";

interface Props {
    detail: any;
}

const CashReport = forwardRef<HTMLDivElement, Props>(
    ({ detail }, ref) => {

        if (!detail) return null;

        const totalIncome =
            Number(detail.membershipCash ?? 0) +
            Number(detail.membershipQr ?? 0) +
            Number(detail.salesCash ?? 0) +
            Number(detail.salesQr ?? 0);


        const printedAt = new Date().toLocaleString();
        return (
        <Box 
            ref={ref}
            sx={{ 
                p: 2,
                bgcolor: "white",
                color: "black",

             }}>

            <Box
                display="flex"
                justifyContent="center"
                mb={2}
            >

                <img
                    src={logo}
                    alt="Logo"
                    style={{
                    width:90,
                }}
            />

            </Box>

            <Typography
                variant="h5"
                align="center"
                fontWeight="bold"

            >
                REPORTE OFICIAL DE CIERRE DE CAJA
                Caja Nº {detail.id}
            </Typography>

            <Typography
                align="center"
                color="text.secondary"
                mb={3}
            >
                EDRA Gym
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>

                <Grid size={{ xs: 6 }}>
                    <Typography fontWeight="bold">
                        Fecha apertura
                    </Typography>

                    <Typography>
                        {new Date(detail.openingDate).toLocaleString()}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Typography fontWeight="bold">
                        Fecha cierre
                    </Typography>

                    <Typography>
                        {
                            detail.closingDate
                                ? new Date(detail.closingDate).toLocaleString()
                                : "-"
                        }
                    </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Typography fontWeight="bold">
                        Abrió caja
                    </Typography>

                    <Typography>

                        {detail.openedBy?.fullName}

                    </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Typography fontWeight="bold">
                        Cerró caja
                    </Typography>

                    <Typography>

                        {detail.closedBy?.fullName}

                    </Typography>
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
                variant="h6"
                gutterBottom
            >
                Caja
            </Typography>

            <Grid container spacing={1}>

                <Grid size={{ xs: 8 }}>
                    Caja inicial
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography align="right">
                        Bs {detail.openingCash}
                    </Typography>
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
                variant="h6"
                gutterBottom
            >
                Ingresos
            </Typography>

            <Grid container spacing={1}>

                <Grid size={{ xs: 8 }}>
                    Membresías efectivo
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography align="right">
                        Bs {detail.membershipCash}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 8 }}>
                    Membresías QR
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography align="right">
                        Bs {detail.membershipQr}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 8 }}>
                    Ventas efectivo
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography align="right">
                        Bs {detail.salesCash}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 8 }}>
                    Ventas QR
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography align="right">
                        Bs {detail.salesQr}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 8 }}>
                    <Typography fontWeight="bold">
                        Total ingresos
                    </Typography>
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography
                        align="right"
                        fontWeight="bold"
                    >
                        Bs {totalIncome.toFixed(2)}
                    </Typography>
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
                variant="h6"
                gutterBottom
            >
                Egresos
            </Typography>

            <Grid container spacing={1}>

                <Grid size={{ xs: 8 }}>
                    Compras y gastos
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography align="right">
                        Bs {detail.expenses}
                    </Typography>
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
                variant="h6"
                gutterBottom
            >
                Cierre
            </Typography>

            <Grid container spacing={1}>

                <Grid size={{ xs: 8 }}>
                    Saldo esperado
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography align="right">
                        Bs {detail.expectedCash}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 8 }}>
                    Dinero contado
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography align="right">
                        Bs {detail.countedCash}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 8 }}>
                    Diferencia
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Typography
                        align="right"
                        color={
                            Number(detail.difference) === 0
                                ? "success.main"
                                : "error.main"
                        }
                        fontWeight="bold"
                    >
                        Bs {detail.difference}
                    </Typography>
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
                variant="h6"
                gutterBottom
            >
                Observaciones
            </Typography>

            <Typography>

                {detail.observations || "-"}

            </Typography>

            <Grid container mt={8} spacing={8}>

                <Grid size={{ xs:6 }}>

                    <Divider/>

                    <Typography
                        align="center"
                    >

                        {detail.openedBy?.fullName}

                    </Typography>

                    <Typography
                        align="center"
                        fontWeight="bold"
                    >
                        Abrió Caja
                    </Typography>

                </Grid>

                <Grid size={{ xs:6 }}>

                    <Divider/>

                    <Typography
                        align="center"
                    >

                        {detail.closedBy?.fullName}

                    </Typography>

                    <Typography
                        align="center"
                        fontWeight="bold"
                    >
                        Cerró Caja
                    </Typography>

                </Grid>

            </Grid>

            <Typography
                align="center"
                color="text.secondary"
                mb={3}
            >
                Fecha impresion
                {printedAt}
            </Typography>

        </Box>
        

    );

},
);
 
export default CashReport;
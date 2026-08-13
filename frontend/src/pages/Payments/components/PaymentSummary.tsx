import {
    Grid,
    TextField,
    Typography,
    Divider,
} from "@mui/material";

interface Props {

    membership: any;

}

export default function PaymentSummary({

    membership,

}: Props) {

    return (

        <>

            <Typography
                variant="h6"
                mt={4}
            >
                Resumen
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>

                <Grid size={6}>
                    <TextField
                        fullWidth
                        label="Plan"
                        value={
                            membership?.service?.name ?? ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                <Grid size={6}>
                    <TextField
                        fullWidth
                        label="Código"
                        value={
                            membership?.membershipCode ?? ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                <Grid size={4}>
                    <TextField
                        fullWidth
                        label="Precio"
                        value={
                            membership
                                ? `Bs ${membership.finalPrice}`
                                : ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                <Grid size={4}>
                    <TextField
                        fullWidth
                        label="Pagado"
                        value={
                            membership
                                ? `Bs ${membership.paidAmount}`
                                : ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                <Grid size={4}>
                    <TextField
                        fullWidth
                        label="Saldo"
                        value={
                            membership
                                ? `Bs ${membership.balanceDue}`
                                : ""
                        }
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

            </Grid>

        </>

    );

}
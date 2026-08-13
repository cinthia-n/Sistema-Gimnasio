import {
    Typography,
    Divider,
    Grid,
    TextField,
    MenuItem,
} from "@mui/material";

interface PaymentMethodProps {

    paymentMethod: string;

    paymentAmount: string;

    paymentReference: string;

    balance: number;

    onPaymentMethodChange: (
        value: string,
    ) => void;

    onPaymentAmountChange: (
        value: string,
    ) => void;

    onReferenceChange: (
        value: string,
    ) => void;

}

export default function PaymentMethod({

    paymentMethod,

    paymentAmount,

    paymentReference,

    balance,

    onPaymentMethodChange,

    onPaymentAmountChange,

    onReferenceChange,

}: PaymentMethodProps) {

    return (

        <>

            <Typography
                variant="h6"
                mt={4}
            >
                Pago
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>

                <Grid size={6}>

                    <TextField
                        fullWidth
                        select
                        label="Forma de pago"
                        value={paymentMethod}
                        onChange={(e) =>
                            onPaymentMethodChange(
                                e.target.value,
                            )
                        }
                    >

                        <MenuItem value="CASH">
                            Efectivo
                        </MenuItem>

                        <MenuItem value="QR">
                            QR
                        </MenuItem>

                    </TextField>

                </Grid>

                <Grid size={6}>

                    <TextField
                        fullWidth
                        type="number"
                        label="Monto que paga hoy"
                        value={paymentAmount}
                        onChange={(e) =>
                            onPaymentAmountChange(
                                e.target.value,
                            )
                        }
                    />

                </Grid>

                {paymentMethod === "QR" && (

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Referencia QR"
                            value={paymentReference}
                            onChange={(e) =>
                                onReferenceChange(
                                    e.target.value,
                                )
                            }
                        />

                    </Grid>

                )}

                <Grid size={12}>

                    <TextField
                        fullWidth
                        label="Saldo restante"
                        value={`Bs ${balance}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                </Grid>

            </Grid>

        </>

    );

}
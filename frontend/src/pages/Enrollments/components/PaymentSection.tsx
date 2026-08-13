import {
    Grid,
    TextField,
    MenuItem,
} from '@mui/material';

interface PaymentSectionProps {

    paymentMethod: string;

    paymentAmount: string;    

    balance: number;

    onPaymentMethodChange: (
        value: string,
    ) => void;

    onPaymentAmountChange: (
        value: string,
    ) => void;

}

export default function PaymentSection({

    paymentMethod,

    paymentAmount,

    balance,

    onPaymentMethodChange,

    onPaymentAmountChange,

}: PaymentSectionProps) {

    return (

        <Grid container spacing={2}>

            <Grid size={6}>

                <TextField

                    fullWidth

                    select

                    label="Forma de Pago"

                    value={paymentMethod}

                    onChange={(e)=>

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

                    label="Monto que paga hoy"

                    type="number"

                    value={paymentAmount}

                    onChange={(e)=>
                        onPaymentAmountChange(
                            e.target.value,
                        )
                    }       
                    
                />
            </Grid>
            
            <Grid size={6}>
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

    );

}
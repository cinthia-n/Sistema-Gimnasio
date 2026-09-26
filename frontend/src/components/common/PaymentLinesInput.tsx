import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export interface PaymentLine {
    paymentMethod: "CASH" | "QR";
    amount: string;
    reference?: string;
}

interface Props {
    lines: PaymentLine[];
    onChange: (lines: PaymentLine[]) => void;
    total: number;
    requireExactMatch?: boolean;
}

export default function PaymentLinesInput({
    lines,
    onChange,
    total,
    requireExactMatch=true,
}: Props) {

    const sum = lines.reduce(
        (acc, l) => acc + (Number(l.amount) || 0),
        0,
    );

    const remaining = total - sum;

    const updateLine = (index: number, field: keyof PaymentLine, value: string) => {

        onChange(
            lines.map((line, i) =>
                i === index ? { ...line, [field]: value } : line,
            ),
        );
    };

    const addLine = () => {

        onChange([
            ...lines,
            { paymentMethod: "CASH", amount: "" },
        ]);
    };

    const removeLine = (index: number) => {
        onChange(lines.filter((_, i) => i !== index));
    };

    return (

        <Box mt={2}>

            <Typography variant="subtitle2" mb={1}>
                Forma de pago
            </Typography>

            <Stack spacing={2}>

                {lines.map((line, index) => (

                    <Stack direction="row" spacing={1} key={index} alignItems="center">

                        <TextField
                            select
                            label="Método"
                            value={line.paymentMethod}
                            onChange={(e) => updateLine(index, "paymentMethod", e.target.value)}
                            sx={{ width: 140 }}
                        >
                            <MenuItem value="CASH">Efectivo</MenuItem>
                            <MenuItem value="QR">QR</MenuItem>
                        </TextField>

                        <TextField
                            label="Monto"
                            type="number"
                            value={line.amount}
                            onChange={(e) => updateLine(index, "amount", e.target.value)}
                            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                            fullWidth
                        />

                        {line.paymentMethod === "QR" && (
                            <TextField
                                label="Referencia"
                                value={line.reference ?? ""}
                                onChange={(e) => updateLine(index, "reference", e.target.value)}
                                fullWidth
                            />
                        )}

                        {lines.length > 1 && (
                            <IconButton color="error" onClick={() => removeLine(index)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}

                    </Stack>

                ))}

            </Stack>

            <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={addLine}
                sx={{ mt: 1 }}
            >
                Agregar otro método de pago
            </Button>

            <Typography
                mt={2}
                fontWeight="bold"
                color={
                    requireExactMatch
                        ? (Math.abs(remaining) < 0.01 ? "success.main" : "warning.main")
                        : (remaining >= -0.01 ? "success.main" : "error.main")
                }
            >
                {requireExactMatch
                    ? (Math.abs(remaining) < 0.01
                        ? "✓ Monto cubierto correctamente"
                        : remaining > 0
                            ? `Falta cubrir: Bs ${remaining.toFixed(2)}`
                            : `Excede el total en: Bs ${Math.abs(remaining).toFixed(2)}`)
                    : (remaining >= -0.01
                        ? `Total a pagar hoy: Bs ${sum.toFixed(2)}`
                        : `Excede el saldo disponible en: Bs ${Math.abs(remaining).toFixed(2)}`)}
            </Typography>

        </Box>

    );

}
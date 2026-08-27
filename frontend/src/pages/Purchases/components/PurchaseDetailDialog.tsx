import {
    Box,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import FormDialog from "../../../components/common/FormDialog";

interface Props {
    open: boolean;
    detail: any;
    onClose: () => void;
}

export default function PurchaseDetailDialog({
    open,
    detail,
    onClose,
}: Props) {

    return (

        <FormDialog
            open={open}
            title="Detalle de compra"
            onClose={onClose}
            onSave={() => {}}
            hideSaveButton
        >

            {detail && (

                <Box>

                    <Typography variant="subtitle1">
                        Proveedor: {detail.supplier?.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Factura: {detail.invoiceNumber || "-"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Fecha: {new Date(detail.purchaseDate).toLocaleDateString()}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Método de pago: {detail.paymentMethod === "CASH" ? "Efectivo" : "QR"}
                    </Typography>

                    {detail.notes && (
                        <Typography variant="body2" color="text.secondary">
                            Observaciones: {detail.notes}
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Table size="small">

                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                                <TableCell align="right">Costo unit.</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {detail.details?.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.product?.name}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">Bs {Number(item.unitCost).toFixed(2)}</TableCell>
                                    <TableCell align="right">Bs {Number(item.subtotal).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>

                    <Typography variant="h6" align="right" mt={2}>
                        Total: Bs {Number(detail.total).toFixed(2)}
                    </Typography>

                </Box>

            )}

        </FormDialog>

    );

}
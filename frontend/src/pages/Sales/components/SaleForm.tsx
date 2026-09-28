import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    
} from "@mui/material";

import { useAvailableProducts } from "../../../hooks/useAvailableProducts";

import { forwardRef, useImperativeHandle, useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { toast } from "react-toastify";
import PaymentLinesInput from "../../../components/common/PaymentLinesInput";
import type { PaymentLine } from "../../../components/common/PaymentLinesInput";
import { useAuth } from "../../../pages/auth/AuthContext";

export interface SaleFormRef {
    submit: () => {
        userId: number;
        items: { productId: number; quantity: number }[];
        payments: { paymentMethod: "CASH" | "QR"; amount: number; reference?: string }[];
    } | null;
}
// --------------------------------------------------
// Obtiene el precio correcto según la cantidad,
// igual que hace el backend en SalesService.
// --------------------------------------------------

function getUnitPrice(product: any, quantity: number) {

    if (!product.prices?.length) {
        return 0;
    }

    const sorted = [...product.prices].sort(
        (a: any, b: any) => b.minimumQuantity - a.minimumQuantity,
    );

    const selected = sorted.find(
        (p: any) => quantity >= p.minimumQuantity,
    );

    return selected ? Number(selected.price) : 0;
}

const SaleForm = forwardRef<SaleFormRef, {}>((_props, ref) => {

    const {
        data: products = [],
        isLoading,
    } = useAvailableProducts();

    const { user } = useAuth();

    const [items, setItems] = useState<any[]>([]);

    const [payments, setPayments] = useState<PaymentLine[]>([
        { paymentMethod: "CASH", amount: "" },
    ]);
    const addProduct = (product: any) => {

        const existing = items.find(
            i => i.productId === product.id,
        );

        if (existing) {

            const newQuantity = existing.quantity + 1;

            setItems(
                items.map(i =>
                    i.productId === product.id
                        ? {
                            ...i,
                            quantity: newQuantity,
                            price: getUnitPrice(product, newQuantity),
                        }
                        : i,
                ),
            );

            return;
        }

        setItems([
            ...items,
            {
                productId: product.id,
                name: product.name,
                quantity: 1,
                price: getUnitPrice(product, 1),
            },
        ]);
    };

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const changeQuantity = (productId: number, delta: number) => {

        setItems(
            items
                .map(item => {

                    if (item.productId !== productId) {
                        return item;
                    }

                    const newQuantity = item.quantity + delta;

                    const product = products.find(
                        (p: any) => p.id === productId,
                    );

                    return {
                        ...item,
                        quantity: newQuantity,
                        price: product
                            ? getUnitPrice(product, newQuantity)
                            : item.price,
                    };
                })
                .filter(item => item.quantity > 0),
        );
    };

    // --------------------------------------------------
    // Precio de referencia mostrado en la lista de
    // productos disponibles (precio mínimo, cantidad 1)
    // --------------------------------------------------

    const getDisplayPrice = (product: any) =>
        getUnitPrice(product, 1);

    useImperativeHandle(ref, () => ({

        submit() {

            if (items.length === 0) {
                toast.warning("Seleccione productos");
                return null;
            }

            const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

            if (Math.abs(totalPaid - total) > 0.01) {
                toast.error("El monto pagado no coincide con el total de la venta");
                return null;
            }

            return {
                userId: user!.id,
                items: items.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
                })),
                payments: payments.map(p => ({
                    paymentMethod: p.paymentMethod,
                    amount: Number(p.amount),
                    reference: p.reference,
                })),
            };
        },
    }));

    return (
        <>
            <Typography variant="h6">
                Productos
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {isLoading ? (

                <CircularProgress />

            ) : (

                <List>
                    {products.map((product: any) => (

                        <ListItemButton
                            key={product.id}
                            onClick={() => addProduct(product)}
                        >
                            <ListItemText
                                primary={product.name}
                                secondary={`Stock: ${product.stock} | Bs ${getDisplayPrice(product)}`}
                            />
                        </ListItemButton>

                    ))}
                </List>

            )}

            <Typography variant="h6" mt={3}>
                Carrito
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
                {items.map((item) => (

                    <ListItem key={item.productId}>

                        <ListItemText primary={item.name} />

                        <Stack direction="row" spacing={1} alignItems="center">

                            <IconButton
                                size="small"
                                onClick={() => changeQuantity(item.productId, -1)}
                            >
                                <RemoveIcon fontSize="small" />
                            </IconButton>

                            <Typography>
                                {item.quantity}
                            </Typography>

                            <IconButton
                                size="small"
                                onClick={() => changeQuantity(item.productId, 1)}
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>

                            <Typography sx={{ width: 70, textAlign: "right" }}>
                                Bs {item.price * item.quantity}
                            </Typography>

                        </Stack>

                    </ListItem>

                ))}
            </List>

            <Typography variant="h5" align="right" mt={2}>
                Total: Bs {total}
            </Typography>

            <FormControl fullWidth sx={{ mt: 3 }}>

                <InputLabel>
                    Forma de pago
                </InputLabel>

                <PaymentLinesInput
                    lines={payments}
                    onChange={setPayments}
                    total={total}
                />

            </FormControl>
        </>
    );
});

export default SaleForm;
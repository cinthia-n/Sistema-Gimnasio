import {
  Stack,
  TextField,
  MenuItem,
  Select,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
  FormControl,
  InputLabel,
  
} from "@mui/material";
import { useProductsBySupplier } from "../../../hooks/useProductsBySupplier";

interface Props{

    value:any;
    onChange:(value:any)=>void;
    suppliers: any[];
    

}

export default function PurchaseForm({

    value,
    onChange,
    suppliers,
    
}:Props){

    const { data: products = [] } =
        useProductsBySupplier(
            value.supplierId || undefined,
        );
    
    const addProduct = (productId: number) => {

        const product = products.find(
            (p: any) => p.id === productId,
        );

        if (!product) return;

        onChange({

            ...value,

            details: [
                ...value.details,
                {
                    productId: product.id,
                    productName: product.name,
                    quantity: 1,
                    unitCost: Number(product.purchasePrice),
                    subtotal:
                        1 * Number(product.purchasePrice),
                },
            ],

        });

    };

    const updateItem = (
        index: number,
        field: "quantity" | "unitCost",
        valueField: number,
        ) => {
        const details = value.details.map(
            (item: any, i: number) => {
            if (i !== index) {
                return item;
            }

            const updatedItem = {
                ...item,
                [field]: valueField,
            };

            return {
                ...updatedItem,
                subtotal:
                Number(updatedItem.quantity) *
                Number(updatedItem.unitCost),
            };
            },
        );

        onChange({
            ...value,
            details,
        });
    };

    const removeItem = (index: number) => {

        const details = value.details.filter(
            (_: any, i: number) => i !== index,
        );

        onChange({

            ...value,

            details,

        });

    };

    const total = value.details.reduce(
        (sum: number, item: any) => {
            const quantity = Number(item.quantity) || 0;
            const unitCost = Number(item.unitCost) || 0;

            return sum + quantity * unitCost;
        },
        0,
    );

    return(

        <Stack spacing={3}>

            <TextField
                select
                label="Proveedor"
                value={value.supplierId}
                onChange={(e) =>
                    onChange({

                        ...value,

                        supplierId: Number(e.target.value),
                        details: [],

                    })
                 }
                fullWidth
            >

                <MenuItem value={0}>

                    Seleccione un proveedor

                </MenuItem>

                {suppliers.map((supplier: any) => (

                    <MenuItem
                        key={supplier.id}
                        value={supplier.id}
                    >

                        {supplier.name}

                    </MenuItem>

                ))}

            </TextField>

            <FormControl fullWidth>
                <InputLabel id="payment-method-label">
                    Método de pago
                </InputLabel>

                <Select
                    labelId="payment-method-label"
                    label="Método de pago"
                    value={value.paymentMethod || ""}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            paymentMethod: e.target.value,
                        })
                    }
                >
                    <MenuItem value="">
                        Seleccione un método de pago
                    </MenuItem>

                    <MenuItem value="CASH">
                        Efectivo
                    </MenuItem>

                    <MenuItem value="QR">
                        QR
                    </MenuItem>
                </Select>
            </FormControl>

            <Typography
                variant="h6"
                sx={{ mt: 3, mb: 2 }}
            >
                Productos
            </Typography>

            <Select
                fullWidth
                value=""
                displayEmpty
                disabled={!value.supplierId}
                onChange={(e) => {

                    if (!e.target.value) return;

                    addProduct(Number(e.target.value));

                }}
            >

                <MenuItem value="">
                    Seleccione un producto
                </MenuItem>

                {products.map((product: any) => (

                    <MenuItem
                         key={product.id}
                        value={product.id}
                    >

                        {product.name}

                    </MenuItem>

                ))}

            </Select>

            <Table size="small">

                <TableHead>

                    <TableRow>

                        <TableCell>Producto</TableCell>

                        <TableCell>Cantidad</TableCell>

                        <TableCell>Costo</TableCell>

                        <TableCell>Subtotal</TableCell>
                        <TableCell>Acción</TableCell>
                    </TableRow>

                </TableHead>

                <TableBody>

                    {value.details.map((item: any, index: number) => (

                        <TableRow key={index}>

                            <TableCell>

                                {item.productName}

                            </TableCell>

                            <TableCell width={120}>

                                <TextField
                                    size="small"
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>

                                        updateItem(

                                            index,

                                            "quantity",

                                            Number(e.target.value),

                                        )

                                    }
                                />

                            </TableCell>

                            <TableCell width={150}>

                                <TextField
                                    size="small"
                                    type="number"
                                    value={item.unitCost}
                                    onChange={(e) =>

                                        updateItem(

                                            index,

                                            "unitCost",

                                            Number(e.target.value),

                                        )

                                    }
                                />

                            </TableCell>

                            <TableCell>

                                Bs {item.subtotal.toFixed(2)}

                            </TableCell>

                            <TableCell width={60}>

                                <Button
                                    color="error"
                                    onClick={() => removeItem(index)}
                                >

                                    X

                                </Button>

                            </TableCell>

                        </TableRow>

                     ))}

                </TableBody>

            </Table>

            <TextField
                label="Factura"
                value={value.invoiceNumber}
                onChange={(e)=>

                    onChange({

                        ...value,

                        invoiceNumber:e.target.value,

                    })

                }
            />

            <TextField
                label="Observaciones"
                multiline
                rows={3}
                value={value.notes}
                onChange={(e)=>

                    onChange({

                        ...value,

                        notes:e.target.value,

                    })

                }
            />
            <Typography
                variant="h6"
                textAlign="right"
            >

                Total: Bs {total.toFixed(2)}

            </Typography>

        </Stack>

    );

}
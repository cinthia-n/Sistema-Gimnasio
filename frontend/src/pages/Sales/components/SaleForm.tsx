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
    Select,
    MenuItem,
    Button
} from "@mui/material";

import { useAvailableProducts } from "../../../hooks/useAvailableProducts";

import { useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRegisterSale } from "../../../hooks/useRegisterSale";

export default function SaleForm() {

    const {

        data: products = [],

        isLoading,

    } = useAvailableProducts();

    const [items, setItems] = useState<any[]>([]);

    const [paymentMethod, setPaymentMethod] =
        useState<"CASH" | "QR">("CASH");
    
    const addProduct = (product: any) => {

        const existing = items.find(

            i => i.productId === product.id,

        );

        if (existing) {

            setItems(

                items.map(i =>

                    i.productId === product.id

                        ? {

                             ...i,

                            quantity: i.quantity + 1,

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

                price: Number(product.salePrice),

            },

        ]);

    };

    

    const total = items.reduce(

        (sum, item) =>

            sum + item.price * item.quantity,

        0,

    );

    
    const increaseQuantity = (productId: number) => {

        setItems(

            items

                .map(item =>

                    item.productId === productId

                        ? {

                            ...item,

                            quantity: item.quantity + 1,

                        }

                        : item,

                )

                .filter(item => item.quantity > 0),

        );

    };

    const decreaseQuantity = (

        productId: number,

    ) => {

        setItems(

            items

                .map(item =>

                    item.productId === productId

                        ? {

                            ...item,

                            quantity:

                                item.quantity - 1,

                         }

                        : item,

                )

                .filter(

                    item => item.quantity > 0,

                ),

        );

    };

    const registerSale = useRegisterSale();

    const handleSave = async () => {

        if (items.length === 0) {

            alert("Seleccione productos");

            return;

        }

        try {

            await registerSale.mutateAsync({

                userId: 1,

                paymentMethod,

                items: items.map(i => ({

                    productId: i.productId,

                    quantity: i.quantity,

                })),

            });

            alert("Venta registrada");

        }

        catch (error) {

            console.error(error);

            alert("Error");

        }

    };

    return (

        <>

            <Typography
                variant="h6"
            >
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

                            secondary={`Stock: ${product.stock} | Bs ${product.salePrice}`}

                        />

                    </ListItemButton>

                ))}

            </List>            

        ) 
        
        }
        <Typography
            variant="h6"
            mt={3}
        >
            Carrito
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List>

            {items.map((item) => (

                <ListItem
                    key={item.productId}
                >

                    <ListItemText

                        primary={item.name}
                       

                    />

                    <Stack

                        direction="row"

                        spacing={1}

                        alignItems="center"

                    >

                        <IconButton

                            size="small"

                            onClick={() =>

                            decreaseQuantity(item.productId)

                            }

                        >

                            <RemoveIcon fontSize="small"/>

                        </IconButton>

                        <Typography>

                            {item.quantity}

                        </Typography>

                        <IconButton

                            size="small"

                            onClick={() =>

                            increaseQuantity(item.productId)

                            }

                        >

                            <AddIcon fontSize="small"/>

                        </IconButton>

                        <Typography

                            sx={{

                            width: 70,

                            textAlign: "right",

                            }}

                        >

                            Bs {item.price * item.quantity}

                        </Typography>

                    </Stack>

                    </ListItem>

                ))}

            </List>

            <Typography
                variant="h5"
                align="right"
                mt={2}
            >

                Total: Bs {total}

            </Typography>
            
            <FormControl
                fullWidth
                sx={{ mt: 3 }}
            >

                <InputLabel>

                    Forma de pago

                </InputLabel>

                <Select

                    value={paymentMethod}

                    label="Forma de pago"

                    onChange={(e) =>

                        setPaymentMethod(

                            e.target.value as "CASH" | "QR",

                        )           

                    }

                >

                    <MenuItem value="CASH">

                        Efectivo

                    </MenuItem>

                    <MenuItem value="QR">

                         QR

                    </MenuItem>

                </Select>

                <Button

                    fullWidth

                     variant="contained"

                    sx={{ mt: 3 }}

                    onClick={handleSave}

                >

                    Registrar Venta

                </Button>

            </FormControl>
            
        </>
            
        

    );

}
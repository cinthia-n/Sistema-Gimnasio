import {
    Grid,
    TextField,
    Button,
    Stack,
    MenuItem,
} from "@mui/material";

import { useSuppliers } from "../../../hooks/useSuppliers";

export type PriceType =

    | "MINORISTA"

    | "MAYORISTA";
    

interface ProductPrice {

    type: PriceType;

    price: number;

    minimumQuantity: number;

}

interface Product {

    supplierId: number;

    name: string;

    purchasePrice: number;

    minimumStock: number;

    prices: ProductPrice[];

}

interface Props {

    value: Product;

    onChange: (value: Product) => void;

}

export default function ProductForm({

    value,

    onChange,

}: Props) {

    const handleChange = (
        field: keyof Product,
        newValue: any,
    ) => {

        onChange({

            ...value,

            [field]:
                field === "name"
                    ? newValue
                    : newValue === "" ? 0 : Number(newValue),

        });

    };

    const addPrice = () => {

        const availableTypes = [

            "MINORISTA",

            "MAYORISTA",
            
        ].filter(

            type =>

                !value.prices.some(

                    p => p.type === type,

                ),

        );

        if (availableTypes.length === 0) {

            return;

        }

        onChange({

         ...value,

            prices: [

                ...value.prices,

                 {

                    type: availableTypes[0] as PriceType,

                    price: 0,

                    minimumQuantity:

                        availableTypes[0] === "MINORISTA"

                            ? 1

                            : 12,

                    },

                ],

            });

    };

    const updatePrice = (

        index: number,

        field: keyof ProductPrice,

        newValue: any,

    ) => {

        const prices = [...value.prices];

        prices[index] = {

            ...prices[index],

            [field]:

                field === "type"

                    ? newValue

                    : Number(newValue),

        };

        onChange({

            ...value,

            prices,

        });

    };

    const removePrice = (

    index: number,

    ) => {

        const prices = value.prices.filter(

            (_: any, i: number) => i !== index,

        );

        onChange({

            ...value,

            prices,

        });

    };

    const { data: suppliers = [] } = useSuppliers();

    return (

        <Grid container spacing={2}>

            <Grid size={12}>

                <TextField
                    select
                    fullWidth
                    label="Proveedor"
                    value={value.supplierId}
                    onChange={(e) =>
                        handleChange("supplierId", e.target.value)
                    }
                >
                    {suppliers.map((supplier: any) => (
                        <MenuItem
                            key={supplier.id}
                            value={supplier.id}
                        >
                            {supplier.name}
                        </MenuItem>
                     ))}
                </TextField>

                <TextField
                    fullWidth
                    label="Nombre"
                    value={value.name}
                    onChange={(e) =>
                        handleChange(
                            "name",
                            e.target.value,
                        )
                    }
                />

            </Grid>

            <Grid size={6}>

                <TextField
                    fullWidth
                    label="Precio de compra"
                    type="number"
                    value={value.purchasePrice === 0 ? '': value.purchasePrice}
                    onChange={(e) =>
                        handleChange(
                            "purchasePrice",
                            e.target.value,
                        )
                    }
                />

            </Grid>

            <Grid size={6}>

                <Grid size={12}>

                    <Stack spacing={2}>

                        {

                            value.prices.map(

                                (price, index) => (

                                    <Grid
                                        container
                                        spacing={2}
                                        key={index}
                                    >

                                        <Grid size={4}>

                                            <TextField
                                                select
                                                fullWidth
                                                label="Tipo"

                                                value={price.type}

                                                onChange={(e)=>

                                                     updatePrice(

                                                         index,

                                                        "type",

                                                        e.target.value,

                                                    )

                                                }

                                            >

                                                <MenuItem value="MINORISTA">

                                                    Minorista

                                                </MenuItem>

                                                <MenuItem value="MAYORISTA">

                                                    Mayorista

                                                </MenuItem>                                             


                                            </TextField>

                                        </Grid>

                                        <Grid size={3}>

                                            <TextField

                                                fullWidth

                                                label="Precio"

                                                type="number"

                                                value={price.price}

                                                onChange={(e)=>

                                                    updatePrice(

                                                        index,

                                                        "price",

                                                        e.target.value,

                                                    )

                                                }

                                            />

                                        </Grid>

                                        <Grid size={3}>

                                            <TextField

                                                fullWidth

                                                label="Cantidad mínima"                                                

                                                 type="number"
                                                 disabled={price.type === "MINORISTA"}

                                                value={price.type === "MINORISTA"
                                                    ? 1
                                                    :price.minimumQuantity
                                                }

                                                onChange={(e)=>

                                                    updatePrice(

                                                        index,

                                                        "minimumQuantity",

                                                        e.target.value,

                                                    )

                                                }

                                            />

                                        </Grid>

                                        <Grid size={2}>

                                            {

                                                index > 0 && (

                                                    <Button

                                                        color="error"

                                                        onClick={()=>

                                                            removePrice(index)

                                                        }

                                                    >

                                                        Eliminar

                                                    </Button>

                                                )

                                            }

                                        </Grid>

                                    </Grid>

                                )

                            )

                        }

                        <Button

                            variant="outlined"

                            onClick={addPrice}

                        >

                            + Agregar precio

                        </Button>

                    </Stack>

                </Grid>

            </Grid>

            <Grid size={6}>

                <TextField
                    fullWidth
                    label="Stock mínimo"
                    type="number"
                    value={value.minimumStock === 0 ? '' : value.minimumStock}
                    onChange={(e) =>
                        handleChange(
                            "minimumStock",
                            e.target.value,
                        )
                    }
                />

            </Grid>

        </Grid>

    );

}
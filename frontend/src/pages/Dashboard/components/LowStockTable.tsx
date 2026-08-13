import {
    Card,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

interface Props {

    products: any[];

}

export default function LowStockTable({

    products,

}: Props) {

    const stockColor = (

        stock: number,

    ) => {

        if (stock === 0)

            return "error.main";

        if (stock <= 3)

            return "warning.main";

        return "success.main";

    };

    return (

        <Card>

            <CardContent>

                <Typography
                    variant="h6"
                    mb={2}
                >

                    Productos con bajo stock

                </Typography>

                <Table size="small">

                    <TableHead>

                        <TableRow>

                            <TableCell>Producto</TableCell>

                            <TableCell align="center">

                                Stock

                            </TableCell>

                            <TableCell align="center">

                                Mínimo

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            products.length === 0 ?

                            (

                                <TableRow>

                                    <TableCell
                                        colSpan={3}
                                        align="center"
                                    >

                                        No existen productos con bajo stock.

                                    </TableCell>

                                </TableRow>

                            )

                            :

                            products.map((product) => (

                                <TableRow
                                    key={product.id}
                                >

                                    <TableCell>

                                        {product.name}

                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{
                                            color: stockColor(product.stock),
                                            fontWeight: "bold",
                                        }}
                                    >

                                        {product.stock}

                                    </TableCell>

                                    <TableCell
                                        align="center"
                                    >

                                        {product.minimumStock}

                                    </TableCell>

                                </TableRow>

                            ))

                        }

                    </TableBody>

                </Table>

            </CardContent>

        </Card>

    );

}
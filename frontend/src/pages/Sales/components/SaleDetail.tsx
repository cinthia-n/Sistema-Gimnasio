import {

    Typography,

    Divider,

    List,

    ListItem,

    ListItemText,

} from "@mui/material";

interface Props {

    sale: any;

}

export default function SaleDetail({

    sale,

}: Props) {

    if (!sale) return null;

    return (

        <>

            <Typography variant="h6">

                Venta #{sale.id}

            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography>

                Fecha:

                {new Date(

                    sale.saleDate,

                ).toLocaleString()}

            </Typography>

            <Typography>

                Cajero:

                {sale.user.fullName}

            </Typography>

            <Typography>

                Forma de pago:

                {sale.paymentMethod}

            </Typography>

            <Divider sx={{ my: 2 }} />

            <List>

                {sale.details.map(

                    (detail: any) => (

                        <ListItem
                            key={detail.id}
                        >

                            <ListItemText

                                primary={

                                    detail.product.name

                                }

                                secondary={

                                    `${detail.quantity} × Bs ${detail.unitPrice}`

                                }

                            />

                            <Typography>

                                Bs {detail.subtotal}

                            </Typography>

                        </ListItem>

                    ),

                )}

            </List>

            <Divider sx={{ my: 2 }} />

            <Typography

                variant="h5"

                align="right"

            >

                Total: Bs {sale.total}

            </Typography>

        </>

    );

}
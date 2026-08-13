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

    memberships: any[];

}

export default function ExpiringMemberships({

    memberships,

}: Props) {

    const getColor = (date: string) => {

        const today = new Date();

        today.setHours(0,0,0,0);

        const end = new Date(date);

        end.setHours(0,0,0,0);

        const diff =
            Math.ceil(

                (end.getTime() - today.getTime())

                / (1000 * 60 * 60 * 24),

            );

        if (diff <= 0) return "error.main";

        if (diff === 1) return "warning.main";

        return "success.main";

    };

    return (

        <Card>

            <CardContent>

                <Typography
                    variant="h6"
                    mb={2}
                >

                    Membresías próximas a vencer

                </Typography>

                <Table size="small">

                    <TableHead>

                        <TableRow>

                            <TableCell>Cliente</TableCell>

                            <TableCell>Servicio</TableCell>

                            <TableCell>Vence</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            memberships.length === 0 ?

                            (

                                <TableRow>

                                    <TableCell
                                        colSpan={3}
                                        align="center"
                                    >

                                        No existen membresías próximas a vencer.

                                    </TableCell>

                                </TableRow>

                            )

                            :

                            memberships.map((item) => (

                                <TableRow
                                    key={item.id}
                                >

                                    <TableCell>

                                        {item.client.fullName}

                                    </TableCell>

                                    <TableCell>

                                        {item.service.name}

                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            color: getColor(item.endDate),
                                            fontWeight: "bold",
                                        }}
                                    >

                                        {

                                            new Date(item.endDate)

                                                .toLocaleDateString()

                                        }

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
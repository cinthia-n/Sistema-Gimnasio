import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";

interface Props {

    title: string;

    value: string | number;

}

export default function DashboardCard({

    title,

    value,

}: Props) {

    return (

        <Card elevation={2}>

            <CardContent>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {title}
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    {value}
                </Typography>

            </CardContent>

        </Card>

    );

}
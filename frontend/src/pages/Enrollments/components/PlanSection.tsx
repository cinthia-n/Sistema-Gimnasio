import {
    Box,
    Divider,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';

interface Props {

    services: any[];

    serviceId: string;

    onServiceChange: (
        value: string,
    ) => void;

    disabled?: boolean;

}

export default function PlanSection({

    services,

    serviceId,

    onServiceChange,

    disabled = false,

}: Props) {

    return (

        <Box mt={4}>

            <Typography
                variant="h6"
                gutterBottom
            >

                Plan de inscripción

            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>

                <Grid size={12}>

                    <TextField

                        fullWidth

                        select

                        label="Plan"

                        value={serviceId}

                        disabled={disabled}

                        onChange={(e) =>
                            onServiceChange(
                                e.target.value,
                            )
                        }

                    >

                        {

                            services.map(
                                (plan: any) => (

                                    <MenuItem

                                        key={plan.id}

                                        value={plan.id}

                                    >

                                        {plan.name}

                                    </MenuItem>

                                ),
                            )

                        }

                    </TextField>

                </Grid>

            </Grid>

        </Box>

    );

}
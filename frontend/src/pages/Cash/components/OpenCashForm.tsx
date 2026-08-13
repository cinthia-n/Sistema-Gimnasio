import { TextField, Stack } from "@mui/material";

interface Props {

    value: {

        openingCash: number;

        observations: string;

    };

    onChange: (value: any) => void;

}

export default function OpenCashForm({

    value,

    onChange,

}: Props) {

    return (

        <Stack spacing={3}>

            <TextField

                label="Monto inicial"

                type="number"

                value={value.openingCash}

                onChange={(e) =>

                    onChange({

                        ...value,

                        openingCash: Number(e.target.value),

                    })

                }

                fullWidth

            />

            <TextField

                label="Observaciones"

                value={value.observations}

                onChange={(e) =>

                    onChange({

                        ...value,

                        observations: e.target.value,

                    })

                }

                fullWidth

                multiline

                rows={3}

            />

        </Stack>

    );

}
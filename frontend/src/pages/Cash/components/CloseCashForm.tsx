import { Stack, TextField } from "@mui/material";

interface Props {

    expectedCash: number;

    value: {

        countedCash: number;

        observations: string;

    };

    onChange: (value: any) => void;

}

export default function CloseCashForm({

    expectedCash,

    value,

    onChange,

}: Props) {

    return (

        <Stack spacing={3}>

            <TextField

                label="Saldo esperado"

                value={`Bs ${expectedCash}`}

                InputProps={{

                    readOnly: true,

                }}

            />

            <TextField

                label="Dinero contado"

                type="number"

                value={value.countedCash}

                onChange={(e) =>

                    onChange({

                        ...value,

                        countedCash: Number(e.target.value),

                    })

                }

            />

            <TextField

                label="Observaciones"

                value={value.observations}

                multiline

                rows={3}

                onChange={(e) =>

                    onChange({

                        ...value,

                        observations: e.target.value,

                    })

                }

            />

        </Stack>

    );

}
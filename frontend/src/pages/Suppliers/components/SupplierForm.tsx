import {
    Stack,
    TextField,
} from "@mui/material";

interface Props {

    value: any;

    onChange: (value: any) => void;

}

export default function SupplierForm({

    value,

    onChange,

}: Props) {

    return (

        <Stack spacing={3}>

            <TextField

                label="Nombre"

                value={value.name}

                onChange={(e)=>

                    onChange({

                        ...value,

                        name: e.target.value,

                    })

                }

                fullWidth

            />

            <TextField

                label="Persona de contacto"

                value={value.contactPerson}

                onChange={(e)=>

                    onChange({

                        ...value,

                        contactPerson: e.target.value,

                    })

                }

                fullWidth

            />

            <TextField

                label="Teléfono"

                value={value.phone}

                onChange={(e)=>

                    onChange({

                        ...value,

                        phone: e.target.value,

                    })

                }

                fullWidth

            />

            <TextField

                label="Dirección"

                value={value.address}

                onChange={(e)=>

                    onChange({

                        ...value,

                        address: e.target.value,

                    })

                }

                fullWidth

            />

            <TextField

                label="NIT"

                value={value.nit}

                onChange={(e)=>

                    onChange({

                        ...value,

                        nit: e.target.value,

                    })

                }

                fullWidth

            />

            <TextField

                label="Observaciones"

                value={value.notes}

                multiline

                rows={3}

                onChange={(e)=>

                    onChange({

                        ...value,

                        notes: e.target.value,

                    })

                }

            />

        </Stack>

    );

}
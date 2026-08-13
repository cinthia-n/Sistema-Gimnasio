import {
    Grid,
    MenuItem,
    TextField,
} from "@mui/material";

interface Service {

    code: string;

    name: string;

    description: string;

    type: string;

    durationDays: number;

    basePrice: number;

    studentPrice: number;

}

interface Props {

    value: Service;

    onChange: (value: Service) => void;

}

export default function ServiceForm({

    value,

    onChange,

}: Props) {

    const handleChange = (

        field: keyof Service,

        newValue: any,

    ) => {

        onChange({

            ...value,

            [field]:

                field === "name" ||

                field === "description" ||

                field === "code" ||

                field === "type"

                    ? newValue

                    : Number(newValue),

        });

    };

    return (

        <Grid container spacing={2}>

            <Grid size={6}>

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

            <Grid size={12}>

                <TextField

                    fullWidth

                    label="Descripción"

                    value={value.description}

                    onChange={(e) =>

                        handleChange(

                            "description",

                            e.target.value,

                        )

                    }

                />

            </Grid>

            <Grid size={4}>

                <TextField

                    select

                    fullWidth

                    label="Tipo"

                    value={value.type}

                    onChange={(e) =>

                        handleChange(

                            "type",

                            e.target.value,

                        )

                    }

                >

                    <MenuItem value="MEMBERSHIP">

                        Mensual 

                    </MenuItem>

                    <MenuItem value="PROGRAM">

                        Diario

                    </MenuItem>

                    <MenuItem value="ADDITIONAL">

                        Personalizado

                    </MenuItem>

                </TextField>

            </Grid>

            <Grid size={4}>

                <TextField

                    fullWidth

                    type="number"

                    label="Duración"

                    value={value.durationDays}

                    onChange={(e) =>

                        handleChange(

                            "durationDays",

                            e.target.value,

                        )

                    }

                />

            </Grid>

            <Grid size={4}>

                <TextField

                    fullWidth

                    type="number"

                    label="Precio"

                    value={value.basePrice}

                    onChange={(e) =>

                        handleChange(

                            "basePrice",

                            e.target.value,

                        )

                    }

                />

            </Grid>

        </Grid>

    );

}
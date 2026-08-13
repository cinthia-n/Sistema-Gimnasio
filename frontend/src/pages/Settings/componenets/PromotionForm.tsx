import {
  Grid,
  TextField,
} from "@mui/material";

export interface PromotionFormValue {
  name: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
}

interface Props {
  value: PromotionFormValue;
  onChange: (
    value: PromotionFormValue,
  ) => void;
}

export default function PromotionForm({
  value,
  onChange,
}: Props) {

  const handleChange = (
    field: keyof PromotionFormValue,
    newValue: any,
  ) => {

    onChange({
      ...value,
      [field]:
        field === "price"
          ? Number(newValue)
          : newValue,
    });

  };

  return (

    <Grid
      container
      spacing={2}
    >

      <Grid size={12}>

        <TextField
          fullWidth
          label="Nombre de la promoción"
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
          multiline
          minRows={2}
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

      <Grid size={6}>

        <TextField
          fullWidth
          type="number"
          label="Precio de promoción"
          value={value.price}
          onChange={(e) =>
            handleChange(
              "price",
              e.target.value,
            )
          }
          slotProps={{
            htmlInput: {
              min: 0,
              step: "0.01",
            },
          }}
        />

      </Grid>

      <Grid size={3}>

        <TextField
          fullWidth
          type="date"
          label="Fecha inicio"
          value={value.startDate}
          onChange={(e) =>
            handleChange(
              "startDate",
              e.target.value,
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

      </Grid>

      <Grid size={3}>

        <TextField
          fullWidth
          type="date"
          label="Fecha fin"
          value={value.endDate}
          onChange={(e) =>
            handleChange(
              "endDate",
              e.target.value,
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

      </Grid>

    </Grid>

  );

}
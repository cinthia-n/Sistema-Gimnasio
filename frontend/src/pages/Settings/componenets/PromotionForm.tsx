import {
  Grid,
  TextField,
} from "@mui/material";

export interface PromotionFormValue {
  name: string;
  description: string;
  price: number;
  durationDays: number;
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
        field === "price" || field === "durationDays"
          ? Number(newValue)
          : newValue,
    });

  };

  return (

    <Grid container spacing={2}>

      <Grid size={12}>
        <TextField
          fullWidth
          label="Nombre de la promoción"
          value={value.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </Grid>

      <Grid size={12}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Descripción"
          value={value.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </Grid>

      <Grid size={6}>
        <TextField
          fullWidth
          type="number"
          label="Precio de promoción"
          value={value.price}
          onChange={(e) => handleChange("price", e.target.value)}
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
      </Grid>

      <Grid size={6}>
        <TextField
          fullWidth
          type="number"
          label="Duración de la membresía (días)"
          value={value.durationDays ?? ""}
          onChange={(e) => handleChange("durationDays", e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          helperText="Días que dura la inscripción otorgada por esta promoción (ej: 120 para 4 meses)"
        />
      </Grid>

      <Grid size={6}>
        <TextField
          fullWidth
          type="date"
          label="Fecha inicio (vigencia)"
          value={value.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Grid>

      <Grid size={6}>
        <TextField
          fullWidth
          type="date"
          label="Fecha fin (vigencia)"
          value={value.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Grid>

    </Grid>

  );

}
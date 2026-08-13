import {
  Grid,
  TextField,
} from '@mui/material';

interface Props {
  value: {
    fullName: string;
    ci: string;
    phone: string;
  };

  onChange: (value: {
    fullName: string;
    ci: string;
    phone: string;
  }) => void;
}

export default function NewClient({
  value,
  onChange,
}: Props) {

  return (

    <Grid container spacing={2}>

      <Grid size={12}>
        <TextField
          fullWidth
          label="Nombre Completo"
          value={value.fullName}
          onChange={(e) =>
            onChange({
              ...value,
              fullName: e.target.value,
            })
          }
        />
      </Grid>

      <Grid size={6}>
        <TextField
          fullWidth
          label="CI"
          value={value.ci}
          onChange={(e) =>
            onChange({
              ...value,
              ci: e.target.value,
            })
          }
        />
      </Grid>

      <Grid size={6}>
        <TextField
          fullWidth
          label="Celular"
          value={value.phone}
          onChange={(e) =>
            onChange({
              ...value,
              phone: e.target.value,
            })
          }
        />
      </Grid>

    </Grid>

  );

}
import {
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';

export default function ClientForm() {

  return (

    <Grid
      container
      spacing={2}
    >

      <Grid size={{ xs: 12 }}>

        <TextField
          label="Nombre completo"
          fullWidth
        />

      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>

        <TextField
          label="CI"
          fullWidth
        />

      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>

        <TextField
          label="Celular"
          fullWidth
        />

      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>

        <TextField
          label="Correo"
          fullWidth
        />

      </Grid>

      <Grid size={{ xs: 12 }}>

        <TextField
          label="Dirección"
          fullWidth
        />

      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>

        <TextField
          type="date"
          label="Fecha de nacimiento"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>

        <TextField
          select
          label="Sexo"
          fullWidth
          defaultValue=""
        >

          <MenuItem value="M">
            Masculino
          </MenuItem>

          <MenuItem value="F">
            Femenino
          </MenuItem>

        </TextField>

      </Grid>

      <Grid size={{ xs: 12 }}>

        <TextField
          label="Observaciones"
          fullWidth
          multiline
          rows={3}
        />

      </Grid>

    </Grid>

  );

}
import {
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from '@mui/material';

import {
  Controller,
  useFormContext,
} from 'react-hook-form';

import type {
  ClientFormData,
} from '../../../validations/client.schema';

export default function ClientForm() {

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ClientFormData>();

  return (

    <Grid container spacing={2}>

      <Grid size={{ xs: 12 }}>

        <TextField
          fullWidth
          label="Nombre completo"
          {...register('fullName')}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />

      </Grid>

      <Grid size={{ xs: 6 }}>

        <TextField
          fullWidth
          label="CI"
          {...register('ci')}
          error={!!errors.ci}
          helperText={errors.ci?.message}
        />

      </Grid>

      <Grid size={{ xs: 6 }}>

        <TextField
          fullWidth
          label="Celular"
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />

      </Grid>

      <Grid size={{ xs: 12 }}>

        <Controller
          control={control}
          name="isStudent"
          render={({ field }) => (

            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                />
              }
              label="Es estudiante de colegio"
            />

          )}
        />

      </Grid>

      <Grid size={{ xs: 6 }}>

        <TextField
          fullWidth
          type="date"
          label="Fecha de nacimiento"
          InputLabelProps={{
            shrink: true,
          }}
          {...register('birthDate')}
        />

      </Grid>

      <Grid size={{ xs: 6 }}>

        <TextField
          fullWidth
          select
          label="Sexo"
          defaultValue=""
          {...register('gender')}
        >

          <MenuItem value="">
            No especificado
          </MenuItem>

          <MenuItem value="MALE">
            Masculino
          </MenuItem>

          <MenuItem value="FEMALE">
            Femenino
          </MenuItem>

        </TextField>

      </Grid>

      <Grid size={{ xs: 12 }}>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Dirección"
          {...register('address')}
        />

      </Grid>

    </Grid>

  );

}
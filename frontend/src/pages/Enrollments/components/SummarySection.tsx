import {
  Box,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

interface SummarySectionProps {

  basePrice: number;

  promotionPrice: number;

  total: number;

}

export default function SummarySection({

  basePrice,

  promotionPrice,

  total,

}: SummarySectionProps) {

  return (

    <Box mt={4}>

      <Typography
        variant="h6"
        gutterBottom
      >
        Resumen
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>

        <Grid size={4}>

          <TextField
            fullWidth
            label="Precio Base"
            value={`Bs ${basePrice.toFixed(2)}`}
            InputProps={{
              readOnly: true,
            }}
          />

        </Grid>

        <Grid size={4}>

          <Typography>
            Precio del plan: Bs {basePrice}
          </Typography>

          {promotionPrice > 0 && (
            <Typography color="success.main">
              Precio de promoción: Bs {promotionPrice}
            </Typography>
          )}

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Total: Bs {total}
          </Typography>

        </Grid>

        <Grid size={4}>

          <TextField
            fullWidth
            label="Total"
            value={`Bs ${total.toFixed(2)}`}
            InputProps={{
              readOnly: true,
            }}
          />

        </Grid>

      </Grid>

    </Box>

  );

}
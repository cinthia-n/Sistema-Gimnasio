import {
  Box,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

export interface PromotionSectionProps {

  promotions: any[];

  promotionId: string;

  onPromotionChange: (value: string) => void;

}

export default function PromotionSection({

  promotions,

  promotionId,

  onPromotionChange,

}: PromotionSectionProps) {

  return (

    <Box mt={4}>

      <Typography
        variant="h6"
        gutterBottom
      >
        Promoción
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Grid
        container
        spacing={2}
      >

        <Grid size={12}>

          <TextField
            fullWidth
            select
            label="Promoción"
            value={promotionId}
            onChange={(e)=>

              onPromotionChange(
                e.target.value,
              )

            }
          >

            <MenuItem value="">
              Ninguna
            </MenuItem>

            {

              promotions.map(

                (promotion:any)=>(

                  <MenuItem
                    key={promotion.id}
                    value={promotion.id}
                  >

                    {promotion.name}

                  </MenuItem>

                )

              )

            }

          </TextField>

        </Grid>

      </Grid>

    </Box>

  );

}
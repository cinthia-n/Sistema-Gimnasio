import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export default function SummaryCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        transition: '.25s',
        height: '100%',

        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent>

        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: color,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            mb: 2,
          }}
        >
          {icon}
        </Box>

        <Typography
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          {value}
        </Typography>

      </CardContent>
    </Card>
  );
}
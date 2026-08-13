import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: Props) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: '#F5F5F5',
        minHeight: '100vh',
      }}
    >
      {children}
    </Box>
  );
}
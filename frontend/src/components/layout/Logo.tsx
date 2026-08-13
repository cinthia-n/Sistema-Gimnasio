import { Box } from '@mui/material';

import logo from '../../assets/logo/edra-logo.png';

export default function Logo() {
  return (
    <Box
      component="img"
      src={logo}
      alt="EDRA Fitness Club"
      sx={{
        width: 150,
        display: 'block',
        mx: 'auto',
        my: 2,
      }}
    />
  );
}
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
} from '@mui/material';

export default function Navbar() {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        ml: '260px',
        width: 'calc(100% - 260px)',
      }}
    >
      <Toolbar>

        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          Sistema EDRA Fitness Club
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Typography>
            Administrador
          </Typography>

          <Avatar
            sx={{
              bgcolor: 'primary.main',
              color: 'black',
            }}
          >
            A
          </Avatar>

        </Box>

      </Toolbar>
    </AppBar>
  );
}
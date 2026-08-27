import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../pages/auth/AuthContext';

export default function Navbar() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);


  // ==========================================
  // DATOS DEL USUARIO
  // ==========================================

  const displayName =
    user?.fullName ||
    user?.username ||
    'Usuario';

  const initial =
    displayName
      .charAt(0)
      .toUpperCase();


  // ==========================================
  // ABRIR MENÚ
  // ==========================================

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
  ) => {

    setAnchorEl(event.currentTarget);

  };


  // ==========================================
  // CERRAR MENÚ
  // ==========================================

  const handleMenuClose = () => {

    setAnchorEl(null);

  };


  // ==========================================
  // CAMBIAR CONTRASEÑA
  // ==========================================

  const handleChangePassword = () => {

    handleMenuClose();

    navigate('/cambiar-contrasena');

  };


  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const handleLogout = () => {

    handleMenuClose();

    logout();

    navigate('/');

  };


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

        {/* =====================================
            TÍTULO
        ===================================== */}

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
          }}
        >
          Sistema EDRA Fitness Club
        </Typography>


        {/* =====================================
            USUARIO
        ===================================== */}

        <Box
          display="flex"
          alignItems="center"
          gap={1}
        >

          <Typography
            sx={{
              fontWeight: 500,
            }}
          >
            {displayName}
          </Typography>


          <IconButton
            onClick={handleMenuOpen}
            size="small"
            aria-controls={
              menuOpen
                ? 'user-menu'
                : undefined
            }
            aria-haspopup="true"
            aria-expanded={
              menuOpen
                ? 'true'
                : undefined
            }
          >

            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'black',
              }}
            >
              {initial}
            </Avatar>

          </IconButton>

        </Box>


        {/* =====================================
            MENÚ DEL USUARIO
        ===================================== */}

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >

          <MenuItem
            onClick={handleChangePassword}
          >

            <ListItemIcon>

              <LockIcon fontSize="small" />

            </ListItemIcon>

            Cambiar contraseña

          </MenuItem>


          <Divider />


          <MenuItem
            onClick={handleLogout}
          >

            <ListItemIcon>

              <LogoutIcon fontSize="small" />

            </ListItemIcon>

            Cerrar sesión

          </MenuItem>

        </Menu>

      </Toolbar>

    </AppBar>

  );
}
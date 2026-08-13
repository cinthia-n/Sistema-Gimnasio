import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentIcon from '@mui/icons-material/Payment';

import Logo from './Logo';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const menu = [
  { text: 'Inicio', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Clientes', path: '/clients', icon: <PeopleIcon /> },
  { text: 'Inscripciones', path: '/enrollments', icon: <CardMembershipIcon /> },
  { text: 'Pagos', path: '/payments', icon: <PaymentIcon />},
  { text: 'Asistencia', path: '/attendance', icon: <EventAvailableIcon /> },
  { text: 'Productos', path: '/products', icon: <InventoryIcon /> },
  { text: 'Ventas', path: '/sales', icon: <ShoppingCartIcon /> },
  { text: 'Compras', path: '/purchases', icon: <LocalShippingIcon /> },
  { text: 'Proveedores', path: '/suppliers', icon: <StoreIcon /> },
  { text: 'Caja', path: '/cash', icon: <PointOfSaleIcon /> },
  { text: 'Reportes', path: '/reports', icon: <AssessmentIcon /> },
  { text: 'Configuración', path: '/settings', icon: <SettingsIcon /> },
];

export default function Sidebar() {

  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        '& .MuiDrawer-paper': {
          width: drawerWidth,
          bgcolor: '#121212',
          color: 'white',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar />

      <Logo />

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
            mx: 1,
            borderRadius: 2,

            bgcolor:
            location.pathname === item.path
            ? '#B7D430'
            : 'transparent',

             color:
              location.pathname === item.path
              ? '#000'
              : '#FFF',

              '&:hover': {
              bgcolor: '#B7D430',
              color: '#000',
              },
            }}
            >
            <ListItemIcon
              sx={{
              color:
              location.pathname === item.path
              ? '#000'
              : '#B7D430',
              minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
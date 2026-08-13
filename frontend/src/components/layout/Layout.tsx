import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import PageContainer from './PageContainer';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />

      <Sidebar />

      <PageContainer>
        <Toolbar />

        <Outlet />

      </PageContainer>

    </Box>
  );
}
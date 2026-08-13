import React from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from './App';
import theme from './theme/theme';

import { AuthProvider } from './pages/auth/AuthContext';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>

        <ToastContainer
          position="top-right"
          autoClose={2500}
        />
      </QueryClientProvider>

    </ThemeProvider>
  </React.StrictMode>,
);
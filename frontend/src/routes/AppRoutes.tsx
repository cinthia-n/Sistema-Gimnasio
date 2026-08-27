import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';

import ProtectedRoute from '../pages/auth/ProtectedRoute';

import Layout from '../components/layout/Layout';
//import { imageListClasses } from '@mui/material';

import ClientsPage from '../pages/Clients/ClientsPage';
//import EnrollmentsPage from '../pages/Enrollments/EnrollmentsPage';
import EnrollmentsPage from '../pages/Enrollments/EnrollmentsPage';

import PaymentsPage from '../pages/Payments/PaymentsPage';
import ProductsPage from '../pages/Products/ProductsPage';
import SalesPage from '../pages/Sales/SalesPage';
import CashPage from '../pages/Cash/CashPage';
import SuppliersPage from '../pages/Suppliers/SuppliersPage';
import PurchasesPage from '../pages/Purchases/PurchasesPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';
import RequirePasswordChange from '../pages/auth/RequirePasswordCgange';
import UsersPage from '../pages/users/UsersPage';
import AdminRoute from '../pages/auth/AdminRoute';

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout/>                
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RequirePasswordChange>
                  <DashboardPage />
                </RequirePasswordChange>
              </ProtectedRoute>
              
            }
          />
          <Route
            path="/clients"
            element={<ClientsPage />}
          />

          <Route
            path="/enrollments"
            element={<EnrollmentsPage/>}
          />

          <Route
            path="/payments"
            element={<PaymentsPage/>}
          />

          <Route
            path="/products"
            element={<ProductsPage/>}
          />

          <Route
            path="/sales"
            element={<SalesPage />}
          />

          <Route
            path="/cash"
            element={<CashPage />}
          />

          <Route
            path="/suppliers"
            element={<SuppliersPage />}
          />

          <Route
            path="/purchases"
            element={<PurchasesPage />}
          />

          <Route
            path="/reports"
            element={
              <AdminRoute>
                <ReportsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <AdminRoute>
                <SettingsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/cambiar-contrasena"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />


        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;
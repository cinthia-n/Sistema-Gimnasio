import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useState } from "react";

import {
  useEmployees,
} from "../../hooks/useEmployees";

import EmployeeDialog from "./components/EmployeeDialog";

export default function UsersPage() {

  const {
    employees,
    isLoading,
    createEmployee,
    changeStatus,
  } = useEmployees();

  const [openDialog, setOpenDialog] =
    useState(false);

  const handleCreate = async (data: {
    username: string;
    fullName: string;
    password: string;
  }) => {

    await createEmployee.mutateAsync(data);

    setOpenDialog(false);
  };

  const handleStatus = async (
    id: number,
    isActive: boolean,
  ) => {

    await changeStatus.mutateAsync({
      id,
      isActive,
    });
  };

  return (
    <Stack spacing={3}>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >

        <Typography variant="h4">
          Usuarios
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            setOpenDialog(true)
          }
        >
          Nueva empleada
        </Button>

      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Administración de las cuentas del personal
        del gimnasio.
      </Typography>

      <TableContainer
        component={Paper}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Usuario
              </TableCell>

              <TableCell>
                Nombre
              </TableCell>

              <TableCell>
                Rol
              </TableCell>

              <TableCell>
                Estado
              </TableCell>

              <TableCell>
                Contraseña
              </TableCell>

              <TableCell align="right">
                Acción
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {isLoading ? (

              <TableRow>

                <TableCell
                  colSpan={6}
                  align="center"
                >
                  Cargando usuarios...
                </TableCell>

              </TableRow>

            ) : employees.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={6}
                  align="center"
                >
                  No hay empleadas registradas.
                </TableCell>

              </TableRow>

            ) : (

              employees.map((employee) => (

                <TableRow
                  key={employee.id}
                >

                  <TableCell>
                    {employee.username}
                  </TableCell>

                  <TableCell>
                    {employee.fullName}
                  </TableCell>

                  <TableCell>
                    Vendedora
                  </TableCell>

                  <TableCell>

                    <Chip
                      label={
                        employee.isActive
                          ? "Activo"
                          : "Inactivo"
                      }
                      color={
                        employee.isActive
                          ? "success"
                          : "default"
                      }
                      size="small"
                    />

                  </TableCell>

                  <TableCell>

                    {employee.mustChangePassword
                      ? "Pendiente de cambio"
                      : "Actualizada"}

                  </TableCell>

                  <TableCell align="right">

                    <Button
                      size="small"
                      color={
                        employee.isActive
                          ? "error"
                          : "success"
                      }
                      onClick={() =>
                        handleStatus(
                          employee.id,
                          !employee.isActive,
                        )
                      }
                    >

                      {employee.isActive
                        ? "Desactivar"
                        : "Activar"}

                    </Button>

                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

      </TableContainer>

      <EmployeeDialog
        open={openDialog}
        onClose={() =>
          setOpenDialog(false)
        }
        onSave={handleCreate}
        loading={
          createEmployee.isPending
        }
      />

    </Stack>
  );
}
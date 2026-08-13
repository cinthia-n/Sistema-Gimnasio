import { useState } from 'react';

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
  useServicePrices,
  useCreateServicePrice,
  useUpdateServicePrice,
  useDeleteServicePrice,
} from '../../../hooks/useServicePrices';

import { useQuery } from '@tanstack/react-query';

import { getServices } from '../../../services/service.service';

interface Service {
  id: number;
  name: string;
  code: string;
}

interface ServicePriceForm {
  serviceId: number | '';
  isStudent: boolean;
  price: string;
}

const initialForm: ServicePriceForm = {
  serviceId: '',
  isStudent: false,
  price: '',
};

export default function ServicePricesSection() {
  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<ServicePriceForm>(
      initialForm,
    );

  const {
    data: servicePrices = [],
    isLoading,
  } = useServicePrices();

  const {
    data: services = [],
  } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const createServicePrice =
    useCreateServicePrice();

  const updateServicePrice =
    useUpdateServicePrice();

  const deleteServicePrice =
    useDeleteServicePrice();

  // --------------------------------------------------
  // Buscar tarifa de un servicio
  // --------------------------------------------------

  const getPrice = (
    serviceId: number,
    isStudent: boolean,
  ) => {
    return servicePrices.find(
      (price: any) =>
        Number(price.serviceId) === serviceId &&
        price.isStudent === isStudent,
    );
  };

  // --------------------------------------------------
  // Nombre correcto del servicio
  // --------------------------------------------------

  const getServiceName = (
    service: Service,
  ) => {
    if (service.code === 'MONTHLY') {
      return 'Mensual';
    }

    return service.name;
  };

  // --------------------------------------------------
  // Abrir formulario para crear
  // --------------------------------------------------

  const handleOpenCreate = () => {
    setEditingId(null);

    setForm({
      serviceId: '',
      isStudent: false,
      price: '',
    });

    setOpen(true);
  };

  // --------------------------------------------------
  // Abrir formulario para editar
  // --------------------------------------------------

  const handleOpenEdit = (
    servicePrice: any,
  ) => {
    setEditingId(servicePrice.id);

    setForm({
      serviceId: servicePrice.serviceId,
      isStudent: servicePrice.isStudent,
      price: String(servicePrice.price),
    });

    setOpen(true);
  };

  // --------------------------------------------------
  // Cerrar formulario
  // --------------------------------------------------

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  // --------------------------------------------------
  // Guardar tarifa
  // --------------------------------------------------

  const handleSave = async () => {
    if (!form.serviceId) {
      alert('Seleccione un servicio');
      return;
    }

    const price = Number(form.price);

    if (!form.price || price <= 0) {
      alert('Ingrese un precio válido');
      return;
    }

    const dto = {
      serviceId: Number(form.serviceId),
      isStudent: form.isStudent,
      price,
    };

    try {
      if (editingId !== null) {
        await updateServicePrice.mutateAsync({
          id: editingId,
          dto,
        });
      } else {
        await createServicePrice.mutateAsync(
          dto,
        );
      }

      handleClose();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ??
          'No se pudo guardar la tarifa',
      );
    }
  };

  // --------------------------------------------------
  // Eliminar tarifa
  // --------------------------------------------------

  const handleDelete = async (
    id: number,
  ) => {
    const confirmed =
      window.confirm(
        '¿Está seguro de eliminar esta tarifa?',
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteServicePrice.mutateAsync(
        id,
      );
    } catch (error) {
      console.error(error);

      alert(
        'No se pudo eliminar la tarifa',
      );
    }
  };

  // --------------------------------------------------
  // Cargando
  // --------------------------------------------------

  if (isLoading) {
    return (
      <Typography>
        Cargando tarifas...
      </Typography>
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Box>
      {/* ENCABEZADO */}

      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        justifyContent="space-between"
        alignItems={{
          xs: 'flex-start',
          sm: 'center',
        }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5">
            Tarifas de servicios
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Configure los precios normales y
            los precios para estudiantes de
            colegio.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nueva tarifa
        </Button>
      </Stack>

      {/* TABLA */}

      <TableContainer
        component={Paper}
        elevation={1}
      >
        <Table
          size="small"
          sx={{
            minWidth: 850,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Servicio</strong>
              </TableCell>

              <TableCell>
                <strong>Código</strong>
              </TableCell>

              <TableCell align="right">
                <strong>Tarifa normal</strong>
              </TableCell>

              <TableCell align="right">
                <strong>Estudiante de colegio</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Estado</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Acciones</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map(
              (service) => {
                const normal =
                  getPrice(
                    service.id,
                    false,
                  );

                const student =
                  getPrice(
                    service.id,
                    true,
                  );

                const hasAnyPrice =
                  Boolean(
                    normal ||
                      student,
                  );

                return (
                  <TableRow
                    key={service.id}
                    hover
                  >
                    {/* SERVICIO */}

                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                      >
                        {getServiceName(
                          service,
                        )}
                      </Typography>
                    </TableCell>

                    {/* CÓDIGO */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {service.code}
                      </Typography>
                    </TableCell>

                    {/* TARIFA NORMAL */}

                    <TableCell align="right">
                      {normal ? (
                        <Typography
                          fontWeight={600}
                        >
                          Bs{' '}
                          {Number(
                            normal.price,
                          ).toFixed(2)}
                        </Typography>
                      ) : (
                        <Typography
                          color="text.disabled"
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* TARIFA ESTUDIANTE */}

                    <TableCell align="right">
                      {student ? (
                        <Typography
                          fontWeight={600}
                        >
                          Bs{' '}
                          {Number(
                            student.price,
                          ).toFixed(2)}
                        </Typography>
                      ) : (
                        <Typography
                          color="text.disabled"
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* ESTADO */}

                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={
                          hasAnyPrice
                            ? 'Configurado'
                            : 'Sin tarifa'
                        }
                        color={
                          hasAnyPrice
                            ? 'success'
                            : 'default'
                        }
                      />
                    </TableCell>

                    {/* ACCIONES */}

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        {/* Editar normal */}

                        {normal && (
                          <Button
                            size="small"
                            color="inherit"
                            title="Editar tarifa normal"
                            onClick={() =>
                              handleOpenEdit(
                                normal,
                              )
                            }
                            sx={{
                              minWidth: 36,
                            }}
                          >
                            <EditIcon
                              fontSize="small"
                            />
                          </Button>
                        )}

                        {/* Editar estudiante */}

                        {student && (
                          <Button
                            size="small"
                            color="info"
                            title="Editar tarifa de estudiante"
                            onClick={() =>
                              handleOpenEdit(
                                student,
                              )
                            }
                            sx={{
                              minWidth: 36,
                            }}
                          >
                            <EditIcon
                              fontSize="small"
                            />
                          </Button>
                        )}

                        {/* Eliminar normal */}

                        {normal && (
                          <Button
                            size="small"
                            color="error"
                            title="Eliminar tarifa normal"
                            onClick={() =>
                              handleDelete(
                                normal.id,
                              )
                            }
                            sx={{
                              minWidth: 36,
                            }}
                          >
                            <DeleteIcon
                              fontSize="small"
                            />
                          </Button>
                        )}

                        {/* Eliminar estudiante */}

                        {student && (
                          <Button
                            size="small"
                            color="error"
                            title="Eliminar tarifa de estudiante"
                            onClick={() =>
                              handleDelete(
                                student.id,
                              )
                            }
                            sx={{
                              minWidth: 36,
                            }}
                          >
                            <DeleteIcon
                              fontSize="small"
                            />
                          </Button>
                        )}

                        {/* Crear tarifa normal */}

                        {!normal && (
                          <Button
                            size="small"
                            color="success"
                            title="Crear tarifa normal"
                            onClick={() => {
                              setEditingId(
                                null,
                              );

                              setForm({
                                serviceId:
                                  service.id,
                                isStudent:
                                  false,
                                price: '',
                              });

                              setOpen(
                                true,
                              );
                            }}
                          >
                            + Normal
                          </Button>
                        )}

                        {/* Crear tarifa estudiante */}

                        {!student && (
                          <Button
                            size="small"
                            color="info"
                            title="Crear tarifa de estudiante"
                            onClick={() => {
                              setEditingId(
                                null,
                              );

                              setForm({
                                serviceId:
                                  service.id,
                                isStudent:
                                  true,
                                price: '',
                              });

                              setOpen(
                                true,
                              );
                            }}
                          >
                            + Est.
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              },
            )}

            {services.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                >
                  <Typography
                    color="text.secondary"
                    py={3}
                  >
                    No hay servicios
                    registrados.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* FORMULARIO */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId !== null
            ? 'Editar tarifa'
            : 'Nueva tarifa'}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={3}
            mt={1}
          >
            {/* SERVICIO */}

            <FormControl fullWidth>
              <InputLabel>
                Servicio
              </InputLabel>

              <Select
                label="Servicio"
                value={form.serviceId}
                disabled={
                  editingId !== null
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    serviceId:
                      Number(
                        e.target.value,
                      ),
                  })
                }
              >
                {services.map(
                  (service) => (
                    <MenuItem
                      key={service.id}
                      value={service.id}
                    >
                      {getServiceName(
                        service,
                      )}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>

            {/* TIPO DE CLIENTE */}

            <FormControl fullWidth>
              <InputLabel>
                Tipo de cliente
              </InputLabel>

              <Select
                label="Tipo de cliente"
                value={
                  form.isStudent
                    ? 'student'
                    : 'normal'
                }
                disabled={
                  editingId !== null
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    isStudent:
                      e.target.value ===
                      'student',
                  })
                }
              >
                <MenuItem value="normal">
                  Cliente normal
                </MenuItem>

                <MenuItem value="student">
                  Estudiante de colegio
                </MenuItem>
              </Select>
            </FormControl>

            {/* PRECIO */}

            <TextField
              fullWidth
              label="Precio"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: '0.01',
                },
              }}
              InputProps={{
                startAdornment: (
                  <Typography
                    sx={{ mr: 1 }}
                  >
                    Bs
                  </Typography>
                ),
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              createServicePrice.isPending ||
              updateServicePrice.isPending
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
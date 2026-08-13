import { useState } from 'react';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Typography,
  Chip,
  IconButton,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { toast } from 'react-toastify';

import TableToolbar from '../../components/table/TableToolbar';
import DataTable from '../../components/table/DataTable';
import FormDialog from '../../components/common/FormDialog';

import ClientForm from './components/ClientForm';

import { clientSchema } from '../../validations/client.schema';
import type { ClientFormData } from '../../validations/client.schema';

import { useClients } from '../../hooks/useClients';
import { useCreateClient } from '../../hooks/useCreateClient';
import { useUpdateClient } from '../../hooks/useUpdateClient';
import { useDeleteClient } from '../../hooks/useDeleteClient';

export default function ClientsPage() {

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingClient, setEditingClient] = useState<any>(null);

  const methods = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),

    defaultValues: {
      fullName: '',
      ci: '',
      phone: '',
      isStudent: false,
      birthDate: '',
      gender: '',
      address: '',
    },
  });

  const { data = [] } = useClients(search);

  const createClient = useCreateClient();

  const updateClient = useUpdateClient();
  
  const deleteClient = useDeleteClient();

  function handleNew() {

    setEditingClient(null);

    methods.reset({

        fullName: '',
        ci: '',
        phone: '',
        isStudent: false,
        birthDate: '',
        gender: '',
        address: '',

    });

      setOpen(true);

  }

  function handleEdit(client: any) {

    setEditingClient(client);

    methods.reset({

      fullName: client.fullName,

      ci: client.ci,

      phone: client.phone,

      isStudent: client.isStudent,

      birthDate: client.birthDate
        ? client.birthDate.substring(0,10)
        : '',

      gender: client.gender ?? '',

      address: client.address ?? '',

    });

    setOpen(true);

  }

  async function handleDelete(client: any) {

  const ok = window.confirm(

    `¿Desea desactivar a ${client.fullName}?\n\nEl cliente conservara todo su historial y podra reactivarse posteriormente.`

  );

  if (!ok) return;

  try {

    await deleteClient.mutateAsync(

      client.id,

    );

    toast.success(

      'Cliente desactivado correctamente'

    );

  }

  catch {

    toast.error(

      'No se pudo desactivar el Cliente'

    );

  }

}


  function handleClose() {

    setOpen(false);

  }

  async function onSubmit(data: ClientFormData) {

    const payload = {

      ...data,

      gender:
        data.gender === ''
          ? undefined
          : data.gender,

    };

    try {

      if (editingClient) {

        await updateClient.mutateAsync({

          id: editingClient.id,

          data: payload,

        });

        toast.success(
          'Cliente actualizado'
        );

      }

      else {

        await createClient.mutateAsync(
          payload
        );

        toast.success(
          'Cliente registrado'
        );

      }

      setOpen(false);

      methods.reset();

    }

    catch {

      toast.error(
        'Ocurrió un error'
      );

    }

  }

  const columns = [

    {
      field: 'fullName',
      headerName: 'Nombre completo',
    },

    {
      field: 'ci',
      headerName: 'CI',
    },

    {
      field: 'phone',
      headerName: 'Celular',
    },

    {
      field: 'isStudent',
      headerName: 'Estudiante',
    },

    {
      field: 'actions',
      headerName: 'Acciones',
    },

  ];

  const rows = data.map((client: any) => ({

    ...client,

    isStudent: (

      <Chip
        label={client.isStudent ? 'Sí' : 'No'}
        color={client.isStudent ? 'success' : 'default'}
        size="small"
      />

    ),

    actions: (

      <>

        <IconButton

          color="primary"

          onClick={() => handleEdit(client)}

        >

        <EditIcon />

        </IconButton>

        <IconButton 
          
          color="error"
          onClick={() => handleDelete(client)}
        >

          <DeleteIcon />

        </IconButton>

      </>

    ),

  }));

  return (

    <>

      <Typography
        variant="h4"
        mb={3}
      >

        Clientes

      </Typography>

      <TableToolbar
        title="clientes"
        onNew={handleNew}
        search={search}
        onSearchChange={setSearch}
      />

      <DataTable
        columns={columns}
        rows={rows}
      />

      <FormProvider {...methods}>

        <FormDialog
          open={open}
          title={
            editingClient
              ?'Editar Cliente'
              : 'Nuevo Cliente'
          }
          onClose={handleClose}
          onSave={methods.handleSubmit(onSubmit)}
        >

          <ClientForm />

        </FormDialog>

      </FormProvider>

    </>

  );

}
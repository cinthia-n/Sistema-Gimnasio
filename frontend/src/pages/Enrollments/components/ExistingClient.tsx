import {
  TextField,
  MenuItem,
} from '@mui/material';

interface ExistingClientProps {

  clients: any[];

  clientId: number | '';

  onClientChange: (value: number) => void;

}

export default function ExistingClient({

  clients,

  clientId,

  onClientChange,

}: ExistingClientProps) {

  return (

    <TextField
      fullWidth
      select
      label="Cliente"
      value={clientId}
      onChange={(e) =>
        onClientChange(
          Number(e.target.value),
        )
      }
    >

      {clients.map((client: any) => (

        <MenuItem
          key={client.id}
          value={client.id}
        >

          {client.fullName}

        </MenuItem>

      ))}

    </TextField>

  );

}
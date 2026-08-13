import {
  Stack,
  Button,
  TextField,
} from '@mui/material';

interface Props {
  title: string;
  onNew: () => void;
  search: string;
  onSearchChange: (
    value: string,
  ) => void;
}

export default function TableToolbar({
  title,
  onNew,
  search,
  onSearchChange,
}: Props) {

  return (

    <Stack
      direction="row"
      justifyContent="space-between"
      mb={3}
    >

      <TextField
        size="small"
        placeholder={`Buscar ${title}...`}
        value={search}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        sx={{
          width: 350,
        }}
      />

      <Button
        variant="contained"
        onClick={onNew}
      >
        Nuevo
      </Button>

    </Stack>

  );

}
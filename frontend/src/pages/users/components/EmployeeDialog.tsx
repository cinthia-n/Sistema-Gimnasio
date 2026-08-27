import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    username: string;
    fullName: string;
    password: string;
  }) => void;
  loading?: boolean;
}

export default function EmployeeDialog({
  open,
  onClose,
  onSave,
  loading = false,
}: Props) {

  const [fullName, setFullName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleClose = () => {

    setFullName("");
    setUsername("");
    setPassword("");

    onClose();
  };

  const handleSave = () => {

    if (
      !fullName.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      return;
    }

    onSave({
      fullName: fullName.trim(),
      username: username.trim(),
      password,
    });

    setFullName("");
    setUsername("");
    setPassword("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>
        Nueva empleada
      </DialogTitle>

      <DialogContent>

        <Stack spacing={3} mt={1}>

          <TextField
            label="Nombre completo"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            fullWidth
          />

          <TextField
            label="Nombre de usuario"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            fullWidth
          />

          <TextField
            label="Contraseña inicial"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            helperText="La empleada deberá cambiarla al ingresar."
            fullWidth
          />

        </Stack>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={handleClose}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            loading ||
            !fullName.trim() ||
            !username.trim() ||
            !password
          }
        >
          Crear empleada
        </Button>

      </DialogActions>

    </Dialog>
  );
}
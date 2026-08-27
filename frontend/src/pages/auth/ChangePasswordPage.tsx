import {
  Alert,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "./AuthContext";

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError("");

    if (!currentPassword || !newPassword) {
      setError(
        "Todos los campos son obligatorios",
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "La nueva contraseña debe tener al menos 6 caracteres",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Las contraseñas nuevas no coinciden",
      );
      return;
    }

    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    try {
      setLoading(true);

      await api.patch(
        `/auth/change-password/${user.id}`,
        {
          currentPassword,
          newPassword,
        },
      );

      /*
       * El cambio fue exitoso.
       *
       * Actualizamos el usuario almacenado
       * para que el frontend deje de considerar
       * que debe cambiar la contraseña.
       */

      const updatedUser = {
        ...user,
        mustChangePassword: false,
      };

      localStorage.setItem(
        "edra_user",
        JSON.stringify(updatedUser),
      );

      navigate("/inicio", {
        replace: true,
      });

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "No se pudo cambiar la contraseña",
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      spacing={3}
      sx={{
        width: "100%",
        maxWidth: 450,
        margin: "80px auto",
        padding: 3,
      }}
    >
      <Typography variant="h4">
        Cambiar contraseña
      </Typography>

      <Typography color="text.secondary">
        Por seguridad, debes cambiar tu contraseña
        antes de continuar.
      </Typography>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Contraseña actual"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
          />

          <TextField
            label="Nueva contraseña"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading
              ? "Actualizando..."
              : "Cambiar contraseña"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
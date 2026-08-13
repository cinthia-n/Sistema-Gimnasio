import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  loginSchema,
  type LoginFormData,
} from '../../validations/login.schema';

import { login as loginService } from '../auth/auth.service';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const auth = useAuth();
  const navigate = useNavigate();

  async function onSubmit(data: LoginFormData) {

  try {

    const response =
      await loginService(data);

    auth.login(
      response.access_token,
      response.user,
    );

    toast.success(
      `Bienvenido ${response.user.fullName}`,
    );

    navigate('/dashboard');

  } catch {

    toast.error(
      'Usuario o contraseña incorrectos',
    );

  }

}
  return (
    <Container maxWidth="sm">

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >

        <Paper
          elevation={5}
          sx={{
            width: '100%',
            p: 5,
            borderRadius: 4,
          }}
        >

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 60,
                height: 60,
                mb: 2,
              }}
            >
              <LockIcon />
            </Avatar>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              EDRA Fitness Club
            </Typography>

            <Typography
              color="text.secondary"
              mb={4}
            >
              Iniciar sesión
            </Typography>

          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>

            <TextField
              label="Usuario"
              fullWidth
              margin="normal"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                mt: 3,
              }}
            >
              Ingresar
            </Button>

          </form>

        </Paper>

      </Box>

    </Container>
  );
}
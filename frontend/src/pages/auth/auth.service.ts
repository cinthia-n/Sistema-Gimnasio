import api from '../../api/axios';

export interface LoginDto {
  username: string;
  password: string;
}

export async function login(dto: LoginDto) {
  const response = await api.post(
    '/auth/login',
    dto,
  );

  return response.data;
}
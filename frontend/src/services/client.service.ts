import api from '../api/axios';

export async function getClients() {
  const { data } = await api.get('/clients');

  return data;
}
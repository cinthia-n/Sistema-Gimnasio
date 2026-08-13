import api from '../../api/axios';

import type { Client } from '../../types/client';


export async function getClients(search = '') {

  const { data } =
    await api.get('/clients', {
        params: {
            search,
        },
    });

  return data;

}

export async function createClient(
  client: Omit<Client, 'id' | 'createdAt' | 'active'>,
) {

  const { data } =
    await api.post(
      '/clients',
      client,
    );

  return data;

}

export async function updateClient(

  id: number,

  data: any,

) {

  const response = await api.put(

    `/clients/${id}`,

    data,

  );

  return response.data;

}

export async function deleteClient(id: number) 
{
    const{data} = await api.delete(
      `/clients/${id}`,  
    );
    return data;
    
}

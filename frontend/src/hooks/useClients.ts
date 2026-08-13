import { useQuery } from '@tanstack/react-query';

import {
  getClients,
} from '../services/clients/client.service';

export function useClients(search: string) {

  return useQuery({

    queryKey: ['clients', search],

    queryFn: () => getClients(search),

  });

}
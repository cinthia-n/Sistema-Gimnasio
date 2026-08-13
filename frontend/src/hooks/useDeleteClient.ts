import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteClient } from '../services/clients/client.service';

export function useDeleteClient() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: deleteClient,

    onSuccess() {

      queryClient.invalidateQueries({

        queryKey: ['clients'],

      });

    },

  });

}
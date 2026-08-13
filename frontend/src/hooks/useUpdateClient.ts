import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateClient } from '../services/clients/client.service';

export function useUpdateClient() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: ({
      id,
      data,
    }: any) => updateClient(id, data),

    onSuccess() {

      queryClient.invalidateQueries({

        queryKey: ['clients'],

      });

    },

  });

}
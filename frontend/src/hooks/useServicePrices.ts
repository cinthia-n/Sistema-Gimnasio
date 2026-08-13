import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getServicePrices,
  createServicePrice,
  updateServicePrice,
  deleteServicePrice,
} from '../services/service-price.service';

export function useServicePrices() {
  return useQuery({
    queryKey: ['service-prices'],
    queryFn: getServicePrices,
  });
}

export function useCreateServicePrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServicePrice,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['service-prices'],
      });
    },
  });
}

export function useUpdateServicePrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: {
        serviceId: number;
        isStudent: boolean;
        price: number;
      };
    }) =>
      updateServicePrice(id, dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['service-prices'],
      });
    },
  });
}

export function useDeleteServicePrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServicePrice,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['service-prices'],
      });
    },
  });
}
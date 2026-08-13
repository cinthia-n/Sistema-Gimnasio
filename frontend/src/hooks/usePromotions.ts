import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getPromotions,
  createPromotion,
  updatePromotion,
  togglePromotion,
} from "../services/promotion.service";

export function usePromotions() {

  return useQuery({
    queryKey: ["promotions"],
    queryFn: getPromotions,
  });

}

export function useCreatePromotion() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: createPromotion,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["promotions"],
      });

    },

  });

}

export function useUpdatePromotion() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: any;
    }) =>
      updatePromotion(id, dto),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["promotions"],
      });

    },

  });

}

export function useTogglePromotion() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: togglePromotion,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["promotions"],
      });

    },

  });

}
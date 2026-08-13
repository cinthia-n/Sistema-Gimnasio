import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "../services/product.service";

export function useUpdateProduct() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({
            id,
            dto,
        }: {
            id: number;
            dto: any;
        }) => updateProduct(id, dto),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["products"],

            });

        },

    });

}
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { registerSale } from "../services/sale.service";

export function useRegisterSale() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: registerSale,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["sales"],
            });

        },

    });

}
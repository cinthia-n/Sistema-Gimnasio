import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService } from "../services/purchase.service";

export function useCreatePurchase() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: purchaseService.create,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["purchases"],
            });

            queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            queryClient.invalidateQueries({
                queryKey: ["cashSummary"],
            });

            queryClient.invalidateQueries({
                queryKey: ["cashHistory"],
            });

            queryClient.invalidateQueries({
                queryKey: ["cashDetail"],
            });

        },

    });

}
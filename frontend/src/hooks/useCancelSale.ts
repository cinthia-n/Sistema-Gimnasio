import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelSale } from "../services/sale.service";

export function useCancelSale() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            cancelSale(id, reason),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["available-products"] });
            queryClient.invalidateQueries({ queryKey: ["cash-summary"] });
            queryClient.invalidateQueries({ queryKey: ["current-cash"] });
        },
    });

}
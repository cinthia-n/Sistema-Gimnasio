import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService } from "../services/purchase.service";

export function useCancelPurchase() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            purchaseService.cancel(id, reason),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["purchases"] });
            queryClient.invalidateQueries({ queryKey: ["available-products"] });
            queryClient.invalidateQueries({ queryKey: ["cash-summary"] });
            queryClient.invalidateQueries({ queryKey: ["current-cash"] });
        },
    });

}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeCash } from "../services/cash.service";

export function useCloseCash() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: closeCash,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["cash-summary"],
            });

            queryClient.invalidateQueries({
                queryKey: ["cash"],
            });

            queryClient.invalidateQueries({
                queryKey: ["current-cash"],
            });

        },

    });

}
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { openCash } from "../services/cash.service";

export function useOpenCash() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: openCash,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["cash-summary"],

            });

            queryClient.invalidateQueries({

                queryKey: ["current-cash"],

            });

        },

    });

}
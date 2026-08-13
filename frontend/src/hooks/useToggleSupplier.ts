import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleSupplier } from "../services/supplier.service";

export function useToggleSupplier() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: toggleSupplier,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["suppliers"],

            });

        },

    });

}
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSupplier } from "../services/supplier.service";

export function useUpdateSupplier() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({

            id,

            dto,

        }: any) =>

            updateSupplier(id, dto),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["suppliers"],

            });

        },

    });

}
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { registerPayment } from "../services/payment.service";

export function useRegisterPayment() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: registerPayment,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["payments"],

            });

            queryClient.invalidateQueries({

                queryKey: ["pending-memberships"],

            });

        },

    });

}
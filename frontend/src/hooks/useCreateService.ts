import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import {

    createService,

} from "../services/service.service";

export function useCreateService() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: createService,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["services"],

            });

        },

    });

}
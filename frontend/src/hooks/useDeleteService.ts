import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import {

    deleteService,

} from "../services/service.service";

export function useDeleteService() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: deleteService,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["services"],

            });

        },

    });

}
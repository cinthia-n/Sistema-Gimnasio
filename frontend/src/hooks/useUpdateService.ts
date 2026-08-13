import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import {

    updateService,

} from "../services/service.service";

export function useUpdateService() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({

            id,

            dto,

        }: any) =>

            updateService(

                id,

                dto,

            ),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["services"],

            });

        },

    });

}
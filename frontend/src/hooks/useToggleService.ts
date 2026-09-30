import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleService } from "../services/service.service";

export function useToggleService() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => toggleService(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });

}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelEnrollment } from "../services/enrollment.service";

export function useCancelEnrollment() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            cancelEnrollment(id, reason),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] });
            queryClient.invalidateQueries({ queryKey: ["pending-payments"] });
            queryClient.invalidateQueries({ queryKey: ["cash-summary"] });
            queryClient.invalidateQueries({ queryKey: ["current-cash"] });
        },
    });

}
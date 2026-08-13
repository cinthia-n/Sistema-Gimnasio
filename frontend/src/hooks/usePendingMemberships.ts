import { useQuery } from "@tanstack/react-query";

import { getPendingMemberships } from "../services/payment.service";

export function usePendingMemberships(
    clientId?: number,
) {

    return useQuery({

        queryKey: [
            "pending-memberships",
            clientId,
        ],

        queryFn: () =>
            getPendingMemberships(clientId!),

        enabled: !!clientId,

    });

}
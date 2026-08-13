import { useQuery } from "@tanstack/react-query";

import { getPendingPayments } from "../services/payment.service";

export function usePendingPayments() {

    return useQuery({

        queryKey: ["pending-payments"],

        queryFn: getPendingPayments,

    });

}
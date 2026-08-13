import { useQuery } from "@tanstack/react-query";

import { getCashSummary } from "../services/cash.service";

export function useCashSummary() {

    return useQuery({

        queryKey: ["cash-summary"],

        queryFn: getCashSummary,

        retry: false,

    });

}
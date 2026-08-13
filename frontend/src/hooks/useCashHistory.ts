import { useQuery } from "@tanstack/react-query";

import { getCashHistory } from "../services/cash.service";

export function useCashHistory() {

    return useQuery({

        queryKey: ["cash-history"],

        queryFn: getCashHistory,

    });

}
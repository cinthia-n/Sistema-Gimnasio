import { useQuery } from "@tanstack/react-query";

import { getCashHistoryDetail } from "../services/cash.service";

export function useCashHistoryDetail(id?: number) {

    return useQuery({

        queryKey: ["cash-history-detail", id],

        queryFn: () => getCashHistoryDetail(id!),

        enabled: !!id,

    });

}
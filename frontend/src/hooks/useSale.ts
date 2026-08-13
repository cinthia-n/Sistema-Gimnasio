import { useQuery } from "@tanstack/react-query";

import { getSale } from "../services/sale.service";

export function useSale(
    id?: number,
) {

    return useQuery({

        queryKey: [

            "sale",

            id,

        ],

        queryFn: () => getSale(id!),

        enabled: !!id,

    });

}
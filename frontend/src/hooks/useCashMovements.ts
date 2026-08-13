import { useQuery } from "@tanstack/react-query";

import { getCashMovements } from "../services/cash.service";

export function useCashMovements() {

    return useQuery({

        queryKey: ["cash"],

        queryFn: getCashMovements,

    });

}
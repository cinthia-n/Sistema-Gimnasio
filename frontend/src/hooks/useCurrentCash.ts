import { useQuery } from "@tanstack/react-query";

import { getCurrentCash } from "../services/cash.service";

export function useCurrentCash() {

    return useQuery({

        queryKey: ["current-cash"],

        queryFn: getCurrentCash,

    });

}
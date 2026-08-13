import { useQuery } from "@tanstack/react-query";

import { getAvailableProducts } from "../services/product.service";

export function useAvailableProducts() {

    return useQuery({

        queryKey: ["available-products"],

        queryFn: getAvailableProducts,

    });

}
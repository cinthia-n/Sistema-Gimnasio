import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../services/product.service";

export function useProducts(
    search: string = "",
) {

    return useQuery({

        queryKey: [
            "products",
            search,
        ],

        queryFn: () =>
            getProducts(search),

    });

}
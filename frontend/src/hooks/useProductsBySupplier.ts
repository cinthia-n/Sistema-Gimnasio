import { useQuery } from "@tanstack/react-query";

import { getProductsBySupplier } from "../services/product.service";

export function useProductsBySupplier(
    supplierId?: number,
) {

    return useQuery({

        queryKey: [

            "products",

            supplierId,

        ],

        queryFn: () =>

            getProductsBySupplier(supplierId!),

        enabled: !!supplierId,

    });

}
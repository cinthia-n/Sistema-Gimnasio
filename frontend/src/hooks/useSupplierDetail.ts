import { useQuery } from "@tanstack/react-query";

import { getSupplierDetail } from "../services/supplier.service";

export function useSupplierDetail(id?: number) {

    return useQuery({

        queryKey: [

            "supplier-detail",

            id,

        ],

        queryFn: () =>

            getSupplierDetail(id!),

        enabled: !!id,

    });

}
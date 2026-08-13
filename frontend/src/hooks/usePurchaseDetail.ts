import { useQuery } from "@tanstack/react-query";
import { purchaseService } from "../services/purchase.service";

export function usePurchaseDetail(id?: number) {

  return useQuery({

    queryKey: ["purchase", id],

    queryFn: () => purchaseService.getOne(id!),

    enabled: !!id,

  });

}
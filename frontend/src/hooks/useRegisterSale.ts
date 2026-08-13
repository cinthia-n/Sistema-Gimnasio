import { useMutation } from "@tanstack/react-query";

import { registerSale } from "../services/sale.service";

export function useRegisterSale() {

    return useMutation({

        mutationFn: registerSale,

    });

}
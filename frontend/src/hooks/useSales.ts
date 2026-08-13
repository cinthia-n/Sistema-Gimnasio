import { useQuery } from '@tanstack/react-query';

import { getSales } from '../services/sale.service';

export function useSales() {

    return useQuery({

        queryKey: ['sales'],

        queryFn: getSales,

    });

}
import { useQuery } from "@tanstack/react-query";

import {
    getPurchasesReport,    
} from "../services/reports.service";
import type { ReportFilterDto } from "../services/reports.service";
export function usePurchasesReport(
    filter: ReportFilterDto,
) {

    return useQuery({

        queryKey: [
            "report-purchases",
            filter,
        ],

        queryFn: () =>
            getPurchasesReport(filter),

        enabled:
            !!filter.startDate &&
            !!filter.endDate,

    });

}
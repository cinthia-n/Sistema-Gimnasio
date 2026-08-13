import { useQuery } from "@tanstack/react-query";

import {getSalesReport} from "../services/reports.service";

import type { ReportFilterDto } from "../services/reports.service";

export function useSalesReport(
    filter: ReportFilterDto,
) {

    return useQuery({

        queryKey: [
            "report-sales",
            filter,
        ],

        queryFn: () =>
            getSalesReport(filter),

        enabled:
            !!filter.startDate &&
            !!filter.endDate,

    });

}
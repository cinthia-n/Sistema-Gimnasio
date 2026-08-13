import { useQuery } from "@tanstack/react-query";

import {
    getCashReport,
    } from "../services/reports.service";
import type { ReportFilterDto } from "../services/reports.service";
export function useCashReport(
    filter: ReportFilterDto,
) {

    return useQuery({

        queryKey: [
            "report-cash",
            filter,
        ],

        queryFn: () =>
            getCashReport(filter),

        enabled:
            !!filter.startDate &&
            !!filter.endDate,

    });

}
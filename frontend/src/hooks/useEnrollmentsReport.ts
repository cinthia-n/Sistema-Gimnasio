import { useQuery } from "@tanstack/react-query";

import {
    getEnrollmentsReport,    
} from "../services/reports.service";
import type { ReportFilterDto } from "../services/reports.service";
export function useEnrollmentsReport(
    filter: ReportFilterDto,
) {

    return useQuery({

        queryKey: [
            "report-enrollments",
            filter,
        ],

        queryFn: () =>
            getEnrollmentsReport(filter),

        enabled:
            !!filter.startDate &&
            !!filter.endDate,

    });

}
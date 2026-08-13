import api from "../api/axios";

export interface ReportFilterDto {
    startDate: string;
    endDate: string;
}

//--------------------------------------
// Ventas
//--------------------------------------

export async function getSalesReport(
    filter: ReportFilterDto,
) {

    const { data } = await api.get(
        "/reports/sales",
        {
            params: filter,
        },
    );

    return data;

}

//--------------------------------------
// Compras
//--------------------------------------

export async function getPurchasesReport(
    filter: ReportFilterDto,
) {

    const { data } = await api.get(
        "/reports/purchases",
        {
            params: filter,
        },
    );

    return data;

}

//--------------------------------------
// Inscripciones
//--------------------------------------

export async function getEnrollmentsReport(
    filter: ReportFilterDto,
) {

    const { data } = await api.get(
        "/reports/enrollments",
        {
            params: filter,
        },
    );

    return data;

}

//--------------------------------------
// Caja
//--------------------------------------

export async function getCashReport(
    filter: ReportFilterDto,
) {

    const { data } = await api.get(
        "/reports/cash",
        {
            params: filter,
        },
    );

    return data;

}
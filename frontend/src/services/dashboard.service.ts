import api from "../api/axios";

export async function getDashboardSummary() {

    const { data } = await api.get(
        "/dashboard/summary",
    );

    return data;
}
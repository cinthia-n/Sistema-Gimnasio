import api from "../api/axios";

export async function getCashSummary() {
    const { data } = await api.get("/cash/summary");
    return data;
}

export async function openCash(dto: {
    openingCash: number;
    openedById: number;
    observations?: string;
}) {
    const { data } = await api.post("/cash/open", dto);
    return data;
}

export async function closeCash(dto: {
    countedCash: number;
    closedById: number;
    observations?: string;
}) {
    const { data } = await api.post("/cash/close", dto);
    return data;
}

export async function getCashMovements() {
    const { data } = await api.get("/cash");
    return data;
}

export async function getCurrentCash() {

    const { data } = await api.get("/cash/current");

    return data;

}

export async function getCashHistory() {
    const { data } = await api.get("/cash/history");
    return data;
}

export async function getCashHistoryDetail(id: number) {

    const { data } = await api.get(`/cash/history/${id}`);

    return data;

}


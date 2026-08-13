import api from "../api/axios";

export async function getSuppliers() {
    const { data } = await api.get("/suppliers");
    return data;
}

export async function searchSuppliers(term: string) {
    const { data } = await api.get(`/suppliers/search/${term}`);
    return data;
}

export async function getSupplierDetail(id: number) {
    const { data } = await api.get(`/suppliers/${id}/detail`);
    return data;
}

export async function createSupplier(dto: any) {
    const { data } = await api.post("/suppliers", dto);
    return data;
}

export async function updateSupplier(id: number, dto: any) {
    const { data } = await api.patch(`/suppliers/${id}`, dto);
    return data;
}

export async function toggleSupplier(id: number) {
    const { data } = await api.patch(`/suppliers/${id}/status`);
    return data;
}
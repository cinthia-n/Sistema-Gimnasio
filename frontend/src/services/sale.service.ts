import api from "../api/axios";
export async function registerSale(dto: any) {

    const { data } = await api.post(

        "/sales",

        dto,

    );

    return data;

}

export async function getSales() {

    const { data } = await api.get("/sales");

    return data;

}

export async function getSale(
    id: number,
) {

    const { data } = await api.get(

        `/sales/${id}`,

    );

    return data;

}


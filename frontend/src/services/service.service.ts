import api from "../api/axios";

export interface ServiceDto {

    code: string;

    name: string;

    description?: string;

    type: string;

    durationDays: number;

    basePrice: number;

}

export async function getServices() {

    const { data } = await api.get(

        "/services",

    );

    return data;

}

export async function getService(

    id: number,

) {

    const { data } = await api.get(

        `/services/${id}`,

    );

    return data;

}

export async function createService(

    dto: ServiceDto,

) {

    const { data } = await api.post(

        "/services",

        dto,

    );

    return data;

}

export async function updateService(

    id: number,

    dto: Partial<ServiceDto>,

) {

    const { data } = await api.patch(

        `/services/${id}`,

        dto,

    );

    return data;

}

export async function deleteService(

    id: number,

) {

    const { data } = await api.delete(

        `/services/${id}`,

    );

    return data;

}
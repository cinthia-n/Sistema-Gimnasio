import api from "../api/axios";

export async function getPendingMemberships(
    clientId: number,
) {

    const { data } = await api.get(
        `/payments/client/${clientId}`,
    );

    return data;

}

export async function registerPayment(
    dto: any,
) {

    const { data } = await api.post(
        "/payments",
        dto,
    );

    return data;

}

export async function getPendingPayments() {

    const { data } = await api.get(

        "/payments/pending",

    );

    return data;

}
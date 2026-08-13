import api from "../api/axios";

export type ProductPriceType =
    | "MINORISTA"
    | "MAYORISTA";

export interface ProductPriceDto {

    type: ProductPriceType;

    price: number;

    minimumQuantity: number;

}

export interface ProductDto{
    supplierId:number;
    name:string;
    purchasePrice:number;
    minimumStock:number;
    prices:ProductPriceDto[];
}

export async function getProducts(
    search = "",
) {

    const { data } = await api.get(
        "/products",
        {
            params: {
                search,
            },
        },
    );

    return data;

}

export async function createProduct(
    dto: ProductDto,
) {

    const { data } = await api.post(
        "/products",
        dto,
    );

    return data;

}

export async function updateProduct(
    id: number,
    dto: ProductDto,
) {

    const { data } = await api.patch(
        `/products/${id}`,
        dto,
    );

    return data;

}

export async function deleteProduct(
    id: number,
) {

    const { data } = await api.delete(
        `/products/${id}`,
    );

    return data;

}

export async function getProduct(
    id: number,
) {

    const { data } = await api.get(
        `/products/${id}`,
    );

    return data;

}

export async function getAvailableProducts() {

    const { data } = await api.get(

        "/products/available",

    );

    return data;

}

export async function getProductsBySupplier(
    supplierId: number,
) {

    const { data } = await api.get(

        `/products/supplier/${supplierId}`,

    );

    return data;

}
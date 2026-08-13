import api from '../api/axios';

export interface ServicePrice {
  id: number;
  serviceId: number;
  isStudent: boolean;
  price: number | string;
  service: {
    id: number;
    name: string;
    code: string;
  };
}

export interface CreateServicePriceDto {
  serviceId: number;
  isStudent: boolean;
  price: number;
}

export async function getServicePrices() {
  const { data } = await api.get<ServicePrice[]>(
    '/service-prices',
  );

  return data;
}

export async function createServicePrice(
  dto: CreateServicePriceDto,
) {
  const { data } = await api.post(
    '/service-prices',
    dto,
  );

  return data;
}

export async function updateServicePrice(
  id: number,
  dto: CreateServicePriceDto,
) {
  const { data } = await api.put(
    `/service-prices/${id}`,
    dto,
  );

  return data;
}

export async function deleteServicePrice(
  id: number,
) {
  await api.delete(
    `/service-prices/${id}`,
  );
}
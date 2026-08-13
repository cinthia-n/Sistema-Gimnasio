import api from "../api/axios";

export interface PromotionDto {
  name: string;
  description?: string;
  price?: number;
  startDate: string;
  endDate: string;
  active?: boolean;
}

export async function getPromotions() {
  const { data } = await api.get("/promotions");

  return data;
}

export async function createPromotion(
  dto: PromotionDto,
) {
  const { data } = await api.post(
    "/promotions",
    dto,
  );

  return data;
}

export async function updatePromotion(
  id: number,
  dto: PromotionDto,
) {
  const { data } = await api.put(
    `/promotions/${id}`,
    dto,
  );

  return data;
}

export async function togglePromotion(
  id: number,
) {
  const { data } = await api.patch(
    `/promotions/${id}/toggle`,
  );

  return data;
}
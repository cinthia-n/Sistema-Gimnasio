import api from "../api/axios";

export const purchaseService = {

  getAll: async () => {
    const { data } = await api.get("/purchases");
    return data;
  },

  getOne: async (id: number) => {
    const { data } = await api.get(`/purchases/${id}`);
    return data;
  },

  create: async (purchase: any) => {
    const { data } = await api.post("/purchases", purchase);
    return data;
  },

};
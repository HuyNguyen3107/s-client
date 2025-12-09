import httpClient from "../../../libs/http.libs";

export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  orderCode?: string;
  customerName?: string;
  phone?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}) => {
  const response = await httpClient.get("/orders", { params });
  return response.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await httpClient.get(`/orders/${orderId}`);
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await httpClient.delete(`/orders/${orderId}`);
  return response.data;
};

export const updateOrder = async (orderId: string, data: any) => {
  const response = await httpClient.patch(`/orders/${orderId}`, data, {
    headers: { "X-Mutation-Request": "true" },
  });
  return response.data;
};

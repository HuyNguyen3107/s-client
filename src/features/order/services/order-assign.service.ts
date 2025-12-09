import httpClient from "../../../libs/http.libs";

export const assignOrderToMe = async (orderId: string) => {
  const response = await httpClient.post(`/orders/${orderId}/assign`);
  return response.data;
};

export const unassignOrder = async (orderId: string) => {
  const response = await httpClient.post(`/orders/${orderId}/unassign`);
  return response.data;
};

 

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await httpClient.patch(`/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};

export const transferOrder = async (
  orderId: string,
  targetUserEmail: string
) => {
  const response = await httpClient.post(`/orders/${orderId}/transfer`, {
    targetUserEmail,
  });
  return response.data;
};

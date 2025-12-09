import httpClient from "../../../libs/http.libs";

interface SearchOrderParams {
  orderCode?: string;
  email?: string;
}

export const searchOrder = async (params: SearchOrderParams) => {
  const queryParams = new URLSearchParams();

  if (params.orderCode) {
    queryParams.append("orderCode", params.orderCode);
  }

  if (params.email) {
    queryParams.append("email", params.email);
  }

  const response = await httpClient.get(
    `/orders/search?${queryParams.toString()}`
  );
  return response.data;
};

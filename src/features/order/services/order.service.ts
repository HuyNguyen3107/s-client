import type {
  OrderSubmissionData,
  BatchOrderSubmissionData,
} from "../types/order.types";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string | null;
    status: string;
    information: any;
    createdAt: string;
    updatedAt: string;
    orderCode?: string; // Mã đơn hàng tự động tạo
  };
}

interface CreateBatchOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string | null;
    status: string;
    information: any;
    createdAt: string;
    updatedAt: string;
    orderCode?: string;
    itemCount?: number;
  };
}

/**
 * Create a new order with full structured information
 * @param orderData - Complete order data with all details
 * @returns Promise with order creation response
 */
export const createOrder = async (
  orderData: OrderSubmissionData
): Promise<CreateOrderResponse> => {
  try {
    const response = await http.post<CreateOrderResponse>(API_PATHS.ORDERS, {
      orderData: orderData, // Send full structured data matching CreateOrderDto
      status: "pending", // Will be set as default in backend if not provided
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create order"
    );
  }
};

/**
 * Create a batch order with multiple products
 * @param batchOrderData - Batch order data with customer info, shipping, and multiple items
 * @returns Promise with batch order creation response
 */
export const createBatchOrder = async (
  batchOrderData: BatchOrderSubmissionData
): Promise<CreateBatchOrderResponse> => {
  try {
    const response = await http.post<CreateBatchOrderResponse>(
      `${API_PATHS.ORDERS}/batch`,
      batchOrderData
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating batch order:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create batch order"
    );
  }
};

/**
 * Get order by ID
 * @param orderId - Order ID
 * @returns Promise with order data
 */
export const getOrderById = async (orderId: string): Promise<any> => {
  try {
    const response = await http.get(API_PATHS.ORDER_BY_ID(orderId));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching order:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch order"
    );
  }
};

import http from "../../../libs/http.libs";
import { API_PATHS } from "../../../constants/api-path.constants";
import type {
  InventoryWithRelations,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  StockAdjustmentRequest,
  ReserveStockRequest,
  ReleaseReservedStockRequest,
  InventoryListResponse,
  InventoryQueryParams,
  ApiResponse,
  PaginatedApiResponse,
  InventoryStatistics,
  LowStockItem,
} from "../types";

// Abstract service interface for Dependency Inversion Principle
export interface IInventoryService {
  getInventories(params?: InventoryQueryParams): Promise<InventoryListResponse>;
  getInventoryById(id: string): Promise<InventoryWithRelations>;
  getInventoryByProductCustom(
    productCustomId: string
  ): Promise<InventoryWithRelations>;
  createInventory(
    data: CreateInventoryRequest
  ): Promise<InventoryWithRelations>;
  updateInventory(
    id: string,
    data: UpdateInventoryRequest
  ): Promise<InventoryWithRelations>;
  deleteInventory(id: string): Promise<{ message: string }>;
  adjustStock(
    id: string,
    data: StockAdjustmentRequest
  ): Promise<InventoryWithRelations>;
  reserveStock(
    id: string,
    data: ReserveStockRequest
  ): Promise<InventoryWithRelations>;
  releaseReservedStock(
    id: string,
    data: ReleaseReservedStockRequest
  ): Promise<InventoryWithRelations>;
  getLowStockItems(limit?: number): Promise<LowStockItem[]>;
  getInventoryStatistics(): Promise<InventoryStatistics>;
}

// Concrete implementation following Single Responsibility Principle
class InventoryService implements IInventoryService {
  async getInventories(
    params?: InventoryQueryParams
  ): Promise<InventoryListResponse> {
    const response = await http.get<
      PaginatedApiResponse<InventoryWithRelations[]>
    >(API_PATHS.INVENTORY, { params });

    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  async getInventoryById(id: string): Promise<InventoryWithRelations> {
    const response = await http.get<ApiResponse<InventoryWithRelations>>(
      API_PATHS.INVENTORY_BY_ID(id)
    );
    return response.data.data!;
  }

  async getInventoryByProductCustom(
    productCustomId: string
  ): Promise<InventoryWithRelations> {
    const response = await http.get<ApiResponse<InventoryWithRelations>>(
      API_PATHS.INVENTORY_BY_PRODUCT_CUSTOM(productCustomId)
    );
    return response.data.data!;
  }

  async createInventory(
    data: CreateInventoryRequest
  ): Promise<InventoryWithRelations> {
    const response = await http.post<ApiResponse<InventoryWithRelations>>(
      API_PATHS.INVENTORY,
      data
    );
    return response.data.data!;
  }

  async updateInventory(
    id: string,
    data: UpdateInventoryRequest
  ): Promise<InventoryWithRelations> {
    const response = await http.patch<ApiResponse<InventoryWithRelations>>(
      API_PATHS.INVENTORY_BY_ID(id),
      data
    );
    return response.data.data!;
  }

  async deleteInventory(id: string): Promise<{ message: string }> {
    const response = await http.delete<ApiResponse<{ message: string }>>(
      API_PATHS.INVENTORY_BY_ID(id)
    );
    return response.data.data!;
  }

  async adjustStock(
    id: string,
    data: StockAdjustmentRequest
  ): Promise<InventoryWithRelations> {
    const response = await http.post<ApiResponse<InventoryWithRelations>>(
      API_PATHS.INVENTORY_ADJUST_STOCK(id),
      data
    );
    return response.data.data!;
  }

  async reserveStock(
    id: string,
    data: ReserveStockRequest
  ): Promise<InventoryWithRelations> {
    const response = await http.post<ApiResponse<InventoryWithRelations>>(
      API_PATHS.INVENTORY_RESERVE_STOCK(id),
      data
    );
    return response.data.data!;
  }

  async releaseReservedStock(
    id: string,
    data: ReleaseReservedStockRequest
  ): Promise<InventoryWithRelations> {
    const response = await http.post<ApiResponse<InventoryWithRelations>>(
      API_PATHS.INVENTORY_RELEASE_RESERVED_STOCK(id),
      data
    );
    return response.data.data!;
  }

  async getLowStockItems(limit: number = 10): Promise<LowStockItem[]> {
    const response = await http.get<ApiResponse<LowStockItem[]>>(
      API_PATHS.INVENTORY_LOW_STOCK,
      { params: { limit } }
    );
    return response.data.data || [];
  }

  async getInventoryStatistics(): Promise<InventoryStatistics> {
    try {
      const response = await http.get<ApiResponse<InventoryStatistics>>(
        API_PATHS.INVENTORY_REPORT
      );

      // Server returns direct data, not wrapped in ApiResponse format
      const statsData = response.data as any;

      // Extract the actual stats from server response
      const stats = statsData.data || statsData;

      // Convert values to numbers if needed (from database or API)
      const convertedStats = {
        totalItems: Number(stats?.totalItems || 0),
        lowStockCount: Number(stats?.lowStockCount || 0),
        outOfStockCount: Number(stats?.outOfStockCount || 0),
        healthyStockCount: Number(stats?.healthyStockCount || 0),
        totalValue: Number(stats?.totalValue || 0),
      };

      // Validate that conversions resulted in valid numbers
      if (
        isNaN(convertedStats.totalItems) ||
        isNaN(convertedStats.lowStockCount) ||
        isNaN(convertedStats.outOfStockCount) ||
        isNaN(convertedStats.healthyStockCount) ||
        isNaN(convertedStats.totalValue)
      ) {
        throw new Error(
          "Invalid inventory statistics data - contains non-numeric values"
        );
      }

      return convertedStats as InventoryStatistics;
    } catch (error) {
      throw error;
    }
  }
}

// Export single instance following Singleton pattern
export const inventoryService: IInventoryService = new InventoryService();

// Export individual functions for convenience
export const getInventories = (params?: InventoryQueryParams) =>
  inventoryService.getInventories(params);

export const getInventoryById = (id: string) =>
  inventoryService.getInventoryById(id);

export const getInventoryByProductCustom = (productCustomId: string) =>
  inventoryService.getInventoryByProductCustom(productCustomId);

export const createInventory = (data: CreateInventoryRequest) =>
  inventoryService.createInventory(data);

export const updateInventory = (id: string, data: UpdateInventoryRequest) =>
  inventoryService.updateInventory(id, data);

export const deleteInventory = (id: string) =>
  inventoryService.deleteInventory(id);

export const adjustStock = (id: string, data: StockAdjustmentRequest) =>
  inventoryService.adjustStock(id, data);

export const reserveStock = (id: string, data: ReserveStockRequest) =>
  inventoryService.reserveStock(id, data);

export const releaseReservedStock = (
  id: string,
  data: ReleaseReservedStockRequest
) => inventoryService.releaseReservedStock(id, data);

export const getLowStockItems = (limit?: number) =>
  inventoryService.getLowStockItems(limit);

export const getInventoryStatistics = () =>
  inventoryService.getInventoryStatistics();

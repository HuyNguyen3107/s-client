export interface OrderData {
  // Product customization data
  productId: string;
  variantId: string;
  selectedOptions: Array<{ id: string; price: number }>;
  customQuantities: Record<string, number>;
  selectedCategoryProducts?: Record<
    string,
    Array<{ productCustomId: string; quantity: number }>
  >;
  multiItemCustomizations?: Record<
    number,
    Record<string, Array<{ productCustomId: string; quantity: number }>>
  >;
  productTotalPrice: number;

  // Background data
  selectedBackgroundIds: string[];
  backgroundFormData?: Record<string, any>;
  backgroundTotalPrice: number;

  // Total
  totalPrice: number;
}

// Full order structure matching backend CreateOrderDto
export interface OrderSubmissionData {
  collection?: {
    id: string;
    name?: string;
    imageUrl?: string;
    routeName?: string;
  };
  product: {
    id: string;
    name?: string;
    hasBg?: boolean;
  };
  variant: {
    id: string;
    name?: string;
    description?: string;
    price: number;
    endow?: any;
    option?: any;
    config?: any;
  };
  selectedOptions?: Array<{
    id: string;
    name?: string;
    description?: string;
    price: number;
  }>;
  customQuantities?: Record<string, number>;
  selectedCategoryProducts?: Record<
    string,
    {
      categoryId: string;
      categoryName?: string;
      products: Array<{
        productCustomId: string;
        productCustomName?: string;
        productCustomImage?: string;
        productCustomDescription?: string;
        quantity: number;
        price: number;
        totalPrice: number;
      }>;
    }
  >;
  multiItemCustomizations?: Record<
    number,
    Record<
      string,
      {
        categoryId: string;
        categoryName?: string;
        products: Array<{
          productCustomId: string;
          productCustomName?: string;
          productCustomImage?: string;
          productCustomDescription?: string;
          quantity: number;
          price: number;
          totalPrice: number;
        }>;
      }
    >
  >;
  // ⭐ Background - single object (not array) với formConfig và formData đầy đủ
  background?: {
    backgroundId: string;
    backgroundName?: string;
    backgroundDescription?: string;
    backgroundImageUrl?: string;
    backgroundPrice?: number;
    // Cấu hình form (từ background.config)
    formConfig?: {
      fields: Array<{
        id: string;
        type: string;
        title: string;
        placeholder?: string;
        required?: boolean;
        validation?: any;
        options?: Array<{
          label: string;
          value: string;
        }>;
      }>;
    };
    // Dữ liệu form khách hàng đã nhập (bao gồm thông tin người gửi/nhận)
    formData: {
      values: Array<{
        fieldId: string;
        fieldTitle: string;
        fieldType: string;
        value: any;
        otherValue?: string;
      }>;
    };
  };
  shipping?: {
    shippingId: string;
    shippingType?: string;
    area?: string;
    estimatedDeliveryTime?: string;
    shippingFee: number;
    notes?: string;
  };
  promotion?: {
    promotionId: string;
    promoCode?: string;
    title?: string;
    description?: string;
    type?: string;
    value?: number;
    discountAmount: number;
  };
  pricing: {
    productPrice: number;
    optionsPrice: number;
    customProductsPrice: number;
    backgroundPrice: number;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    total: number;
  };
  metadata?: {
    orderSource?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

// ============================================
// BATCH ORDER TYPES (Nhiều sản phẩm trong 1 đơn)
// ============================================

// Thông tin khách hàng chung cho cả đơn
export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

// Pricing cho từng item trong batch
export interface BatchItemPricing {
  productPrice: number;
  optionsPrice: number;
  customProductsPrice: number;
  backgroundPrice: number;
  itemSubtotal: number;
}

// Mỗi item trong batch order
export interface BatchOrderItem {
  collection?: {
    id: string;
    name?: string;
    imageUrl?: string;
    routeName?: string;
  };
  product: {
    id: string;
    name?: string;
    hasBg?: boolean;
  };
  variant: {
    id: string;
    name?: string;
    description?: string;
    price: number;
    endow?: any;
    option?: any;
    config?: any;
  };
  selectedOptions?: Array<{
    id: string;
    name?: string;
    description?: string;
    price: number;
  }>;
  customQuantities?: Record<string, number>;
  selectedCategoryProducts?: Record<
    string,
    {
      categoryId: string;
      categoryName?: string;
      products: Array<{
        productCustomId: string;
        productCustomName?: string;
        productCustomImage?: string;
        productCustomDescription?: string;
        quantity: number;
        price: number;
        totalPrice: number;
      }>;
    }
  >;
  multiItemCustomizations?: Record<
    number,
    Record<
      string,
      {
        categoryId: string;
        categoryName?: string;
        products: Array<{
          productCustomId: string;
          productCustomName?: string;
          productCustomImage?: string;
          productCustomDescription?: string;
          quantity: number;
          price: number;
          totalPrice: number;
        }>;
      }
    >
  >;
  background?: {
    backgroundId: string;
    backgroundName?: string;
    backgroundDescription?: string;
    backgroundImageUrl?: string;
    backgroundPrice?: number;
    formConfig?: {
      fields: Array<{
        id: string;
        type: string;
        title: string;
        placeholder?: string;
        required?: boolean;
        validation?: any;
        options?: Array<{
          label: string;
          value: string;
        }>;
      }>;
    };
    formData?: {
      values: Array<{
        fieldId: string;
        fieldTitle: string;
        fieldType: string;
        value: any;
        otherValue?: string;
      }>;
    };
  };
  pricing: BatchItemPricing;
  metadata?: {
    orderSource?: string;
    userAgent?: string;
  };
}

// Tổng hợp pricing cho cả đơn batch
export interface BatchPricing {
  itemsSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
}

// Shipping info for batch order
export interface BatchShippingInfo {
  shippingId: string;
  shippingType?: string;
  area?: string;
  estimatedDeliveryTime?: string;
  shippingFee: number;
  notes?: string;
}

// Promotion info for batch order
export interface BatchPromotionInfo {
  promotionId: string;
  promoCode?: string;
  title?: string;
  description?: string;
  type?: string;
  value?: number;
  discountAmount: number;
}

// Main batch order submission data
export interface BatchOrderSubmissionData {
  customerInfo: CustomerInfo;
  shipping: BatchShippingInfo;
  promotion?: BatchPromotionInfo;
  items: BatchOrderItem[];
  pricing: BatchPricing;
  userId?: string;
  metadata?: {
    orderSource?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

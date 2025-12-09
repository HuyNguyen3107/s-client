/**
 * Utility functions to extract customer information from order background form data
 * Supports both single orders and batch orders
 */

interface FieldValue {
  fieldId: string;
  fieldTitle: string;
  fieldType: string;
  value: any;
}

interface BatchOrderInfo {
  isBatchOrder: true;
  itemCount: number;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  };
  items: any[];
  pricing: {
    itemsSubtotal: number;
    shippingFee: number;
    discountAmount: number;
    total: number;
  };
}

interface SingleOrderInfo {
  isBatchOrder?: false;
  background?: {
    formData?: {
      values?: FieldValue[];
    };
  };
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  pricing?: {
    total: number;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
  };
  product?: {
    id: string;
    name?: string;
  };
}

interface OrderWithBackground {
  information?: SingleOrderInfo | BatchOrderInfo;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}

/**
 * Check if order is a batch order
 */
export const isBatchOrder = (order: OrderWithBackground): boolean => {
  return (order.information as BatchOrderInfo)?.isBatchOrder === true;
};

/**
 * Get item count for batch orders
 */
export const getItemCount = (order: OrderWithBackground): number => {
  if (isBatchOrder(order)) {
    return (order.information as BatchOrderInfo).itemCount || 0;
  }
  return 1;
};

/**
 * Get product names (for display in table)
 */
export const getProductNames = (order: OrderWithBackground): string => {
  const info = order.information;

  if (isBatchOrder(order)) {
    const batchInfo = info as BatchOrderInfo;
    const itemCount = batchInfo.itemCount || batchInfo.items?.length || 0;
    const productNames = batchInfo.items
      ?.slice(0, 2)
      .map((item) => item.product?.name || "Sản phẩm")
      .join(", ");

    if (itemCount > 2) {
      return `${productNames}... (+${itemCount - 2})`;
    }
    return productNames || `${itemCount} sản phẩm`;
  }

  return (info as SingleOrderInfo)?.product?.name || "Sản phẩm";
};

/**
 * Get order total
 */
export const getOrderTotal = (order: OrderWithBackground): number => {
  const info = order.information;

  if (isBatchOrder(order)) {
    return (info as BatchOrderInfo).pricing?.total || 0;
  }

  return (info as SingleOrderInfo)?.pricing?.total || 0;
};

/**
 * Extract customer name from background form data or batch order customerInfo
 * Falls back to user.name if not found
 */
export const getCustomerName = (order: OrderWithBackground): string => {
  const info = order.information;

  // Check for batch order first
  if (isBatchOrder(order)) {
    return (
      (info as BatchOrderInfo).customerInfo?.name || order.user?.name || "N/A"
    );
  }

  // Single order - check contactInfo first
  const singleInfo = info as SingleOrderInfo;
  if (singleInfo?.contactInfo?.name) {
    return singleInfo.contactInfo.name;
  }

  // Fallback to form data
  const formData = singleInfo?.background?.formData?.values || [];

  const nameField = formData.find((field) => {
    const title = field.fieldTitle?.toLowerCase() || "";
    return (
      title.includes("họ tên") ||
      title.includes("tên khách") ||
      title.includes("họ và tên") ||
      title.includes("tên người đặt") ||
      (title.includes("tên") && !title.includes("người nhận")) ||
      title === "name" ||
      title === "customer name"
    );
  });

  return nameField?.value || order.user?.name || "N/A";
};

/**
 * Extract customer phone from background form data or batch order customerInfo
 * Falls back to user.phone if not found
 */
export const getCustomerPhone = (order: OrderWithBackground): string => {
  const info = order.information;

  // Check for batch order first
  if (isBatchOrder(order)) {
    return (
      (info as BatchOrderInfo).customerInfo?.phone || order.user?.phone || "N/A"
    );
  }

  // Single order - check contactInfo first
  const singleInfo = info as SingleOrderInfo;
  if (singleInfo?.contactInfo?.phone) {
    return singleInfo.contactInfo.phone;
  }

  // Fallback to form data
  const formData = singleInfo?.background?.formData?.values || [];

  const phoneField = formData.find((field) => {
    const title = field.fieldTitle?.toLowerCase() || "";
    return (
      title.includes("số điện thoại") ||
      title.includes("điện thoại") ||
      title.includes("sđt") ||
      title.includes("phone") ||
      (title.includes("số") &&
        title.includes("điện thoại") &&
        !title.includes("người nhận"))
    );
  });

  return phoneField?.value || order.user?.phone || "N/A";
};

/**
 * Extract customer email from background form data or batch order customerInfo
 * Falls back to user.email if not found
 */
export const getCustomerEmail = (order: OrderWithBackground): string => {
  const info = order.information;

  // Check for batch order first
  if (isBatchOrder(order)) {
    return (
      (info as BatchOrderInfo).customerInfo?.email || order.user?.email || "N/A"
    );
  }

  // Single order - check contactInfo first
  const singleInfo = info as SingleOrderInfo;
  if (singleInfo?.contactInfo?.email) {
    return singleInfo.contactInfo.email;
  }

  // Fallback to form data
  const formData = singleInfo?.background?.formData?.values || [];

  const emailField = formData.find((field) => {
    const title = field.fieldTitle?.toLowerCase() || "";
    return title.includes("email") || title.includes("e-mail");
  });

  return emailField?.value || order.user?.email || "N/A";
};

/**
 * Extract customer address from background form data or batch order customerInfo
 * Falls back to shipping address if not found
 */
export const getCustomerAddress = (order: any): string => {
  const info = order.information;

  // Check for batch order first
  if (isBatchOrder(order)) {
    return (info as BatchOrderInfo).customerInfo?.address || "N/A";
  }

  const formData = order.information?.background?.formData?.values || [];

  const addressField = formData.find((field: any) => {
    const title = field.fieldTitle?.toLowerCase() || "";
    return (
      title.includes("địa chỉ") ||
      title.includes("dia chi") ||
      title.includes("address") ||
      title.includes("nhận hàng")
    );
  });

  return addressField?.value || order.information?.shipping?.address || "N/A";
};

/**
 * Extract receiver name (person who receives the shipment)
 */
export const getReceiverName = (order: OrderWithBackground): string => {
  // Batch orders don't have separate receiver info
  if (isBatchOrder(order)) {
    return (order.information as BatchOrderInfo).customerInfo?.name || "N/A";
  }

  const formData =
    (order.information as SingleOrderInfo)?.background?.formData?.values || [];

  const receiverField = formData.find((field) => {
    const title = field.fieldTitle?.toLowerCase() || "";
    return (
      title.includes("người nhận") ||
      title.includes("tên người nhận") ||
      title.includes("họ tên người nhận") ||
      title.includes("receiver name")
    );
  });

  return receiverField?.value || "N/A";
};

/**
 * Extract receiver phone
 */
export const getReceiverPhone = (order: OrderWithBackground): string => {
  // Batch orders don't have separate receiver info
  if (isBatchOrder(order)) {
    return (order.information as BatchOrderInfo).customerInfo?.phone || "N/A";
  }

  const formData =
    (order.information as SingleOrderInfo)?.background?.formData?.values || [];

  const receiverPhoneField = formData.find((field) => {
    const title = field.fieldTitle?.toLowerCase() || "";
    return (
      (title.includes("số điện thoại") ||
        title.includes("điện thoại") ||
        title.includes("sđt") ||
        title.includes("phone")) &&
      title.includes("người nhận")
    );
  });

  return receiverPhoneField?.value || "N/A";
};

/**
 * Get all customer information in one object
 */
export const getCustomerInfo = (order: OrderWithBackground) => {
  return {
    name: getCustomerName(order),
    phone: getCustomerPhone(order),
    email: getCustomerEmail(order),
    address: getCustomerAddress(order),
    receiverName: getReceiverName(order),
    receiverPhone: getReceiverPhone(order),
    isBatchOrder: isBatchOrder(order),
    itemCount: getItemCount(order),
  };
};

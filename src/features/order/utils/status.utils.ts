export const STATUS_MAP_VI_TO_EN: Record<string, string> = {
  "chờ xử lý": "pending",
  "đã nhận đơn": "acknowledged",
  "tư vấn": "consulting",
  "chờ demo": "demo_pending",
  "đã gửi demo": "demo_sent",
  "chờ confirm demo": "demo_confirm_pending",
  "chỉnh sửa demo": "demo_editing",
  "chờ duyệt demo": "demo_approval_pending",
  "chờ bank": "payment_pending",
  "đã thanh toán": "paid",
  "chờ thiết kế": "design_pending",
  "duyệt thiết kế": "design_approved",
  "đang sản xuất": "manufacturing",
  "hoàn thành": "completed",
  "đã giao hàng": "delivered",
  "giải quyết khiếu nại": "complaint_resolving",
  "đóng khiếu nại": "complaint_closed",
  // Legacy/simple labels
  "đã xác nhận": "acknowledged",
  "đang xử lý": "manufacturing",
  "đang giao": "delivered",
  "đã giao": "delivered",
  "đã hủy": "complaint_closed",
};

export const STATUS_MAP_EN_TO_VI: Record<string, string> = Object.entries(
  STATUS_MAP_VI_TO_EN
).reduce((acc, [vi, en]) => {
  // prefer first mapping encountered
  if (!acc[en]) acc[en] = vi;
  return acc;
}, {} as Record<string, string>);

export function mapStatusToEnglish(vietnameseStatus: string): string {
  return STATUS_MAP_VI_TO_EN[vietnameseStatus] || vietnameseStatus;
}

export function mapStatusToVietnamese(englishStatus: string): string {
  return STATUS_MAP_EN_TO_VI[englishStatus] || englishStatus;
}

const STATUS_PHASE_COLORS: Record<string, string> = {
  intake: "#ff9800",
  demo: "#2196f3",
  finance: "#9c27b0",
  production: "#3f51b5",
  fulfillment: "#4caf50",
  after_sales: "#795548",
};

const STATUS_TO_PHASE: Record<string, string> = {
  pending: "intake",
  acknowledged: "intake",
  consulting: "intake",
  demo_pending: "demo",
  demo_sent: "demo",
  demo_confirm_pending: "demo",
  demo_editing: "demo",
  demo_approval_pending: "demo",
  payment_pending: "finance",
  paid: "finance",
  design_pending: "production",
  design_approved: "production",
  manufacturing: "production",
  completed: "fulfillment",
  delivered: "fulfillment",
  complaint_resolving: "after_sales",
  complaint_closed: "after_sales",
};

export function getStatusColorByEnglish(englishStatus: string): string {
  const phase = STATUS_TO_PHASE[englishStatus];
  if (!phase) return "#757575";
  return STATUS_PHASE_COLORS[phase] || "#757575";
}

export function getStatusColorByVietnamese(vietnameseStatus: string): string {
  const en = mapStatusToEnglish(vietnameseStatus);
  return getStatusColorByEnglish(en);
}

export async function applyOrderStatusUpdate(
  orderId: string,
  prevEnglishStatus: string,
  newVietnameseStatus: string,
  updateStatusFn: (id: string, nextEnglishStatus: string) => Promise<any>
): Promise<{ updated: boolean; nextEnglishStatus: string; error?: string }> {
  const nextEnglishStatus = mapStatusToEnglish(newVietnameseStatus);
  if (!nextEnglishStatus || nextEnglishStatus === prevEnglishStatus) {
    return { updated: false, nextEnglishStatus: prevEnglishStatus };
  }
  try {
    await updateStatusFn(orderId, nextEnglishStatus);
    return { updated: true, nextEnglishStatus };
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || "Không thể cập nhật trạng thái";
    return { updated: false, nextEnglishStatus: prevEnglishStatus, error: msg };
  }
}


/**
 * Additional Vietnamese Messages for Features
 * Bổ sung thông báo tiếng Việt cho các features chưa có
 */

// Product Customs Messages
export const PRODUCT_CUSTOM_MESSAGES = {
  SUCCESS: {
    CREATE: "Tạo sản phẩm tùy chỉnh thành công!",
    UPDATE: "Cập nhật sản phẩm tùy chỉnh thành công!",
    DELETE: "Xóa sản phẩm tùy chỉnh thành công!",
    STATUS_UPDATE: "Cập nhật trạng thái sản phẩm tùy chỉnh thành công!",
    DUPLICATE: "Nhân bản sản phẩm tùy chỉnh thành công!",
  },
  ERROR: {
    CREATE: "Tạo sản phẩm tùy chỉnh thất bại!",
    UPDATE: "Cập nhật sản phẩm tùy chỉnh thất bại!",
    DELETE: "Xóa sản phẩm tùy chỉnh thất bại!",
    NOT_FOUND: "Không tìm thấy sản phẩm tùy chỉnh!",
    FETCH_FAILED: "Tải danh sách sản phẩm tùy chỉnh thất bại!",
  },
} as const;

// Orders Messages
export const ORDER_MESSAGES = {
  SUCCESS: {
    CREATE: "Tạo đơn hàng thành công!",
    UPDATE: "Cập nhật đơn hàng thành công!",
    CANCEL: "Hủy đơn hàng thành công!",
    CONFIRM: "Xác nhận đơn hàng thành công!",
    SHIP: "Chuyển trạng thái giao hàng thành công!",
    COMPLETE: "Hoàn thành đơn hàng thành công!",
    PAYMENT_UPDATE: "Cập nhật thanh toán thành công!",
  },
  ERROR: {
    CREATE: "Tạo đơn hàng thất bại!",
    UPDATE: "Cập nhật đơn hàng thất bại!",
    CANCEL: "Hủy đơn hàng thất bại!",
    NOT_FOUND: "Không tìm thấy đơn hàng!",
    INVALID_STATUS: "Trạng thái đơn hàng không hợp lệ!",
    FETCH_FAILED: "Tải danh sách đơn hàng thất bại!",
  },
} as const;

// Upload Messages
export const UPLOAD_MESSAGES = {
  SUCCESS: {
    SINGLE: "Tải file lên thành công!",
    MULTIPLE: "Tải nhiều file lên thành công!",
    IMAGE: "Tải hình ảnh lên thành công!",
    DOCUMENT: "Tải tài liệu lên thành công!",
    DELETE: "Xóa file thành công!",
  },
  ERROR: {
    UPLOAD: "Tải file lên thất bại!",
    DELETE: "Xóa file thất bại!",
    FILE_TOO_LARGE: "File quá lớn! Vui lòng chọn file nhỏ hơn {size}MB",
    INVALID_TYPE: "Loại file không được hỗ trợ!",
    NETWORK_ERROR: "Lỗi mạng khi tải file!",
  },
} as const;

// Dashboard Messages
export const DASHBOARD_MESSAGES = {
  SUCCESS: {
    LOAD_STATS: "Tải thống kê thành công!",
    REFRESH: "Làm mới dữ liệu thành công!",
  },
  ERROR: {
    LOAD_STATS: "Tải thống kê thất bại!",
    NO_DATA: "Không có dữ liệu để hiển thị!",
  },
} as const;

// Settings Messages
export const SETTINGS_MESSAGES = {
  SUCCESS: {
    UPDATE: "Cập nhật cài đặt thành công!",
    RESET: "Đặt lại cài đặt thành công!",
    BACKUP: "Sao lưu cài đặt thành công!",
    RESTORE: "Khôi phục cài đặt thành công!",
  },
  ERROR: {
    UPDATE: "Cập nhật cài đặt thất bại!",
    INVALID_CONFIG: "Cấu hình không hợp lệ!",
    BACKUP_FAILED: "Sao lưu cài đặt thất bại!",
    RESTORE_FAILED: "Khôi phục cài đặt thất bại!",
  },
} as const;

// Permissions Messages
export const PERMISSION_MESSAGES = {
  SUCCESS: {
    GRANT: "Cấp quyền thành công!",
    REVOKE: "Thu hồi quyền thành công!",
    UPDATE: "Cập nhật quyền hạn thành công!",
  },
  ERROR: {
    GRANT: "Cấp quyền thất bại!",
    REVOKE: "Thu hồi quyền thất bại!",
    INSUFFICIENT: "Không đủ quyền hạn!",
    NOT_FOUND: "Không tìm thấy quyền hạn!",
  },
} as const;

// Search Messages
export const SEARCH_MESSAGES = {
  SUCCESS: {
    FOUND: "Tìm thấy {count} kết quả!",
    FILTER_APPLIED: "Áp dụng bộ lọc thành công!",
  },
  ERROR: {
    NO_RESULTS: "Không tìm thấy kết quả nào!",
    SEARCH_FAILED: "Tìm kiếm thất bại!",
    INVALID_QUERY: "Từ khóa tìm kiếm không hợp lệ!",
  },
  INFO: {
    SEARCHING: "Đang tìm kiếm...",
    ENTER_KEYWORD: "Vui lòng nhập từ khóa tìm kiếm",
  },
} as const;

// Export Messages
export const EXPORT_MESSAGES = {
  SUCCESS: {
    PDF: "Xuất PDF thành công!",
    EXCEL: "Xuất Excel thành công!",
    CSV: "Xuất CSV thành công!",
  },
  ERROR: {
    EXPORT: "Xuất dữ liệu thất bại!",
    NO_DATA: "Không có dữ liệu để xuất!",
    GENERATE_FAILED: "Tạo file xuất thất bại!",
  },
  INFO: {
    GENERATING: "Đang tạo file xuất...",
    PREPARING: "Đang chuẩn bị dữ liệu...",
  },
} as const;

// Import Messages
export const IMPORT_MESSAGES = {
  SUCCESS: {
    COMPLETE: "Nhập dữ liệu thành công! Đã nhập {count} bản ghi",
    VALIDATE: "Xác thực dữ liệu thành công!",
  },
  ERROR: {
    IMPORT: "Nhập dữ liệu thất bại!",
    INVALID_FILE: "File không hợp lệ!",
    VALIDATION_FAILED: "Xác thực dữ liệu thất bại!",
    DUPLICATE_DATA: "Dữ liệu trùng lặp!",
  },
  INFO: {
    PROCESSING: "Đang xử lý dữ liệu...",
    VALIDATING: "Đang xác thực dữ liệu...",
  },
} as const;

// Cache Messages
export const CACHE_MESSAGES = {
  SUCCESS: {
    CLEARED: "Xóa cache thành công!",
    REFRESHED: "Làm mới cache thành công!",
  },
  ERROR: {
    CLEAR_FAILED: "Xóa cache thất bại!",
    REFRESH_FAILED: "Làm mới cache thất bại!",
  },
} as const;

// Email Messages
export const EMAIL_MESSAGES = {
  SUCCESS: {
    SENT: "Gửi email thành công!",
    VERIFIED: "Xác thực email thành công!",
  },
  ERROR: {
    SEND_FAILED: "Gửi email thất bại!",
    INVALID_EMAIL: "Email không hợp lệ!",
    VERIFY_FAILED: "Xác thực email thất bại!",
  },
} as const;

// SMS Messages
export const SMS_MESSAGES = {
  SUCCESS: {
    SENT: "Gửi SMS thành công!",
    VERIFIED: "Xác thực SMS thành công!",
  },
  ERROR: {
    SEND_FAILED: "Gửi SMS thất bại!",
    INVALID_PHONE: "Số điện thoại không hợp lệ!",
    VERIFY_FAILED: "Xác thực SMS thất bại!",
  },
} as const;

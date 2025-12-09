/**
 * Global Message Constants - Tiếng Việt
 * Centralized messages for consistent user experience
 */

export const GLOBAL_MESSAGES = {
  // Success Messages
  SUCCESS: {
    CREATED: "Tạo mới thành công!",
    UPDATED: "Cập nhật thành công!",
    DELETED: "Xóa thành công!",
    SAVED: "Lưu thành công!",
    UPLOADED: "Tải lên thành công!",
    DOWNLOADED: "Tải xuống thành công!",
    IMPORTED: "Nhập dữ liệu thành công!",
    EXPORTED: "Xuất dữ liệu thành công!",
    OPERATION_COMPLETED: "Thao tác hoàn tất thành công!",
    STATUS_CHANGED: "Thay đổi trạng thái thành công!",
    ASSIGNED: "Gán quyền thành công!",
    REMOVED: "Xóa quyền thành công!",
  },

  // Error Messages
  ERROR: {
    // Network & Connection
    NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng kiểm tra và thử lại!",
    TIMEOUT: "Kết nối quá thời gian chờ. Vui lòng thử lại!",
    CONNECTION_FAILED: "Không thể kết nối đến server. Vui lòng thử lại sau!",

    // Authentication & Authorization
    UNAUTHORIZED: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại!",
    FORBIDDEN: "Bạn không có quyền thực hiện hành động này!",
    TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
    LOGIN_FAILED: "Email hoặc mật khẩu không đúng!",

    // Validation & Input
    VALIDATION_FAILED: "Dữ liệu nhập vào không hợp lệ!",
    REQUIRED_FIELDS: "Vui lòng điền đầy đủ thông tin bắt buộc!",
    INVALID_FORMAT: "Định dạng dữ liệu không đúng!",
    INVALID_EMAIL: "Email không hợp lệ!",
    INVALID_PHONE: "Số điện thoại không hợp lệ!",
    PASSWORD_TOO_WEAK: "Mật khẩu quá yếu!",
    PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp!",

    // CRUD Operations
    CREATE_FAILED: "Tạo mới thất bại!",
    UPDATE_FAILED: "Cập nhật thất bại!",
    DELETE_FAILED: "Xóa thất bại!",
    FETCH_FAILED: "Tải dữ liệu thất bại!",
    SAVE_FAILED: "Lưu dữ liệu thất bại!",

    // Resource Not Found
    NOT_FOUND: "Không tìm thấy dữ liệu!",
    USER_NOT_FOUND: "Không tìm thấy người dùng!",
    PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm!",
    ORDER_NOT_FOUND: "Không tìm thấy đơn hàng!",

    // Conflict & Duplicate
    DUPLICATE_ENTRY: "Dữ liệu đã tồn tại!",
    EMAIL_EXISTS: "Email đã được sử dụng!",
    PHONE_EXISTS: "Số điện thoại đã được sử dụng!",
    NAME_EXISTS: "Tên đã tồn tại!",

    // File & Upload
    FILE_TOO_LARGE: "Kích thước file quá lớn!",
    INVALID_FILE_TYPE: "Loại file không được hỗ trợ!",
    UPLOAD_FAILED: "Tải file lên thất bại!",
    DOWNLOAD_FAILED: "Tải file xuống thất bại!",

    // Business Logic
    INSUFFICIENT_STOCK: "Không đủ tồn kho!",
    INVALID_QUANTITY: "Số lượng không hợp lệ!",
    OPERATION_NOT_ALLOWED: "Thao tác không được phép!",
    QUOTA_EXCEEDED: "Đã vượt quá giới hạn cho phép!",

    // Server Errors
    SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau!",
    DATABASE_ERROR: "Lỗi cơ sở dữ liệu. Vui lòng thử lại sau!",
    INTERNAL_ERROR: "Lỗi hệ thống. Vui lòng liên hệ quản trị viên!",

    // General
    UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định!",
    OPERATION_FAILED: "Thao tác thất bại!",
    SOMETHING_WENT_WRONG: "Có lỗi xảy ra. Vui lòng thử lại!",
  },

  // Warning Messages
  WARNING: {
    UNSAVED_CHANGES: "Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời khỏi?",
    DELETE_CONFIRMATION: "Bạn có chắc chắn muốn xóa?",
    LOGOUT_CONFIRMATION: "Bạn có chắc chắn muốn đăng xuất?",
    OVERWRITE_CONFIRMATION: "Dữ liệu sẽ bị ghi đè. Bạn có chắc chắn?",
    IRREVERSIBLE_ACTION: "Hành động này không thể hoàn tác!",
  },

  // Info Messages
  INFO: {
    LOADING: "Đang tải dữ liệu...",
    SAVING: "Đang lưu...",
    UPLOADING: "Đang tải lên...",
    DOWNLOADING: "Đang tải xuống...",
    PROCESSING: "Đang xử lý...",
    PLEASE_WAIT: "Vui lòng đợi...",
    NO_DATA: "Không có dữ liệu để hiển thị",
    EMPTY_LIST: "Danh sách trống",
  },
} as const;

// HTTP Status Code Messages
export const HTTP_STATUS_MESSAGES = {
  200: "Thành công",
  201: "Tạo mới thành công",
  400: "Yêu cầu không hợp lệ",
  401: "Chưa được xác thực",
  403: "Không có quyền truy cập",
  404: "Không tìm thấy",
  409: "Dữ liệu đã tồn tại",
  422: "Dữ liệu không hợp lệ",
  429: "Quá nhiều yêu cầu",
  500: "Lỗi máy chủ nội bộ",
  502: "Lỗi gateway",
  503: "Dịch vụ không khả dụng",
  504: "Timeout gateway",
} as const;

// Loading States
export const LOADING_MESSAGES = {
  // Entities
  USERS: "Đang tải danh sách người dùng...",
  PRODUCTS: "Đang tải danh sách sản phẩm...",
  ORDERS: "Đang tải danh sách đơn hàng...",
  CATEGORIES: "Đang tải danh sách thể loại...",
  ROLES: "Đang tải danh sách vai trò...",
  PERMISSIONS: "Đang tải danh sách quyền hạn...",

  // Operations
  CREATING: "Đang tạo mới...",
  UPDATING: "Đang cập nhật...",
  DELETING: "Đang xóa...",
  AUTHENTICATING: "Đang xác thực...",

  // File Operations
  UPLOADING_FILE: "Đang tải file lên...",
  PROCESSING_FILE: "Đang xử lý file...",
  GENERATING_REPORT: "Đang tạo báo cáo...",
} as const;

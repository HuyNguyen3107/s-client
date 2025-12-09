export const getLoginErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
    case 401:
      return "Email hoặc mật khẩu không đúng.";
    case 403:
      return "Tài khoản của bạn không có quyền truy cập.";
    case 500:
      return "Lỗi máy chủ. Vui lòng thử lại sau.";
    default:
      return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
  }
};

export const getLogoutErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
    case 401:
      return "Bạn chưa đăng nhập hoặc phiên đã hết hạn.";
    case 403:
      return "Bạn không có quyền thực hiện hành động này.";
    case 500:
      return "Lỗi máy chủ. Vui lòng thử lại sau.";
    default:
      return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
  }
};

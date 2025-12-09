import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from "@mui/material";
import {
  Search,
  CheckCircle,
  LocalShipping,
  Inventory,
  PendingActions,
  AssignmentTurnedIn,
  ExpandMore,
  Person,
  Phone,
  Email,
  LocationOn,
  ShoppingBag,
  Receipt,
  Info,
  Image as ImageIcon,
  Category,
  Palette,
  Notes,
} from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { searchOrder } from "../services/order-search.service";
import { useToastStore } from "../../../store/toast.store";
import PageWrapper from "../../../components/page-wrapper.components";
import Header from "../../../components/header.components";
import Footer from "../../../components/footer.components";
import { PAGE_METADATA } from "../../../constants/page-metadata.constants";
import {
  getCustomerName,
  getCustomerPhone,
  getCustomerEmail,
  getCustomerAddress,
  getReceiverName,
  getReceiverPhone,
  isBatchOrder,
  getItemCount,
} from "../utils/customer-info.utils";

interface OrderData {
  id: string;
  status: string;
  information: any;
  pricing: any;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

const statusSteps = [
  { key: "intake", label: "Tiếp nhận", icon: <PendingActions /> },
  { key: "demo", label: "Demo", icon: <AssignmentTurnedIn /> },
  { key: "finance", label: "Chốt đơn – Tài chính", icon: <Inventory /> },
  { key: "production", label: "Thiết kế – Sản xuất", icon: <Inventory /> },
  {
    key: "fulfillment",
    label: "Hoàn tất – Giao hàng",
    icon: <LocalShipping />,
  },
  { key: "after_sales", label: "Hậu mãi", icon: <CheckCircle /> },
];

const statusColors: Record<string, string> = {
  intake: "#ff9800",
  demo: "#2196f3",
  finance: "#9c27b0",
  production: "#3f51b5",
  fulfillment: "#4caf50",
  after_sales: "#795548",
};

const statusLabels: Record<string, string> = {
  // Detailed statuses for chip label
  pending: "Chờ xử lý",
  acknowledged: "Đã nhận đơn",
  consulting: "Tư vấn",
  demo_pending: "Chờ demo",
  demo_sent: "Đã gửi demo",
  demo_confirm_pending: "Chờ confirm demo",
  demo_editing: "Chỉnh sửa demo",
  demo_approval_pending: "Chờ duyệt demo",
  payment_pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  design_pending: "Chờ thiết kế",
  design_approved: "Duyệt thiết kế",
  manufacturing: "Đang sản xuất",
  completed: "Hoàn thành sản xuất",
  delivered: "Đã giao hàng",
  complaint_resolving: "Đang giải quyết khiếu nại",
  complaint_closed: "Đã đóng khiếu nại",
  cancelled: "Đã hủy",
};

const statusDescriptions: Record<string, string> = {
  pending: "Đơn hàng đang chờ nhân viên tiếp nhận và xác nhận",
  acknowledged: "Đơn hàng đã được tiếp nhận và đang xử lý",
  consulting: "Nhân viên đang tư vấn thêm về sản phẩm",
  demo_pending: "Đang chuẩn bị mẫu demo cho bạn xem",
  demo_sent: "Mẫu demo đã được gửi, vui lòng kiểm tra và phản hồi",
  demo_confirm_pending: "Đang chờ bạn xác nhận mẫu demo",
  demo_editing: "Đang chỉnh sửa mẫu demo theo yêu cầu của bạn",
  demo_approval_pending: "Mẫu demo đang chờ bạn duyệt cuối cùng",
  payment_pending: "Đang chờ thanh toán để tiến hành sản xuất",
  paid: "Thanh toán đã được xác nhận",
  design_pending: "Đang trong quá trình thiết kế chi tiết",
  design_approved: "Thiết kế đã được duyệt, chuẩn bị sản xuất",
  manufacturing: "Sản phẩm đang được sản xuất",
  completed: "Sản phẩm đã hoàn thành, chuẩn bị giao hàng",
  delivered: "Sản phẩm đã được giao thành công",
  complaint_resolving: "Đang xử lý khiếu nại của bạn",
  complaint_closed: "Khiếu nại đã được giải quyết",
  cancelled: "Đơn hàng đã bị hủy",
};

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const { showToast } = useToastStore();

  // Get order code from URL if available
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setSearchValue(code);
      // Auto search if code is provided
      handleSearchWithCode(code);
    }
  }, [searchParams]);

  const handleSearchWithCode = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setOrders([]);

    try {
      const params = { orderCode: code.trim() };
      const response = await searchOrder(params);

      if (response.success && response.data.length > 0) {
        setOrders(response.data);
        showToast(response.message || "Tìm thấy đơn hàng", "success");
      } else {
        setError(response.message || "Không tìm thấy đơn hàng nào");
        showToast(response.message || "Không tìm thấy đơn hàng", "warning");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm đơn hàng";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      showToast("Vui lòng nhập mã đơn hàng", "error");
      return;
    }
    await handleSearchWithCode(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusToPhase: Record<string, string> = {
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

  const getCurrentStep = (status: string) => {
    const phase = statusToPhase[status];
    if (!phase) return -1;
    return statusSteps.findIndex((step) => step.key === phase);
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Check if a section is expanded (default to true for important sections)
  const isSectionExpanded = (sectionKey: string, defaultExpanded = true) => {
    return expandedSections[sectionKey] !== undefined
      ? expandedSections[sectionKey]
      : defaultExpanded;
  };

  // Using imported utility functions from "../utils/customer-info.utils"
  // - getCustomerName(order)
  // - getCustomerPhone(order)
  // - getCustomerEmail(order)
  // - getCustomerAddress(order)
  // - getReceiverName(order)
  // - getReceiverPhone(order)
  // - isBatchOrder(order)
  // - getItemCount(order)

  return (
    <PageWrapper
      title={PAGE_METADATA.ORDER_TRACKING.title}
      description={PAGE_METADATA.ORDER_TRACKING.description}
      keywords={PAGE_METADATA.ORDER_TRACKING.keywords}
    >
      <Header />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, pt: { xs: 10, md: 12 } }}>
        {/* Page Title */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#731618",
              mb: 2,
            }}
          >
            Tìm kiếm đơn hàng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Nhập mã đơn hàng để theo dõi tình trạng đơn hàng của bạn
          </Typography>
        </Box>

        {/* Search Box */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              fullWidth
              label="Nhập mã đơn hàng (VD: ORD-20241016-XXXX)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ORD-20241016-XXXX"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#731618",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#731618",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{
                bgcolor: "#731618",
                minWidth: 120,
                height: 56,
                "&:hover": {
                  bgcolor: "#5f0d10",
                },
                "&:disabled": {
                  bgcolor: "#ccc",
                },
              }}
            >
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </Box>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search Results */}
        {orders.length > 0 && (
          <Box>
            {orders.map((order, index) => (
              <Card
                key={order.id}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Order Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="#731618"
                      >
                        {order.information?.orderCode ||
                          `Đơn hàng #${index + 1}`}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Ngày đặt: {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                    <Chip
                      label={statusLabels[order.status] || order.status}
                      sx={{
                        bgcolor:
                          statusColors[statusToPhase[order.status] || ""] ||
                          "#757575",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        px: 2,
                        py: 2.5,
                      }}
                    />
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Order Status Timeline */}
                  {statusToPhase[order.status] && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Trạng thái đơn hàng
                      </Typography>
                      <Stepper
                        activeStep={getCurrentStep(order.status)}
                        alternativeLabel
                      >
                        {statusSteps.map((step) => (
                          <Step key={step.key}>
                            <StepLabel
                              StepIconComponent={() => (
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor:
                                      getCurrentStep(order.status) >=
                                      statusSteps.findIndex(
                                        (s) => s.key === step.key
                                      )
                                        ? statusColors[step.key]
                                        : "#e0e0e0",
                                    color: "white",
                                  }}
                                >
                                  {step.icon}
                                </Box>
                              )}
                            >
                              {step.label}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  )}

                  {!statusToPhase[order.status] && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      Trạng thái không xác định: {order.status}
                    </Alert>
                  )}

                  {/* Status Description */}
                  {statusDescriptions[order.status] && (
                    <Alert severity="info" sx={{ mb: 3 }} icon={<Info />}>
                      <Typography variant="body2">
                        <strong>Trạng thái hiện tại:</strong>{" "}
                        {statusDescriptions[order.status]}
                      </Typography>
                    </Alert>
                  )}

                  {/* Batch Order Indicator */}
                  {isBatchOrder(order) && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        <strong>Đơn hàng nhiều sản phẩm:</strong>{" "}
                        {getItemCount(order)} sản phẩm
                      </Typography>
                    </Alert>
                  )}

                  {/* Contact Information Section */}
                  <Accordion
                    expanded={isSectionExpanded(`contact-${order.id}`)}
                    onChange={() => toggleSection(`contact-${order.id}`)}
                    sx={{ mb: 2, boxShadow: 1 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Person color="primary" />
                        <Typography variant="h6" fontWeight="bold">
                          Thông tin người đặt hàng
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Person fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Họ tên:
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ ml: 3.5 }}
                          >
                            {getCustomerName(order)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Phone fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Số điện thoại:
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ ml: 3.5 }}
                          >
                            {getCustomerPhone(order)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Email fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Email:
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ ml: 3.5 }}
                          >
                            {getCustomerEmail(order)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Địa chỉ:
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ ml: 3.5 }}
                          >
                            {getCustomerAddress(order)}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Receiver Info if different */}
                      {getReceiverName(order) !== "N/A" &&
                        getReceiverName(order) !== getCustomerName(order) && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              Thông tin người nhận hàng (nếu khác người đặt)
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <Person fontSize="small" color="action" />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Người nhận:
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body1"
                                  fontWeight="medium"
                                  sx={{ ml: 3.5 }}
                                >
                                  {getReceiverName(order)}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <Phone fontSize="small" color="action" />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    SĐT người nhận:
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body1"
                                  fontWeight="medium"
                                  sx={{ ml: 3.5 }}
                                >
                                  {getReceiverPhone(order)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        )}
                    </AccordionDetails>
                  </Accordion>

                  {/* Product Information Section */}
                  <Accordion
                    expanded={isSectionExpanded(`product-${order.id}`)}
                    onChange={() => toggleSection(`product-${order.id}`)}
                    sx={{ mb: 2, boxShadow: 1 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ShoppingBag color="primary" />
                        <Typography variant="h6" fontWeight="bold">
                          Thông tin sản phẩm
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        {/* Product Main Info */}
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                            <Grid container spacing={2} alignItems="center">
                              {order.information?.product?.imageUrl && (
                                <Grid item xs={12} sm={3}>
                                  <Box
                                    component="img"
                                    src={order.information.product.imageUrl}
                                    alt={order.information.product.name}
                                    sx={{
                                      width: "100%",
                                      maxWidth: 150,
                                      height: "auto",
                                      borderRadius: 2,
                                      boxShadow: 1,
                                    }}
                                  />
                                </Grid>
                              )}
                              <Grid
                                item
                                xs={12}
                                sm={
                                  order.information?.product?.imageUrl ? 9 : 12
                                }
                              >
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  color="#731618"
                                  gutterBottom
                                >
                                  {order.information?.product?.name || "N/A"}
                                </Typography>
                                {order.information?.product?.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    {order.information.product.description}
                                  </Typography>
                                )}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mt: 1,
                                  }}
                                >
                                  {order.information?.variant?.name && (
                                    <Chip
                                      label={`Phân loại: ${order.information.variant.name}`}
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                  )}
                                  {order.information?.collection?.name && (
                                    <Chip
                                      label={`BST: ${order.information.collection.name}`}
                                      size="small"
                                      color="secondary"
                                      variant="outlined"
                                    />
                                  )}
                                  {order.information?.quantity && (
                                    <Chip
                                      label={`SL: ${order.information.quantity}`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>

                        {/* Variant Details */}
                        {order.information?.variant?.description && (
                          <Grid item xs={12}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Mô tả phân loại:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: "pre-line" }}
                            >
                              {order.information.variant.description}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {/* Background Information Section */}
                  {order.information?.background && (
                    <Accordion
                      expanded={isSectionExpanded(`background-${order.id}`)}
                      onChange={() => toggleSection(`background-${order.id}`)}
                      sx={{ mb: 2, boxShadow: 1 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Palette color="primary" />
                          <Typography variant="h6" fontWeight="bold">
                            Background đã chọn
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Paper sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                          <Grid container spacing={2} alignItems="flex-start">
                            {order.information.background
                              .backgroundImageUrl && (
                              <Grid item xs={12} sm={4} md={3}>
                                <Box
                                  component="img"
                                  src={
                                    order.information.background
                                      .backgroundImageUrl
                                  }
                                  alt={
                                    order.information.background.backgroundName
                                  }
                                  sx={{
                                    width: "100%",
                                    maxWidth: 200,
                                    height: "auto",
                                    borderRadius: 2,
                                    boxShadow: 2,
                                  }}
                                />
                              </Grid>
                            )}
                            <Grid
                              item
                              xs={12}
                              sm={
                                order.information.background.backgroundImageUrl
                                  ? 8
                                  : 12
                              }
                              md={
                                order.information.background.backgroundImageUrl
                                  ? 9
                                  : 12
                              }
                            >
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="#731618"
                                gutterBottom
                              >
                                {order.information.background.backgroundName}
                              </Typography>
                              {order.information.background
                                .backgroundDescription && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 2 }}
                                >
                                  {
                                    order.information.background
                                      .backgroundDescription
                                  }
                                </Typography>
                              )}
                              <Chip
                                label={`Giá: ${formatCurrency(
                                  order.information.background
                                    .backgroundPrice || 0
                                )}`}
                                color="primary"
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Form Data Section - All fields from background */}
                  {order.information?.background?.formData?.values &&
                    order.information.background.formData.values.length > 0 && (
                      <Accordion
                        expanded={isSectionExpanded(`formdata-${order.id}`)}
                        onChange={() => toggleSection(`formdata-${order.id}`)}
                        sx={{ mb: 2, boxShadow: 1 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Notes color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                              Thông tin chi tiết đơn hàng
                            </Typography>
                            <Chip
                              label={`${order.information.background.formData.values.length} mục`}
                              size="small"
                              color="info"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {order.information.background.formData.values.map(
                              (field: any) => (
                                <Grid item xs={12} sm={6} key={field.fieldId}>
                                  <Paper
                                    sx={{
                                      p: 2,
                                      bgcolor: "#f8f9fa",
                                      height: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                      }}
                                    >
                                      {field.fieldTitle}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                      sx={{
                                        mt: 0.5,
                                        whiteSpace: "pre-line",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {field.value || "-"}
                                    </Typography>
                                  </Paper>
                                </Grid>
                              )
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    )}

                  {/* Selected Options Section */}
                  {order.information?.selectedOptions &&
                    order.information.selectedOptions.length > 0 && (
                      <Accordion
                        expanded={isSectionExpanded(
                          `options-${order.id}`,
                          false
                        )}
                        onChange={() => toggleSection(`options-${order.id}`)}
                        sx={{ mb: 2, boxShadow: 1 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Category color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                              Tùy chọn đã chọn
                            </Typography>
                            <Chip
                              label={`${order.information.selectedOptions.length} tùy chọn`}
                              size="small"
                              color="info"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Tên tùy chọn
                                </TableCell>
                                <TableCell
                                  sx={{ fontWeight: "bold" }}
                                  align="right"
                                >
                                  Giá
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.information.selectedOptions.map(
                                (option: any) => (
                                  <TableRow key={option.id}>
                                    <TableCell>{option.name}</TableCell>
                                    <TableCell align="right">
                                      <Typography
                                        color="primary"
                                        fontWeight="bold"
                                      >
                                        {formatCurrency(option.price)}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                      </Accordion>
                    )}

                  {/* Custom Products Section */}
                  {order.information?.selectedCategoryProducts &&
                    Object.keys(order.information.selectedCategoryProducts)
                      .length > 0 && (
                      <Accordion
                        expanded={isSectionExpanded(
                          `customproducts-${order.id}`,
                          false
                        )}
                        onChange={() =>
                          toggleSection(`customproducts-${order.id}`)
                        }
                        sx={{ mb: 2, boxShadow: 1 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <ImageIcon color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                              Sản phẩm custom đã chọn
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {Object.values(
                            order.information.selectedCategoryProducts
                          ).map((category: any) => (
                            <Box key={category.categoryId} sx={{ mb: 3 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ mb: 2, color: "#731618" }}
                              >
                                {category.categoryName}
                              </Typography>
                              <Grid container spacing={2}>
                                {category.products.map((product: any) => (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={product.productCustomId}
                                  >
                                    <Paper sx={{ p: 2, height: "100%" }}>
                                      <Box sx={{ display: "flex", gap: 2 }}>
                                        {product.productCustomImage && (
                                          <Avatar
                                            src={product.productCustomImage}
                                            alt={product.productCustomName}
                                            variant="rounded"
                                            sx={{ width: 60, height: 60 }}
                                          />
                                        )}
                                        <Box sx={{ flex: 1 }}>
                                          <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                          >
                                            {product.productCustomName}
                                          </Typography>
                                          {product.productCustomDescription && (
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              {product.productCustomDescription}
                                            </Typography>
                                          )}
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              mt: 1,
                                            }}
                                          >
                                            <Typography variant="body2">
                                              x{product.quantity}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="primary"
                                              fontWeight="bold"
                                            >
                                              {formatCurrency(
                                                product.totalPrice
                                              )}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Paper>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    )}

                  {/* Shipping Information Section */}
                  {order.information?.shipping && (
                    <Accordion
                      expanded={isSectionExpanded(
                        `shipping-${order.id}`,
                        false
                      )}
                      onChange={() => toggleSection(`shipping-${order.id}`)}
                      sx={{ mb: 2, boxShadow: 1 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocalShipping color="primary" />
                          <Typography variant="h6" fontWeight="bold">
                            Thông tin vận chuyển
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Loại vận chuyển:
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {order.information.shipping.shippingType || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Khu vực:
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {order.information.shipping.area || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Thời gian dự kiến:
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {order.information.shipping
                                .estimatedDeliveryTime || "N/A"}
                            </Typography>
                          </Grid>
                          {order.information.shipping.notes && (
                            <Grid item xs={12}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Ghi chú:
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ whiteSpace: "pre-line" }}
                              >
                                {order.information.shipping.notes}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Pricing Information Section */}
                  <Paper sx={{ p: 3, bgcolor: "#f8f9fa", mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Receipt color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        Thông tin thanh toán
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">Tổng tiền hàng:</Typography>
                        <Typography variant="body1">
                          {formatCurrency(
                            order.information?.pricing?.subtotal || 0
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">Phí vận chuyển:</Typography>
                        <Typography variant="body1">
                          {formatCurrency(
                            order.information?.pricing?.shippingFee || 0
                          )}
                        </Typography>
                      </Box>

                      {(order.information?.pricing?.discountAmount || 0) >
                        0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body1" color="error">
                            Giảm giá:
                          </Typography>
                          <Typography variant="body1" color="error">
                            -
                            {formatCurrency(
                              order.information?.pricing?.discountAmount || 0
                            )}
                          </Typography>
                        </Box>
                      )}

                      {order.information?.pricing?.promotionCode && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Mã giảm giá:
                          </Typography>
                          <Chip
                            label={order.information.pricing.promotionCode}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                      )}

                      <Divider sx={{ my: 1 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#731618"
                        >
                          TỔNG CỘNG:
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="#731618"
                        >
                          {formatCurrency(
                            order.information?.pricing?.total || 0
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Last Update */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 2 }}
                  >
                    Cập nhật lần cuối: {formatDate(order.updatedAt)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* No results and no error */}
        {!loading && orders.length === 0 && !error && (
          <Paper sx={{ textAlign: "center", py: 8, px: 4 }}>
            <Search sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Tìm kiếm đơn hàng của bạn
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Nhập mã đơn hàng để theo dõi tình trạng và xem chi tiết đơn hàng
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxWidth: 400,
                mx: "auto",
                textAlign: "left",
                bgcolor: "#f5f5f5",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                💡 Hướng dẫn:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Mã đơn hàng có định dạng: <strong>ORD-YYYYMMDD-XXXX</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Kiểm tra email xác nhận đơn hàng để tìm mã
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Liên hệ hỗ trợ nếu bạn cần trợ giúp
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
      <Footer />
    </PageWrapper>
  );
}

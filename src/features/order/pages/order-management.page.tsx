import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Tooltip,
  Autocomplete,
  InputAdornment,
  Collapse,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  PersonAdd,
  Refresh,
  HourglassEmpty,
  CheckCircle,
  BuildCircle,
  LocalShipping,
  DoneAll,
  Cancel as CancelIcon,
  ExpandMore,
} from "@mui/icons-material";
import {
  getAllOrders,
  deleteOrder,
} from "../services/order-management.service";
import { updateOrderStatus } from "../services/order-assign.service";
import {
  mapStatusToEnglish,
  mapStatusToVietnamese,
  getStatusColorByEnglish,
} from "../utils/status.utils";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "../../../store/toast.store";
import {
  getCustomerName,
  getCustomerPhone,
  isBatchOrder,
  getItemCount,
  getProductNames,
  getOrderTotal,
} from "../utils/customer-info.utils";

interface Order {
  id: string;
  status: string;
  information: {
    orderCode: string;
    pricing: {
      total: number;
      subtotal: number;
      shippingFee: number;
      optionsPrice: number;
      productPrice: number;
      discountAmount: number;
      backgroundPrice: number;
      customProductsPrice: number;
    };
    product: {
      id: string;
      name: string;
      hasBg: boolean;
    };
    variant: {
      id: string;
      name: string;
      price: number;
      description: string;
      endow?: any;
      config?: any;
      option?: any;
    };
    background?: {
      backgroundId: string;
      backgroundName: string;
      backgroundPrice: number;
      backgroundImageUrl: string;
      backgroundDescription: string;
      formData?: {
        values?: Array<{
          fieldId: string;
          fieldTitle: string;
          fieldType: string;
          value: any;
        }>;
      };
      formConfig?: {
        fields?: Array<{
          id: string;
          type: string;
          title: string;
          required: boolean;
          placeholder: string;
        }>;
      };
    };
    collection: {
      id: string;
      name: string;
      imageUrl: string;
      routeName: string;
    };
    shipping: {
      area: string;
      notes: string;
      shippingId: string;
      shippingFee: number;
      shippingType: string;
      estimatedDeliveryTime: string;
    };
    selectedOptions?: Array<{
      id: string;
      name: string;
      price: number;
      description: string;
    }>;
    selectedCategoryProducts?: {
      [categoryId: string]: {
        categoryId: string;
        categoryName: string;
        products: Array<{
          productCustomId: string;
          productCustomName: string;
          productCustomImage: string;
          productCustomDescription: string;
          price: number;
          quantity: number;
          totalPrice: number;
        }>;
      };
    };
    customQuantities?: any;
    metadata?: {
      createdAt: string;
      userAgent: string;
      orderSource: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
}

export default function OrderManagementPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "status">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState<
    "orderCode" | "customerName" | "phone" | "all"
  >("orderCode");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [expandSearch, setExpandSearch] = useState(true);
  const [expandStatusTime, setExpandStatusTime] = useState(true);
  const [expandPrice, setExpandPrice] = useState(false);
  const [expandSort, setExpandSort] = useState(true);
  const cacheRef = (function () {
    const r = (globalThis as any).__ordersCacheRef;
    if (r) return r;
    const m = new Map<string, any>();
    (globalThis as any).__ordersCacheRef = m;
    return m;
  })();

  const { showToast } = useToastStore();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        limit: 20,
        sortBy,
        sortOrder,
      };

      // Map status từ tiếng Việt sang tiếng Anh trước khi gửi lên API
      if (statusFilter) params.status = mapStatusToEnglish(statusFilter);

      // Gửi ngày dưới dạng ISO string
      if (startDate) params.startDate = new Date(startDate).toISOString();
      if (endDate) params.endDate = new Date(endDate).toISOString();

      // Chỉ gửi giá nếu là số hợp lệ
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        params.minPrice = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        params.maxPrice = parseFloat(maxPrice);
      }

      if (orderCode) params.orderCode = orderCode.trim();
      if (customerName) params.customerName = customerName.trim();
      if (phone) params.phone = phone.trim();
      const key = JSON.stringify(params);
      const cached = cacheRef.get(key);
      if (cached) {
        setOrders(cached.orders || []);
        setTotalPages(cached.pagination?.totalPages || 1);
        setTotalOrders(cached.pagination?.totalItems || 0);
        setLoading(false);
      }
      const response = await getAllOrders(params);

      setOrders(response.data?.orders || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
      setTotalOrders(response.data?.pagination?.totalItems || 0);
      cacheRef.set(key, {
        orders: response.data?.orders || [],
        pagination: response.data?.pagination || {},
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    statusFilter,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    orderCode,
    customerName,
    phone,
    sortBy,
    sortOrder,
  ]);

  const fetchSuggestions = async (text: string) => {
    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const reqs: Promise<any>[] = [];
      if (searchMode === "orderCode" || searchMode === "all") {
        reqs.push(getAllOrders({ orderCode: text.trim(), limit: 5 }));
      }
      if (searchMode === "customerName" || searchMode === "all") {
        reqs.push(getAllOrders({ customerName: text.trim(), limit: 5 }));
      }
      if (searchMode === "phone" || searchMode === "all") {
        reqs.push(getAllOrders({ phone: text.trim(), limit: 5 }));
      }
      const results = await Promise.all(reqs);
      const labels = new Set<string>();
      for (const res of results) {
        const list = res?.data?.orders || [];
        for (const o of list) {
          if (searchMode === "orderCode")
            labels.add(o?.information?.orderCode || o.id);
          else if (searchMode === "customerName")
            labels.add(getCustomerName(o));
          else if (searchMode === "phone") labels.add(getCustomerPhone(o));
          else {
            labels.add(o?.information?.orderCode || o.id);
            const n = getCustomerName(o);
            const p = getCustomerPhone(o);
            if (n) labels.add(n);
            if (p) labels.add(p);
          }
        }
      }
      setSuggestions(Array.from(labels).filter(Boolean).slice(0, 10));
    } catch {}
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchSuggestions(searchText);
      if (searchMode === "orderCode") {
        setOrderCode(searchText);
        setCustomerName("");
        setPhone("");
      } else if (searchMode === "customerName") {
        setCustomerName(searchText);
        setOrderCode("");
        setPhone("");
      } else if (searchMode === "phone") {
        setPhone(searchText);
        setOrderCode("");
        setCustomerName("");
      }
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchText, searchMode]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusIcon = (status: string) => {
    const vietnameseStatus = mapStatusToVietnamese(status);
    switch (vietnameseStatus) {
      case "chờ xử lý":
        return <HourglassEmpty sx={{ color: "#ff9800" }} />;
      case "đã xác nhận":
        return <CheckCircle sx={{ color: "#2196f3" }} />;
      case "đang xử lý":
        return <BuildCircle sx={{ color: "#9c27b0" }} />;
      case "đang giao":
        return <LocalShipping sx={{ color: "#3f51b5" }} />;
      case "đã giao":
        return <DoneAll sx={{ color: "#4caf50" }} />;
      case "đã hủy":
        return <CancelIcon sx={{ color: "#f44336" }} />;
      default:
        return <HourglassEmpty sx={{ color: "#757575" }} />;
    }
  };

  const getStatusColor = (statusEn: string) =>
    getStatusColorByEnglish(statusEn);

  // Local functions removed - using imported utils
  // Now using getCustomerName and getCustomerPhone from "../utils/customer-info.utils"

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    navigate(`/dashboard/orders/${order.id}/edit`);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setUpdating(true);
    try {
      // Map status từ tiếng Việt sang tiếng Anh trước khi gửi lên server
      const englishStatus = mapStatusToEnglish(newStatus);

      // Call API to update order status
      await updateOrderStatus(selectedOrder.id, englishStatus);

      // Show success message
      showToast("Cập nhật trạng thái đơn hàng thành công", "success");

      // Refresh orders
      await fetchOrders();
      setUpdateDialogOpen(false);
      setSelectedOrder(null);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể cập nhật trạng thái";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;

    setDeleting(true);
    try {
      await deleteOrder(selectedOrder.id);

      showToast("Xóa đơn hàng thành công", "success");

      // Refresh orders
      await fetchOrders();
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể xóa đơn hàng";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setMinPrice("");
    setMaxPrice("");
    setOrderCode("");
    setCustomerName("");
    setPhone("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#731618",
            fontSize: { xs: "24px", sm: "32px", md: "2.125rem" },
          }}
        >
          Quản lý đơn hàng
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Chip
            label={`Tổng: ${totalOrders} đơn hàng`}
            sx={{
              bgcolor: "#731618",
              color: "white",
              fontWeight: "bold",
              fontSize: { xs: "0.8rem", sm: "1rem" },
              padding: { xs: "12px 8px", sm: "20px 10px" },
            }}
          />
          <IconButton
            onClick={fetchOrders}
            sx={{
              bgcolor: "#731618",
              color: "white",
              "&:hover": {
                bgcolor: "#5f0d10",
              },
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
            }}
          >
            <Refresh sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontWeight="bold" sx={{ color: "#731618" }}>
              Tìm kiếm nhanh
            </Typography>
            <IconButton
              onClick={() => setExpandSearch((v) => !v)}
              sx={{ color: "#731618" }}
            >
              <ExpandMore
                sx={{
                  transform: expandSearch ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={expandSearch}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <Autocomplete
                freeSolo
                options={suggestions}
                value={searchText}
                onInputChange={(_, v) => setSearchText(v)}
                onChange={(_, v) => {
                  const val = typeof v === "string" ? v : "";
                  setSearchText(val);
                  setPage(1);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tìm kiếm"
                    placeholder="Mã đơn, tên khách, SĐT"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" color="text.secondary">
                            {suggestions.length > 0
                              ? `${suggestions.length}`
                              : ""}
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <FormControl sx={{ minWidth: { xs: "100%", sm: "auto" } }}>
                <InputLabel>Tìm theo</InputLabel>
                <Select
                  value={searchMode}
                  onChange={(e) => {
                    setSearchMode(e.target.value as any);
                    setPage(1);
                  }}
                  label="Tìm theo"
                >
                  <MenuItem value="orderCode">Mã đơn</MenuItem>
                  <MenuItem value="customerName">Tên khách</MenuItem>
                  <MenuItem value="phone">SĐT</MenuItem>
                  <MenuItem value="all">Tất cả</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Mã đơn hàng"
                value={orderCode}
                onChange={(e) => {
                  setPage(1);
                  setOrderCode(e.target.value);
                }}
                placeholder="VD: SG-000123"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              />

              <TextField
                label="Tên khách hàng"
                value={customerName}
                onChange={(e) => {
                  setPage(1);
                  setCustomerName(e.target.value);
                }}
                placeholder="Nhập tên"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              />

              <TextField
                label="Số điện thoại"
                value={phone}
                onChange={(e) => {
                  setPage(1);
                  setPhone(e.target.value);
                }}
                placeholder="Nhập số điện thoại"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              />
            </Box>
          </Collapse>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontWeight="bold" sx={{ color: "#731618" }}>
              Trạng thái & thời gian
            </Typography>
            <IconButton
              onClick={() => setExpandStatusTime((v) => !v)}
              sx={{ color: "#731618" }}
            >
              <ExpandMore
                sx={{
                  transform: expandStatusTime
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={expandStatusTime}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <FormControl sx={{ minWidth: { xs: "100%", sm: "auto" } }}>
                <InputLabel sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  Trạng thái
                </InputLabel>
                <Select
                  value={(function () {
                    const allowed = [
                      "",
                      "chờ xử lý",
                      "đã nhận đơn",
                      "tư vấn",
                      "chờ demo",
                      "đã gửi demo",
                      "chờ confirm demo",
                      "chỉnh sửa demo",
                      "chờ duyệt demo",
                      "chờ bank",
                      "đã thanh toán",
                      "chờ thiết kế",
                      "duyệt thiết kế",
                      "đang sản xuất",
                      "hoàn thành",
                      "đã giao hàng",
                      "giải quyết khiếu nại",
                      "đóng khiếu nại",
                    ];
                    return allowed.includes(statusFilter) ? statusFilter : "";
                  })()}
                  onChange={(e) => {
                    setPage(1);
                    setStatusFilter(e.target.value);
                  }}
                  label="Trạng thái"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem disabled value="__intake">
                    Tiếp nhận
                  </MenuItem>
                  <MenuItem value="chờ xử lý">Chờ xử lý</MenuItem>
                  <MenuItem value="đã nhận đơn">Đã nhận đơn</MenuItem>
                  <MenuItem value="tư vấn">Tư vấn</MenuItem>
                  <MenuItem disabled value="__demo">
                    Demo
                  </MenuItem>
                  <MenuItem value="chờ demo">Chờ demo</MenuItem>
                  <MenuItem value="đã gửi demo">Đã gửi demo</MenuItem>
                  <MenuItem value="chờ confirm demo">Chờ confirm demo</MenuItem>
                  <MenuItem value="chỉnh sửa demo">Chỉnh sửa demo</MenuItem>
                  <MenuItem value="chờ duyệt demo">Chờ duyệt demo</MenuItem>
                  <MenuItem disabled value="__finance">
                    Chốt đơn – Tài chính
                  </MenuItem>
                  <MenuItem value="chờ bank">Chờ bank</MenuItem>
                  <MenuItem value="đã thanh toán">Đã thanh toán</MenuItem>
                  <MenuItem disabled value="__production">
                    Thiết kế – Sản xuất
                  </MenuItem>
                  <MenuItem value="chờ thiết kế">Chờ thiết kế</MenuItem>
                  <MenuItem value="duyệt thiết kế">Duyệt thiết kế</MenuItem>
                  <MenuItem value="đang sản xuất">Đang sản xuất</MenuItem>
                  <MenuItem disabled value="__fulfillment">
                    Hoàn tất – Giao hàng
                  </MenuItem>
                  <MenuItem value="hoàn thành">Hoàn thành</MenuItem>
                  <MenuItem value="đã giao hàng">Đã giao hàng</MenuItem>
                  <MenuItem disabled value="__aftersales">
                    Hậu mãi – Chăm sóc sau mua
                  </MenuItem>
                  <MenuItem value="giải quyết khiếu nại">
                    Giải quyết khiếu nại
                  </MenuItem>
                  <MenuItem value="đóng khiếu nại">Đóng khiếu nại</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="date"
                label="Từ ngày"
                value={startDate}
                onChange={(e) => {
                  setPage(1);
                  setStartDate(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              />

              <TextField
                type="date"
                label="Đến ngày"
                value={endDate}
                onChange={(e) => {
                  setPage(1);
                  setEndDate(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              />
            </Box>
          </Collapse>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontWeight="bold" sx={{ color: "#731618" }}>
              Giá trị đơn hàng
            </Typography>
            <IconButton
              onClick={() => setExpandPrice((v) => !v)}
              sx={{ color: "#731618" }}
            >
              <ExpandMore
                sx={{
                  transform: expandPrice ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={expandPrice}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <TextField
                type="number"
                label="Giá tối thiểu"
                value={minPrice}
                onChange={(e) => {
                  setPage(1);
                  setMinPrice(e.target.value);
                }}
                placeholder="VNĐ"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              />
              <TextField
                type="number"
                label="Giá tối đa"
                value={maxPrice}
                onChange={(e) => {
                  setPage(1);
                  setMaxPrice(e.target.value);
                }}
                placeholder="VNĐ"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              />
            </Box>
          </Collapse>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontWeight="bold" sx={{ color: "#731618" }}>
              Sắp xếp
            </Typography>
            <IconButton
              onClick={() => setExpandSort((v) => !v)}
              sx={{ color: "#731618" }}
            >
              <ExpandMore
                sx={{
                  transform: expandSort ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={expandSort}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: { xs: 1.5, sm: 2 },
                alignItems: "center",
              }}
            >
              <FormControl sx={{ minWidth: { xs: "100%", sm: "auto" } }}>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => {
                    setPage(1);
                    setSortBy(e.target.value as any);
                  }}
                  label="Sắp xếp theo"
                >
                  <MenuItem value="createdAt">Ngày tạo</MenuItem>
                  <MenuItem value="updatedAt">Ngày cập nhật</MenuItem>
                  <MenuItem value="status">Trạng thái</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: { xs: "100%", sm: "auto" } }}>
                <InputLabel>Thứ tự</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => {
                    setPage(1);
                    setSortOrder(e.target.value as any);
                  }}
                  label="Thứ tự"
                >
                  <MenuItem value="desc">Mới nhất</MenuItem>
                  <MenuItem value="asc">Cũ nhất</MenuItem>
                </Select>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{
                    minWidth: { xs: "100%", sm: 120 },
                    color: "#731618",
                    borderColor: "#731618",
                    "&:hover": {
                      borderColor: "#5f0d10",
                      bgcolor: "rgba(115, 22, 24, 0.04)",
                    },
                  }}
                >
                  Xóa bộ lọc
                </Button>
                <Button
                  variant="contained"
                  onClick={() => fetchOrders()}
                  sx={{
                    minWidth: { xs: "100%", sm: 140 },
                    bgcolor: "#731618",
                    "&:hover": { bgcolor: "#5f0d10" },
                  }}
                >
                  Áp dụng bộ lọc
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {orderCode && (
            <Chip
              label={`Mã: ${orderCode}`}
              onDelete={() => {
                setOrderCode("");
                setPage(1);
              }}
            />
          )}
          {customerName && (
            <Chip
              label={`Khách: ${customerName}`}
              onDelete={() => {
                setCustomerName("");
                setPage(1);
              }}
            />
          )}
          {phone && (
            <Chip
              label={`SĐT: ${phone}`}
              onDelete={() => {
                setPhone("");
                setPage(1);
              }}
            />
          )}
          {statusFilter && (
            <Chip
              label={`Trạng thái: ${statusFilter}`}
              onDelete={() => {
                setStatusFilter("");
                setPage(1);
              }}
            />
          )}
          {(startDate || endDate) && (
            <Chip
              label={`Ngày: ${startDate || ""} → ${endDate || ""}`}
              onDelete={() => {
                setStartDate("");
                setEndDate("");
                setPage(1);
              }}
            />
          )}
          {(minPrice || maxPrice) && (
            <Chip
              label={`Giá: ${minPrice || 0} → ${maxPrice || "∞"}`}
              onDelete={() => {
                setMinPrice("");
                setMaxPrice("");
                setPage(1);
              }}
            />
          )}
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress sx={{ color: "#731618" }} />
        </Box>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography color="text.secondary">Không có đơn hàng nào</Typography>
        </Paper>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ overflowX: "auto", borderRadius: 2 }}
          >
            <Table sx={{ minWidth: { xs: 900, sm: 1100 } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#731618" }}>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      bgcolor: "#731618",
                    }}
                  >
                    Mã đơn hàng
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      bgcolor: "#731618",
                    }}
                  >
                    Khách hàng
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      bgcolor: "#731618",
                    }}
                  >
                    Số điện thoại
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      bgcolor: "#731618",
                    }}
                  >
                    Tổng tiền
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      bgcolor: "#731618",
                    }}
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      bgcolor: "#731618",
                    }}
                  >
                    Ngày tạo
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      bgcolor: "#731618",
                    }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(115, 22, 24, 0.04)" },
                      "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                      borderLeft:
                        mapStatusToVietnamese(order.status) === "chờ xử lý"
                          ? "4px solid #ff9800"
                          : undefined,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    <TableCell
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          color: "#731618",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        {order.information?.orderCode || order.id}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {getCustomerName(order)}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {getCustomerPhone(order)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(getOrderTotal(order))}
                      </Typography>
                      {isBatchOrder(order) && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          ({getItemCount(order)} sản phẩm)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={
                          mapStatusToVietnamese(order.status) || "Chờ xử lý"
                        }
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(order.status),
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(order)}
                            sx={{
                              color: "#731618",
                              "&:hover": {
                                bgcolor: "rgba(115, 22, 24, 0.1)",
                              },
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cập nhật trạng thái">
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateStatus(order)}
                            sx={{
                              color: "#2196f3",
                              "&:hover": {
                                bgcolor: "rgba(33, 150, 243, 0.1)",
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hủy đơn hàng">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteOrder(order)}
                            sx={{
                              color: "#f44336",
                              "&:hover": {
                                bgcolor: "rgba(244, 67, 54, 0.1)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              alignItems: "center",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setPage(1)}
              disabled={page === 1}
              sx={{ color: "#731618", borderColor: "#731618" }}
            >
              Trang đầu
            </Button>
            <Button
              variant="outlined"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              sx={{ color: "#731618", borderColor: "#731618" }}
            >
              Trang trước
            </Button>
            <TextField
              type="number"
              value={page}
              onChange={(e) => {
                const v = parseInt(e.target.value || "1", 10);
                if (!isNaN(v)) setPage(Math.min(Math.max(1, v), totalPages));
              }}
              inputProps={{ min: 1, max: totalPages }}
              sx={{ width: 90 }}
              label="Trang"
            />
            <Typography variant="body2">/ {totalPages}</Typography>
            <Button
              variant="outlined"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              sx={{ color: "#731618", borderColor: "#731618" }}
            >
              Trang sau
            </Button>
            <Button
              variant="outlined"
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              sx={{ color: "#731618", borderColor: "#731618" }}
            >
              Trang cuối
            </Button>
          </Box>
        </>
      )}

      {/* Detail Dialog - Same as my-orders.page.tsx */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#731618", color: "white" }}>
          Chi tiết đơn hàng
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder && (
            <Box>
              {/* Mã đơn hàng */}
              <Typography variant="h6" gutterBottom>
                Mã đơn hàng:{" "}
                <span style={{ color: "#731618" }}>
                  {selectedOrder.information?.orderCode || selectedOrder.id}
                </span>
                {isBatchOrder(selectedOrder) && (
                  <Chip
                    label={`${getItemCount(selectedOrder)} sản phẩm`}
                    size="small"
                    sx={{ ml: 1, bgcolor: "#e91e63", color: "white" }}
                  />
                )}
              </Typography>

              {/* Trạng thái */}
              <Box
                sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái:
                </Typography>
                <Chip
                  label={
                    mapStatusToVietnamese(selectedOrder.status) || "Chờ xử lý"
                  }
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(selectedOrder.status),
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </Box>

              {/* Nhân viên xử lý */}
              {selectedOrder.user && (
                <Paper sx={{ p: 2, mt: 3, bgcolor: "#e3f2fd" }}>
                  <Typography variant="h6" sx={{ color: "#1976d2", mb: 2 }}>
                    Nhân viên xử lý
                  </Typography>
                  <Stack spacing={1}>
                    <Typography>
                      <strong>Tên:</strong> {selectedOrder.user.name}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedOrder.user.email}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {/* Thông tin khách hàng - Batch Order */}
              {isBatchOrder(selectedOrder) &&
                (selectedOrder.information as any)?.customerInfo && (
                  <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }}>
                    <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                      Thông tin khách hàng
                    </Typography>
                    <Stack spacing={1}>
                      <Typography>
                        <strong>Họ tên:</strong>{" "}
                        {(selectedOrder.information as any).customerInfo.name}
                      </Typography>
                      <Typography>
                        <strong>Số điện thoại:</strong>{" "}
                        {(selectedOrder.information as any).customerInfo.phone}
                      </Typography>
                      {(selectedOrder.information as any).customerInfo
                        .email && (
                        <Typography>
                          <strong>Email:</strong>{" "}
                          {
                            (selectedOrder.information as any).customerInfo
                              .email
                          }
                        </Typography>
                      )}
                      {(selectedOrder.information as any).customerInfo
                        .address && (
                        <Typography>
                          <strong>Địa chỉ:</strong>{" "}
                          {
                            (selectedOrder.information as any).customerInfo
                              .address
                          }
                        </Typography>
                      )}
                      {(selectedOrder.information as any).customerInfo
                        .notes && (
                        <Typography>
                          <strong>Ghi chú:</strong>{" "}
                          {
                            (selectedOrder.information as any).customerInfo
                              .notes
                          }
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                )}

              {/* Danh sách sản phẩm - Batch Order */}
              {isBatchOrder(selectedOrder) &&
                (selectedOrder.information as any)?.items && (
                  <Paper sx={{ p: 2, mt: 3, bgcolor: "#fff3e0" }}>
                    <Typography variant="h6" sx={{ color: "#e65100", mb: 2 }}>
                      Danh sách sản phẩm (
                      {(selectedOrder.information as any).items.length})
                    </Typography>
                    {(selectedOrder.information as any).items.map(
                      (item: any, index: number) => (
                        <Paper
                          key={index}
                          sx={{ p: 2, mb: 2, bgcolor: "white" }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ color: "#731618", mb: 1 }}
                          >
                            Sản phẩm #{index + 1}: {item.product?.name || "N/A"}
                          </Typography>
                          <Stack spacing={0.5} sx={{ pl: 2 }}>
                            <Typography variant="body2">
                              <strong>Phân loại:</strong>{" "}
                              {item.variant?.name || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Giá:</strong>{" "}
                              {formatCurrency(item.pricing?.itemSubtotal || 0)}
                            </Typography>
                            {item.collection?.name && (
                              <Typography variant="body2">
                                <strong>Bộ sưu tập:</strong>{" "}
                                {item.collection.name}
                              </Typography>
                            )}
                            {item.selectedOptions &&
                              item.selectedOptions.length > 0 && (
                                <Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    Tùy chọn:
                                  </Typography>
                                  {item.selectedOptions.map(
                                    (opt: any, optIdx: number) => (
                                      <Typography
                                        key={optIdx}
                                        variant="body2"
                                        sx={{ pl: 2 }}
                                      >
                                        - {opt.name || `Tùy chọn ${optIdx + 1}`}
                                        : {formatCurrency(opt.price)}
                                      </Typography>
                                    )
                                  )}
                                </Box>
                              )}
                            {item.background && (
                              <Typography variant="body2">
                                <strong>Background:</strong>{" "}
                                {item.background.backgroundName || "N/A"}
                              </Typography>
                            )}
                          </Stack>
                        </Paper>
                      )
                    )}
                  </Paper>
                )}

              {/* Thông tin khách hàng - Single Order */}
              {!isBatchOrder(selectedOrder) && (
                <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }}>
                  <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                    Thông tin khách hàng
                  </Typography>
                  <Stack spacing={1}>
                    {selectedOrder.information?.background?.formData?.values?.map(
                      (field: any, index: number) => (
                        <Typography key={index}>
                          <strong>{field.fieldTitle}:</strong>{" "}
                          {field.value || "N/A"}
                        </Typography>
                      )
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Thông tin sản phẩm - Single Order */}
              {!isBatchOrder(selectedOrder) && (
                <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }}>
                  <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                    Thông tin sản phẩm
                  </Typography>
                  <Stack spacing={1}>
                    <Typography>
                      <strong>Sản phẩm:</strong>{" "}
                      {selectedOrder.information?.product?.name || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Phân loại:</strong>{" "}
                      {selectedOrder.information?.variant?.name || "N/A"}
                    </Typography>
                    {selectedOrder.information?.variant?.description && (
                      <Typography>
                        <strong>Mô tả:</strong>{" "}
                        {selectedOrder.information.variant.description}
                      </Typography>
                    )}
                    <Typography>
                      <strong>Bộ sưu tập:</strong>{" "}
                      {selectedOrder.information?.collection?.name || "N/A"}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {/* Background đã chọn - Single Order */}
              {!isBatchOrder(selectedOrder) &&
                selectedOrder.information?.background && (
                  <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }}>
                    <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                      Background đã chọn
                    </Typography>
                    <Stack spacing={1}>
                      <Typography>
                        <strong>Tên:</strong>{" "}
                        {selectedOrder.information.background.backgroundName ||
                          "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Giá:</strong>{" "}
                        {formatCurrency(
                          selectedOrder.information.background
                            .backgroundPrice || 0
                        )}
                      </Typography>
                      {selectedOrder.information.background
                        .backgroundDescription && (
                        <Typography>
                          <strong>Mô tả:</strong>{" "}
                          {
                            selectedOrder.information.background
                              .backgroundDescription
                          }
                        </Typography>
                      )}
                      {selectedOrder.information.background
                        .backgroundImageUrl && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={
                              selectedOrder.information.background
                                .backgroundImageUrl
                            }
                            alt="Background"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              objectFit: "contain",
                              borderRadius: "8px",
                            }}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                )}

              {/* Tùy chọn đã chọn - Single Order */}
              {!isBatchOrder(selectedOrder) &&
                selectedOrder.information?.selectedOptions &&
                selectedOrder.information.selectedOptions.length > 0 && (
                  <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }}>
                    <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                      Tùy chọn đã chọn
                    </Typography>
                    <Stack spacing={1}>
                      {selectedOrder.information.selectedOptions.map(
                        (option, index) => (
                          <Box key={index}>
                            <Typography>
                              <strong>{option.name}</strong> -{" "}
                              {formatCurrency(option.price)}
                            </Typography>
                            {option.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {option.description}
                              </Typography>
                            )}
                          </Box>
                        )
                      )}
                    </Stack>
                  </Paper>
                )}

              {/* Sản phẩm tùy chỉnh - Single Order */}
              {!isBatchOrder(selectedOrder) &&
                selectedOrder.information?.selectedCategoryProducts &&
                Object.keys(selectedOrder.information.selectedCategoryProducts)
                  .length > 0 && (
                  <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }}>
                    <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                      Sản phẩm tùy chỉnh
                    </Typography>
                    {Object.values(
                      selectedOrder.information.selectedCategoryProducts
                    ).map((category, catIndex) => (
                      <Box key={catIndex} sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          {category.categoryName}
                        </Typography>
                        <Stack spacing={1}>
                          {category.products.map((product, prodIndex) => (
                            <Box
                              key={prodIndex}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                p: 1,
                                bgcolor: "white",
                                borderRadius: 1,
                              }}
                            >
                              {product.productCustomImage && (
                                <img
                                  src={product.productCustomImage}
                                  alt={product.productCustomName}
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                              )}
                              <Box sx={{ flex: 1 }}>
                                <Typography fontWeight="bold">
                                  {product.productCustomName}
                                </Typography>
                                {product.productCustomDescription && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {product.productCustomDescription}
                                  </Typography>
                                )}
                                <Typography variant="body2">
                                  Số lượng: {product.quantity} ×{" "}
                                  {formatCurrency(product.price)} ={" "}
                                  {formatCurrency(product.totalPrice)}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Paper>
                )}

              {/* Thông tin giao hàng */}
              {selectedOrder.information?.shipping && (
                <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }}>
                  <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                    Thông tin giao hàng
                  </Typography>
                  <Stack spacing={1}>
                    <Typography>
                      <strong>Loại giao hàng:</strong>{" "}
                      {selectedOrder.information.shipping.shippingType || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Khu vực:</strong>{" "}
                      {selectedOrder.information.shipping.area || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Phí giao hàng:</strong>{" "}
                      {formatCurrency(
                        selectedOrder.information.shipping.shippingFee || 0
                      )}
                    </Typography>
                    <Typography>
                      <strong>Thời gian giao hàng dự kiến:</strong>{" "}
                      {selectedOrder.information.shipping
                        .estimatedDeliveryTime || "N/A"}
                    </Typography>
                    {selectedOrder.information.shipping.notes && (
                      <Typography>
                        <strong>Ghi chú:</strong>{" "}
                        {selectedOrder.information.shipping.notes}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Chi tiết giá - Single Order */}
              {!isBatchOrder(selectedOrder) && (
                <Paper sx={{ p: 2, mt: 3, bgcolor: "#fff3cd" }}>
                  <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                    Chi tiết thanh toán
                  </Typography>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Giá sản phẩm:</Typography>
                      <Typography>
                        {formatCurrency(
                          selectedOrder.information?.pricing?.productPrice || 0
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Giá background:</Typography>
                      <Typography>
                        {formatCurrency(
                          selectedOrder.information?.pricing?.backgroundPrice ||
                            0
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Giá tùy chọn:</Typography>
                      <Typography>
                        {formatCurrency(
                          selectedOrder.information?.pricing?.optionsPrice || 0
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Giá sản phẩm tùy chỉnh:</Typography>
                      <Typography>
                        {formatCurrency(
                          selectedOrder.information?.pricing
                            ?.customProductsPrice || 0
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Tạm tính:</Typography>
                      <Typography fontWeight="bold">
                        {formatCurrency(
                          selectedOrder.information?.pricing?.subtotal || 0
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Phí vận chuyển:</Typography>
                      <Typography>
                        {formatCurrency(
                          selectedOrder.information?.pricing?.shippingFee || 0
                        )}
                      </Typography>
                    </Box>
                    {selectedOrder.information?.pricing?.discountAmount > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography color="error">Giảm giá:</Typography>
                        <Typography color="error">
                          -
                          {formatCurrency(
                            selectedOrder.information.pricing.discountAmount
                          )}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        pt: 2,
                        borderTop: "2px solid #731618",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Tổng cộng:
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#731618" }}
                      >
                        {formatCurrency(
                          selectedOrder.information?.pricing?.total || 0
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}

              {/* Chi tiết giá - Batch Order */}
              {isBatchOrder(selectedOrder) && (
                <Paper sx={{ p: 2, mt: 3, bgcolor: "#fff3cd" }}>
                  <Typography variant="h6" sx={{ color: "#731618", mb: 2 }}>
                    Chi tiết thanh toán
                  </Typography>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>
                        Tạm tính (
                        {(selectedOrder.information as any)?.items?.length || 0}{" "}
                        sản phẩm):
                      </Typography>
                      <Typography fontWeight="bold">
                        {formatCurrency(
                          (selectedOrder.information as any)?.pricing
                            ?.subtotal || 0
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Phí vận chuyển:</Typography>
                      <Typography>
                        {formatCurrency(
                          (selectedOrder.information as any)?.pricing
                            ?.shippingFee || 0
                        )}
                      </Typography>
                    </Box>
                    {(selectedOrder.information as any)?.pricing
                      ?.discountAmount > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography color="error">Giảm giá:</Typography>
                        <Typography color="error">
                          -
                          {formatCurrency(
                            (selectedOrder.information as any).pricing
                              .discountAmount
                          )}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        pt: 2,
                        borderTop: "2px solid #731618",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Tổng cộng:
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#731618" }}
                      >
                        {formatCurrency(
                          (selectedOrder.information as any)?.pricing?.total ||
                            0
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}

              {/* Thông tin metadata */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ngày đặt hàng:</strong>{" "}
                  {formatDate(selectedOrder.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cập nhật lần cuối:</strong>{" "}
                  {formatDate(selectedOrder.updatedAt)}
                </Typography>
                {selectedOrder.information?.metadata && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Nguồn đơn hàng:</strong>{" "}
                    {selectedOrder.information.metadata.orderSource || "N/A"}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDetailDialogOpen(false)}
            sx={{ color: "#731618" }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#731618", color: "white" }}>
          Cập nhật trạng thái đơn hàng
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Mã đơn hàng:{" "}
                <strong>
                  {selectedOrder.information?.orderCode || selectedOrder.id}
                </strong>
              </Typography>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Trạng thái mới</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Trạng thái mới"
                >
                  {[
                    "chờ xử lý",
                    "đã nhận đơn",
                    "tư vấn",
                    "chờ demo",
                    "đã gửi demo",
                    "chờ confirm demo",
                    "chỉnh sửa demo",
                    "chờ duyệt demo",
                    "chờ bank",
                    "đã thanh toán",
                    "chờ thiết kế",
                    "duyệt thiết kế",
                    "đang sản xuất",
                    "hoàn thành",
                    "đã giao hàng",
                    "giải quyết khiếu nại",
                    "đóng khiếu nại",
                  ].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUpdateDialogOpen(false)}
            sx={{ color: "#731618" }}
            disabled={updating}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSaveStatus}
            variant="contained"
            disabled={updating || !newStatus}
            startIcon={
              updating ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : null
            }
            sx={{
              bgcolor: "#731618",
              "&:hover": {
                bgcolor: "#5f0d10",
              },
            }}
          >
            {updating ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#f44336", color: "white" }}>
          Xác nhận xóa đơn hàng
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Cảnh báo: Hành động này không thể hoàn tác!
                </Typography>
              </Alert>
              <Typography variant="body2" gutterBottom>
                Bạn có chắc chắn muốn xóa đơn hàng:{" "}
                <strong>
                  {selectedOrder.information?.orderCode || selectedOrder.id}
                </strong>
                ?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Khách hàng: <strong>{getCustomerName(selectedOrder)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng tiền:{" "}
                <strong>
                  {formatCurrency(
                    selectedOrder.information?.pricing?.total || 0
                  )}
                </strong>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "#731618" }}
            disabled={deleting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <Delete />
              )
            }
            sx={{
              bgcolor: "#f44336",
              "&:hover": {
                bgcolor: "#d32f2f",
              },
            }}
          >
            {deleting ? "Đang xóa..." : "Xóa đơn hàng"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

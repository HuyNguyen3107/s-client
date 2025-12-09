import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Skeleton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTheme } from "@mui/material/styles";
import {
  ContentCopy,
  OpenInNew,
  Undo,
  InfoOutlined,
  LocalShipping,
  Image as ImageIcon,
  Inventory,
  Person,
  ShoppingBag,
  Payment,
  History,
  Info,
  PhotoCamera,
  Close,
} from "@mui/icons-material";
import {
  mapStatusToVietnamese,
  getStatusColorByEnglish,
  applyOrderStatusUpdate,
} from "../utils/status.utils";
import {
  getOrderById,
  updateOrder,
} from "../services/order-management.service";
import { updateOrderStatus } from "../services/order-assign.service";
import { useToastStore } from "../../../store/toast.store";
import { useImageUpload } from "../../feedbacks/hooks/use-image-upload.hooks";
import { getProductCustoms } from "../../product-customs/services/product-custom.service";
import {
  getInventoryByProductCustom,
  adjustStock,
  releaseReservedStock,
  reserveStock,
} from "../../inventory/services/inventory.services";

export default function OrderEditPage() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const initialRef = useRef<{
    shippingFee: number;
    vtpCode: string;
    statusVi: string;
  } | null>(null);

  const demoUpload = useImageUpload();
  const bgUpload = useImageUpload();
  const completedUpload = useImageUpload();

  const [shippingFee, setShippingFee] = useState<string>("");
  const [vtpCode, setVtpCode] = useState<string>("");
  const [newStatusVi, setNewStatusVi] = useState<string>("");
  const [shippingFeeError, setShippingFeeError] = useState<string>("");
  const [vtpCodeError, setVtpCodeError] = useState<string>("");

  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [changeTarget, setChangeTarget] = useState<{
    categoryId: string;
    index: number;
  } | null>(null);
  const [changeSearch, setChangeSearch] = useState("");
  const [changeOptions, setChangeOptions] = useState<any[]>([]);
  const [selectedChangeOption, setSelectedChangeOption] = useState<any>(null);
  const [customProducts, setCustomProducts] = useState<any>({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addOptions, setAddOptions] = useState<any[]>([]);
  const [selectedAddOption, setSelectedAddOption] = useState<any>(null);
  const [addQuantity, setAddQuantity] = useState<number>(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    categoryId: string;
    index: number;
  } | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };
  const computeCustomProductsPrice = (groups: any): number => {
    if (!groups || typeof groups !== "object") return 0;
    let sum = 0;
    for (const g of Object.values(groups)) {
      for (const p of (g as any).products || []) {
        const price = Number(p.price || 0);
        const qty = Number(p.quantity || 0);
        const total = Number(p.totalPrice || price * qty);
        sum += isNaN(total) ? 0 : total;
      }
    }
    return sum;
  };
  const customProductsPrice = useMemo(
    () => computeCustomProductsPrice(customProducts),
    [customProducts]
  );
  const shippingFeeNum = useMemo(() => {
    const v = parseFloat(shippingFee || "0");
    return isNaN(v) ? 0 : Math.max(0, v);
  }, [shippingFee]);
  const productPriceDynamic = Number(
    (order?.information?.pricing || {}).productPrice || 0
  );
  const backgroundPriceDynamic = Number(
    order?.information?.background?.backgroundPrice ||
      (order?.information?.pricing || {}).backgroundPrice ||
      0
  );
  const optionsPriceDynamic = useMemo(() => {
    const opts = order?.information?.selectedOptions || [];
    if (!Array.isArray(opts))
      return Number((order?.information?.pricing || {}).optionsPrice || 0);
    return opts.reduce((sum: number, o: any) => sum + Number(o?.price || 0), 0);
  }, [order]);
  const discountDynamic = Number(
    (order?.information?.pricing || {}).discountAmount || 0
  );
  const subtotalComputed = useMemo(() => {
    return (
      productPriceDynamic +
      backgroundPriceDynamic +
      optionsPriceDynamic +
      customProductsPrice
    );
  }, [
    productPriceDynamic,
    backgroundPriceDynamic,
    optionsPriceDynamic,
    customProductsPrice,
  ]);
  const totalComputed = useMemo(() => {
    return subtotalComputed + shippingFeeNum - discountDynamic;
  }, [subtotalComputed, shippingFeeNum, discountDynamic]);
  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleString("vi-VN") : "";
  };
  const getStatusColor = (statusEn: string) =>
    getStatusColorByEnglish(statusEn);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Không tìm thấy mã đơn hàng");
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch order with ID:", id);

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 15000)
        );

        const res: any = await Promise.race([getOrderById(id), timeoutPromise]);

        console.log("Order data received:", res);
        const data = res.data || res;

        if (!data) {
          throw new Error("Không có dữ liệu đơn hàng");
        }

        setOrder(data);
        const info = data?.information || {};
        const assets = info?.assets || {};
        if (assets?.demoImageUrl)
          demoUpload.setUploadedImage(assets.demoImageUrl);
        const bgUrl =
          info?.background?.backgroundImageUrl || assets?.backgroundImageUrl;
        if (bgUrl) bgUpload.setUploadedImage(bgUrl);
        if (assets?.completedImageUrl)
          completedUpload.setUploadedImage(assets.completedImageUrl);
        const shipFee =
          info?.shipping?.shippingFee ?? info?.pricing?.shippingFee ?? 0;
        setShippingFee(String(shipFee));
        setVtpCode(info?.shipping?.vtpCode || info?.metadata?.vtpCode || "");
        setNewStatusVi(mapStatusToVietnamese(data?.status || ""));
        initialRef.current = {
          shippingFee: shipFee,
          vtpCode: info?.shipping?.vtpCode || info?.metadata?.vtpCode || "",
          statusVi: mapStatusToVietnamese(data?.status || ""),
        };
        setCustomProducts(info?.selectedCategoryProducts || {});
        setError(null);
      } catch (e: any) {
        console.error("Error fetching order:", e);
        setError(
          e?.message || e?.response?.data?.message || "Không thể tải đơn hàng"
        );
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "demo" | "bg" | "completed"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (type === "demo") await demoUpload.uploadImage(file);
      else if (type === "bg") await bgUpload.uploadImage(file);
      else await completedUpload.uploadImage(file);
    } catch (err: any) {
      showToast(err?.message || "Upload ảnh không hợp lệ", "error");
    }
  };

  const handleRemoveImage = (type: "demo" | "bg" | "completed") => {
    if (type === "demo") demoUpload.setUploadedImage("");
    else if (type === "bg") bgUpload.setUploadedImage("");
    else completedUpload.setUploadedImage("");
    showToast("Đã xóa ảnh", "info");
  };

  const handleSave = async () => {
    if (!order?.id) return;
    const feeNum = parseFloat(shippingFee || "0");
    if (isNaN(feeNum) || feeNum < 0) {
      setShippingFeeError("Phí vận chuyển phải là số không âm");
      showToast("Phí vận chuyển không hợp lệ", "error");
      return;
    }
    if (vtpCode && vtpCode.trim().length < 5) {
      setVtpCodeError("Mã VTP tối thiểu 5 ký tự");
      showToast("Mã Viettel Post không hợp lệ", "error");
      return;
    }
    let statusResult: any = null;
    try {
      setSaving(true);
      const prevEnglishStatus = order.status || "";
      statusResult = await applyOrderStatusUpdate(
        order.id,
        prevEnglishStatus,
        newStatusVi,
        updateOrderStatus
      );
      if (statusResult.error) {
        showToast(statusResult.error, "error");
        setError(statusResult.error);
      }
      if ((statusResult as any)?.nextEnglishStatus === "paid") {
        const cps = customProducts || {};
        const tasks: Promise<any>[] = [];
        for (const group of Object.values(cps)) {
          for (const p of (group as any).products || []) {
            const qty = Number(p.quantity || 0);
            if (qty > 0 && p.productCustomId) {
              tasks.push(
                (async () => {
                  try {
                    const inv = await getInventoryByProductCustom(
                      p.productCustomId
                    );
                    if (inv?.id) {
                      try {
                        await releaseReservedStock(inv.id, { quantity: qty });
                      } catch {}
                      await adjustStock(inv.id, {
                        quantity: -qty,
                        reason: "order_paid",
                      });
                    }
                  } catch {}
                })()
              );
            }
          }
        }
        if (tasks.length > 0) {
          try {
            await Promise.all(tasks);
            showToast("Đã cập nhật kho theo đơn đã thanh toán", "success");
          } catch {
            showToast("Cập nhật kho gặp lỗi ở một số mục", "warning");
          }
        }
      }
      if (
        [
          "cancelled",
          "canceled",
          "complaint_closed",
          "order_cancelled",
        ].includes((statusResult as any)?.nextEnglishStatus)
      ) {
        const cps = customProducts || {};
        const tasks: Promise<any>[] = [];
        for (const group of Object.values(cps)) {
          for (const p of (group as any).products || []) {
            const qty = Number(p.quantity || 0);
            if (qty > 0 && p.productCustomId) {
              tasks.push(
                (async () => {
                  try {
                    const inv = await getInventoryByProductCustom(
                      p.productCustomId
                    );
                    if (inv?.id)
                      await releaseReservedStock(inv.id, { quantity: qty });
                  } catch {}
                })()
              );
            }
          }
        }
        if (tasks.length > 0) {
          try {
            await Promise.all(tasks);
            showToast(
              "Đã giải phóng giữ chỗ trong kho theo trạng thái đơn",
              "success"
            );
          } catch {
            showToast("Giải phóng kho gặp lỗi ở một số mục", "warning");
          }
        }
      }
      const info = { ...(order?.information || {}) };
      const nextBgUrl =
        bgUpload.uploadedImage ||
        info?.background?.backgroundImageUrl ||
        info?.assets?.backgroundImageUrl ||
        "";
      info.background = {
        ...(info.background || {}),
        backgroundImageUrl: nextBgUrl,
      };
      info.assets = {
        demoImageUrl:
          demoUpload.uploadedImage || info?.assets?.demoImageUrl || "",
        backgroundImageUrl: nextBgUrl,
        completedImageUrl:
          completedUpload.uploadedImage ||
          info?.assets?.completedImageUrl ||
          "",
      };
      info.shipping = {
        ...(info.shipping || {}),
        shippingFee: feeNum,
        vtpCode: vtpCode || "",
      };
      const bp = { ...(info.pricing || {}) };
      const productPriceNum = Number(bp.productPrice || 0);
      const backgroundPriceNum = Number(
        info?.background?.backgroundPrice || bp.backgroundPrice || 0
      );
      const optionsPriceNum = Array.isArray(info?.selectedOptions)
        ? (info.selectedOptions as any[]).reduce(
            (s, o) => s + Number((o as any)?.price || 0),
            0
          )
        : Number(bp.optionsPrice || 0);
      const discountNum = Number(bp.discountAmount || 0);
      const subtotalNum =
        productPriceNum +
        backgroundPriceNum +
        optionsPriceNum +
        customProductsPrice;
      const totalNum = subtotalNum + feeNum - discountNum;
      info.pricing = {
        ...bp,
        shippingFee: feeNum,
        optionsPrice: optionsPriceNum,
        customProductsPrice: customProductsPrice,
        subtotal: subtotalNum,
        total: totalNum,
      };
      info.selectedCategoryProducts = customProducts;
      const payload = { information: info };
      await updateOrder(order.id, payload);
      showToast("Cập nhật đơn hàng thành công", "success");
      navigate(-1);
    } catch (e: any) {
      const m = e?.response?.data?.message || "Không thể cập nhật đơn hàng";
      setError(m);
      showToast(m, "error");
      try {
        const prevEnglishStatus = order.status || "";
        const rollbackNeeded =
          prevEnglishStatus !== (statusResult as any)?.nextEnglishStatus;
        if (rollbackNeeded) {
          await updateOrderStatus(order.id, prevEnglishStatus);
        }
      } catch {}
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const init = initialRef.current;
    if (!init) return;
    setShippingFee(String(init.shippingFee ?? 0));
    setVtpCode(init.vtpCode || "");
    setNewStatusVi(init.statusVi || "");
    setShippingFeeError("");
    setVtpCodeError("");
    showToast("Đã hoàn tác thay đổi", "info");
  };

  const primary = theme.palette.primary.main;
  const onVtpHelpClick = () => {
    showToast("Mã VTP do Viettel Post cung cấp để tracking.", "info");
  };

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!addDialogOpen) return;
      try {
        const res = await getProductCustoms({ search: addSearch, limit: 10 });
        setAddOptions(res.data || []);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [addDialogOpen, addSearch]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!changeDialogOpen) return;
      try {
        const res = await getProductCustoms({
          search: changeSearch,
          limit: 10,
        });
        setChangeOptions(res.data || []);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [changeDialogOpen, changeSearch]);

  const handleAddCustomProduct = () => {
    if (!selectedAddOption || addQuantity <= 0) {
      showToast("Vui lòng chọn sản phẩm và số lượng hợp lệ", "error");
      return;
    }
    const catId = selectedAddOption.productCategoryId;
    const catName = selectedAddOption.productCategory?.name || "Danh mục";
    const price = Number(selectedAddOption.price || 0);
    const prod = {
      productCustomId: selectedAddOption.id,
      productCustomName: selectedAddOption.name,
      productCustomImage: selectedAddOption.imageUrl,
      productCustomDescription: selectedAddOption.description || "",
      price,
      quantity: addQuantity,
      totalPrice: price * addQuantity,
    };
    setCustomProducts((prev: any) => {
      const group = prev[catId] || {
        categoryId: catId,
        categoryName: catName,
        products: [],
      };
      const next = { ...prev };
      next[catId] = { ...group, products: [...group.products, prod] };
      return next;
    });
    setAddDialogOpen(false);
    setSelectedAddOption(null);
    setAddSearch("");
    setAddQuantity(1);
    showToast("Đã thêm sản phẩm tùy chỉnh", "success");
    try {
      handleReserveForProduct(prod.productCustomId, prod.quantity);
    } catch {}
  };

  const requestDeleteProduct = (categoryId: string, index: number) => {
    setDeleteTarget({ categoryId, index });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (!deleteTarget) return;
    const { categoryId, index } = deleteTarget;
    try {
      const group = (customProducts as any)?.[categoryId];
      const prod = group?.products?.[index];
      const qty = Number(prod?.quantity || 0);
      const pid = prod?.productCustomId;
      if (pid && qty > 0) {
        getInventoryByProductCustom(pid)
          .then(
            (inv) => inv?.id && releaseReservedStock(inv.id, { quantity: qty })
          )
          .catch(() => {});
      }
    } catch {}
    setCustomProducts((prev: any) => {
      const group = prev[categoryId];
      if (!group) return prev;
      const products = group.products.filter(
        (_: any, i: number) => i !== index
      );
      const next = { ...prev };
      if (products.length === 0) {
        delete next[categoryId];
      } else {
        next[categoryId] = { ...group, products };
      }
      return next;
    });
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
    showToast("Đã xóa sản phẩm", "success");
  };

  const handleReserveForProduct = async (
    productCustomId: string,
    qty: number
  ) => {
    if (!productCustomId || qty <= 0) return;
    try {
      const inv = await getInventoryByProductCustom(productCustomId);
      if (inv?.id)
        await reserveStock(inv.id, {
          quantity: qty,
          reason: "order_edit_add",
        } as any);
    } catch {}
  };

  const handleReleaseForProduct = async (
    productCustomId: string,
    qty: number
  ) => {
    if (!productCustomId || qty <= 0) return;
    try {
      const inv = await getInventoryByProductCustom(productCustomId);
      if (inv?.id) await releaseReservedStock(inv.id, { quantity: qty });
    } catch {}
  };

  const handleQuantityChange = async (
    categoryId: string,
    index: number,
    newQty: number
  ) => {
    setCustomProducts((prev: any) => {
      const group = prev[categoryId];
      if (!group) return prev;
      const products = [...group.products];
      const current = products[index];
      const oldQty = Number(current.quantity || 0);
      const qty = Math.max(1, Number(newQty || 1));
      const delta = qty - oldQty;
      products[index] = {
        ...current,
        quantity: qty,
        totalPrice: Number(current.price || 0) * qty,
      };
      const next = { ...prev };
      next[categoryId] = { ...group, products };
      return next;
    });
    try {
      const group = (customProducts as any)[categoryId];
      const prod = group?.products?.[index];
      const pid = prod?.productCustomId;
      const oldQty = Number(prod?.quantity || 0);
      const delta = Math.max(1, Number(newQty || 1)) - oldQty;
      if (pid && delta !== 0) {
        if (delta > 0) await handleReserveForProduct(pid, delta);
        else await handleReleaseForProduct(pid, Math.abs(delta));
      }
    } catch {}
  };

  const requestChangeProduct = (categoryId: string, index: number) => {
    setChangeTarget({ categoryId, index });
    setSelectedChangeOption(null);
    setChangeSearch("");
    setChangeDialogOpen(true);
  };

  const confirmChangeProduct = () => {
    if (!changeTarget || !selectedChangeOption) {
      showToast("Vui lòng chọn sản phẩm", "error");
      return;
    }
    const { categoryId, index } = changeTarget;
    const price = Number(selectedChangeOption.price || 0);
    let oldPid: string | undefined;
    let oldQty = 0;
    setCustomProducts((prev: any) => {
      const group = prev[categoryId];
      if (!group) return prev;
      const products = [...group.products];
      const current = products[index];
      oldPid = current?.productCustomId;
      oldQty = Number(current?.quantity || 0);
      const nextProd = {
        productCustomId: selectedChangeOption.id,
        productCustomName: selectedChangeOption.name,
        productCustomImage: selectedChangeOption.imageUrl,
        productCustomDescription: selectedChangeOption.description || "",
        price,
        quantity: current.quantity,
        totalPrice: price * current.quantity,
      };
      products[index] = nextProd;
      return { ...prev, [categoryId]: { ...group, products } };
    });
    setChangeDialogOpen(false);
    setChangeTarget(null);
    showToast("Đã thay đổi sản phẩm", "success");
    (async () => {
      try {
        if (oldPid && oldQty > 0) await handleReleaseForProduct(oldPid, oldQty);
        await handleReserveForProduct(selectedChangeOption.id, oldQty);
      } catch {}
    })();
  };

  const totalValue = useMemo(() => {
    const p = order?.information?.pricing || {};
    return (p.total ?? 0) as number;
  }, [order]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress sx={{ color: primary }} />
      </Box>
    );
  }

  if (!order && !error) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Alert severity="warning" sx={{ mb: 2 }}>
          Không tìm thấy dữ liệu đơn hàng hoặc dữ liệu trống.
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${primary} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Chỉnh sửa đơn hàng
            </Typography>
            <Chip
              label={order?.information?.orderCode || order?.id}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "bold",
                backdropFilter: "blur(10px)",
              }}
            />
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Sao chép mã đơn" enterTouchDelay={0}>
              <IconButton
                aria-label="Sao chép mã đơn"
                onClick={() => {
                  const code = order?.information?.orderCode || order?.id;
                  navigator.clipboard.writeText(String(code || ""));
                  showToast("Đã sao chép mã đơn", "success");
                }}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xem tracking đơn" enterTouchDelay={0}>
              <IconButton
                aria-label="Xem tracking"
                onClick={() => {
                  const code = order?.information?.orderCode || order?.id;
                  navigate(
                    `/order-tracking?code=${encodeURIComponent(code || "")}`
                  );
                }}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hoàn tác thay đổi" enterTouchDelay={0}>
              <span>
                <IconButton
                  aria-label="Hoàn tác"
                  onClick={handleReset}
                  disabled={!initialRef.current}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  <Undo />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>
      </Paper>

      {/* Main Content */}
      <Stack spacing={3}>
        {/* Status Section */}
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Info sx={{ color: primary }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Trạng thái đơn hàng
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Trạng thái
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <Chip
                aria-label="Trạng thái hiện tại"
                label={mapStatusToVietnamese(order?.status || "")}
                sx={{
                  bgcolor: getStatusColor(order?.status || ""),
                  color: "white",
                  fontWeight: "bold",
                  transition: "background-color 200ms ease",
                }}
              />
              <Tooltip
                title="Chọn trạng thái theo quy trình xử lý đơn"
                enterTouchDelay={0}
              >
                <TextField
                  select
                  label="Trạng thái mới"
                  value={newStatusVi}
                  onChange={(e) => setNewStatusVi(e.target.value)}
                  sx={{ minWidth: { xs: "100%", sm: 240 } }}
                  aria-describedby="status-help"
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
                </TextField>
              </Tooltip>
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Ảnh
            </Typography>
            <Grid container spacing={3}>
              {/* Ảnh demo sản phẩm */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Ảnh demo sản phẩm
                  </Typography>
                  {demoUpload.uploadedImage ? (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <Box
                        component="img"
                        src={demoUpload.uploadedImage}
                        alt="Ảnh demo"
                        sx={{
                          width: "100%",
                          maxWidth: 280,
                          height: 200,
                          objectFit: "contain",
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          bgcolor: "#fafafa",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage("demo")}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(0, 0, 0, 0.6)",
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.8)",
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 280,
                        height: 200,
                        border: "2px dashed #e0e0e0",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        bgcolor: "#fafafa",
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                      <Typography variant="body2">Chưa có ảnh</Typography>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mt: 1, maxWidth: 280 }}
                    startIcon={<PhotoCamera />}
                    disabled={demoUpload.uploading}
                  >
                    {demoUpload.uploadedImage ? "Thay đổi ảnh" : "Chọn ảnh"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleFileChange(e, "demo")}
                    />
                  </Button>
                  {demoUpload.uploading && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Ảnh nền */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Ảnh nền
                  </Typography>
                  {bgUpload.uploadedImage ? (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <Box
                        component="img"
                        src={bgUpload.uploadedImage}
                        alt="Ảnh nền"
                        sx={{
                          width: "100%",
                          maxWidth: 280,
                          height: 200,
                          objectFit: "contain",
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          bgcolor: "#fafafa",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage("bg")}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(0, 0, 0, 0.6)",
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.8)",
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 280,
                        height: 200,
                        border: "2px dashed #e0e0e0",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        bgcolor: "#fafafa",
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                      <Typography variant="body2">Chưa có ảnh</Typography>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mt: 1, maxWidth: 280 }}
                    startIcon={<PhotoCamera />}
                    disabled={bgUpload.uploading}
                  >
                    {bgUpload.uploadedImage ? "Thay đổi ảnh" : "Chọn ảnh"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleFileChange(e, "bg")}
                    />
                  </Button>
                  {bgUpload.uploading && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Ảnh sản phẩm đã hoàn thành */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Ảnh sản phẩm đã hoàn thành
                  </Typography>
                  {completedUpload.uploadedImage ? (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <Box
                        component="img"
                        src={completedUpload.uploadedImage}
                        alt="Ảnh hoàn thành"
                        sx={{
                          width: "100%",
                          maxWidth: 280,
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          bgcolor: "#fafafa",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage("completed")}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(0, 0, 0, 0.6)",
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.8)",
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 280,
                        height: 200,
                        border: "2px dashed #e0e0e0",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        bgcolor: "#fafafa",
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                      <Typography variant="body2">Chưa có ảnh</Typography>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mt: 1, maxWidth: 280 }}
                    startIcon={<PhotoCamera />}
                    disabled={completedUpload.uploading}
                  >
                    {completedUpload.uploadedImage
                      ? "Thay đổi ảnh"
                      : "Chọn ảnh"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleFileChange(e, "completed")}
                    />
                  </Button>
                  {completedUpload.uploading && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Vận chuyển
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Tooltip
                  title="Nhập phí vận chuyển (VNĐ). Phải là số không âm"
                  enterTouchDelay={0}
                >
                  <TextField
                    label="Phí vận chuyển"
                    type="number"
                    value={shippingFee}
                    onChange={(e) => {
                      const v = e.target.value;
                      setShippingFee(v);
                      const num = parseFloat(v || "0");
                      setShippingFeeError(
                        isNaN(num) || num < 0 ? "Phí vận chuyển phải ≥ 0" : ""
                      );
                    }}
                    fullWidth
                    error={Boolean(shippingFeeError)}
                    helperText={shippingFeeError || ""}
                    inputProps={{ "aria-label": "Phí vận chuyển" }}
                  />
                </Tooltip>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Tooltip
                    title="Mã tracking do Viettel Post cung cấp"
                    enterTouchDelay={0}
                  >
                    <IconButton
                      aria-label="Giải thích mã VTP"
                      onClick={onVtpHelpClick}
                      sx={{ color: theme.palette.info.main }}
                    >
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Nhập mã Viettel Post (tối thiểu 5 ký tự)"
                    enterTouchDelay={0}
                  >
                    <TextField
                      label="Mã Viettel Post"
                      value={vtpCode}
                      onChange={(e) => {
                        const v = e.target.value;
                        setVtpCode(v);
                        setVtpCodeError(
                          v && v.trim().length < 5 ? "Tối thiểu 5 ký tự" : ""
                        );
                      }}
                      fullWidth
                      error={Boolean(vtpCodeError)}
                      helperText={vtpCodeError || ""}
                      inputProps={{ "aria-label": "Mã Viettel Post" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                      }}
                    />
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Danh sách sản phẩm trong đơn
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
              <Stack spacing={1}>
                <Typography>
                  <strong>Sản phẩm:</strong>{" "}
                  {order?.information?.product?.name || "N/A"}
                </Typography>
                <Typography>
                  <strong>Phân loại:</strong>{" "}
                  {order?.information?.variant?.name || "N/A"}
                </Typography>
                {order?.information?.variant?.description && (
                  <Typography>
                    <strong>Mô tả:</strong>{" "}
                    {order?.information?.variant?.description}
                  </Typography>
                )}
                <Typography>
                  <strong>Bộ sưu tập:</strong>{" "}
                  {order?.information?.collection?.name || "N/A"}
                </Typography>
              </Stack>
            </Paper>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Thông tin khách hàng
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
              <Stack spacing={1}>
                {(order?.information?.background?.formData?.values || []).map(
                  (field: any, i: number) => (
                    <Typography key={i}>
                      <strong>{field.fieldTitle}:</strong>{" "}
                      {field.value || "N/A"}
                    </Typography>
                  )
                )}
              </Stack>
            </Paper>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Thông tin sản phẩm
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
              <Stack spacing={1}>
                <Typography>
                  <strong>Sản phẩm:</strong>{" "}
                  {order?.information?.product?.name || "N/A"}
                </Typography>
                <Typography>
                  <strong>Phân loại:</strong>{" "}
                  {order?.information?.variant?.name || "N/A"}
                </Typography>
                {order?.information?.variant?.description && (
                  <Typography>
                    <strong>Mô tả:</strong>{" "}
                    {order?.information?.variant?.description}
                  </Typography>
                )}
                <Typography>
                  <strong>Bộ sưu tập:</strong>{" "}
                  {order?.information?.collection?.name || "N/A"}
                </Typography>
              </Stack>
            </Paper>
          </Box>
          {order?.information?.background && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Background đã chọn
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <Stack spacing={1}>
                  <Typography>
                    <strong>Tên:</strong>{" "}
                    {order?.information?.background?.backgroundName || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Giá:</strong>{" "}
                    {formatCurrency(
                      order?.information?.background?.backgroundPrice || 0
                    )}
                  </Typography>
                  {order?.information?.background?.backgroundDescription && (
                    <Typography>
                      <strong>Mô tả:</strong>{" "}
                      {order?.information?.background?.backgroundDescription}
                    </Typography>
                  )}
                  {order?.information?.background?.backgroundImageUrl && (
                    <Box sx={{ mt: 1 }}>
                      <Box
                        component="img"
                        src={order?.information?.background?.backgroundImageUrl}
                        alt="Background"
                        sx={{
                          width: "100%",
                          maxWidth: 300,
                          height: "auto",
                          maxHeight: 200,
                          objectFit: "contain",
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Box>
          )}
          {order?.information?.selectedOptions &&
            order?.information?.selectedOptions.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Tùy chọn đã chọn
                </Typography>
                <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Stack spacing={1}>
                    {order?.information?.selectedOptions.map(
                      (option: any, idx: number) => (
                        <Box key={idx}>
                          <Typography>
                            <strong>{option.name}</strong> -{" "}
                            {formatCurrency(option.price)}
                          </Typography>
                          {option.description && (
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                          )}
                        </Box>
                      )
                    )}
                  </Stack>
                </Paper>
              </Box>
            )}
          {customProducts && Object.keys(customProducts).length > 0 && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Sản phẩm tùy chỉnh
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                {Object.values(customProducts).map(
                  (category: any, catIndex: number) => (
                    <Box key={catIndex} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        {category.categoryName}
                      </Typography>
                      <Stack spacing={2}>
                        {category.products.map(
                          (product: any, prodIndex: number) => (
                            <Box
                              key={prodIndex}
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: { xs: "flex-start", md: "center" },
                                gap: 2,
                                p: 2,
                                bgcolor: "white",
                                borderRadius: 2,
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              {product.productCustomImage && (
                                <Box
                                  component="img"
                                  src={product.productCustomImage}
                                  alt={product.productCustomName}
                                  sx={{
                                    width: { xs: "100%", sm: 80, md: 80 },
                                    height: { xs: 120, sm: 80, md: 80 },
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    border: "1px solid #e0e0e0",
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  fontWeight="bold"
                                  sx={{
                                    mb: 0.5,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {product.productCustomName}
                                </Typography>
                                {product.productCustomDescription && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      mb: 1,
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {product.productCustomDescription}
                                  </Typography>
                                )}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    alignItems: {
                                      xs: "flex-start",
                                      sm: "center",
                                    },
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <TextField
                                    type="number"
                                    size="small"
                                    label="Số lượng"
                                    value={product.quantity}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        category.categoryId,
                                        prodIndex,
                                        parseInt(e.target.value || "1", 10)
                                      )
                                    }
                                    sx={{ width: { xs: "100%", sm: 120 } }}
                                    inputProps={{ min: 1 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      whiteSpace: "nowrap",
                                      alignSelf: {
                                        xs: "flex-start",
                                        sm: "center",
                                      },
                                    }}
                                  >
                                    × {formatCurrency(product.price)} ={" "}
                                    {formatCurrency(product.totalPrice)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Stack
                                direction={{ xs: "row", md: "row" }}
                                spacing={1}
                                sx={{
                                  width: { xs: "100%", md: "auto" },
                                  flexShrink: 0,
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    requestChangeProduct(
                                      category.categoryId,
                                      prodIndex
                                    )
                                  }
                                  sx={{ flex: { xs: 1, md: "initial" } }}
                                >
                                  Thay đổi
                                </Button>
                                <Button
                                  color="error"
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    requestDeleteProduct(
                                      category.categoryId,
                                      prodIndex
                                    )
                                  }
                                  sx={{ flex: { xs: 1, md: "initial" } }}
                                >
                                  Xóa
                                </Button>
                              </Stack>
                            </Box>
                          )
                        )}
                      </Stack>
                    </Box>
                  )
                )}
              </Paper>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => setAddDialogOpen(true)}
                  sx={{ bgcolor: primary }}
                >
                  Thêm
                </Button>
              </Box>
            </Box>
          )}
          {!customProducts || Object.keys(customProducts).length === 0 ? (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Sản phẩm tùy chỉnh
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có sản phẩm tùy chỉnh
                </Typography>
              </Paper>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => setAddDialogOpen(true)}
                  sx={{ bgcolor: primary }}
                >
                  Thêm
                </Button>
              </Box>
            </Box>
          ) : null}
          {order?.information?.shipping && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Thông tin giao hàng
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <Stack spacing={1}>
                  <Typography>
                    <strong>Loại giao hàng:</strong>{" "}
                    {order?.information?.shipping?.shippingType || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Khu vực:</strong>{" "}
                    {order?.information?.shipping?.area || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Phí giao hàng:</strong>{" "}
                    {formatCurrency(
                      order?.information?.shipping?.shippingFee || 0
                    )}
                  </Typography>
                  <Typography>
                    <strong>Thời gian giao hàng dự kiến:</strong>{" "}
                    {order?.information?.shipping?.estimatedDeliveryTime ||
                      "N/A"}
                  </Typography>
                  {order?.information?.shipping?.notes && (
                    <Typography>
                      <strong>Ghi chú:</strong>{" "}
                      {order?.information?.shipping?.notes}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Box>
          )}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Chi tiết thanh toán
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "#fff3cd" }}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Giá sản phẩm:</Typography>
                  <Typography>
                    {formatCurrency(
                      order?.information?.pricing?.productPrice || 0
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Giá background:</Typography>
                  <Typography>
                    {formatCurrency(
                      order?.information?.pricing?.backgroundPrice || 0
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Giá tùy chọn:</Typography>
                  <Typography>
                    {formatCurrency(
                      order?.information?.pricing?.optionsPrice || 0
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Giá sản phẩm tùy chỉnh:</Typography>
                  <Typography>{formatCurrency(customProductsPrice)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Tạm tính:</Typography>
                  <Typography fontWeight="bold">
                    {formatCurrency(subtotalComputed)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Phí vận chuyển:</Typography>
                  <Typography>{formatCurrency(shippingFeeNum)}</Typography>
                </Box>
                {order?.information?.pricing?.discountAmount > 0 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="error">Giảm giá:</Typography>
                    <Typography color="error">
                      -
                      {formatCurrency(
                        order?.information?.pricing?.discountAmount || 0
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
                    sx={{ color: primary }}
                  >
                    {formatCurrency(totalComputed)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Lịch sử chỉnh sửa
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
              {Array.isArray(order?.information?.history) &&
              order?.information?.history.length > 0 ? (
                <Stack spacing={1}>
                  {order.information.history.map((h: any, idx: number) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      color="text.secondary"
                    >
                      {h}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có dữ liệu lịch sử chỉnh sửa
                </Typography>
              )}
            </Paper>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Thông tin khác
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Ngày đặt hàng:</strong> {formatDate(order?.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Cập nhật lần cuối:</strong>{" "}
                {formatDate(order?.updatedAt)}
              </Typography>
              {order?.information?.metadata && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Nguồn đơn hàng:</strong>{" "}
                  {order?.information?.metadata?.orderSource || "N/A"}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ color: primary, borderColor: primary }}
            >
              Hủy
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleSave}
              loading={saving}
              sx={{
                bgcolor: primary,
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              Lưu
            </LoadingButton>
          </Box>
        </Paper>
      </Stack>
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm sản phẩm tùy chỉnh</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Autocomplete
            options={addOptions}
            getOptionLabel={(o: any) => o?.name || ""}
            value={selectedAddOption}
            onChange={(_, v) => setSelectedAddOption(v)}
            onInputChange={(_, v) => setAddSearch(v)}
            renderInput={(params) => (
              <TextField {...params} label="Tìm sản phẩm" />
            )}
          />
          <TextField
            sx={{ mt: 2 }}
            type="number"
            label="Số lượng"
            value={addQuantity}
            onChange={(e) =>
              setAddQuantity(Math.max(1, parseInt(e.target.value || "1", 10)))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleAddCustomProduct}
            sx={{ bgcolor: primary }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Bạn chắc chắn muốn xóa sản phẩm này khỏi đơn hàng?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeleteProduct}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={changeDialogOpen}
        onClose={() => setChangeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận thay đổi sản phẩm</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Autocomplete
            options={changeOptions}
            getOptionLabel={(o: any) => o?.name || ""}
            value={selectedChangeOption}
            onChange={(_, v) => setSelectedChangeOption(v)}
            onInputChange={(_, v) => setChangeSearch(v)}
            renderInput={(params) => (
              <TextField {...params} label="Chọn sản phẩm thay thế" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={confirmChangeProduct}
            sx={{ bgcolor: primary }}
          >
            Thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

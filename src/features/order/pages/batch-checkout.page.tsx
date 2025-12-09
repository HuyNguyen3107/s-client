import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaTag,
  FaTruck,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStickyNote,
} from "react-icons/fa";
import type {
  BatchOrderSubmissionData,
  BatchOrderItem,
  CustomerInfo,
} from "../types/order.types";
import { createBatchOrder } from "../services/order.service";
import { getProductById } from "../../products/services/product.services";
import { getBackgroundById } from "../../backgrounds/services/background.services";
import { getProductCustomById } from "../../product-customs/services/product-custom.service";
import { productCategoryService } from "../../product-categories/services/product-category.service";
import { getShippingFees } from "../../shipping-fees/services/shipping-fee.services";
import { getPromotionByCode } from "../../promotions/services/promotion.services";
import type { ProductWithRelations } from "../../products/types";
import type { Background } from "../../backgrounds/types/background.types";
import type { ProductCustomWithRelations } from "../../product-customs/types";
import type { ProductCategoryWithRelations } from "../../product-categories/types";
import type { ShippingFee } from "../../shipping-fees/types/shipping-fee.types";
import type { Promotion } from "../../promotions/types/promotion.types";
import Header from "../../../components/header.components";
import Footer from "../../../components/footer.components";
import { OrderSuccessModal } from "../components/order-success-modal";
import { useCartStore } from "../../../store/cart.store";
import type { CartItem } from "../../../store/cart.store";
import { toast } from "react-toastify";
import styles from "./order.module.scss";

interface LoadedItemDetails {
  product: ProductWithRelations | null;
  variant: any;
  backgrounds: Background[];
  productCustomDetails: Map<string, ProductCustomWithRelations>;
  categoryDetails: Map<string, ProductCategoryWithRelations>;
}

export default function BatchCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items: cartItems, clearCart, removeItem } = useCartStore();

  // Parse data từ URL
  const parsedData = useMemo(() => {
    const dataString = searchParams.get("data");
    return dataString ? JSON.parse(decodeURIComponent(dataString)) : null;
  }, [searchParams]);

  // Lấy danh sách items từ data hoặc cart
  const orderItems: CartItem[] = useMemo(() => {
    if (parsedData?.items) {
      return parsedData.items;
    }
    return [];
  }, [parsedData]);

  // Customer info state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  // Loaded details cho từng item
  const [itemsDetails, setItemsDetails] = useState<
    Map<string, LoadedItemDetails>
  >(new Map());
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Shipping state
  const [availableShippingOptions, setAvailableShippingOptions] = useState<
    ShippingFee[]
  >([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingFee | null>(
    null
  );
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Promotion state
  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
    null
  );
  const [promoError, setPromoError] = useState<string>("");
  const [promoLoading, setPromoLoading] = useState(false);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState<string>("");

  // Expanded items state
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Fetch shipping options
  useEffect(() => {
    const fetchShippingOptions = async () => {
      setLoadingShipping(true);
      try {
        const response = await getShippingFees({
          area: "Hà Nội",
          limit: 100,
        });

        if (response?.data?.length > 0) {
          setAvailableShippingOptions(response.data);
          setSelectedShipping(response.data[0]);
          setShippingFee(Number(response.data[0].shippingFee));
        } else {
          setShippingFee(30000);
        }
      } catch (error) {
        console.error("Error fetching shipping options:", error);
        setShippingFee(30000);
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingOptions();
  }, []);

  // Fetch details for all items
  useEffect(() => {
    const fetchAllDetails = async () => {
      if (!orderItems || orderItems.length === 0) {
        setLoadingDetails(false);
        return;
      }

      setLoadingDetails(true);
      const detailsMap = new Map<string, LoadedItemDetails>();

      for (const item of orderItems) {
        try {
          const orderData = item.orderData;
          let product: ProductWithRelations | null = null;
          let variant: any = null;
          const backgrounds: Background[] = [];
          const productCustomDetails = new Map<
            string,
            ProductCustomWithRelations
          >();
          const categoryDetails = new Map<
            string,
            ProductCategoryWithRelations
          >();

          // Fetch product
          if (orderData.productId) {
            product = await getProductById(orderData.productId);
            variant = product?.productVariants?.find(
              (v) => v.id === orderData.variantId
            );
          }

          // Fetch backgrounds
          if (orderData.selectedBackgroundIds?.length > 0) {
            for (const bgId of orderData.selectedBackgroundIds) {
              try {
                const bg = await getBackgroundById(bgId);
                backgrounds.push(bg);
              } catch (e) {
                console.warn(`Background ${bgId} not found`);
              }
            }
          }

          // Fetch custom products
          if (orderData.selectedCategoryProducts) {
            for (const [catId, products] of Object.entries(
              orderData.selectedCategoryProducts
            )) {
              // Fetch category
              try {
                const cat = await productCategoryService.getProductCategoryById(
                  catId
                );
                categoryDetails.set(catId, cat);
              } catch (e) {
                console.warn(`Category ${catId} not found`);
              }

              // Fetch custom products
              for (const { productCustomId } of products) {
                if (!productCustomDetails.has(productCustomId)) {
                  try {
                    const customData = await getProductCustomById(
                      productCustomId
                    );
                    productCustomDetails.set(productCustomId, customData);
                  } catch (e) {
                    console.warn(`Product custom ${productCustomId} not found`);
                  }
                }
              }
            }
          }

          detailsMap.set(item.id, {
            product,
            variant,
            backgrounds,
            productCustomDetails,
            categoryDetails,
          });
        } catch (error) {
          console.error(`Error fetching details for item ${item.id}:`, error);
        }
      }

      setItemsDetails(detailsMap);
      setLoadingDetails(false);
    };

    fetchAllDetails();
  }, [orderItems]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle shipping change
  const handleShippingChange = (shippingId: string) => {
    const selected = availableShippingOptions.find((s) => s.id === shippingId);
    if (selected) {
      setSelectedShipping(selected);
      setShippingFee(Number(selected.shippingFee));
    }
  };

  // Calculate items subtotal
  const calculateItemsSubtotal = (): number => {
    return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Apply promo code
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Vui lòng nhập mã giảm giá");
      return;
    }

    setPromoLoading(true);
    setPromoError("");

    try {
      const promotion = await getPromotionByCode(promoCode.trim());

      if (!promotion.isActive) {
        setPromoError("Mã giảm giá không còn hiệu lực");
        setAppliedPromotion(null);
        return;
      }

      const now = new Date();
      const startDate = new Date(promotion.startDate);
      const endDate = promotion.endDate ? new Date(promotion.endDate) : null;

      if (now < startDate) {
        setPromoError("Mã giảm giá chưa có hiệu lực");
        setAppliedPromotion(null);
        return;
      }

      if (endDate && now > endDate) {
        setPromoError("Mã giảm giá đã hết hạn");
        setAppliedPromotion(null);
        return;
      }

      const subtotal = calculateItemsSubtotal();
      if (subtotal < Number(promotion.minOrderValue)) {
        setPromoError(
          `Đơn hàng tối thiểu ${formatPrice(
            Number(promotion.minOrderValue)
          )} để áp dụng mã này`
        );
        setAppliedPromotion(null);
        return;
      }

      setAppliedPromotion(promotion);
      setPromoError("");
    } catch (error: any) {
      setPromoError(
        error.response?.data?.message || "Mã giảm giá không hợp lệ"
      );
      setAppliedPromotion(null);
    } finally {
      setPromoLoading(false);
    }
  };

  // Remove promo
  const handleRemovePromo = () => {
    setAppliedPromotion(null);
    setPromoCode("");
    setPromoError("");
  };

  // Calculate discount
  const calculateDiscount = (): number => {
    if (!appliedPromotion) return 0;

    const subtotal = calculateItemsSubtotal();

    if (appliedPromotion.type === "PERCENTAGE") {
      const discount = (subtotal * appliedPromotion.value) / 100;
      if (appliedPromotion.maxDiscountAmount) {
        return Math.min(discount, appliedPromotion.maxDiscountAmount);
      }
      return discount;
    } else if (appliedPromotion.type === "FIXED_AMOUNT") {
      return Math.min(appliedPromotion.value, subtotal);
    }

    return 0;
  };

  // Calculate total
  const calculateTotal = (): number => {
    const subtotal = calculateItemsSubtotal();
    const discount = calculateDiscount();
    return Math.max(0, subtotal + shippingFee - discount);
  };

  // Toggle item expand
  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!customerInfo.name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }
    if (!customerInfo.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!selectedShipping) {
      toast.error("Vui lòng chọn phương thức vận chuyển");
      return false;
    }
    return true;
  };

  // Build batch order items
  const buildBatchOrderItems = (): BatchOrderItem[] => {
    return orderItems.map((cartItem) => {
      const details = itemsDetails.get(cartItem.id);
      const orderData = cartItem.orderData;

      // Build selected options với name và description
      const selectedOptions = orderData.selectedOptions?.map((opt) => {
        // Parse option data từ variant nếu có
        let optionName = `Tùy chọn ${opt.id}`;
        let optionDescription = "";

        if (details?.variant?.option?.purchaseOptions) {
          const optionIndex = parseInt(opt.id.split("-")[1]);
          const optionData =
            details.variant.option.purchaseOptions[optionIndex];
          if (optionData) {
            optionName = optionData.name || optionData.title || optionName;
            optionDescription = optionData.description || "";
          }
        }

        return {
          id: opt.id,
          name: optionName,
          description: optionDescription,
          price: Number(opt.price),
        };
      });

      // Build selected category products
      const selectedCategoryProducts = orderData.selectedCategoryProducts
        ? Object.entries(orderData.selectedCategoryProducts).reduce(
            (acc, [categoryId, products]) => {
              const category = details?.categoryDetails.get(categoryId);
              acc[categoryId] = {
                categoryId,
                categoryName: category?.name,
                products: products.map(({ productCustomId, quantity }) => {
                  const customProduct =
                    details?.productCustomDetails.get(productCustomId);
                  const price = Number(customProduct?.price || 0);
                  return {
                    productCustomId,
                    productCustomName: customProduct?.name,
                    productCustomImage: customProduct?.imageUrl,
                    productCustomDescription: customProduct?.description,
                    quantity,
                    price,
                    totalPrice: price * quantity,
                  };
                }),
              };
              return acc;
            },
            {} as Record<string, any>
          )
        : undefined;

      // Build background
      const background =
        details?.backgrounds && details.backgrounds.length > 0
          ? {
              backgroundId: details.backgrounds[0].id,
              backgroundName: details.backgrounds[0].name,
              backgroundDescription: details.backgrounds[0].description,
              backgroundImageUrl: details.backgrounds[0].imageUrl,
              backgroundPrice: 0,
              formConfig: details.backgrounds[0].config
                ? {
                    fields: details.backgrounds[0].config.fields?.map(
                      (field: any) => ({
                        id: field.id,
                        type: field.type,
                        title: field.title,
                        placeholder: field.placeholder,
                        required: field.required,
                      })
                    ),
                  }
                : undefined,
              formData: orderData.backgroundFormData
                ? {
                    values: orderData.backgroundFormData.values?.map(
                      (fv: any) => {
                        const fieldConfig =
                          details.backgrounds[0].config?.fields?.find(
                            (f: any) => f.id === fv.fieldId
                          );
                        return {
                          fieldId: fv.fieldId,
                          fieldTitle: fieldConfig?.title || fv.fieldId,
                          fieldType: fieldConfig?.type || "text",
                          value: fv.value,
                          otherValue: fv.otherValue,
                        };
                      }
                    ),
                  }
                : { values: [] },
            }
          : undefined;

      // Calculate item pricing
      const productPrice = Number(details?.variant?.price || 0);
      const optionsPrice = (orderData.selectedOptions || []).reduce(
        (sum, opt) => sum + Number(opt.price),
        0
      );
      const customProductsPrice = orderData.selectedCategoryProducts
        ? Object.values(orderData.selectedCategoryProducts)
            .flat()
            .reduce((sum, products: any) => {
              return (
                sum +
                products.reduce((pSum: number, p: any) => {
                  const customProduct = details?.productCustomDetails.get(
                    p.productCustomId
                  );
                  return pSum + Number(customProduct?.price || 0) * p.quantity;
                }, 0)
              );
            }, 0)
        : 0;

      return {
        collection: details?.product?.collection
          ? {
              id: details.product.collection.id,
              name: details.product.collection.name,
              imageUrl: details.product.collection.imageUrl,
              routeName: details.product.collection.routeName,
            }
          : undefined,
        product: {
          id: details?.product?.id || orderData.productId,
          name: details?.product?.name,
          hasBg: details?.product?.hasBg,
        },
        variant: {
          id: details?.variant?.id || orderData.variantId,
          name: details?.variant?.name,
          description: details?.variant?.description,
          price: productPrice,
          endow: details?.variant?.endow,
          option: details?.variant?.option,
          config: details?.variant?.config,
        },
        selectedOptions,
        customQuantities: orderData.customQuantities,
        selectedCategoryProducts,
        multiItemCustomizations: orderData.multiItemCustomizations as any,
        background,
        pricing: {
          productPrice,
          optionsPrice,
          customProductsPrice,
          backgroundPrice: 0,
          itemSubtotal: cartItem.subtotal,
        },
        metadata: {
          orderSource: "web",
          userAgent: navigator.userAgent,
        },
      };
    });
  };

  // Submit batch order
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const batchItems = buildBatchOrderItems();

      const batchOrderData: BatchOrderSubmissionData = {
        customerInfo,
        shipping: {
          shippingId: selectedShipping!.id,
          shippingType: selectedShipping!.shippingType,
          area: selectedShipping!.area,
          estimatedDeliveryTime: selectedShipping!.estimatedDeliveryTime,
          shippingFee: Number(selectedShipping!.shippingFee),
          notes: selectedShipping!.notesOrRemarks,
        },
        promotion: appliedPromotion
          ? {
              promotionId: appliedPromotion.id,
              promoCode: appliedPromotion.promoCode,
              title: appliedPromotion.title,
              description: appliedPromotion.description,
              type: appliedPromotion.type,
              value: Number(appliedPromotion.value),
              discountAmount: calculateDiscount(),
            }
          : undefined,
        items: batchItems,
        pricing: {
          itemsSubtotal: calculateItemsSubtotal(),
          shippingFee,
          discountAmount: calculateDiscount(),
          total: calculateTotal(),
        },
        metadata: {
          orderSource: "web",
          userAgent: navigator.userAgent,
        },
      };

      const response = await createBatchOrder(batchOrderData);

      const receivedOrderCode =
        response.data?.orderCode || response.data?.information?.orderCode || "";

      setOrderCode(receivedOrderCode);
      setSubmitSuccess(true);

      // Clear cart after successful order
      orderItems.forEach((item) => removeItem(item.id));

      toast.success("Đặt hàng thành công!");
    } catch (error: any) {
      setSubmitError(
        error.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại."
      );
      toast.error(error.message || "Đặt hàng thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle go back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Show error if no items
  if (!orderItems || orderItems.length === 0) {
    return (
      <>
        <Header />
        <div className={styles.errorState}>
          <div className="site-inner">
            <h2>Không có sản phẩm nào trong giỏ hàng</h2>
            <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
            <button
              onClick={() => navigate("/collections")}
              className={styles.backBtn}
            >
              <FaArrowLeft /> Tiếp tục mua sắm
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show success modal
  if (submitSuccess) {
    return (
      <OrderSuccessModal
        orderCode={orderCode}
        itemCount={orderItems.length}
        isBatchOrder={true}
      />
    );
  }

  return (
    <>
      <Header />
      <div className={styles.orderPage}>
        <div className="site-inner">
          {/* Header */}
          <div className={styles.header}>
            <button onClick={handleGoBack} className={styles.backBtn}>
              <FaArrowLeft />
              Quay lại
            </button>
            <h1 className={styles.pageTitle}>
              <FaShoppingCart className={styles.icon} />
              Thanh toán đơn hàng ({orderItems.length} sản phẩm)
            </h1>
          </div>

          <div className={styles.batchCheckoutContent}>
            {/* Left Column - Customer Info & Shipping */}
            <div className={styles.leftColumn}>
              {/* Customer Info Section */}
              <div className={styles.detailsCard}>
                <h3 className={styles.detailsTitle}>
                  <FaUser className={styles.sectionIcon} />
                  Thông tin khách hàng
                </h3>

                <div className={styles.formGroup}>
                  <label>
                    Họ và tên <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Số điện thoại <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <FaPhone className={styles.inputIcon} />
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <div className={styles.inputWrapper}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="Nhập email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Địa chỉ</label>
                  <div className={styles.inputWrapper}>
                    <FaMapMarkerAlt className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Nhập địa chỉ nhận hàng"
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Ghi chú</label>
                  <div className={styles.inputWrapper}>
                    <FaStickyNote className={styles.inputIcon} />
                    <textarea
                      placeholder="Ghi chú cho đơn hàng (nếu có)"
                      value={customerInfo.notes}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Section */}
              <div className={styles.detailsCard}>
                <h3 className={styles.detailsTitle}>
                  <FaTruck className={styles.sectionIcon} />
                  Phương thức vận chuyển
                </h3>

                {loadingShipping ? (
                  <div className={styles.loadingBox}>Đang tải...</div>
                ) : (
                  <div className={styles.shippingOptions}>
                    {availableShippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`${styles.shippingOption} ${
                          selectedShipping?.id === option.id
                            ? styles.selected
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping?.id === option.id}
                          onChange={() => handleShippingChange(option.id)}
                        />
                        <div className={styles.shippingInfo}>
                          <span className={styles.shippingType}>
                            {option.shippingType}
                          </span>
                          <span className={styles.shippingArea}>
                            {option.area}
                          </span>
                          <span className={styles.shippingTime}>
                            {option.estimatedDeliveryTime}
                          </span>
                        </div>
                        <span className={styles.shippingPrice}>
                          {formatPrice(Number(option.shippingFee))}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Promo Code Section */}
              <div className={styles.detailsCard}>
                <h3 className={styles.detailsTitle}>
                  <FaTag className={styles.sectionIcon} />
                  Mã giảm giá
                </h3>

                {appliedPromotion ? (
                  <div className={styles.appliedPromo}>
                    <div className={styles.promoInfo}>
                      <span className={styles.promoCode}>
                        {appliedPromotion.promoCode}
                      </span>
                      <span className={styles.promoDiscount}>
                        -{formatPrice(calculateDiscount())}
                      </span>
                    </div>
                    <button
                      className={styles.removePromoBtn}
                      onClick={handleRemovePromo}
                    >
                      Xóa
                    </button>
                  </div>
                ) : (
                  <div className={styles.promoInputGroup}>
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      className={styles.applyPromoBtn}
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                    >
                      {promoLoading ? "..." : "Áp dụng"}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className={styles.promoError}>{promoError}</p>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className={styles.rightColumn}>
              <div className={styles.detailsCard}>
                <h3 className={styles.detailsTitle}>Danh sách sản phẩm</h3>

                {loadingDetails ? (
                  <div className={styles.loadingBox}>Đang tải thông tin...</div>
                ) : (
                  <div className={styles.orderItemsList}>
                    {orderItems.map((item, index) => {
                      const details = itemsDetails.get(item.id);
                      const isExpanded = expandedItems.has(item.id);

                      return (
                        <div key={item.id} className={styles.orderItemCard}>
                          <div className={styles.orderItemHeader}>
                            <div className={styles.orderItemInfo}>
                              <span className={styles.itemIndex}>
                                #{index + 1}
                              </span>
                              <span className={styles.itemName}>
                                {details?.product?.name || "Sản phẩm"}
                              </span>
                            </div>
                            <div className={styles.orderItemActions}>
                              <span className={styles.itemPrice}>
                                {formatPrice(item.subtotal)}
                              </span>
                              <button
                                className={styles.toggleBtn}
                                onClick={() => toggleExpand(item.id)}
                              >
                                {isExpanded ? "Thu gọn" : "Chi tiết"}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className={styles.orderItemDetails}>
                              {details?.variant && (
                                <div className={styles.detailRow}>
                                  <span>Biến thể:</span>
                                  <span>{details.variant.name}</span>
                                </div>
                              )}
                              {item.orderData.selectedOptions?.length > 0 && (
                                <div className={styles.detailRow}>
                                  <span>Tùy chọn:</span>
                                  <span>
                                    {item.orderData.selectedOptions.length} tùy
                                    chọn
                                  </span>
                                </div>
                              )}
                              {details?.backgrounds?.length > 0 && (
                                <div className={styles.detailRow}>
                                  <span>Background:</span>
                                  <span>{details.backgrounds[0].name}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Price Summary */}
                <div className={styles.priceSummary}>
                  <div className={styles.priceRow}>
                    <span>Tạm tính ({orderItems.length} sản phẩm):</span>
                    <span>{formatPrice(calculateItemsSubtotal())}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>
                  {appliedPromotion && (
                    <div className={styles.priceRow}>
                      <span>Giảm giá:</span>
                      <span className={styles.discount}>
                        -{formatPrice(calculateDiscount())}
                      </span>
                    </div>
                  )}
                  <div className={styles.totalRow}>
                    <span>Tổng cộng:</span>
                    <span className={styles.totalAmount}>
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className={styles.errorMessage}>{submitError}</div>
                )}

                {/* Submit Button */}
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={isSubmitting || loadingDetails}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

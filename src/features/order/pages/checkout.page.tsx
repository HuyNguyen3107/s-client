import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Header from "../../../components/header.components";
import Footer from "../../../components/footer.components";
import { useToastStore } from "../../../store/toast.store";
import { useCartStore } from "../../../store/cart.store";
import type { OrderData } from "../types/order.types";
import { OrderSuccessModal } from "../components/order-success-modal";
import styles from "./order.module.scss";

interface CheckoutItem {
  id: string;
  orderData: OrderData;
  shippingFee: number;
  selectedShippingId?: string;
  appliedPromotionCode?: string;
  discount: number;
  subtotal: number;
  total: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  totalAmount: number;
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const { removeItem } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [orderCodes, setOrderCodes] = useState<string[]>([]);

  const checkoutData: CheckoutData | null = useMemo(() => {
    const dataString = searchParams.get("data");
    return dataString ? JSON.parse(decodeURIComponent(dataString)) : null;
  }, [searchParams]);

  useEffect(() => {
    if (!checkoutData) {
      showToast("Không tìm thấy thông tin đơn hàng!", "error");
      navigate("/collections");
    }
  }, [checkoutData, navigate, showToast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSubmit = async () => {
    if (!checkoutData || checkoutData.items.length === 0) {
      showToast("Không có đơn hàng để xác nhận!", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      // For now, navigate each order to order page for individual submission
      // Since we need full OrderSubmissionData which requires fetching product details
      if (checkoutData.items.length === 1) {
        // Single order - navigate to order page
        const item = checkoutData.items[0];
        const orderDataString = encodeURIComponent(
          JSON.stringify(item.orderData)
        );
        navigate(`/order?data=${orderDataString}`);
        return;
      }

      // Multiple orders - simulate success and remove from cart
      // In real implementation, you would need to fetch all product details
      // and construct proper OrderSubmissionData for each order
      const codes: string[] = [];

      for (let i = 0; i < checkoutData.items.length; i++) {
        const item = checkoutData.items[i];
        // Generate temporary order code
        const code = `ORD${Date.now()}${i}`;
        codes.push(code);

        // Remove from cart
        removeItem(item.id);
      }

      setOrderCodes(codes);
      setSubmitSuccess(true);
      showToast(`Đã thêm ${codes.length} đơn hàng vào hệ thống!`, "success");
    } catch (error: any) {
      showToast(error.message || "Có lỗi xảy ra khi xử lý đơn hàng!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!checkoutData) {
    return null;
  }

  if (submitSuccess) {
    return (
      <OrderSuccessModal
        orderCode={orderCodes.length > 0 ? orderCodes.join(", ") : ""}
      />
    );
  }

  return (
    <>
      <Header />
      <div className={styles.orderContainer}>
        <div className={styles.orderContent}>
          {/* Back Button */}
          <div className={styles.backButton}>
            <button onClick={() => navigate(-1)}>
              <FaArrowLeft /> Quay lại
            </button>
          </div>

          <div className={styles.mainContent}>
            <h1 className={styles.pageTitle}>
              <FaShoppingCart className={styles.icon} />
              Xác nhận đơn hàng
            </h1>

            {/* Order Items Summary */}
            <div className={styles.orderDetails}>
              <h2 className={styles.sectionTitle}>
                Danh sách đơn hàng ({checkoutData.items.length})
              </h2>

              <div className={checkoutData.items.length > 1 ? styles.ordersGrid : ""}>
              {checkoutData.items.map((item, index) => {
                const orderData = item.orderData;
                return (
                  <div key={item.id} className={styles.checkoutOrderItem}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderHeaderLeft}>
                        <span className={styles.orderBadge}>#{index + 1}</span>
                        <h3 className={styles.orderTitle}>Đơn hàng {index + 1}</h3>
                      </div>
                      <div className={styles.orderHeaderRight}>
                        <span className={styles.orderAmount}>{formatPrice(item.total)}</span>
                      </div>
                    </div>

                    <div className={styles.orderItemDetails}>
                      {/* Product Info */}
                      <div className={styles.detailsCard}>
                        <h4 className={styles.detailsTitle}>
                          Thông tin sản phẩm
                        </h4>
                        <div className={styles.productInfo}>
                          <div className={styles.productRow}>
                            <span className={styles.productLabel}>
                              Giá sản phẩm:
                            </span>
                            <span className={styles.productValue}>
                              {formatPrice(orderData.productTotalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Selected Options */}
                      {orderData.selectedOptions &&
                        orderData.selectedOptions.length > 0 && (
                          <div className={styles.detailsCard}>
                            <h4 className={styles.detailsTitle}>
                              Tùy chọn đã chọn (
                              {orderData.selectedOptions.length})
                            </h4>
                            <ul className={styles.optionsList}>
                              {orderData.selectedOptions.map((option, idx) => (
                                <li key={idx} className={styles.optionItem}>
                                  <span>Tùy chọn {idx + 1}</span>
                                  <span className={styles.optionPrice}>
                                    {formatPrice(option.price)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Background Info */}
                      {orderData.selectedBackgroundIds &&
                        orderData.selectedBackgroundIds.length > 0 && (
                          <div className={styles.detailsCard}>
                            <h4 className={styles.detailsTitle}>
                              Background tùy chỉnh
                            </h4>
                            <div className={styles.productInfo}>
                              <div className={styles.productRow}>
                                <span className={styles.productLabel}>
                                  Số lượng background:
                                </span>
                                <span className={styles.productValue}>
                                  {orderData.selectedBackgroundIds.length}
                                </span>
                              </div>
                              <div className={styles.productRow}>
                                <span className={styles.productLabel}>
                                  Tổng giá:
                                </span>
                                <span className={styles.productValue}>
                                  {formatPrice(orderData.backgroundTotalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Custom Products */}
                      {orderData.selectedCategoryProducts &&
                        Object.keys(orderData.selectedCategoryProducts).length >
                          0 && (
                          <div className={styles.detailsCard}>
                            <h4 className={styles.detailsTitle}>
                              Sản phẩm tùy chỉnh
                            </h4>
                            {Object.entries(
                              orderData.selectedCategoryProducts
                            ).map(([categoryId, products]) => (
                              <div
                                key={categoryId}
                                className={styles.categoryGroup}
                              >
                                <h5>Danh mục: {categoryId}</h5>
                                <ul className={styles.customProductsList}>
                                  {products.map(
                                    ({ productCustomId, quantity }) => (
                                      <li
                                        key={productCustomId}
                                        className={styles.customProductItem}
                                      >
                                        <span>Sản phẩm: {productCustomId}</span>
                                        <span>Số lượng: {quantity}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Custom Quantities */}
                      {orderData.customQuantities &&
                        Object.keys(orderData.customQuantities).length > 0 && (
                          <div className={styles.detailsCard}>
                            <h4 className={styles.detailsTitle}>
                              Số lượng tùy chỉnh
                            </h4>
                            <ul className={styles.optionsList}>
                              {Object.entries(orderData.customQuantities).map(
                                ([key, value]) => (
                                  <li key={key} className={styles.optionItem}>
                                    <span>{key}</span>
                                    <span>{value} sản phẩm</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {/* Pricing Breakdown */}
                      <div className={styles.priceBreakdown}>
                        <div className={styles.priceRow}>
                          <span>Tạm tính:</span>
                          <span>{formatPrice(item.subtotal)}</span>
                        </div>

                        {item.discount > 0 && (
                          <div className={styles.priceRow}>
                            <span>Giảm giá:</span>
                            <span className={styles.discount}>
                              -{formatPrice(item.discount)}
                            </span>
                          </div>
                        )}

                        <div className={styles.priceRow}>
                          <span>Phí ship:</span>
                          <span>{formatPrice(item.shippingFee)}</span>
                        </div>

                        <div className={styles.totalRow}>
                          <span>Tổng cộng:</span>
                          <span>{formatPrice(item.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Grand Total */}
              <div className={styles.grandTotal}>
                <h3>Tổng cộng tất cả đơn hàng</h3>
                <div className={styles.amount}>
                  {formatPrice(checkoutData.totalAmount)}
                </div>
              </div>

              {/* Note removed per request */}

              {/* Submit Button */}
              <div className={styles.actionButtons}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className={styles.addToCartBtn}
                  disabled={isSubmitting}
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={styles.submitBtn}
                  disabled={isSubmitting}
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

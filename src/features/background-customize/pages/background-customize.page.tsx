import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPalette, FaShoppingCart } from "react-icons/fa";
import BackgroundSelector from "../components/background-selector.component";
import { useBackgrounds } from "../hooks/use-backgrounds.hook";
import { BackgroundDynamicForm } from "../../backgrounds/components/background-dynamic-form.component";
import type { BackgroundConfig } from "../../backgrounds/types/background-config.types";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import styles from "./background-customize.module.scss";

interface CustomizationData {
  productId: string;
  variantId: string;
  selectedOptions: Array<{ id: string; price: number }>;
  customQuantities: Record<string, number>;
  selectedCategoryProducts?: Record<
    string,
    Array<{ productCustomId: string; quantity: number }>
  >;
  multiItemCustomizations?: Record<
    number,
    Record<string, Array<{ productCustomId: string; quantity: number }>>
  >;
  totalPrice: number;
}

export default function BackgroundCustomizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get customization data from URL params
  const customizationDataString = searchParams.get("data");
  const customizationData: CustomizationData | null = customizationDataString
    ? JSON.parse(decodeURIComponent(customizationDataString))
    : null;

  // State management
  const [selectedBackgroundIds, setSelectedBackgroundIds] = useState<string[]>(
    []
  );
  const [backgroundFormData, setBackgroundFormData] = useState<
    Record<string, any>
  >({});
  const [formValid, setFormValid] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [forceShowErrors, setForceShowErrors] = useState(false);

  // Fetch backgrounds
  const {
    backgrounds,
    loading: backgroundsLoading,
    error: backgroundsError,
  } = useBackgrounds({
    limit: 50,
  });

  // Get selected background and its config
  const selectedBackground =
    selectedBackgroundIds.length > 0
      ? backgrounds.find((bg) => bg.id === selectedBackgroundIds[0])
      : null;

  const backgroundConfig: BackgroundConfig | null = selectedBackground?.config
    ? (selectedBackground.config as BackgroundConfig)
    : null;

  // Handle background selection (single selection)
  const handleBackgroundSelect = (backgroundId: string) => {
    setSelectedBackgroundIds([backgroundId]); // Replace with single selection
  };

  const handleBackgroundDeselect = (backgroundId: string) => {
    setSelectedBackgroundIds((prev) =>
      prev.filter((id) => id !== backgroundId)
    );
  };

  // Calculate total price including background costs
  const calculateTotalPrice = () => {
    if (!customizationData) return 0;

    let totalBackgroundPrice = 0;

    selectedBackgroundIds.forEach((backgroundId) => {
      const background = backgrounds.find((bg) => bg.id === backgroundId);
      if (background?.price) {
        totalBackgroundPrice += background.price;
      }
    });

    return customizationData.totalPrice + totalBackgroundPrice;
  };

  // Handle back navigation
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle proceed to order
  const handleProceedToOrder = () => {
    if (selectedBackgroundIds.length === 0) {
      alert("Vui lòng chọn background trước khi tiếp tục");
      return;
    }

    if (backgroundConfig && !formValid) {
      setForceShowErrors(true);
      setShowValidationModal(true);
      return;
    }

    const backgroundTotalPrice = selectedBackgroundIds.reduce((total, id) => {
      const bg = backgrounds.find((b) => b.id === id);
      return total + (bg?.price || 0);
    }, 0);

    // Prepare order data
    const orderData = {
      ...customizationData,
      productTotalPrice: customizationData!.totalPrice,
      selectedBackgroundIds,
      backgroundFormData,
      backgroundTotalPrice,
      totalPrice: calculateTotalPrice(),
    };

    // Navigate to order page with data
    const encodedData = encodeURIComponent(JSON.stringify(orderData));
    navigate(`${ROUTE_PATH.ORDER}?data=${encodedData}`);
  };

  // Handle background form submit
  const handleBackgroundFormSubmit = (data: Record<string, any>) => {
    setBackgroundFormData(data);
  };

  if (!customizationData) {
    return (
      <div className={styles.errorState}>
        <h2>Không tìm thấy dữ liệu tùy chỉnh</h2>
        <p>Vui lòng quay lại trang tùy chỉnh sản phẩm</p>
        <button onClick={handleGoBack} className={styles.backBtn}>
          <FaArrowLeft /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className={styles.backgroundCustomizePage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={handleGoBack} className={styles.backBtn}>
            <FaArrowLeft className={styles.icon} />
            Quay lại
          </button>
          <h1 className={styles.pageTitle}>
            <FaPalette className={styles.icon} />
            Tùy chỉnh Background
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Background Selection */}
        <div className={styles.selectionSection}>
          <div className={styles.sectionHeader}>
            <h2>Chọn Background</h2>
            <p>Chọn background phù hợp cho sản phẩm của bạn</p>
          </div>

          {backgroundsError && (
            <div className={styles.errorMessage}>
              Có lỗi khi tải background: {backgroundsError}
            </div>
          )}

          <BackgroundSelector
            backgrounds={backgrounds}
            selectedBackgroundIds={selectedBackgroundIds}
            onBackgroundSelect={handleBackgroundSelect}
            onBackgroundDeselect={handleBackgroundDeselect}
            loading={backgroundsLoading}
            maxSelections={1} // Only allow single background
          />

          {/* Dynamic Form for selected background */}
          {selectedBackground &&
            backgroundConfig &&
            backgroundConfig.fields.length > 0 && (
              <div className={styles.dynamicFormSection}>
                <div className={styles.sectionHeader}>
                  <h2>Thông tin tùy chỉnh</h2>
                  <p>
                    Điền thông tin cho background "{selectedBackground.name}"
                  </p>
                </div>

                <BackgroundDynamicForm
                  backgroundId={selectedBackground.id}
                  config={backgroundConfig}
                  onSubmit={handleBackgroundFormSubmit}
                  autoSubmit={true}
                  onValidationChange={({ valid, errors }) => {
                    setFormValid(valid);
                    setFormErrors(errors);
                  }}
                  forceShowErrors={forceShowErrors}
                />
              </div>
            )}
        </div>

        {/* Price Summary */}
        <div className={styles.priceSummary}>
          <div className={styles.summaryHeader}>
            <h3>Tổng kết đơn hàng</h3>
          </div>

          <div className={styles.priceBreakdown}>
            <div className={styles.priceRow}>
              <span>Tùy chỉnh sản phẩm:</span>
              <span>{formatPrice(customizationData.totalPrice)}</span>
            </div>

            {selectedBackgroundIds.length > 0 && (
              <div className={styles.priceRow}>
                <span>Background:</span>
                <span>
                  {formatPrice(
                    selectedBackgroundIds.reduce((total, id) => {
                      const bg = backgrounds.find((b) => b.id === id);
                      return total + (bg?.price || 0);
                    }, 0)
                  )}
                </span>
              </div>
            )}

            <div className={`${styles.priceRow} ${styles.totalRow}`}>
              <span>Tổng cộng:</span>
              <span>{formatPrice(calculateTotalPrice())}</span>
            </div>
          </div>

          {/* Order Button */}
          <button
            className={styles.orderBtn}
            onClick={handleProceedToOrder}
            disabled={selectedBackgroundIds.length === 0}
          >
            <FaShoppingCart className={styles.icon} />
            Tiến hành đặt hàng
          </button>
        </div>
      </div>

      {showValidationModal && (
        <div className={styles.simpleModal}>
          <div
            className={styles.modalOverlay}
            onClick={() => setShowValidationModal(false)}
          />
          <div className={styles.modalContent} role="dialog" aria-modal="true">
            <h3 className={styles.modalTitle}>Vui lòng nhập các trường bắt buộc</h3>
            <p className={styles.modalText}>Các trường thiếu đã được đánh dấu trong form.</p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalBtn}
                onClick={() => setShowValidationModal(false)}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

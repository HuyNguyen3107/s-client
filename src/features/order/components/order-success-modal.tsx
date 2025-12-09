import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaCopy,
  FaHome,
  FaSearch,
  FaCheck,
  FaShoppingBag,
} from "react-icons/fa";
import styles from "./order-success-modal.module.scss";

interface OrderSuccessModalProps {
  orderCode: string;
  itemCount?: number; // Số lượng sản phẩm trong batch order
  isBatchOrder?: boolean;
}

export const OrderSuccessModal = ({
  orderCode,
  itemCount,
  isBatchOrder = false,
}: OrderSuccessModalProps) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Store original body style
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Disable body scroll
    document.body.style.overflow = "hidden";

    // Cleanup: restore original style when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const displayOrderCode = orderCode || "Đang tải...";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(displayOrderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleTrackOrder = () => {
    navigate(`/order-tracking?code=${displayOrderCode}`);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <FaCheckCircle className={styles.successIcon} />
        </div>

        <h2 className={styles.title}>Đặt hàng thành công!</h2>

        {isBatchOrder && itemCount && itemCount > 1 && (
          <div className={styles.batchInfo}>
            <FaShoppingBag className={styles.batchIcon} />
            <span>
              Đơn hàng của bạn gồm <strong>{itemCount} sản phẩm</strong>
            </span>
          </div>
        )}

        <p className={styles.message}>
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian
          sớm nhất.
        </p>

        <div className={styles.orderCodeSection}>
          <div className={styles.orderCodeLabel}>
            <strong>Mã đơn hàng của bạn:</strong>
          </div>

          <div className={styles.orderCodeBox}>
            <span className={styles.orderCode}>{displayOrderCode}</span>
            <button
              className={styles.copyBtn}
              onClick={handleCopyCode}
              title="Sao chép mã đơn hàng"
              disabled={!orderCode}
            >
              {copied ? (
                <>
                  <FaCheck /> Đã sao chép
                </>
              ) : (
                <>
                  <FaCopy /> Sao chép
                </>
              )}
            </button>
          </div>

          <div className={styles.notice}>
            <p>
              <strong>⚠️ Lưu ý quan trọng:</strong>
            </p>
            <p>
              Vui lòng <strong>lưu lại mã đơn hàng</strong> này để tra cứu và
              theo dõi tình trạng đơn hàng của bạn.
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={handleTrackOrder}>
            <FaSearch /> Tra cứu đơn hàng
          </button>
          <button className={styles.secondaryBtn} onClick={handleGoHome}>
            <FaHome /> Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

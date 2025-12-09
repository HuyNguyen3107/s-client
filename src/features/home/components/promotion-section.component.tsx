import styles from "./promotion-section.module.scss";
import productImg from "../../../assets/images/product-1.jpg";
import { useActivePromotions } from "../../../hooks/use-promotions.hooks";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import { Link } from "react-router-dom";
import PromotionCountdown from "./promotion-countdown.component";

export default function PromotionSection() {
  const { data: promotions, isLoading, error } = useActivePromotions();

  const formatDiscount = (promotion: any) => {
    if (promotion.type === "PERCENTAGE") {
      return `${promotion.value}%`;
    } else {
      return `${promotion.value.toLocaleString("vi-VN")}đ`;
    }
  };

  const copyToClipboard = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    // You can add toast notification here if needed
  };

  return (
    <section className={styles["promo-root"]}>
      <div className="site-inner">
        <div className={styles["promo-image-wrap"]}>
          <img
            src={productImg}
            alt="Product"
            className={styles["promo-image"]}
          />
        </div>

        <div className={styles["promo-cta-wrap"]}>
          {isLoading ? (
            <div className={styles["loading"]} role="status" aria-live="polite">Đang tải mã giảm giá...</div>
          ) : error ? (
            <div className={styles["error"]} role="alert" aria-live="assertive">Không thể tải mã giảm giá</div>
          ) : promotions && promotions.length > 0 ? (
            <div className={styles["promotions-container"]}>
              <h3 className={styles["promotions-title"]}>
                MÃ GIẢM GIÁ HIỆN CÓ
              </h3>
              <div className={styles["promotions-grid"]}>
                {promotions.slice(0, 3).map((promotion) => (
                  <div
                    key={promotion.id}
                    className={styles["promotion-card"]}
                    onClick={() => copyToClipboard(promotion.promoCode)}
                  >
                    <div className={styles["promo-code"]}>
                      {promotion.promoCode}
                    </div>
                    <div className={styles["promo-discount"]}>
                      Giảm {formatDiscount(promotion)}
                    </div>

                    {/* Countdown */}
                    <PromotionCountdown
                      startDate={promotion.startDate}
                      endDate={promotion.endDate}
                    />

                    <div className={styles["promo-min-order"]}>
                      Đơn tối thiểu:{" "}
                      {promotion.minOrderValue.toLocaleString("vi-VN")}đ
                    </div>
                    <div className={styles["copy-hint"]}>Click để sao chép</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles["no-promotions"]}>
              Hiện tại chưa có mã giảm giá
            </div>
          )}

          <Link className={styles["buy-btn"]} to={ROUTE_PATH.COLLECTIONS}>
            MUA NGAY
          </Link>
        </div>
      </div>
    </section>
  );
}

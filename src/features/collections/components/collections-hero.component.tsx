import { useState } from "react";
import styles from "./collections-hero.module.scss";
import { useActivePromotions } from "../../../hooks/use-promotions.hooks";
import PromotionCountdown from "./promotion-countdown.component";
import heroImg from "../../../assets/images/product-1.jpg";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

export default function CollectionsHero() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { data: promotions, isLoading, error } = useActivePromotions();

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Không thể sao chép mã:", err);
    }
  };

  return (
    <section className={styles["collections-hero"]}>
      <div
        className={styles["hero-image"]}
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-label="Ảnh nền bộ sưu tập"
      />

      <div className={styles["hero-center"]}>
        {isLoading ? (
          <div className={`${styles.loading} animate-fade-in`} role="status" aria-live="polite">
            Đang tải mã giảm giá...
          </div>
        ) : error || !promotions || promotions.length === 0 ? (
          <div className={`${styles.error} animate-fade-in`} role="alert" aria-live="assertive">
            Hiện tại chưa có mã giảm giá
          </div>
        ) : (
          <div className={styles["promotions-container"]}>
            {promotions.slice(0, 2).map((promotion: any, index: number) => (
              <div
                key={promotion.id}
                className={`${
                  styles["promotion-card"]
                } animate-fade-in-up delay-${(index + 1) * 100}`}
                style={{ opacity: 0 }}
              >
                <div className={styles["promotion-info"]}>
                  <div className={styles["promotion-code"]}>
                    {promotion.promoCode}
                  </div>
                  <div className={styles["promotion-description"]}>
                    {promotion.description}
                  </div>
                  <div className={styles["promotion-discount"]}>
                    {promotion.type === "PERCENTAGE"
                      ? `Giảm ${promotion.value}%`
                      : `Giảm ${promotion.value.toLocaleString()}đ`}
                  </div>
                  {promotion.endDate && (
                    <div className={styles["promotion-countdown"]}>
                      <PromotionCountdown endDate={promotion.endDate} />
                    </div>
                  )}
                </div>
                <button
                  className={styles["copy-btn"]}
                  onClick={() => handleCopyCode(promotion.promoCode)}
                  aria-label={`Sao chép mã ${promotion.promoCode}`}
                >
                  {copiedCode === promotion.promoCode
                    ? "Đã sao chép!"
                    : "Sao chép"}
                </button>
              </div>
            ))}
          </div>
        )}

        <a
          href="#collections-list"
          className={`${styles.cta} animate-fade-in-up delay-300`}
          style={{ opacity: 0 }}
          aria-label="Xem danh sách quà tặng"
        >
          MUA NGAY
        </a>
      </div>
    </section>
  );
}

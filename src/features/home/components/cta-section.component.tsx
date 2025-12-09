import styles from "./cta-section.module.scss";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

export default function CtaSection() {
  return (
    <section className={styles["cta-root"]}>
      <div className={styles["cta-inner"]}>
        <h2 className={styles["cta-title"]}>
          BẠN ĐÃ SẴN SÀNG TẠO MÓN QUÀ ĐẶC BIỆT?
        </h2>
        <p className={styles["cta-desc"]}>
          Hãy bắt đầu tạo ra những món quà độc đáo, ý nghĩa dành tặng người thân
          yêu nào
        </p>
        <Link to={ROUTE_PATH.COLLECTIONS} className={styles["cta-btn"]}>
          BẮT ĐẦU NGAY
        </Link>
      </div>
    </section>
  );
}

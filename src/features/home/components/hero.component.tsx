import styles from "./hero.module.scss";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

export default function Hero() {
  return (
    <section className={styles["hero-root"]} aria-labelledby="hero-title">
      <div className="site-inner">
        <div className={styles["hero-inner"]}>
          <p
            className={`${styles["hero-tagline"]} animate-fade-in-down delay-200`}
            aria-label="Slogan của Soligant"
          >
            Tinh tế cho mọi dịp - Hiện diện trong từng món quà
          </p>
          <h1
            id="hero-title"
            className={`${styles["hero-title"]} animate-fade-in delay-300`}
          >
            SOLIGANT.GIFTS
          </h1>
          <div className={styles["hero-cta-group"]}>
            <Link
              to={ROUTE_PATH.COLLECTIONS}
              className={`${styles["hero-cta"]} animate-fade-in-up delay-400`}
              aria-label="Mua ngay từ bộ sưu tập"
            >
              MUA NGAY
            </Link>
            <Link
              to={ROUTE_PATH.ABOUT}
              className={`${styles["hero-cta"]} ${styles["hero-cta--secondary"]} animate-fade-in-up delay-500`}
              aria-label="Tìm hiểu thêm về Soligant"
            >
              TÌM HIỂU THÊM
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

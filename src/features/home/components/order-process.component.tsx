import styles from "./order-process.module.scss";
import { useEffect, useState } from "react";
import productImg1 from "../../../assets/images/product-1.jpg";
import productImg2 from "../../../assets/images/product-2.jpg";
import productImg3 from "../../../assets/images/product-3.jpg";

const steps = [
  {
    num: 1,
    title: "CHỌN BỘ SƯU TẬP",
    desc: "Lựa chọn món quà phù hợp với nhu cầu của bạn",
  },
  {
    num: 2,
    title: "CUSTOM SẢN PHẨM",
    desc: "Cá nhân hóa sản phẩm theo ý thích của bạn",
  },
  {
    num: 3,
    title: "TƯ VẤN & ĐẶT HÀNG",
    desc: "Nhận tư vấn chi tiết và đặt hàng",
  },
  {
    num: 4,
    title: "SẢN XUẤT & NHẬN HÀNG",
    desc: "Hoàn tất đơn hàng và nhận sản phẩm",
  },
];

export default function OrderProcess() {
  const images = [productImg1, productImg2, productImg3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className={styles["process-root"]}>
      <div className="site-inner">
        <h2 className={styles["process-title"]}>QUY TRÌNH ĐẶT QUÀ</h2>
        <div className={styles["process-grid"]}>
          <div className={styles["process-steps"]}>
            {steps.map((step, i) => {
              const isOdd = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={
                    styles["step-card"] +
                    " " +
                    (isOdd
                      ? styles["step-card--primary"]
                      : styles["step-card--outline"])
                  }
                >
                  <div className={styles["step-title-row"]}>
                    <span className={styles["step-num"]}>{step.num}.</span>
                    <span className={styles["step-title"]}>{step.title}</span>
                  </div>
                  <div className={styles["step-desc"]}>{step.desc}</div>
                </div>
              );
            })}
          </div>
          <div className={styles["process-image-wrap"]}>
            <img
              src={images[current]}
              alt={`Quy trình đặt quà ${current + 1}`}
              className={styles["process-image"]}
            />
            <div className={styles["process-dots"]}>
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={
                    styles["dot"] +
                    (current === idx ? " " + styles["active-dot"] : "")
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

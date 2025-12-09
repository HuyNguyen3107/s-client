import React from "react";
import styles from "./imprint-gift-section.module.scss";
import productImg1 from "../../../assets/images/product-1.jpg";
import productImg2 from "../../../assets/images/product-2.jpg";
import productImg3 from "../../../assets/images/product-3.jpg";

const ImprintGiftSection = () => {
  return (
    <section className={styles.imprintGiftSectionWrap}>
      <div className={styles.leftCol}>
        <div className={styles.gridCustom}>
          {/* Góc trên bên trái: chiếm 4 hàng, 1 cột */}
          <div className={styles.box + " " + styles.topLeft}>
            <img
              src={productImg1}
              alt="Gift 1"
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </div>
          {/* Góc dưới bên trái: chiếm 3 hàng, 1 cột */}
          <div className={styles.box + " " + styles.bottomLeft}>
            <img
              src={productImg2}
              alt="Gift 2"
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </div>
          {/* Góc trên bên phải: chiếm 2 hàng, 1 cột */}
          <div className={styles.box + " " + styles.topRight}>
            <img
              src={productImg3}
              alt="Gift 3"
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </div>
          {/* Góc dưới bên phải: chiếm 5 hàng, 1 cột */}
          <div className={styles.box + " " + styles.bottomRight}>
            <img
              src={productImg1}
              alt="Gift 4"
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
      <div className={styles.rightCol}>
        <h2 className={styles.heading}>QUÀ TẶNG MANG DẤU ẤN</h2>
        <p className={styles.quote}>
          “Những điều tưởng chừng nhỏ bé lại làm nên hạnh phúc lớn – và{" "}
          <b>Soligant</b> tin rằng, hạnh phúc thật sự nằm trong những khoảnh
          khắc giản dị như thế.
          <br />
          <br />
          Đó có thể là ngày sinh nhật, ngày tốt nghiệp, hay chỉ đơn giản là một
          lời nhắn <b className={styles.highlight}>“Dear You”</b> gửi đến ai
          đó.”
        </p>
        <div className={styles.signatureBlock}>
          <div className={styles.signature}>
            <b>Soligant.Gifts</b>
          </div>
          <div className={styles.slogan}>Luôn hiện diện dù không hiện hữu</div>
        </div>
      </div>
    </section>
  );
};

export default ImprintGiftSection;

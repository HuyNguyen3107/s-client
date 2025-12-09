import styles from "./about-meaning-section.module.scss";
import aboutMeaningImg from "@/assets/images/product-2.jpg";

const AboutMeaningSection = () => (
  <section className={styles.aboutMeaningSection}>
    <h1 className={styles.logoTitle}>SOLIGANT.GIFTS</h1>
    <div className={styles.contentWrap}>
      <div className={styles.textWrap}>
        <h2 className={styles.heading}>Ý NGHĨA TÊN GỌI</h2>
        <p>
          <b>“Soligant”</b> theo tiếng Thụy Điển có nghĩa là{" "}
          <b>”chất kết dính”</b>.<br />
          Hay còn được kết hợp từ <b>“Solidarity”</b> <i>(sự gắn kết)</i> và{" "}
          <b>“Elegant”</b> <i>(sự tinh tế, thanh lịch)</i>
        </p>
        <p>
          <b>Soligant</b> không chỉ là biểu tượng của sự tinh tế mà còn gửi gắm
          tình yêu, sự quan tâm ấm áp. Mỗi món quà đều mang ý nghĩa sâu sắc, kết
          nối những tâm hồn qua từng khoảnh khắc quý giá.
        </p>
        <p>
          <b>Soligant</b> chính là <b>chất keo gắn kết tình cảm</b>, thay bạn
          hiện diện bên cạnh người thương, dù ở xa, mang đến cảm giác được chăm
          sóc và yêu thương.
        </p>
      </div>
      <div className={styles.imageWrap}>
        <img
          src={aboutMeaningImg}
          alt="Ý nghĩa tên gọi Soligant"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
);

export default AboutMeaningSection;

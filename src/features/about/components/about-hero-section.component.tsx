import styles from "./about-hero-section.module.scss";
import aboutHeroImg from "@/assets/images/product-2.jpg";
import { MdFormatQuote } from "react-icons/md";

const AboutHeroSection = () => {
  return (
    <section className={styles.aboutHeroSection} aria-labelledby="about-hero-title">
      <div className={`${styles.imageWrap} animate-fade-in`}>
        <img
          src={aboutHeroImg}
          alt="Soligant – câu chuyện phía sau món quà"
          className={styles.heroImg}
        />
      </div>
      <div
        className={`${styles.quoteWrap} animate-fade-in-up delay-200`}
        style={{ opacity: 0 }}
      >
        <div className={styles.quoteBox}>
          <p className={styles.quote}>
            "Có món quà nào vừa nhỏ bé, vừa độc đáo, <br />
            vừa giữ lại được cảm xúc không?"
          </p>
          <div className={styles.quoteIcon} aria-hidden="true">
            <MdFormatQuote />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;

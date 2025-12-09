import styles from "./story-intro-section.module.scss";

const StoryIntroSection = () => {
  return (
    <section className={styles.storyIntroSection}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          KHI MÓN QUÀ TRỞ THÀNH CÂU CHUYỆN YÊU THƯƠNG
        </h2>
        <p className={styles.subtitle}>
          Trong thời đại mà mọi thứ đều sản xuất hàng loạt – từ lời chúc, cảm
          xúc đến cả quà tặng – sự riêng tư và ý nghĩa dần biến mất.
        </p>
      </div>
    </section>
  );
};

export default StoryIntroSection;

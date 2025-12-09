import styles from "./contact-hero.module.scss";

const ContactHero = () => {
  return (
    <section className={styles.heroRoot}>
      <div className="site-inner">
        <h1
          className={`${styles.title} animate-fade-in-down delay-100`}
          style={{ opacity: 0 }}
        >
          Liên hệ với Soligant
        </h1>
        <p
          className={`${styles.subtitle} animate-fade-in-up delay-200`}
          style={{ opacity: 0 }}
        >
          Mọi thắc mắc, hợp tác hay đặt hàng - hãy gửi tin nhắn cho chúng tôi.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;

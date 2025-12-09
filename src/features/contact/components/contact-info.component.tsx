import styles from "./contact-info.module.scss";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
} from "react-icons/fa";

const ContactInfo = () => {
  return (
    <section className={styles.infoRoot}>
      <div className="site-inner">
        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.icon} aria-hidden>
              <FaPhone />
            </span>
            <div>
              <div className={styles.label}>Hotline</div>
              <div className={styles.value}>0989804006</div>
            </div>
          </div>

          <div className={styles.item}>
            <span className={styles.icon} aria-hidden>
              <FaEnvelope />
            </span>
            <div>
              <div className={styles.label}>Email</div>
              <div className={styles.value}>soligant.gifts@gmail.com</div>
            </div>
          </div>

          <div className={styles.item}>
            <span className={styles.icon} aria-hidden>
              <FaMapMarkerAlt />
            </span>
            <div>
              <div className={styles.label}>Địa chỉ</div>
              <div className={styles.value}>Online tại Hà Nội</div>
            </div>
          </div>

          <div className={styles.item}>
            <span className={styles.icon} aria-hidden>
              <FaInstagram />
            </span>
            <div>
              <div className={styles.label}>Instagram</div>
              <div className={styles.value}>@soligant.gifts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;

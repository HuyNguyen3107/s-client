import styles from "./contact-info.module.scss";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
} from "react-icons/fa";

const ContactInfo = () => {
  const contactItems = [
    {
      icon: <FaPhone />,
      label: "Hotline",
      value: "0989804006",
      link: "tel:0989804006",
      color: "#7a2323",
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: "soligant.gifts@gmail.com",
      link: "mailto:soligant.gifts@gmail.com",
      color: "#a02c2c",
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Địa chỉ",
      value: "Online tại Hà Nội",
      link: null,
      color: "#c93838",
    },
    {
      icon: <FaInstagram />,
      label: "Instagram",
      value: "@soligant.gifts",
      link: "https://instagram.com/soligant.gifts",
      color: "#e05050",
    },
  ];

  return (
    <section className={styles.infoRoot}>
      <div className="site-inner">
        <div className={styles.header}>
          <h2 className={styles.title}>Thông tin liên hệ</h2>
          <p className={styles.subtitle}>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc
          </p>
        </div>
        <div className={styles.grid}>
          {contactItems.map((item, index) => (
            <div
              key={index}
              className={styles.item}
              style={{ "--item-color": item.color } as React.CSSProperties}
            >
              <span className={styles.icon} aria-hidden>
                {item.icon}
              </span>
              <div className={styles.content}>
                <div className={styles.label}>{item.label}</div>
                {item.link ? (
                  <a
                    href={item.link}
                    className={styles.valueLink}
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className={styles.value}>{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;

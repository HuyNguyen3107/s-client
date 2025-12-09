import { Box } from "@mui/material";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./footer.module.scss";
import colors from "../constants/colors";

export default function Footer() {
  return (
    <Box
      component="footer"
      className={styles["footer-root"]}
      sx={{ backgroundColor: colors.brand.primary }}
      role="contentinfo"
    >
      <div className="site-inner">
        <div className={styles["footer-inner"]}>
          <div className={styles.brand}>
            <h2 className={styles["brand-title"]}>SOLIGANT.GIFTS</h2>
            <p className={styles["brand-tagline"]}>
              Thương hiệu quà tặng tinh tế cho mọi dịp
            </p>
            <div
              className={styles.social}
              role="group"
              aria-label="Social media links"
            >
              <a
                href="https://www.facebook.com/profile.php?id=61567332901935"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook của Soligant"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/soligant.gifts?igsh=MWFoMnNsaDR1eHVxeA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram của Soligant"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@soligant.gifts?_r=1&_d=secCgYIASAHKAESPgo8aebRqK1alX58tZiz94dz2nBwxv1GRtjMQTcHpyYulvxZcaQOtvnAPhA8uVY85B4WUxp9JRLVBMivJ5%2FPGgA%3D&_svg=1&checksum=cced687b9c6afa822b2064e5d3eb91f8a01cd238176544d7f8e85400db8cb176&item_author_type=1&sec_uid=MS4wLjABAAAApf5aD_5ZHEH5cMy_vGL1cRGIlLRjOCKonikYsbU55CsXF7YSwuUMXYaB8Kv2lZ6U&sec_user_id=MS4wLjABAAAApf5aD_5ZHEH5cMy_vGL1cRGIlLRjOCKonikYsbU55CsXF7YSwuUMXYaB8Kv2lZ6U&share_app_id=1180&share_author_id=7418931856509666312&share_link_id=07BB422D-B98C-4C89-9F89-8E7D2985A5D5&share_region=VN&share_scene=1&sharer_language=vi&social_share_type=4&source=h5_t&timestamp=1763008332&tt_from=copy&u_code=egc8d35flgl961&ug_btm=b8727%2Cb0&user_id=7418931856509666312&utm_campaign=client_share&utm_medium=ios&utm_source=copy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok của Soligant"
              >
                <FaTiktok />
              </a>
            </div>
          </div>

          <nav className={styles.links} aria-label="Footer navigation">
            <h3 className={styles["links-heading"]}>Liên kết</h3>
            <ul>
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/collections">Bộ sưu tập</Link>
              </li>
              <li>
                <Link to="/order-tracking">Tìm đơn hàng</Link>
              </li>
              <li>
                <Link to="/policy">Chính sách</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </nav>

          <div className={styles.contact}>
            <h3 className={styles["contact-heading"]}>Liên hệ</h3>
            <div className={styles["contact-item"]}>
              <span className={styles["contact-icon"]} aria-hidden="true">
                <FaPhone />
              </span>
              <a href="tel:0989804006" aria-label="Gọi điện: 0989804006">
                0989804006
              </a>
            </div>
            <div className={styles["contact-item"]}>
              <span className={styles["contact-icon"]} aria-hidden="true">
                <FaEnvelope />
              </span>
              <a
                href="mailto:soligant.gifts@gmail.com"
                aria-label="Gửi email: soligant.gifts@gmail.com"
              >
                soligant.gifts@gmail.com
              </a>
            </div>
            <div className={styles["contact-item"]}>
              <span className={styles["contact-icon"]} aria-hidden="true">
                <FaMapMarkerAlt />
              </span>
              <span>Online tại Hà Nội</span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

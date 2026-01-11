import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./contact-form.module.scss";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Phone validation (optional but if provided must be valid)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (
      formData.phone.trim() &&
      !phoneRegex.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Vui lòng chọn chủ đề";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Nội dung phải có ít nhất 10 ký tự";
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = "Nội dung không được quá 1000 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now just alert; integration with API can be added later
      console.log("Form submitted:", formData);
      alert(
        `Họ tên: ${formData.name}\nEmail: ${formData.email}\nSố điện thoại: ${formData.phone}\nChủ đề: ${formData.subject}\nNội dung: ${formData.message}`
      );

      setSubmitStatus("success");
      setShowSuccess(true);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setSubmitStatus("idle");
  };

  return (
    <section className={styles.formRoot}>
      <div className="site-inner">
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Gửi tin nhắn cho chúng tôi</h2>
            <p className={styles.subtitle}>
              Điền vào form bên dưới và chúng tôi sẽ phản hồi trong thời gian
              sớm nhất
            </p>
          </div>

          {showSuccess && (
            <div className={styles.successMessage}>
              <FaCheckCircle className={styles.successIcon} />
              <div>
                <div className={styles.successTitle}>Gửi thành công!</div>
                <div className={styles.successText}>
                  Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.
                </div>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className={styles.errorMessage}>
              <FaExclamationCircle className={styles.errorIcon} />
              <div>
                <div className={styles.errorTitle}>Có lỗi xảy ra</div>
                <div className={styles.errorText}>
                  Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.
                </div>
              </div>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  Họ và tên <span className={styles.required}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ tên của bạn"
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`${styles.input} ${
                    errors.email ? styles.inputError : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09xxxxxxxxx"
                  className={`${styles.input} ${
                    errors.phone ? styles.inputError : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <span className={styles.errorText}>{errors.phone}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="subject" className={styles.label}>
                  Chủ đề <span className={styles.required}>*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`${styles.select} ${
                    errors.subject ? styles.inputError : ""
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="hoidap">Hỏi đáp sản phẩm</option>
                  <option value="dathang">Đặt hàng</option>
                  <option value="hop_tac">Hợp tác kinh doanh</option>
                  <option value="khac">Khác</option>
                </select>
                {errors.subject && (
                  <span className={styles.errorText}>{errors.subject}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>
                Nội dung <span className={styles.required}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Nhập nội dung tin nhắn của bạn..."
                rows={6}
                className={`${styles.textarea} ${
                  errors.message ? styles.inputError : ""
                }`}
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className={styles.charCount}>
                {formData.message.length}/1000 ký tự
              </div>
              {errors.message && (
                <span className={styles.errorText}>{errors.message}</span>
              )}
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleReset}
                className={styles.resetBtn}
                disabled={isSubmitting}
              >
                Làm mới
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className={styles.submitIcon} />
                    Gửi tin nhắn
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

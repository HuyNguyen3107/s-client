import React, { useState } from "react";
import styles from "./consult-form-section.module.scss";
import { useCreateConsultation } from "../../../hooks/use-consultations.hooks";
import { useToastStore } from "../../../store/toast.store";

const ConsultFormSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const createConsultation = useCreateConsultation();
  const { showToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createConsultation.isPending) return;

    // Validate phone number
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(phone)) {
      showToast("Số điện thoại không hợp lệ", "error");
      return;
    }

    try {
      const result = await createConsultation.mutateAsync({
        customerName: name,
        phoneNumber: phone,
      });

      if (result.success) {
        showToast(
          result.message ||
            "Đã gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm.",
          "success"
        );
        // Reset form
        setName("");
        setPhone("");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau";
      showToast(errorMessage, "error");
    }
  };

  return (
    <section className={styles.consultSection}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>NHẬN TƯ VẤN</h2>
        <p className={styles.subheading}>
          Để lại thông tin, chúng tôi sẽ liên hệ tư vấn chi tiết cho bạn
        </p>
        <div className={styles.formGroup}>
          <label htmlFor="name">Họ và tên *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ và tên của bạn"
            required
            disabled={createConsultation.isPending}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Số điện thoại *</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại của bạn"
            pattern="^(0|\+84)[0-9]{9,10}$"
            required
            disabled={createConsultation.isPending}
          />
          <small className={styles.hint}>
            Ví dụ: 0912345678 hoặc +84912345678
          </small>
        </div>
        <button
          className={styles.submitBtn}
          type="submit"
          disabled={createConsultation.isPending}
        >
          {createConsultation.isPending ? "ĐANG GỬI..." : "GỬI THÔNG TIN"}
        </button>
      </form>
    </section>
  );
};

export default ConsultFormSection;

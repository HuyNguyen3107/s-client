import { useState } from "react";
import styles from "./contact-form.module.scss";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just alert; integration with API can be added later
    alert(`Họ tên: ${name}\nEmail: ${email}\nNội dung: ${message}`);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section className={styles.formRoot}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="name">Họ và tên</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="message">Nội dung</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          required
        />

        <button type="submit" className={styles.submitBtn}>
          Gửi
        </button>
      </form>
    </section>
  );
};

export default ContactForm;

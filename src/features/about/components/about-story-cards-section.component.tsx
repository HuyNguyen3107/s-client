import React from "react";
import styles from "./about-story-cards-section.module.scss";
import cardImg from "@/assets/images/product-1.jpg";

const cards = [
  {
    id: 1,
    text: (
      <>
        Món quà không còn kể câu chuyện của người tặng, không còn khiến người
        nhận thấy mình được thấu hiểu.
        <br />
        Chỉ còn lại một vật thể đẹp...
        <br />
        nhưng vô hồn.
      </>
    ),
    highlight: false,
  },
  {
    id: 2,
    text: (
      <>
        Soligant ra đời từ khoảng trống ấy. Không để phô bày điều rực rỡ, mà để
        gợi lại điều tưởng chừng đã bị quên lãng.
        <br />
        Rằng một món quà vẫn có thể chạm vào cảm xúc.
      </>
    ),
    highlight: true,
  },
  {
    id: 3,
    text: (
      <>
        Một thiết kế riêng – một chi tiết chỉ hai người mới hiểu.
        <br />
        Một sự hiện diện thầm lặng, nhưng đủ để người nhận biết:
        <br />
        “Mình đã được nghĩ đến. Ai đó vẫn ở bên – đủ chẳng ở cạnh.”
      </>
    ),
    highlight: false,
  },
];

const AboutStoryCardsSection: React.FC = () => {
  return (
    <section className={styles.cardsSection}>
      <div className={styles.container}>
        {cards.map((c) => (
          <article
            key={c.id}
            className={
              c.highlight ? `${styles.card} ${styles.highlight}` : styles.card
            }
            aria-label={`story-card-${c.id}`}
          >
            <div className={styles.imageWrap}>
              <img src={cardImg} alt={`card-${c.id}`} loading="lazy" decoding="async" />
            </div>
            <div className={styles.textWrap}>{c.text}</div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AboutStoryCardsSection;

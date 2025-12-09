import styles from "./testimonial-section.module.scss";
import { useState, useEffect } from "react";
import { useFeedbacks } from "../../../hooks/use-feedbacks.hooks";

interface Feedback {
  id: string;
  customerName: string;
  content: string;
  imageUrl: string;
  rating: number;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className={styles["star-row"]}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={i < rating ? styles["star-filled"] : styles["star-empty"]}
        >
          ★
        </span>
      ))}
      <span className={styles["rating-number"]}>({rating}/5)</span>
    </div>
  );
}

function FeedbackImageModal({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose, isZoomed]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  const handleOverlayClick = () => {
    if (isZoomed) {
      setIsZoomed(false);
    } else {
      onClose();
    }
  };

  return (
    <div className={styles["modal-overlay"]} onClick={handleOverlayClick}>
      <div
        className={`${styles["modal-content"]} ${
          isZoomed ? styles["modal-content-zoomed"] : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles["modal-close"]}
          onClick={onClose}
          title="Đóng (Esc)"
        >
          ×
        </button>
        {!imageLoaded && (
          <div className={styles["modal-loading"]}>
            <div className={styles["modal-spinner"]}></div>
            <span>Đang tải hình ảnh...</span>
          </div>
        )}
        <img
          src={imageUrl}
          alt="Feedback từ khách hàng"
          className={`${styles["modal-image"]} ${
            isZoomed ? styles["modal-image-zoomed"] : ""
          } ${imageLoaded ? styles["modal-image-loaded"] : ""}`}
          onClick={handleImageClick}
          onLoad={() => setImageLoaded(true)}
          style={{ cursor: isZoomed ? "zoom-out" : "zoom-in" }}
        />
        {imageLoaded && (
          <div className={styles["modal-hint"]}>
            {isZoomed ? "Nhấp để thu nhỏ" : "Nhấp vào hình để phóng to"}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  const [page, setPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const perPage = 2; // Show 2 feedbacks at a time
  const autoPlayInterval = 5000; // 5 seconds
  const [paused, setPaused] = useState(false);

  // Fetch ALL feedbacks from server (no rating filter)
  const {
    data: feedbackData,
    isLoading,
    error,
  } = useFeedbacks({
    page: 1,
    limit: 20,
    rating: undefined,
  });

  // Get all feedbacks (no filter)
  const allFeedbacks = feedbackData?.data || [];

  const maxPage = Math.ceil(allFeedbacks.length / perPage) - 1;

  const handlePrev = () => {
    setPage((p) => (p === 0 ? Math.max(0, maxPage) : p - 1));
  };

  const handleNext = () => {
    setPage((p) => (p >= maxPage ? 0 : p + 1));
  };

  const goToPage = (pageIndex: number) => {
    setPage(pageIndex);
  };

  const shown = allFeedbacks.slice(page * perPage, page * perPage + perPage);

  // Auto-play functionality
  useEffect(() => {
    if (allFeedbacks.length <= perPage) return;
    if (paused) return;
    const timer = setInterval(() => {
      setPage((p) => (p >= maxPage ? 0 : p + 1));
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [page, allFeedbacks.length, perPage, maxPage, paused]);

  if (isLoading) {
    return (
      <section className={styles["testimonial-root"]}>
        <h2 className={styles["testimonial-title"]}>NHỮNG NIỀM VUI NHỎ</h2>
        <div className={styles["loading"]}>Đang tải đánh giá...</div>
      </section>
    );
  }

  if (error || !feedbackData) {
    return (
      <section className={styles["testimonial-root"]}>
        <h2 className={styles["testimonial-title"]}>NHỮNG NIỀM VUI NHỎ</h2>
        <div className={styles["error"]}>Không thể tải đánh giá</div>
      </section>
    );
  }

  if (allFeedbacks.length === 0) {
    return (
      <section className={styles["testimonial-root"]}>
        <h2 className={styles["testimonial-title"]}>NHỮNG NIỀM VUI NHỎ</h2>
        <div className={styles["no-feedbacks"]}>Chưa có đánh giá nào</div>
      </section>
    );
  }

  const totalPages = Math.ceil(allFeedbacks.length / perPage);

  return (
    <section className={styles["testimonial-root"]}>
      <h2 className={styles["testimonial-title"]}>NHỮNG NIỀM VUI NHỎ</h2>
      <div
        className={styles["testimonial-slider"]}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {allFeedbacks.length > perPage && (
          <button
            className={styles["nav-btn"]}
            onClick={handlePrev}
            aria-label="Xem feedback trước"
          >
            &#8592;
          </button>
        )}
        <div className={styles["testimonial-cards-wrapper"]}>
          {shown.map((feedback: Feedback) => (
            <div className={styles["testimonial-card"]} key={feedback.id}>
              <div className={styles["testimonial-header"]}>
                <div className={styles["customer-info"]}>
                  <div className={styles["customer-name"]}>
                    {feedback.customerName}
                  </div>
                  <StarRow rating={feedback.rating} />
                </div>
              </div>
              <div className={styles["testimonial-content"]}>
                "{feedback.content}"
              </div>
              {feedback.imageUrl && (
                <button
                  className={styles["view-image-btn"]}
                  onClick={() => setSelectedImage(feedback.imageUrl)}
                >
                  📷 Xem tin nhắn feedback
                </button>
              )}
            </div>
          ))}
        </div>
        {allFeedbacks.length > perPage && (
          <button
            className={styles["nav-btn"]}
            onClick={handleNext}
            aria-label="Xem feedback tiếp theo"
          >
            &#8594;
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className={styles["pagination-dots"]}>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`${styles["dot"]} ${
                page === idx ? styles["dot-active"] : ""
              }`}
              onClick={() => goToPage(idx)}
              aria-label={`Chuyển đến trang ${idx + 1}`}
              aria-current={page === idx ? "true" : "false"}
            />
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <FeedbackImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}

import { useState, useEffect } from "react";
import styles from "./promotion-countdown.module.scss";

interface CountdownProps {
  endDate: string | Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PromotionCountdown({
  endDate,
  className,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval if expired
      if (!newTimeLeft) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return (
      <div className={`${styles.expired} ${className || ""}`}>Đã hết hạn</div>
    );
  }

  return (
    <div className={`${styles.countdown} ${className || ""}`}>
      <div className={styles.timeUnit}>
        <span className={styles.value}>
          {String(timeLeft.days).padStart(2, "0")}
        </span>
        <span className={styles.label}>ngày</span>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.timeUnit}>
        <span className={styles.value}>
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className={styles.label}>giờ</span>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.timeUnit}>
        <span className={styles.value}>
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className={styles.label}>phút</span>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.timeUnit}>
        <span className={styles.value}>
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className={styles.label}>giây</span>
      </div>
    </div>
  );
}

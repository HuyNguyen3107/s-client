import React from "react";
import { FaChartLine, FaArrowUp, FaArrowDown } from "react-icons/fa";
import styles from "./summary-card.components.module.scss";

interface SummaryCardProps {
  title: string;
  value: number | string;
  trend?: {
    type: "up" | "down" | "neutral";
    value: number;
    period: string;
  };
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "info";
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  trend,
  icon,
  color = "primary",
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;

    switch (trend.type) {
      case "up":
        return <FaArrowUp className={styles.trendUp} />;
      case "down":
        return <FaArrowDown className={styles.trendDown} />;
      default:
        return <FaChartLine className={styles.trendNeutral} />;
    }
  };

  return (
    <div className={`${styles.summaryCard} ${styles[color]}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>{icon}</div>
        <div className={styles.cardTitle}>{title}</div>
      </div>

      <div className={styles.cardValue}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>

      {trend && (
        <div className={styles.cardTrend}>
          {getTrendIcon()}
          <span className={`${styles.trendText} ${styles[trend.type]}`}>
            {trend.value > 0 ? "+" : ""}
            {trend.value}% {trend.period}
          </span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;

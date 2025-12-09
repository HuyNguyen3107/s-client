import React from "react";

interface PromotionCountdownProps {
  startDate?: string;
  endDate?: string;
}

const msInSecond = 1000;
const msInMinute = 60 * msInSecond;
const msInHour = 60 * msInMinute;
const msInDay = 24 * msInHour;

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00:00";
  const days = Math.floor(ms / msInDay);
  const hours = Math.floor((ms % msInDay) / msInHour);
  const minutes = Math.floor((ms % msInHour) / msInMinute);
  const seconds = Math.floor((ms % msInMinute) / msInSecond);

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return days > 0 ? `${days} ngày ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
}

export default function PromotionCountdown({
  startDate,
  endDate,
}: PromotionCountdownProps) {
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!startDate && !endDate) return null;

  const start = startDate ? new Date(startDate).getTime() : undefined;
  const end = endDate ? new Date(endDate).getTime() : undefined;

  // If start is in the future, show time until start
  if (start && start > now) {
    const remaining = start - now;
    return (
      <div className="promo-countdown">
        Bắt đầu sau: {formatRemaining(remaining)}
      </div>
    );
  }

  // If end exists, show time until end (or expired)
  if (end) {
    const remaining = end - now;
    if (remaining <= 0) {
      return <div className="promo-countdown">Đã hết hạn</div>;
    }
    return (
      <div className="promo-countdown">Còn: {formatRemaining(remaining)}</div>
    );
  }

  return null;
}

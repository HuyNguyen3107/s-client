import type { ReactNode } from "react";
import useScrollAnimation from "../../../hooks/use-scroll-animation.hooks";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?:
    | "fade-in-up"
    | "fade-in-left"
    | "fade-in-right"
    | "scale-in"
    | "fade-in";
  delay?: number;
  threshold?: number;
}

/**
 * Wrapper component that reveals children with animation when scrolled into view
 */
export default function ScrollReveal({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce: true,
  });

  const animationClass = `animate-${animation}`;
  const delayClass = delay > 0 ? `delay-${delay}` : "";
  const visibilityClass = isVisible ? animationClass : "";

  return (
    <div
      ref={elementRef as any}
      className={`scroll-reveal ${visibilityClass} ${delayClass} ${className}`.trim()}
      style={{ opacity: isVisible ? undefined : 0 }}
    >
      {children}
    </div>
  );
}

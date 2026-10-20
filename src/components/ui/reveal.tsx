"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";

type RevealProps = {
  children: ReactNode;
  /** يظهر عند التأخير (بالمللي ثانية) — للتتابع المتدرّج */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * ظهور تدريجي عند دخول العنصر إلى الشاشة (IntersectionObserver).
 * يحترم prefers-reduced-motion عبر CSS.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={
        delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}

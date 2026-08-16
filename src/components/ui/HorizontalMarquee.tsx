"use client";

import { Children, ReactNode, useMemo } from "react";

type HorizontalMarqueeProps = {
  children: ReactNode;
  /** Segundos para completar un ciclo */
  duration?: number;
  pauseOnHover?: boolean;
  className?: string;
  /** Repeticiones del bloque para asegurar scroll continuo */
  repeat?: number;
};

export function HorizontalMarquee({
  children,
  duration = 28,
  pauseOnHover = true,
  className = "",
  repeat = 2,
}: HorizontalMarqueeProps) {
  const items = Children.toArray(children);

  const loopItems = useMemo(() => {
    if (items.length === 0) return [];
    const loops = Math.max(repeat, 2);
    return Array.from({ length: loops }, () => items).flat();
  }, [items, repeat]);

  if (loopItems.length === 0) return null;

  return (
    <div className={`marquee-viewport ${className}`}>
      <div
        className={`marquee-track ${pauseOnHover ? "marquee-pause-hover" : ""}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="marquee-content">
          {loopItems.map((item, index) => (
            <div key={`marquee-a-${index}`} className="marquee-item">
              {item}
            </div>
          ))}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {loopItems.map((item, index) => (
            <div key={`marquee-b-${index}`} className="marquee-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

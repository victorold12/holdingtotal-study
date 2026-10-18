"use client";
import { useEffect } from "react";

export function ScrollReveals() {
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cards = document.querySelectorAll<HTMLElement>(
      mobile ? ".comp-card" : ".for-you-card, .comp-card",
    );
    if (reduced) return;
    // Literal source contract: threshold .1, y=20px, 500ms CSS ease.
    // No stagger exists in the source. Mobile audience cards remain sticky.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }
      },
      { threshold: 0.1 },
    );
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);
  return null;
}

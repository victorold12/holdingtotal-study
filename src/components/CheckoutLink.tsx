"use client";
import type { ReactNode } from "react";

export function CheckoutLink({
  children,
  className,
  as = "a",
}: {
  children: ReactNode;
  className?: string;
  as?: "a" | "button";
}) {
  const Tag = as;
  return (
    <Tag
      className={className}
      href={as === "a" ? "#offer-grid" : undefined}
      onClick={(event) => {
        event.preventDefault();
        const target = document.getElementById("offer-grid");
        if (!target) return;
        // Observed inline-03.js: native smooth-scroll; exact offset is 24 px.
        // Native duration/easing are browser-controlled, not a guessed tween.
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 24,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      }}
    >
      {children}
    </Tag>
  );
}

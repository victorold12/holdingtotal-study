"use client";
import { useState } from "react";
import { faqItems } from "@/generated/content";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq-list">
      {faqItems.map((item, index) => (
        <div
          className={`faq-item${open === index ? " open" : ""}`}
          key={item.question}
        >
          <button
            id={`question-${index}`}
            className="faq-item__q"
            aria-expanded={open === index}
            aria-controls={`answer-${index}`}
            onClick={() => setOpen(open === index ? null : index)}
          >
            {item.question}
            <span className="faq-item__icon">
              <svg viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>
          {/* Source CSS owns motion: max-height 0 -> 400px plus bottom padding,
        350ms cubic-bezier(.16,1,.3,1). Single open item, no invented springs. */}
          <div
            id={`answer-${index}`}
            className="faq-item__a"
            role="region"
            aria-labelledby={`question-${index}`}
            inert={open !== index}
          >
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

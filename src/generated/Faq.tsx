// Generated from .faq-section in reference/index.html (live DOM).
import { CheckoutLink } from "@/components/CheckoutLink";
import { FaqAccordion } from "@/components/FaqAccordion";
export function Faq() {
  return (
    <section className="faq-section">
      {"\n"}
      <div className="faq-header">
        {"\n"}
        <span className="eyebrow">{"Dúvidas frequentes"}</span>
        {"\n"}
        <h2>{"Perguntas que todo advogado faz antes de entrar"}</h2>
        {"\n"}
      </div>
      {"\n"}
      <FaqAccordion />
      {"\n"}
      <div className="faq-cta">
        {"\n"}
        <CheckoutLink className="btn btn--primary btn--lg">
          {"QUERO GARANTIR MINHA VAGA"}
        </CheckoutLink>
        {"\n"}
      </div>
      {"\n"}
    </section>
  );
}

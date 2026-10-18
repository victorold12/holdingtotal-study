// Generated from .video-section in reference/index.html (live DOM).
import { CheckoutLink } from "@/components/CheckoutLink";
import { VideoCarousel } from "@/components/VideoCarousel";
export function Testimonials() {
  return (
    <section className="video-section">
      {"\n"}
      <div className="video-carousel-header">
        {"\n"}
        <span className="eyebrow">{"Depoimentos"}</span>
        {"\n"}
        <h2>
          {
            "Esses são resultados reais de quem decidiu atacar esse nicho, alcançando um novo nível de posicionamento no mercado jurídico."
          }
        </h2>
        {"\n"}
        <p
          style={{
            marginTop: "var(--sp-4)",
            fontSize: "var(--text-lg)",
            color: "var(--color-text-secondary)",
            maxWidth: "640px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: "1.7",
          }}
        >
          {
            "\nVeja o que mudou na prática para quem aplicou o método, e o que você vai aprender para chegar ao mesmo resultado.      "
          }
        </p>
        {"\n"}
      </div>
      {"\n"}
      <VideoCarousel />
      {"\n"}
      {"\n"}
      <div className="video-carousel-cta">
        {"\n"}
        <CheckoutLink className="btn btn--primary btn--lg">
          {"Garantir meu ingresso"}
        </CheckoutLink>
        {"\n"}
      </div>
      {"\n"}
    </section>
  );
}

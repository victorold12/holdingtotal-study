// Generated from .nossa-hero in reference/index.html (live DOM).
import { CheckoutLink } from "@/components/CheckoutLink";
export function Hero() {
  return (
    <section className="nossa-hero">
      {"\n"}
      <div className="overlay-gradient"></div>
      {"\n"}
      <div className="container-s1">
        {"\n"}
        <div className="hero-text-wrapper">
          {"\n"}
          <div className="logo-area">
            {"\n"}
            <img src="/source-assets/logo-ht.webp" alt="Holding Total" />
            {"\n"}
          </div>
          {"\n"}
          <div className="badges-wrapper">
            {"\n"}
            <span className="info-badge">
              {"\n"}
              <i className="bi bi-calendar3"></i>
              {" 25 a 27 de setembro\n          "}
            </span>
            {"\n"}
            <span className="info-badge-zoom">
              {"\n"}
              <i className="bi bi-camera-video-fill"></i>
              {" 100% online e ao vivo\n          "}
            </span>
            {"\n"}
          </div>
          {"\n"}
          <h1 className="headline">
            {"\n          Advogados que faturam R$ 50 mil por mês\n          "}
            <span className="highlight">
              {"não trabalham mais do que você."}
            </span>
            {
              "\n          Eles só dominam algo que a faculdade jamais ensinou.\n        "
            }
          </h1>
          {"\n"}
          <h2 className="subheadline">
            {"\n          Em "}
            <strong>{"3 dias de aula online e ao vivo"}</strong>
            {
              ", você vai aprender o método completo\n          para estruturar Holding Familiar, da captação ao fechamento, validado por mais de\n          "
            }
            <strong>{"10.000 advogados"}</strong>
            {" em todo o Brasil.\n        "}
          </h2>
          {"\n"}
          <CheckoutLink className="btn btn--primary btn--lg">
            {"\n          GARANTIR MEU INGRESSO\n        "}
          </CheckoutLink>
          {"\n"}
          <div className="secure-payment">
            {"\n"}
            <span>{"PAGAMENTO SEGURO"}</span>
            {"\n"}
            <img
              src="/source-assets/logo-hotmart-branca.svg"
              alt="Hotmart"
              width="110"
              height="28"
            />
            {"\n"}
          </div>
          {"\n"}
        </div>
        {"\n"}
      </div>
      {"\n"}
    </section>
  );
}

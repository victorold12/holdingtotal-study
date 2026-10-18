// Generated from .guarantee-section in reference/index.html (live DOM).
import { CheckoutLink } from "@/components/CheckoutLink";
export function Guarantee() {
  return (
    <section className="guarantee-section">
      {"\n"}
      <div className="guarantee-inner">
        {"\n"}
        <div className="seal-wrap">
          {"\n"}
          <svg
            id="spinning-seal"
            viewBox="0 0 200 200"
            role="img"
            aria-label="Selo de garantia incondicional de 7 dias"
          >
            {"\n"}
            <defs>
              {"\n"}
              {"\n"}
              <path
                id="selo-topo"
                d="M 31,100 A 69,69 0 0 1 169,100"
                fill="none"
              ></path>
              {"\n"}
              {"\n"}
              <path
                id="selo-base"
                d="M 19,100 A 81,81 0 0 0 181,100"
                fill="none"
              ></path>
              {"\n"}
            </defs>
            {"\n"}
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="#fe7413"
              strokeWidth="2"
              opacity="0.45"
            ></circle>
            {"\n"}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke="#fe7413"
              strokeWidth="1"
              opacity="0.25"
            ></circle>
            {"\n"}
            <circle cx="100" cy="100" r="56" fill="#fe7413"></circle>
            {"\n"}
            <text
              fill="#fe7413"
              fontFamily="Montserrat, sans-serif"
              fontSize="12"
              fontWeight="600"
              letterSpacing="0.9"
            >
              {"\n"}
              <textPath href="#selo-topo" startOffset="50%" textAnchor="middle">
                {"GARANTIA INCONDICIONAL"}
              </textPath>
              {"\n"}
            </text>
            {"\n"}
            <text
              fill="#fe7413"
              fontFamily="Montserrat, sans-serif"
              fontSize="13"
              fontWeight="600"
              letterSpacing="1.8"
            >
              {"\n"}
              <textPath href="#selo-base" startOffset="50%" textAnchor="middle">
                {"RISCO ZERO"}
              </textPath>
              {"\n"}
            </text>
            {"\n"}
            <text
              x="100"
              y="93"
              fill="#000"
              fontFamily="Montserrat, sans-serif"
              fontSize="42"
              fontWeight="600"
              textAnchor="middle"
            >
              {"7"}
            </text>
            {"\n"}
            <text
              x="100"
              y="122"
              fill="#000"
              fontFamily="Montserrat, sans-serif"
              fontSize="19"
              fontWeight="600"
              textAnchor="middle"
              letterSpacing="1.5"
            >
              {"DIAS"}
            </text>
            {"\n"}
          </svg>
          {"\n"}
        </div>
        {"\n"}
        <h2 className="guarantee-title">{"Garantia de 7 dias"}</h2>
        {"\n"}
        <p className="guarantee-subtitle">{"O risco é todo meu, não seu."}</p>
        {"\n"}
        <div className="guarantee-desc">
          {"\n"}
          <p>
            {
              "Entre, assista e aplique. Se em até 7 dias você achar que a Imersão não é para o seu momento, é só pedir o\n          reembolso. Devolvemos 100% do valor, sem perguntas e sem burocracia."
            }
          </p>
          {"\n"}
          <p>
            {
              "Você não precisa decidir agora se isso vale a pena. Só precisa decidir dar uma olhada."
            }
          </p>
          {"\n"}
        </div>
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

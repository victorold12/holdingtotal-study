# Arquitetura de componentes e DOM

Fonte: `reference/index.html`, DOM vivo da página. O HTML de resposta termina
um `<h3>` com `</h2>` na seção de público. Chromium corrige essa estrutura; o
estudo acompanha o DOM corrigido, evitando deslocar o CTA para dentro do título.

| Módulo gerado | Estrutura principal | Responsabilidade |
| --- | --- | --- |
| `Hero` | `section.nossa-hero > .overlay-gradient + .container-s1 > .hero-text-wrapper` | Imagem responsiva no fundo, logo, badges, h1, resumo, CTA e selo |
| `Comparison` | `section.comparison-section > .container > .comparison-inner` | Título e duas listas semânticas de comparação |
| `AlertBanner` | `.cta-banner-wrap > .cta-banner` | Bloco existente no DOM, com a visibilidade definida pela cascata original |
| `Testimonials` | `section.video-section > .video-carousel-header + VideoCarousel + .video-carousel-cta` | Introdução e navegação dos cinco depoimentos |
| `Audience` | `section.for-you-section > .for-you-inner + .for-you-cta` | Título sticky, seis cards e CTA; empilhamento sticky mobile |
| `Offer` | `section#ingressos > .offer-header + #offer-grid` | Benefícios sticky à esquerda, checkout externo à direita |
| `Guarantee` | `section.guarantee-section > .guarantee-inner` | Selo SVG com textPath, descrição e CTA |
| `Mentor` | `section.mentor-section > .mentor-inner` | Biografia e galeria de três imagens |
| `Faq` | `section.faq-section > .faq-header + FaqAccordion + .faq-cta` | Quatro perguntas; somente uma aberta |
| `FinalParallax` | `section.final-parallax > .final-card` | Fundo e texto finais, conforme CSS original |
| `Footer` | `footer.footer` | Links legais e avisos extraídos |

`src/app/page.tsx` compõe esses módulos dentro de `<main>`, deixando o footer
fora dele. A rota `/imersao` reutiliza a mesma página. Módulos estáticos são
Server Components; as cinco fronteiras interativas são Client Components:

- `CheckoutLink`: elemento original (`a` ou `button`), rolagem até `#offer-grid`.
- `FaqAccordion`: estado `open: number | null`, ARIA e transições CSS.
- `VideoCarousel`: índice, medidas, swipe, resize e montagem lazy do runtime real.
- `CheckoutEmbed`: load diferido, UTMs/sck e ajuste de altura via postMessage.
- `ScrollReveals`: IntersectionObserver com cleanup; sem nó visual adicional.

Não se usa `dangerouslySetInnerHTML`, screenshot como fundo da página, iframe
para a página inteira ou recitação manual do conteúdo. SVGs são JSX extraído,
com a capitalização SVG corrigida para React (`viewBox`, `textPath`, `startOffset`).

## CSS, assets e performance

`globals.css` concatena os três blocos originais na mesma ordem, trocando apenas
URLs relativas de assets por `/source-assets/...`. Mantém inclusive regras de
seções inativas; uma animação declarada no CSS não é automaticamente tratada
como observada na página. `study.css` isola foco/reduced motion.

`next.config.mjs` faz rewrite dos assets para a origem. Não há imagens/binários
de terceiros em `public/`. A fonte e os ícones são carregados dos mesmos CDNs.
O preload da imagem principal é condicionado ao breakpoint. Voomly só carrega
quando a seção está a 200px da viewport; Hotmart espera 1s após `load`.

Mantém-se a geometria original de imagens sem `next/image`, evitando alterar
recortes e alturas. O carrossel anima `transform`; os reveals usam `transform`
e `opacity`. O FAQ preserva a transição de `max-height` do alvo, apesar do custo
de layout inerente. O pulso de sombra dos CTAs também foi preservado, com seu
custo de pintura, em vez de substituir o efeito.

O estado React não depende de queries globais para controlar FAQ/carrossel.
O observador global dos cards só escreve estilos de entrada e desconecta no
unmount. Timers e listeners dos componentes têm cleanup.

## Reprodução dos dados

Execute `npm run extract`. O extrator usa BeautifulSoup, preserva a estrutura
do DOM vivo, descarta estados transitórios do observador e gera código tipado.
Não edite `src/generated/` manualmente: altere o extrator ou os componentes
interativos. `src/generated/manifest.json` registra hashes e contagens.

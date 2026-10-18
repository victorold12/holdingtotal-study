# Motion ledger — parâmetros observados

Fonte primária: `reference/original.css` e `reference/source-scripts/inline-03.js`
até `inline-08.js`. `inline-00` a `inline-02` são trackers, fora do app local.

| Efeito | Parâmetros literais | Gatilho/sequência | Implementação |
| --- | --- | --- | --- |
| Pulso do CTA | `btn-pulse 2.2s ease-in-out infinite`; sombra 8px/24px → 8px/40px + anel de 6px | Contínuo; hover remove animação | CSS `.btn--primary` |
| Hover CTA | `translateY(-2px)`; 250ms; `cubic-bezier(.16,1,.3,1)` | Pointer hover; active volta a y=0 | CSS `.btn` |
| Hover badges | `translateY(-2px)` e borda laranja; 250ms, `ease` implícito | Pointer hover | CSS `.info-badge`/`.info-badge-zoom` |
| Reveal de cards | opacity 0→1; translateY 20px→0; 500ms `ease` = cubic-bezier(.25,.1,.25,1) | IntersectionObserver threshold .1; sem stagger e sem reset ao sair | `ScrollReveals.tsx`, `inline-03` |
| Cards de público mobile | `position:sticky`; top 84/96/108/120/132/144px | Scroll nativo, até 767px; não recebe reveal transform | CSS `.for-you-card:nth-child(n)` |
| CTA para oferta | `top = rect.top + scrollY - 24`; `behavior:smooth` | Clique em `button.btn` e `a[data-checkout]` | `CheckoutLink.tsx`, `inline-03` |
| Movimento carrossel | translateX = −(container.offsetWidth / visible) × índice; 450ms `cubic-bezier(.16,1,.3,1)` | Setas, dots ou swipe; índice limitado a `5 - visible` | `VideoCarousel.tsx`, `inline-08` |
| Breakpoints carrossel | 1 item até 640px; 2 até 1024px; 3 acima | Resize com debounce 150ms; recalcula largura e limita índice | `VideoCarousel.tsx` |
| Swipe | `abs(startX-endX) > 40` | Move exatamente um índice; sem momentum/autoplay | `VideoCarousel.tsx` |
| Overlay vídeo | opacity →0 em 250ms `ease`; remoção visual em 280ms | Primeiro clique; clique alcança player real | `VideoCarousel.tsx`, CSS `.video-play-overlay` |
| Player lazy | rootMargin `200px`; runtime `https://embed.voomly.com/embed/embed-build.js` | Primeira aproximação da seção, uma carga | `VideoCarousel.tsx`, `inline-05` |
| Player seek | CSS no shadow root; polling 1000ms | Desativa progress bar/handles como no alvo | `VideoCarousel.tsx`, `inline-06` |
| FAQ | max-height 0→400px e padding inferior 0→24px; 350ms `cubic-bezier(.16,1,.3,1)` | Clique/Enter/Space; fecha os demais | `FaqAccordion.tsx`, `inline-07` |
| Ícone FAQ | rotate(180deg); fundo laranja; 250ms `ease` implícito | Estado `.open` | CSS `.faq-item__icon` |
| Checkout lazy | setTimeout 1000ms após `load` | Depois do conteúdo crítico | `CheckoutEmbed.tsx`, `inline-04` |
| Loader checkout | spinner 1s linear infinite; opacity 400ms `ease` | iframe load esconde overlay | `CheckoutEmbed.tsx`/CSS |

## Easings e orquestração

`--ease-out = cubic-bezier(0.16,1,0.3,1)` e
`--ease-in-out = cubic-bezier(0.4,0,0.2,1)` são tokens do original. O token
`--ease-in-out` não deve ser confundido com o keyword CSS `ease-in-out` usado
pelo pulso. `ease` implícito usa a curva CSS padrão, sem aproximação por spring.

A rolagem suave é nativa: sua curva e duração dependem do navegador/distância.
Não foi atribuído um número fixo fictício. Não há SplitText, timeline GSAP,
stagger de letras, Lenis ou canvas observados nesta página.

O nome `spinning-seal` é um ID SVG; sozinho não comprova rotação. Regras de
marquee/bounce/float presentes em CSS de seções inativas não foram promovidas
a efeitos ativos nem reinventadas na implementação.

## Adaptações explícitas

`prefers-reduced-motion:reduce` desativa transições/animações e torna o scroll
instantâneo. Foco visível e teclas horizontais foram adicionados ao carrossel.
Esses comportamentos são melhorias do estudo, não observações do original.

No teste de pixels, transições/animações são desligadas **em ambos os sites**
após medir seus valores. Os testes funcionais e a captura REA de runtime usam
o estado normal. Igualdade de frame estático não prova igualdade temporal de
toda interação; reprodução Voomly depende da autorização do provedor externo.

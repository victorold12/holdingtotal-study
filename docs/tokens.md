# Tokens de design ? extra?dos da refer?ncia

Fonte literal: `reference/original.css`, primeiro bloco `:root` (62 vari?veis). Valores de breakpoint posteriores permanecem no CSS e est?o descritos abaixo. N?o h? escala fluida `--fluid-*` neste alvo.

| Token | Valor literal |
| --- | --- |
| `--color-bg` | `#0a0a0a` |
| `--color-bg-deep` | `#060606` |
| `--color-surface` | `#141414` |
| `--color-surface-2` | `#1c1c1c` |
| `--color-border` | `rgba(255,255,255,0.07)` |
| `--color-border-strong` | `rgba(255,255,255,0.14)` |
| `--color-brand` | `#fe7413` |
| `--color-brand-light` | `#ff8f3f` |
| `--color-brand-dark` | `#d45e0a` |
| `--color-brand-dim` | `rgba(254,116,19,0.10)` |
| `--color-brand-glow` | `rgba(254,116,19,0.22)` |
| `--color-cta` | `#fe7413` |
| `--color-cta-hover` | `#d45e0a` |
| `--color-cta-glow` | `rgba(254,116,19,0.35)` |
| `--color-danger` | `#ff453a` |
| `--color-success` | `#30d158` |
| `--color-text-primary` | `#ffffff` |
| `--color-text-secondary` | `#ffffff` |
| `--color-text-muted` | `#ffffff` |
| `--text-xs` | `0.75rem` |
| `--text-sm` | `0.875rem` |
| `--text-base` | `1rem` |
| `--text-lg` | `1.125rem` |
| `--text-xl` | `1.25rem` |
| `--text-2xl` | `1.5rem` |
| `--text-3xl` | `1.875rem` |
| `--text-4xl` | `2.25rem` |
| `--text-5xl` | `3rem` |
| `--text-6xl` | `3.75rem` |
| `--text-7xl` | `4.5rem` |
| `--sp-1` | `4px` |
| `--sp-2` | `8px` |
| `--sp-3` | `12px` |
| `--sp-4` | `16px` |
| `--sp-5` | `20px` |
| `--sp-6` | `24px` |
| `--sp-8` | `32px` |
| `--sp-10` | `40px` |
| `--sp-12` | `48px` |
| `--sp-16` | `64px` |
| `--sp-20` | `80px` |
| `--sp-24` | `96px` |
| `--sp-32` | `128px` |
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `20px` |
| `--radius-xl` | `32px` |
| `--radius-pill` | `9999px` |
| `--shadow-card` | `0 2px 8px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2)` |
| `--shadow-float` | `0 20px 60px rgba(0,0,0,0.5)` |
| `--shadow-brand` | `0 0 30px var(--color-brand-glow)` |
| `--ease-out` | `cubic-bezier(0.16,1,0.3,1)` |
| `--ease-in-out` | `cubic-bezier(0.4,0,0.2,1)` |
| `--duration-fast` | `150ms` |
| `--duration-base` | `250ms` |
| `--duration-slow` | `400ms` |
| `--container-max` | `1160px` |
| `--container-wide` | `1360px` |
| `--section-inline` | `var(--sp-5)` |
| `--section-pad-md` | `var(--sp-16)` |
| `--section-pad-lg` | `var(--sp-20)` |
| `--schedule-pad-bottom` | `var(--sp-20)` |

## Tipografia

Montserrat, Google Fonts, pesos 400 e 600. Fonte base: 16px; line-height do body 1.6; antialiasing `-webkit-font-smoothing:antialiased`. Hierarquia observada: hero desktop 2rem/1.3 e peso 600; at? 1025px recebe 1.35rem, com override desktop tamb?m come?ando em 1025px; subheadline 1.05rem desktop e .85rem mobile. As duas regras que se sobrep?em em 1025px foram preservadas na ordem original.

Escala nominal: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60 e 72px. At? 1024px, os tokens 5xl/6xl/7xl tornam-se 40/48/56px. N?o se usaram tamanhos Tailwind gen?ricos para substituir as m?tricas das classes.

## Espa?amento e geometria

Escala literal: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 e 128px. Apesar do coment?rio original cham?-la de grade de 8px, existem incrementos de 4px. Raios 8/12/20/32px e pill 9999px. Containers gerais 1160 e 1360px; hero usa max-width pr?prio de 1200px.

| Limiar literal | Efeito observado |
| --- | --- |
| at? 640px | Carrossel com um item; padding e t?tulo pr?prios |
| at? 767px | Cards de p?blico sticky; selo de pagamento compacto; corre??o de min-width |
| a partir de 768px | Gutter de 24px; padding de se??o aumenta |
| at? 768px | Regras adicionais do layout original coexistem na cascata |
| at? 1024px | Carrossel com dois itens; oferta em coluna ?nica; tipografia maior reduzida |
| at? 1025px | Hero centralizado, badges compactos |
| a partir de 1025px | Hero desktop com desk.webp, texto em 50% e overlay horizontal |
| a partir de 1200px | Gutter de 32px; se??es com mais espa?o vertical |

## Recursos e bibliotecas

| Origem | Stack/asset observado | Uso local |
| --- | --- | --- |
| HTML principal | HTML/CSS/JavaScript inline | Next.js 15.5.28, React/React DOM 19.1.10, TypeScript 5.8.3 |
| fonts.googleapis.com / fonts.gstatic.com | Montserrat 400/600 | Mesma folha Google Fonts |
| jsDelivr | Bootstrap Icons 1.11.3 | Mesmos glifos e CSS |
| holdingtotal.com.br/imersao | desk.webp, fundo celular-6.webp, logo-ht.webp, logo-hotmart-branca.svg, imagemfinal2.webp, marcio01.webp, imagem marcio frente.webp, marcio3.webp, fav-ht.webp | Rewrite local, sem bin?rios copiados em public |
| embed.voomly.com | Player real, URL p?blica sem vers?o fixa | Integra??o lazy; vers?o interna n?o inferida |
| pay.hotmart.com | Checkout externo | Iframe oficial, sem reconstruir backend |
| Build do estudo | Tailwind CSS 3.4.19, PostCSS 8.5.6, Autoprefixer 10.4.21 | Utilities e tokens; preflight desligado |

O arquivo `reference/network-urls.json` cont?m a lista observada de recursos. A exist?ncia de URLs/nomes de biblioteca n?o comprova execu??o de cada ramo. Analytics presentes na origem foram registrados como evid?ncia, sem serem incorporados diretamente ao estudo.

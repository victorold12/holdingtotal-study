# Validação — execução de 18/10/2026

Estado: **TESTED pelo implementador**. Não houve auditoria, certificação ou
aceite visual independente. Projeto isolado em
`C:\Users\VTz produti\holdingtotal-study`, preview somente loopback na porta 3081.

## Comandos e evidência

| Verificação | Resultado | Evidência |
| --- | --- | --- |
| `npm run typecheck` | exit 0 | TypeScript sem erros |
| `npm run build` | exit 0 | Next 15.5.28; `/`, `/imersao`, `/robots.txt` pré-renderizados |
| `npm run verify` | **71 PASS / 0 FAIL**, sem erro fatal | `reference/verification/checks.json` |
| `python scripts/pixel-diff.py` | **29/30 regiões exatas**; 13 pixels divergentes na restante | `reference/verification/pixel-diff.json` |
| Captura REA local | completa, mesma viewport 1440×1000 | `reference/rea-final.json`, `ev_11e9e135...` |

O bundle inicial da rota tem aproximadamente 107kB de First Load JS conforme
o relatório do build. Isso exclui scripts dos serviços externos; não é medição
de tempo de carregamento nem pontuação Lighthouse.

## Comparação exata de pixels

Chromium 153.0.8010.12, deviceScaleFactor 1. Mesmos viewports, fontes e assets,
com animações/transições normalizadas nos dois lados após medir os parâmetros.
As integrações externas são neutralizadas **apenas nessa comparação estática**
para não variar a altura de checkout, vídeo ou analytics. Não há tolerância de
cor ou máscara escondida no cálculo. O programa compara os canais RGB exatos.

| Região | 1440×1000 | 768×1024 | 390×844 |
| --- | --- | --- | --- |
| Hero | 0 pixels | 0 pixels | 0 pixels |
| Comparação | 0 | 0 | 0 |
| Cabeçalho dos depoimentos | 0 | 0 | 0 |
| Público e CTA | 0 | 0 | 0 |
| Card de benefícios da oferta | 0 | 0 | 0 |
| Garantia | 0 | 0 | 0 |
| Mentor | 0 | 0 | 0 |
| FAQ fechado | 0 | 0 | 0 |
| Seção final | 0 | 0 | **13 / 200460 (0,006485%)** |
| Footer | 0 | 0 | 0 |

Total comparado: **17.758.431 pixels**. Na diferença residual mobile, cada
pixel varia apenas 1 unidade em um canal RGB; não há deslocamento geométrico
observado nesse relatório. A causa exata dessas pequenas variações de pintura
não foi estabelecida. O resultado não deve ser arredondado para paridade
integral do site, nem generalizado para todos os estados animados.

As capturas por região e os deltas estão em `reference/verification/`.
Os screenshots `original-live-video.png` e `local-live-video.png` pertencem
ao cenário real, sem neutralização de serviços.

## Cobertura dos 71 checks

Nos viewports 1440, 768 e 390: ausência de overflow horizontal, composição,
noindex, curvas/durações CSS, FAQ abrir/fechar/exclusividade, setas e limite do
carrossel, número de itens, swipe e limiar de 40px, CTA com offset de 24px.
No celular também se mediram posição sticky e último offset de 144px.

Resize adicional em **320, 360, 640, 641, 767, 1024, 1025, 1200 e 1920px**:
largura sem overflow e contagem correta do carrossel. Teclado no FAQ e
`prefers-reduced-motion` também passaram. Swipe é uma sequência de TouchEvents
em Chromium com suporte touch emulado, não evidência de aparelho físico.

Integração local: runtime real do Voomly montado, URL Hotmart presente, pulso
2.2s ativo e reveal dos cards observado. São quatro checks de inicialização/
motion; **não são prova de reprodução ou pagamento**.

## Console e limites externos

Nos cenários controlados de layout/interação: **zero avisos/erros** registrados.
No cenário com os provedores reais houve mensagens externas, preservadas com
URL de origem em `checks.json`:

- Voomly: HTTP 403 em `https://waf.voomly.com/` e `Bot detected`, **tanto no
  original quanto no estudo**. Após clique: vídeo pausado, readyState 0,
  currentTime 0. Reprodução permanece **NOT_PROVEN / bloqueada no teste pelo
  provedor**. Não se tentou contornar a proteção.
- Hotmart: aviso `Hydration completed but contains mismatches` proveniente de
  `pay.hotmart.com/_nuxt/DyUQWlZJ.js` nos dois sites. No cenário local, dois
  HTTP 403 de `tracking-api.hotmart.com` também foram observados.

Não há evidência de erro de hidratação do aplicativo Next local nesses logs.
O console completo com integrações **não está limpo**. O estudo não altera
o código privado desses serviços para esconder seus erros.

Não foram testados pagamento, reembolso, cadastro, entrega por e-mail/WhatsApp,
outros navegadores, aparelhos físicos ou operação offline. Os serviços e seus
conteúdos podem mudar. Não há alegação de pixel-perfect para conteúdo interno
dos iframes/players, vídeo em reprodução ou todos os frames das animações.

## Correções feitas durante a validação

O DOM vivo foi usado para corrigir a interpretação de `</h2>` fechando um
`<h3>` no HTML do servidor. Antes disso, o botão da seção de público estava
dentro do título no JSX gerado. A comparação final dessa região passou a
zero pixels nos três viewports. Também se corrigiu a construção dos eventos
Touch do harness; a falha do harness não foi tratada como falha da interface.

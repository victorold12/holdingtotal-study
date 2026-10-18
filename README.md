# Holding Total — estudo técnico local

Implementação modular de https://holdingtotal.com.br/imersao/ em Next.js, React,
TypeScript e Tailwind CSS. Uso educacional local, com `noindex`, `nofollow`,
`noarchive` e `robots.txt` bloqueando indexação. Publicação no GitHub Pages
autorizada pelo proprietário em 18/10/2026.

## GitHub Pages

Site: https://victorold12.github.io/holdingtotal-study/

O workflow `.github/workflows/pages.yml` publica automaticamente os pushes em
`main`. Para gerar a mesma versão estática localmente, execute `npm run build:pages`.
O resultado fica em `out/`, com as rotas `/` e `/imersao/` sob o caminho do
repositório. Imagens permanecem hospedadas na origem e exigem Internet.
Capturas e relatórios de `reference/` são locais e não são enviados ao GitHub.
O modo local com `npm run build` e `npm start` continua disponível.

## Executar

Abra `INICIAR-SITE.bat`, ou, nesta pasta:

```powershell
npm install
npm run build
npm start
```

Preview: **http://127.0.0.1:3081/imersao** (também disponível em `/`).
O servidor escuta somente em `127.0.0.1`. A porta foi verificada antes de iniciar.
Imagens, fontes, player e checkout exigem Internet. Não foi feito pagamento,
cadastro ou submissão de dados ao checkout durante os testes.

## Documentação e código

- [Tokens de design](docs/tokens.md): paleta completa, tipografia, espaçamentos,
  raios, sombras e breakpoints, com fontes de evidência.
- [Arquitetura e DOM](docs/architecture.md): os 11 módulos e suas responsabilidades.
- [Motion ledger](docs/motion.md): efeito → valores literais → gatilho → implementação.
- [Resultados de validação](docs/validation.md): comandos, checks e diferenças de pixels.
- [Ponto de retomada](docs/RESUME.md): estado e comandos para continuar.

```text
src/app/                 layout, rotas, CSS original e adaptações separadas
src/generated/           11 módulos JSX, conteúdo e 62 tokens extraídos
src/components/          FAQ, carrossel, checkout, CTAs e entrada dos cards
scripts/                 extração reproduzível, testes de navegador e pixel diff
reference/index.html     DOM vivo capturado pelo REA, autoridade de estrutura
reference/server.html    HTML recebido por HTTP, preservado para comparação
reference/original.css   os três blocos CSS, na ordem original
reference/source-scripts scripts inline preservados como dados, sem execução
reference/verification/  capturas, métricas e relatórios JSON
```

## Escolhas de implementação

A referência é HTML/CSS/JavaScript próprio. Não há evidência de GSAP, Framer
Motion, Lenis, Rive ou WebGL na interface principal inspecionada. O estudo usa
React para estado/interações e preserva as curvas CSS literais. Adicionar uma
biblioteca de animação aqui aumentaria o custo sem reproduzir melhor o original.

Tailwind 3.4.19 está configurado com os tokens medidos e utilities. O reset
original permanece responsável pela base; `preflight` está desligado. A cascata
CSS foi preservada em vez de traduzida arbitrariamente para utilitários que
mudariam especificidade e ordem. Não se aplicou a escala fluida de outros sites:
este alvo usa `rem`, tokens em `px` e media queries próprias.

Os textos, SVGs, referências de imagem e IDs dos vídeos vêm da extração, sem
reescrita editorial. Datas e preços foram preservados como conteúdo do estudo,
sem afirmar que correspondem a uma oferta atual. Os scripts de analytics do
HTML original não fazem parte do aplicativo local. Os serviços externos
incorporados podem carregar scripts próprios.

## Observado × Inferido × Não reconstruído

**Observado:** DOM vivo, HTML de resposta, três blocos CSS, 62 tokens base,
Montserrat 400/600, Bootstrap Icons 1.11.3, 11 módulos, quatro perguntas,
cinco vídeos, parâmetros de hover/reveal/carrossel/FAQ, scroll sticky mobile,
integração Voomly e iframe Hotmart. Evidências em `reference/` e nos documentos.

**Adaptação de engenharia:** organização em componentes React, `<main>`, estado
controlado, foco visível, relações ARIA no FAQ, teclas no carrossel e suporte a
`prefers-reduced-motion`. O checkout valida origem e janela emissora exatas e
altura finita. Essas melhorias estão separadas e documentadas; não são
parâmetros supostamente extraídos. Não há easing ou duração inventados.

**Não reconstruído:** código privado/backend de Hotmart e Voomly, processamento
de pagamentos e analytics da origem. Player e checkout usam os serviços reais,
sem copiar suas implementações. A detecção de automação do Voomly pode bloquear
reprodução no navegador de teste; montagem do runtime não comprova playback.
Sem teste em aparelho físico ou aceite visual independente. Veja os resultados
literais de pixels, incluindo qualquer diferença residual, em `docs/validation.md`.

## Ferramentas REA usadas

| Operação | Evidência | Escopo |
| --- | --- | --- |
| `capture_browser_scenario` | `ev_85b53f6c2b35951d47c091066cde215545d6a60537bb6f624d43e400b155d7a1` | Original, 1440×1000, rede/corpos, DOM e PNG |
| `export_web_scripts` | `ev_a415ee32c07b2c9d8846eb29380fd67013b55c109dcdb9cd357095c06ef771fd` | Exportação dos corpos retidos; indisponibilidades no manifesto |
| `analyze_javascript_application` | `ev_315b7df97ce672a92b5be338bf4b9faab9bde984e29911309edd32e643a98a9f` | Nove scripts inline, análise estática; cobertura semântica limitada |
| `capture_browser_scenario` | `ev_11e9e1354604e9f054964e367d78379dac90b46288dc7d0c22310526cb479510` | Local, mesmo viewport e ambiente; captura completa |
| `export_evidence_bundle` | `reference/rea-final.json` | Registros completos para rastreabilidade |

A captura original ficou incompleta em parte dos corpos da rede por limites de
retenção de 64 KiB e concorrência do REA. Isso não prova ausência dos recursos.
Os comportamentos principais estão nos scripts inline e foram lidos
integralmente; não houve necessidade de baixar/executar bundles de analytics.

## Reproduzir extração e comparação

```powershell
# Pré-requisito do extrator: Python + beautifulsoup4.
npm run extract
npm run typecheck
npm run build
# Inicie o build atualizado antes de executar a verificação.
npm run verify
python scripts/pixel-diff.py
```

O verificador usa Chromium instalado em `AppData/Local/ms-playwright`; para outro
caminho, configure `STUDY_CHROME`. Pixel diff requer Pillow. Os testes comparam
referência e implementação nos mesmos viewports, normalizando animações CSS
para comparação estática. Fluxos de interação e integrações também são
exercitados separadamente. O resultado é `TESTED` pelo implementador; não é
certificação independente.

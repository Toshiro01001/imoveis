# Vistoria de segurança: Varanda Imóveis (site de demonstração)

Data: 08/11/2026. Vistoria feita por mim, Rodrigo Jr, com apoio de ferramenta, sobre o site estático publicado em `https://toshiro01001.github.io/imoveis/`.

## Resumo

Site 100% estático, sem servidor próprio, sem banco de dados, sem envio de dados e sem gravação no aparelho do visitante. O único risco real seria alguém confundir a demonstração com uma imobiliária de verdade, e a faixa permanente no topo, os textos de cada confirmação, a seção "Quem somos" (com telefone e endereço marcados como fictícios) e a seção "Como isto funciona" deixam claro que tudo é inventado.

## Content-Security-Policy

Declarada por `<meta http-equiv="Content-Security-Policy">` em `index.html`:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'
```

- Nenhum script inline, nenhum atributo `style`, nenhum `onclick`. Todo comportamento está em `js/app.js` e os dados em `js/dados.js`.
- O gráfico do simulador e os ícones são SVG criados por DOM (`createElementNS`) com atributos de apresentação (`fill`, `stroke`), que não dependem de `style-src`.
- `img-src data:` existe só por causa da seta do `<select>`, desenhada em SVG dentro do CSS.
- `connect-src 'none'`: o site não consegue fazer `fetch`, `XMLHttpRequest` nem WebSocket, nem que alguém injetasse código.
- `form-action 'none'`: mesmo que o JavaScript falhe, nenhum dos quatro formulários consegue enviar dados para lugar algum.
- `frame-ancestors` não funciona em meta tag, por isso foi deixado de fora. Em um site com servidor, iria no cabeçalho HTTP.
- O `404.html` tem `script-src 'none'`: a página de erro não roda script nenhum.

## Envio de dados

Nenhum. Os formulários (busca do hero, filtros, simulador e agendamento) são interceptados com `preventDefault()` e processados no navegador. Não há analytics, pixel, fonte externa, CDN ou iframe. O único link externo é `https://mileumalinhas.com.br`.

## Injeção de conteúdo

Todo texto do visitante (nome, telefone, observação, texto de busca) entra na página por `textContent` ou `createTextNode`. Não há `innerHTML` em `js/app.js`. O texto de busca é normalizado e usado só em comparação de strings.

## O que fica no navegador

Nada. Não há `localStorage`, `sessionStorage`, cookies nem IndexedDB. O teste automatizado confere que, após agendar uma visita, `localStorage.length + sessionStorage.length + document.cookie.length` é zero. A lista de comparação e o resumo da visita vivem em variáveis JavaScript e somem ao recarregar a página. Isso está dito na seção "Como isto funciona".

## Dependências

Nenhuma em produção. O site usa apenas HTML, CSS e JavaScript escritos à mão e duas fontes locais (Alegreya Sans e Source Sans 3, licença SIL OFL, arquivos de licença em `fonts/`). O Playwright é usado só nos testes, fora do site. As imagens provisórias foram geradas com Pillow fora do repositório.

## Dados no repositório

O repositório é público. Conferido: não há senhas, chaves de API, tokens, e-mails pessoais, telefones reais ou endereços reais. O telefone `(65) 0000-0000`, o endereço "Rua das Mangueiras, 410" e os seis bairros são fictícios e estão marcados como tal na tela. Os nomes dos corretores são primeiros nomes inventados. O arquivo `google20db0e080e71c701.html` é a verificação de propriedade do Google Search Console do dono do site e não é um segredo.

## Riscos residuais

1. Alguém confundir a demonstração com uma imobiliária real e tentar agendar visita ou fechar negócio. Mitigado pela faixa permanente, pelo texto do resumo ("nenhuma mensagem foi enviada"), pelo aviso do simulador e pelo rodapé.
2. O simulador de financiamento pode ser lido como proposta. Mitigado pelo aviso ao lado do resultado (não inclui seguros, taxas nem TR; a taxa depende do banco).
3. Meta tag de CSP não cobre `frame-ancestors`; o site pode ser colocado em um iframe por terceiros. Sem impacto prático, porque não há sessão nem ação sensível a sequestrar.
4. O GitHub Pages serve os cabeçalhos HTTP que quiser; não controlamos HSTS nem cabeçalhos de segurança além do que cabe na meta tag.

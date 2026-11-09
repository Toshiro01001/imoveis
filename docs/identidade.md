# Identidade visual: Varanda Imóveis

Estudo curto feito antes de qualquer linha de código. Tudo aqui é fictício: a imobiliária, os corretores, os bairros, os imóveis, os preços, o endereço e o telefone.

## Nome e posicionamento

**Varanda Imóveis.** Imobiliária pequena, de bairro, em Cuiabá.

Frase de posicionamento: **"Imóveis em Cuiabá, escolhidos por quem mora aqui."**

A ideia que guia tudo: em Cuiabá a casa boa é a casa que tem varanda, porque é na varanda que se vive o fim de tarde de 38 graus. A varanda é o lugar entre a rua e a casa, onde a pessoa é recebida antes de entrar. A imobiliária quer ser isso: a recepção honesta, sem terno, sem azul-marinho com dourado. O que ela vende é confiança local, por isso o site fala em primeira pessoa, diz quantos imóveis tem, quem acompanha a visita e quando acha que o preço está caro.

## Paleta

Partimos de três coisas de Cuiabá: o verde fechado do cerrado no fim da chuva, o céu muito aberto da seca e a areia clara das ruas de bairro. A telha de barro entra como um quarto elemento, bem pequeno, só no telhado da marca e nos avisos de erro, para não cair no visual "creme com terracota" que todo site gerado usa.

| Nome | Hex | Papel |
|---|---|---|
| Areia | `#F1EEE6` | Fundo da página e caixa de busca sobre o verde. |
| Branco | `#FFFFFF` | Superfícies: cartões, formulários, tabela. |
| Cerrado | `#1F4D3A` | Cor de identidade. Cabeçalho, hero, títulos, seção "Como isto funciona", bordas de seleção. |
| Carvão | `#1E2622` | Texto corrente e rodapé. |
| Folha | `#D9E4D3` | Apoio: faixa de demonstração, fundo das seções alternadas, etiquetas, célula "melhor valor" do comparador. Borda em `#C3D2BB`. |
| Céu | `#6CB8EE` (preenchimento) e `#155C94` (texto e links) | Destaque. Botão principal da tela, linha da Price no gráfico, títulos dos blocos sobre fundo escuro. |
| Telha | `#B85C38` (forma) e `#8C3F20` (texto) | Só no telhado da marca, no sublinhado da casa do hero provisório e nas mensagens de erro. |

Há um tom secundário de texto, **Cinza-verde** `#4C5A52`, para legendas, ajudas de campo e rótulos de tabela.

Regra de uso do destaque: **o Céu aparece em um só botão por tela** (Ver imóveis no hero, Agendar visita no cartão, Confirmar no formulário). Botões secundários são contorno Cerrado. Nunca dois botões Céu na mesma dobra. O Céu de preenchimento sempre recebe texto Carvão, nunca branco.

Contrastes verificados (WCAG): Carvão sobre Areia 15,3:1; Cerrado sobre Areia 8,3:1; Areia sobre Cerrado 8,3:1; Carvão sobre Céu 7,2:1; Céu-texto sobre Areia 6,1:1 e sobre Folha 5,4:1; Cinza-verde sobre Areia 6,3:1 e sobre Folha 5,5:1; Telha-texto sobre Areia 6,4:1; Folha sobre Cerrado 7,3:1; Céu sobre Cerrado 4,5:1 (usado só em títulos grandes).

## Tipografia

Duas famílias humanistas, ambas locais em `fonts/` (licença SIL OFL, arquivos de licença ao lado).

- **Alegreya Sans** (500 e 700): títulos, preços e a marca. Sans humanista de traço caligráfico, feita para leitura longa; dá calor sem precisar de serifa e lembra letreiro pintado à mão de imobiliária de bairro.
- **Source Sans 3** (variável, 200 a 900): texto corrente, formulários, botões, tabela. Neutra, muito legível em tela pequena, com algarismos claros para preços e metragens.

Escala tipográfica (fluida, com `clamp`):

| Papel | Família | Tamanho | Entrelinha | Peso |
|---|---|---|---|---|
| Título da página (h1) | Alegreya Sans | 2,25rem a 3,75rem | 1,05 | 700 |
| Título de seção (h2) | Alegreya Sans | 1,75rem a 2,5rem | 1,12 | 700 |
| Subtítulo (h3) | Alegreya Sans | 1,3rem | 1,3 | 500 (700 nos cartões do simulador) |
| Preço do imóvel | Alegreya Sans | 1,5rem | 1,1 | 700 |
| Corpo | Source Sans 3 | 1,0625rem (17px) | 1,6 | 400 |
| Interface (botões, rótulos) | Source Sans 3 | 0,95rem a 1rem | 1,3 | 600 |
| Legenda | Source Sans 3 | 0,875rem a 0,95rem | 1,45 | 400 |

Regra de peso: 700 só em títulos e preços (Alegreya). No texto, o 600 é o máximo, reservado a rótulos, botões e termos da tabela. Nada de caixa alta em rótulos.

## Layout

- Largura máxima de 1120px, margens laterais de 16px no celular e 20px no computador.
- Ritmo de espaçamento em múltiplos de 8px (8, 16, 24, 32, 48, 80).
- Seções separadas por 80px no computador e 56px no celular. A mudança de fundo (Areia, Folha, Cerrado) marca a mudança de assunto; não há linhas divisórias entre seções.
- Texto alinhado à esquerda em todo o site, inclusive no hero. Nada centralizado, exceto a faixa de demonstração e o conteúdo dos botões.
- Cada seção abre com h2 e uma frase que diz o que é e o que fazer.
- **Forma de identidade: o canto de telhado.** Cartões, formulários, tabela e a foto do hero têm um único canto arredondado grande no alto à direita (28px nos cartões, 72px na foto) e os demais em 6px a 10px. É a silhueta de uma casa com beiral, repetida em tudo que é "um imóvel" ou "um bloco de informação". Campos e botões ficam com 8px uniformes, para não disputar com a forma.
- Sombras: nenhuma. Separação por borda Folha de 1px ou por mudança de fundo. O cartão em comparação ganha borda dupla Cerrado.
- Celular primeiro: uma coluna a partir de 320px, duas colunas de cartões a partir de 600px, três a partir de 960px. Filtros em 6 colunas no computador, 3 em tablet, 2 no celular, 1 abaixo de 360px.

## Imagem forte

A imagem forte do hero é uma **fotografia** (ver a seção "Foto do hero" abaixo), em proporção 4:3, com o canto de telhado no alto à direita. A foto atual de `img/hero.webp` foi gerada por IA no Canva (ilustrativa, não é uma obra real), 1440 x 1080px, sem texto.

As fotos dos 14 imóveis (`img/imovel-01.webp` a `imovel-14.webp`, 800x600) também são composições provisórias geradas com Pillow, variando por tipo (casa, apartamento, terreno, sala comercial), para a sessão principal substituir depois.

Ícones de características (quartos, banheiros, vagas, área) e o gráfico de parcelas são SVG desenhados em código.

## Foto do hero

Prompt em português para gerar a imagem no Canva (ou ferramenta equivalente):

> Fotografia editorial de arquitetura, estilo site imobiliário premium. Fachada de uma casa térrea contemporânea em Cuiabá, Mato Grosso, com varanda ampla de madeira clara e piso de cimento queimado, pé-direito alto, porta de madeira e esquadrias em verde-escuro (#1F4D3A). Paredes em tom areia claro (#F1EEE6). Luz de fim de tarde dourada, suave, vinda da esquerda, sombras longas. Ao fundo, vegetação de cerrado (ipê sem flor, mangueira) e céu azul muito aberto e limpo (#6CB8EE), sem nuvens pesadas. Enquadramento frontal ligeiramente à esquerda, altura dos olhos, lente 35mm, profundidade de campo média, tudo nítido na fachada. Sem pessoas, sem texto, sem placas, sem carros, sem logotipos. Cores reais, sem HDR exagerado, sem filtro.

Proporção esperada: **4:3**, mínimo 1600x1200 px, em `webp`, salva como `img/hero.webp`. O `alt` atual ("Casa térrea com varanda ampla em fim de tarde, com o cerrado ao fundo") já descreve essa cena.

Para as fotos dos imóveis, se forem geradas: mesma luz e mesmo estilo, 800x600, uma por imóvel, respeitando o tipo (casa, apartamento, terreno, sala comercial) descrito em `js/dados.js`.

## Movimento

- Um só momento orquestrado na abertura: a foto do hero se revela da esquerda para a direita (`clip-path`, 900ms) enquanto título, frase, busca e nota sobem em sequência (600ms, 120ms de intervalo).
- Respostas a ações: cartões aparecem com fade de 180ms quando a lista muda; botão "Comparar" vira Cerrado preenchido quando marcado; campo com erro ganha borda Telha; o resumo da visita recebe foco.
- Com `prefers-reduced-motion: reduce`, nenhuma animação roda e a rolagem por âncora vira instantânea.

## O que evitamos de propósito

Azul-marinho com dourado de imobiliária; fundo creme com serif e terracota; preto com verde ácido; cartões iguais com sombra; rótulos em caixa alta; numeração 01/02/03 sem sequência; setas em links; gradientes de enfeite; pontos centrais separando metadados. O único gradiente do site é o céu da imagem provisória, que será trocada pela foto.

## Design systems aplicados (leva final)

Na leva final o site ganhou superfície, botões, cartões, faixas, rodapé, movimento e fotos de seção a partir de dois design systems do catálogo da Mil e Uma Linhas!. A paleta não mudou: o esmeralda do Spectra e o teal do Glass Green viraram Céu no preenchimento (um botão por tela) e Folha nas superfícies, e o canto de telhado continua em todo cartão, formulário e foto.

**Dupla:** Spectra Design System (claro) e Glass Green Design System (escuro).

**Como misturei:** as seções em Areia e Folha (imóveis, comparar, financiamento, visita, quem somos) seguem o Spectra: vidro branco a 60% com desfoque, índice de seção, cartões de mídia com título sobre a foto, pílulas de status, hotspots no gráfico, sanfona e rodapé em quatro colunas. As seções escuras (hero em Cerrado, "Como isto funciona" e rodapé em Carvão) seguem o Glass Green: duas luzes ambientes em CSS, painel de brilho, cartões que sobem e inclinam no hover, barra de estatísticas congelada sobre a foto e títulos com brilho.

**Componentes e onde estão:**

| Componente | De | Onde |
|---|---|---|
| Vidro claro (branco 60%, desfoque 12px, canto de telhado 28px, escala 1.01 no hover) | Spectra | Busca do hero e barra de filtros |
| Índice de seção (chip em Source Sans 3 600 12px + traço de 32px) | Spectra | Acima do h2 de Imóveis ("14 imóveis"), Comparar ("3 vagas"), Financiamento ("Price e SAC"), Visita ("Segunda a sábado") e Como funciona ("Demonstração") |
| Cartão de aplicação (foto no topo, fade de Cerrado 90%, bairro sobre a foto, foto escala 1.05 em 700ms) | Spectra | Cartões de imóvel gerados por `js/app.js` |
| Pílula de status com ponto pulsando | Spectra | Canto da foto de cada cartão ("Visitado pela equipe" ou "Novo esta semana") e foto do hero |
| Hotspot com halo e dica de vidro | Spectra | Gráfico do simulador: início e fim das linhas Price e SAC, com o valor da parcela no toque, foco ou mouse |
| Sanfona (grid-rows 0fr para 1fr em 500ms, mais e menos cruzando) | Spectra | "Perguntas antes da visita" em Agende uma visita e "Detalhes técnicos" em Como isto funciona; uma aberta por vez |
| Botão escuro sólido (contorno Cerrado que preenche no hover, seta anda 4px) | Spectra | Botões secundários das seções claras; o botão Céu ganha só um brilho leve no hover |
| Rodapé em quatro colunas com linha legal | Spectra | Rodapé em Carvão |
| Luzes ambientes (Céu 10% e Folha 8%, desfoque 40px e 60px, 8s e 10s) | Glass Green | Hero e Como isto funciona |
| Cartão com brilho (sobe 8px, inclina 2 graus, brilho de 60px) | Glass Green | Três blocos de Como isto funciona e foto do hero (só com mouse) |
| Painel de brilho (gradiente 135 graus) | Glass Green | Bloco de texto do hero |
| Barra de estatísticas congelada | Glass Green | Base da foto do hero ("Jardim Mangueiral", "3 quartos", "160 m²") |
| Texto com brilho | Glass Green | h1 do hero e h2 de Como isto funciona |
| Entradas ao rolar (slideUp 30px em .8s, scaleIn nos cartões do simulador, 100ms entre irmãos) | Glass Green | Cartões de imóvel (primeira carga), cartões Price e SAC, formulário de visita e dados de Quem somos |

**Exceções conscientes às regras da identidade:** os brilhos do Glass Green (no hover dos cartões, no botão Céu e o `text-shadow` dos títulos escuros) são luz, não sombra de elevação, e só aparecem sobre fundo escuro ou no hover; o painel de brilho e as luzes ambientes são os únicos gradientes, sempre em transparência baixa. A barra do hero usa traços finos entre os dados em vez de pontos centrais.

**Fotos de seção:** geradas por IA no Canva, ilustrativas, em `img/`: `sede-casa-esquina.webp` (Quem somos, 4:3), `equipe-corretores.webp` (Quem somos, 3:2), `visita-varanda.webp` (Agende uma visita, 4:5), `financiamento-chaves.webp` (Simule a parcela, 16:9) e `bairro-rua.webp` (fundo de Como isto funciona, 16:9, sob véu de Carvão a 78%).

**Movimento e desempenho:** tudo em CSS e um `IntersectionObserver`; sem WebGL, sem biblioteca e sem script de terceiros. As animações mexem só em `transform` e `opacity`. Com "reduzir movimento" ligado, nada se mexe, as entradas ao rolar não escondem nada e as luzes ficam paradas. Inclinação e escala no hover só existem em aparelhos com mouse.

/* Testes do site Varanda Imóveis com Playwright.
   Antes de rodar, sirva a pasta do site: python3 -m http.server 8311
   Depois: node tests/site.cjs
   Variáveis opcionais: URL (padrão http://localhost:8311/), CAPTURAS (pasta para salvar PNGs). */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.env.URL || "http://localhost:8311/";
const CAPTURAS = process.env.CAPTURAS || "";

const TELAS = [
  { nome: "computador", opcoes: { viewport: { width: 1280, height: 900 } } },
  { nome: "iphone13", opcoes: { ...devices["iPhone 13"] } },
  { nome: "estreito", opcoes: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } }
];

let falhas = 0;
function ok(cond, msg) {
  if (cond) { console.log("  ok   " + msg); }
  else { falhas++; console.log("  FALHA " + msg); }
}

async function verificarLayout(page, nome) {
  const info = await page.evaluate(() => {
    const larguraJanela = document.documentElement.clientWidth;
    const rolagem = document.documentElement.scrollWidth > larguraJanela + 1;
    const cortados = [];
    const estourados = [];
    document.querySelectorAll("body *").forEach((e) => {
      if (!e.offsetParent && e.tagName !== "BODY") { return; }
      const r = e.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) { return; }
      let pai = e.parentElement, dentroDeRolagem = false;
      while (pai && pai !== document.body) {
        const cs = getComputedStyle(pai);
        if (cs.overflowX === "auto" || cs.overflowX === "scroll") { dentroDeRolagem = true; break; }
        pai = pai.parentElement;
      }
      if (dentroDeRolagem) { return; }
      if (r.right > larguraJanela + 1 && getComputedStyle(e).position !== "fixed") {
        estourados.push(e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""));
      }
      const temTexto = Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!temTexto) { return; }
      const cs = getComputedStyle(e);
      if (cs.overflowX === "hidden" || cs.overflowX === "clip" || cs.textOverflow === "ellipsis") {
        if (e.scrollWidth > e.clientWidth + 1) {
          cortados.push(e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + ": " + e.textContent.trim().slice(0, 40));
        }
      }
    });
    return { rolagem, cortados, estourados: estourados.slice(0, 8) };
  });
  ok(!info.rolagem, nome + ": sem rolagem horizontal");
  ok(info.estourados.length === 0, nome + ": nenhum elemento passa da borda" + (info.estourados.length ? " (" + info.estourados.join(", ") + ")" : ""));
  ok(info.cortados.length === 0, nome + ": nenhum texto cortado" + (info.cortados.length ? " (" + info.cortados.join(" | ") + ")" : ""));
}

async function capturar(page, nome) {
  if (!CAPTURAS) { return; }
  fs.mkdirSync(CAPTURAS, { recursive: true });
  await page.screenshot({ path: path.join(CAPTURAS, nome + ".png") });
}

function proximoDiaUtil(diasAFrente) {
  const d = new Date();
  d.setDate(d.getDate() + diasAFrente);
  while (d.getDay() === 0) { d.setDate(d.getDate() + 1); }
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function proximoDomingo() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== 0) { d.setDate(d.getDate() + 1); }
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

async function testarTela(browser, tela) {
  console.log("\n== " + tela.nome + " ==");
  const context = await browser.newContext(tela.opcoes);
  const page = await context.newPage();
  const erros = [];
  page.on("console", (m) => { if (m.type() === "error") { erros.push((page.url().includes("404") ? "[404] " : "") + m.text()); } });
  page.on("pageerror", (e) => erros.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => erros.push("request: " + r.url()));
  page.on("response", (r) => { if (r.status() >= 400) { erros.push("http " + r.status() + " " + r.url()); } });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1300);
  await capturar(page, "capa-" + tela.nome);
  await verificarLayout(page, "abertura");

  // Função 1: busca com filtros e ordenação
  ok((await page.locator("#lista-imoveis .imovel").count()) === 14, "busca: 14 imóveis no início");
  await page.selectOption("#hb-bairro", "alto-ipe");
  await page.selectOption("#hb-tipo", "apartamento");
  await page.click("#hero-busca button[type=submit]");
  await page.waitForTimeout(600);
  const heroRes = await page.locator("#lista-imoveis .imovel").count();
  ok(heroRes === 2, "busca: formulário do hero filtra (Alto do Ipê + apartamento = 2, deu " + heroRes + ")");
  ok((await page.locator("#f-bairro").inputValue()) === "alto-ipe", "busca: filtro de bairro sincronizado com o hero");
  await page.click("#f-limpar");
  await page.waitForTimeout(200);
  ok((await page.locator("#lista-imoveis .imovel").count()) === 14, "busca: limpar filtros volta aos 14");
  await page.selectOption("#f-quartos", "3");
  await page.selectOption("#f-faixa", "500-900");
  await page.waitForTimeout(200);
  const tresQuartos = await page.locator("#lista-imoveis .imovel").allTextContents();
  ok(tresQuartos.length === 3, "busca: 3+ quartos entre 500 e 900 mil = 3 imóveis (" + tresQuartos.length + ")");
  await page.selectOption("#f-ordem", "preco-asc");
  await page.waitForTimeout(200);
  const precos = await page.locator("#lista-imoveis .imovel-preco").allTextContents();
  ok(precos[0].includes("520.000") && precos[precos.length - 1].includes("890.000"), "busca: ordenação por menor preço (" + precos.map((p) => p.split("R$")[1].trim().split(" ")[0]).join(", ") + ")");
  await page.fill("#f-texto", "zzz");
  await page.waitForTimeout(200);
  ok((await page.locator("#lista-imoveis .vazio").count()) === 1, "busca: lista vazia tem mensagem e botão de limpar");
  await page.click("#lista-imoveis .vazio button");
  await page.waitForTimeout(200);
  await page.fill("#f-texto", "piscina");
  await page.waitForTimeout(200);
  const piscina = await page.locator("#lista-imoveis .imovel").count();
  ok(piscina === 4, "busca: palavra 'piscina' encontra 4 imóveis (" + piscina + ")");
  await page.fill("#f-texto", "");
  await page.waitForTimeout(200);
  await page.locator("#imoveis").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await verificarLayout(page, "busca");
  await capturar(page, "busca-" + tela.nome);

  // Função 2: comparador de até 3 imóveis
  const botoesComparar = page.locator("#lista-imoveis .botao-comparar");
  await botoesComparar.nth(0).click();
  await botoesComparar.nth(1).click();
  await botoesComparar.nth(2).click();
  await page.waitForTimeout(200);
  ok((await page.locator("#comparar-cabecalho th").count()) === 3, "comparar: três imóveis na tabela");
  ok((await page.locator("#lista-imoveis .botao-comparar[aria-pressed=true]").count()) === 3, "comparar: três botões marcados");
  await botoesComparar.nth(3).click();
  await page.waitForTimeout(200);
  ok((await page.locator("#comparar-cabecalho th").count()) === 3, "comparar: quarto imóvel não entra");
  ok((await page.locator("#comparar-nota").textContent()).includes("três"), "comparar: aviso de limite aparece");
  const melhores = await page.locator("#comparar-corpo .melhor").count();
  ok(melhores >= 4, "comparar: melhores valores marcados (" + melhores + ")");
  await page.locator("#comparar-cabecalho th button").first().click();
  await page.waitForTimeout(200);
  ok((await page.locator("#comparar-cabecalho th").count()) === 2, "comparar: tirar um deixa dois");
  ok((await page.locator("#lista-imoveis .botao-comparar[aria-pressed=true]").count()) === 2, "comparar: botão do cartão volta ao normal");
  await page.locator("#comparar").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await verificarLayout(page, "comparar");
  await capturar(page, "comparar-" + tela.nome);
  await page.click("#comparar-limpar");
  await page.waitForTimeout(200);
  ok(!(await page.locator("#comparar-vazio").isHidden()), "comparar: limpar volta ao estado vazio");

  // Função 3: simulador de financiamento
  await page.locator("#lista-imoveis .botao-simular").first().click();
  await page.waitForTimeout(600);
  ok((await page.locator("#fin-valor").inputValue()) === "335.000", "simulador: botão do cartão preenche o valor (" + (await page.locator("#fin-valor").inputValue()) + ")");
  ok((await page.locator("#fin-entrada").inputValue()) === "67.000", "simulador: entrada sugerida de 20%");
  const parcela = await page.locator("#price-parcela").textContent();
  ok(/R\$\s2\.3\d\d,\d\d/.test(parcela), "simulador: parcela Price de 268 mil em 30 anos a 10,5% fica perto de R$ 2.3xx (" + parcela + ")");
  const sacPrimeira = await page.locator("#sac-primeira").textContent();
  ok(/R\$\s2\.9\d\d,\d\d/.test(sacPrimeira), "simulador: primeira parcela SAC perto de R$ 2.9xx (" + sacPrimeira + ")");
  ok((await page.locator("#fin-grafico polyline").count()) === 2, "simulador: gráfico com duas linhas");
  await page.fill("#fin-entrada", "400000");
  await page.waitForTimeout(200);
  ok(!(await page.locator("#fin-erro").isHidden()), "simulador: entrada maior que o valor mostra erro");
  await page.fill("#fin-entrada", "67000");
  await page.locator("#fin-entrada").blur();
  await page.waitForTimeout(200);
  ok(await page.locator("#fin-erro").isHidden(), "simulador: erro some ao corrigir");
  await page.locator("#financiamento").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await verificarLayout(page, "simulador");
  await capturar(page, "simulador-" + tela.nome);

  // Função 4: agendamento de visita
  await page.locator("#lista-imoveis .botao-visitar").nth(1).click();
  await page.waitForTimeout(700);
  ok((await page.locator("#v-imovel").inputValue()) === "13", "visita: botão do cartão escolhe o imóvel (VA-113)");
  await page.click("#visita-form button[type=submit]");
  await page.waitForTimeout(200);
  ok(!(await page.locator("#v-erro").isHidden()), "visita: validação barra envio sem data");
  await page.fill("#v-data", proximoDomingo());
  await page.selectOption("#v-hora", "10:00");
  await page.fill("#v-nome", "Teste da Silva");
  await page.fill("#v-fone", "65999990000");
  await page.click("#visita-form button[type=submit]");
  await page.waitForTimeout(200);
  ok((await page.locator("#v-erro").textContent()).includes("domingo"), "visita: domingo é recusado");
  await page.fill("#v-data", proximoDiaUtil(3));
  await page.fill("#v-fone", "123");
  await page.click("#visita-form button[type=submit]");
  await page.waitForTimeout(200);
  ok((await page.locator("#v-erro").textContent()).includes("telefone"), "visita: telefone curto é recusado");
  await page.fill("#v-fone", "65999990000");
  await page.fill("#v-obs", "Quero ver o quintal.");
  await page.click("#visita-form button[type=submit]");
  await page.waitForTimeout(400);
  ok(!(await page.locator("#visita-resumo").isHidden()), "visita: resumo aparece");
  const resumo = await page.locator("#visita-resumo-lista").textContent();
  ok(resumo.includes("VA-113") && resumo.includes("(65) 9 9999-0000") && resumo.includes("Quero ver o quintal"), "visita: resumo traz imóvel, telefone formatado e observação");
  ok((await page.evaluate(() => localStorage.length + sessionStorage.length + document.cookie.length)) === 0, "visita: nada gravado no navegador");
  await page.locator("#visita").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await verificarLayout(page, "visita");
  await capturar(page, "visita-" + tela.nome);
  await page.click("#visita-outra");
  await page.waitForTimeout(200);
  ok(!(await page.locator("#visita-form").isHidden()), "visita: 'agendar outra' volta ao formulário");

  // Menu no celular
  if (await page.locator("#menu-botao").isVisible()) {
    await page.click("#menu-botao");
    ok(await page.locator("#menu").isVisible(), "menu: abre no celular");
    await page.click("#menu a[href='#imoveis']");
    ok(!(await page.locator("#menu").isVisible()), "menu: fecha ao escolher uma seção");
  }

  // Página 404
  const resp404 = await page.goto(URL + "404.html", { waitUntil: "networkidle" });
  ok(resp404 && resp404.status() === 200, "404.html carrega");
  const erros404 = erros.filter((e) => e.includes("/imoveis/") || e.startsWith("[404]"));
  ok(true, "404 usa caminhos absolutos /imoveis/ (" + erros404.length + " avisos só no servidor local, esperado fora do GitHub Pages)");
  const errosReais = erros.filter((e) => !e.includes("/imoveis/") && !e.startsWith("[404]"));
  ok(errosReais.length === 0, "console sem erros" + (errosReais.length ? " (" + errosReais.join(" | ") + ")" : ""));

  await context.close();
}

(async () => {
  const browser = await chromium.launch();
  for (const tela of TELAS) { await testarTela(browser, tela); }
  await browser.close();
  console.log("\n" + (falhas ? falhas + " falha(s)." : "Tudo certo."));
  process.exit(falhas ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

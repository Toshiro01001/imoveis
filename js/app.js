/* Varanda Imóveis: toda a lógica do site. Nada sai do navegador, nada é gravado no aparelho. */
(function () {
  "use strict";
  var D = window.VARANDA;
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };
  var moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  var moedaCent = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var numero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

  function el(tag, attrs, filhos) {
    var e = document.createElement(tag);
    if (attrs) { Object.keys(attrs).forEach(function (k) {
      if (k === "texto") { e.textContent = attrs[k]; }
      else if (k === "classe") { e.className = attrs[k]; }
      else { e.setAttribute(k, attrs[k]); }
    }); }
    (filhos || []).forEach(function (f) { if (f) { e.appendChild(typeof f === "string" ? document.createTextNode(f) : f); } });
    return e;
  }
  function svgIcone(tipo) {
    var ns = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    var p = document.createElementNS(ns, "path");
    p.setAttribute("fill", "none"); p.setAttribute("stroke", "currentColor"); p.setAttribute("stroke-width", "1.8"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
    var d = {
      quartos: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M6 9V6h5v3M13 9V6h5v3",
      banheiros: "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM6 12V6a2 2 0 0 1 4 0M8 19l-1 2M16 19l1 2",
      vagas: "M5 16l1.5-5h11L19 16M5 16h14v3H5zM7 19v1M17 19v1M8 13h8",
      area: "M4 4h16v16H4zM4 9h5V4M15 20v-5h5"
    }[tipo];
    p.setAttribute("d", d);
    s.appendChild(p);
    return s;
  }
  function bairroNome(id) { var b = D.bairros.filter(function (x) { return x.id === id; })[0]; return b ? b.nome : id; }
  function porId(id) { return D.imoveis.filter(function (i) { return i.id === Number(id); })[0]; }
  function rolarPara(id) { var alvo = document.getElementById(id); if (alvo) { alvo.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); } }

  /* ---------- Menu no celular ---------- */
  var menuBotao = $("#menu-botao"), menu = $("#menu");
  menuBotao.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    menuBotao.setAttribute("aria-expanded", String(aberto));
  });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("aberto"); menuBotao.setAttribute("aria-expanded", "false"); }); });

  /* ---------- Entradas ao rolar (desligadas com "reduzir movimento") ---------- */
  var revelaAtivo = "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  var observador = null;
  if (revelaAtivo) {
    document.documentElement.classList.add("revela-js");
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("visivel"); observador.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -15% 0px" });
  }
  function revelar(n) { if (observador) { observador.observe(n); } else { n.classList.add("visivel"); } }
  $$(".revelar").forEach(revelar);

  /* ---------- Perguntas em sanfona: uma aberta por vez ---------- */
  $$("[data-sanfona]").forEach(function (grupo) {
    grupo.classList.add("sanfona-js");
    var botoes = $$(".sanfona-botao", grupo);
    botoes.forEach(function (b) {
      b.addEventListener("click", function () {
        var abrir = b.getAttribute("aria-expanded") !== "true";
        botoes.forEach(function (o) { o.setAttribute("aria-expanded", "false"); o.closest(".sanfona-item").classList.remove("aberto"); });
        if (abrir) { b.setAttribute("aria-expanded", "true"); b.closest(".sanfona-item").classList.add("aberto"); }
      });
    });
  });

  /* ---------- Preenche selects de bairro, faixa, imóvel e horário ---------- */
  ["#hb-bairro", "#f-bairro"].forEach(function (sel) {
    var s = $(sel);
    D.bairros.forEach(function (b) { s.appendChild(el("option", { value: b.id, texto: b.nome + " (" + b.regiao + ")" })); });
  });
  var fFaixa = $("#f-faixa");
  D.faixas.forEach(function (f) { fFaixa.appendChild(el("option", { value: f.id, texto: f.nome })); });
  var vImovel = $("#v-imovel");
  D.imoveis.forEach(function (i) { vImovel.appendChild(el("option", { value: String(i.id), texto: i.codigo + ": " + i.titulo + " (" + bairroNome(i.bairro) + ")" })); });
  var vHora = $("#v-hora");
  D.horarios.forEach(function (h) { vHora.appendChild(el("option", { value: h, texto: h })); });
  $("#hero-total").textContent = String(D.imoveis.length);

  /* ---------- Função 1: busca com filtros e ordenação ---------- */
  var lista = $("#lista-imoveis"), conta = $("#resultado-conta");
  var filtros = { texto: $("#f-texto"), bairro: $("#f-bairro"), tipo: $("#f-tipo"), quartos: $("#f-quartos"), faixa: $("#f-faixa"), ordem: $("#f-ordem") };
  var comparacao = [];

  function normalizar(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function filtrar() {
    var texto = normalizar(filtros.texto.value.trim());
    var bairro = filtros.bairro.value, tipo = filtros.tipo.value, quartos = Number(filtros.quartos.value);
    var faixa = D.faixas.filter(function (f) { return f.id === filtros.faixa.value; })[0] || D.faixas[0];
    var res = D.imoveis.filter(function (i) {
      if (bairro && i.bairro !== bairro) { return false; }
      if (tipo && i.tipo !== tipo) { return false; }
      if (quartos && i.quartos < quartos) { return false; }
      if (i.preco < faixa.min || i.preco >= faixa.max) { return false; }
      if (texto) {
        var palheiro = normalizar([i.codigo, i.titulo, i.destaque, bairroNome(i.bairro), D.tipos[i.tipo]].concat(i.extras).join(" "));
        if (palheiro.indexOf(texto) === -1) { return false; }
      }
      return true;
    });
    var ordem = filtros.ordem.value;
    res.sort(function (a, b) {
      if (ordem === "preco-asc") { return a.preco - b.preco; }
      if (ordem === "preco-desc") { return b.preco - a.preco; }
      if (ordem === "area-desc") { return b.area - a.area; }
      if (ordem === "m2-asc") { return a.preco / a.area - b.preco / b.area; }
      return b.id - a.id;
    });
    return res;
  }
  function cartao(i) {
    var li = el("li", { classe: "imovel" + (comparacao.indexOf(i.id) > -1 ? " na-comparacao" : ""), "data-id": String(i.id) });
    var img = el("img", { classe: "imovel-foto", src: "img/imovel-" + String(i.id).padStart(2, "0") + ".webp", width: "800", height: "600", loading: "lazy", decoding: "async", alt: D.tipos[i.tipo] + " em " + bairroNome(i.bairro) + ": " + i.titulo });
    var corpo = el("div", { classe: "imovel-corpo" });
    var preco = el("p", { classe: "imovel-preco", texto: moeda.format(i.preco) });
    preco.appendChild(el("small", { texto: moeda.format(Math.round(i.preco / i.area)) + " por m²" }));
    var titulo = el("h3", { texto: i.titulo });
    var local = el("p", { classe: "imovel-local" }, [el("span", { classe: "imovel-tipo", texto: D.tipos[i.tipo] }), "Zona " + D.bairros.filter(function (b) { return b.id === i.bairro; })[0].regiao.toLowerCase() + ". Código " + i.codigo]);
    var midia = el("div", { classe: "imovel-midia" });
    var novo = i.id > D.imoveis.length - 2;
    midia.appendChild(img);
    midia.appendChild(el("span", { classe: "pilula-status" }, [el("span", { classe: "pilula-ponto", "aria-hidden": "true" }), novo ? "Novo esta semana" : "Visitado pela equipe"]));
    midia.appendChild(el("p", { classe: "imovel-bairro", texto: bairroNome(i.bairro) }));
    var specs = el("ul", { classe: "imovel-specs", "aria-label": "Características" });
    if (i.quartos) { specs.appendChild(el("li", null, [svgIcone("quartos"), i.quartos + (i.quartos === 1 ? " quarto" : " quartos")])); }
    if (i.banheiros) { specs.appendChild(el("li", null, [svgIcone("banheiros"), i.banheiros + (i.banheiros === 1 ? " banheiro" : " banheiros")])); }
    if (i.vagas) { specs.appendChild(el("li", null, [svgIcone("vagas"), i.vagas + (i.vagas === 1 ? " vaga" : " vagas")])); }
    specs.appendChild(el("li", null, [svgIcone("area"), numero.format(i.area) + " m²"]));
    var mais = el("details", { classe: "imovel-mais" });
    mais.appendChild(el("summary", { texto: "Mais sobre o imóvel" }));
    mais.appendChild(el("p", { texto: i.destaque }));
    var extras = el("ul", { classe: "imovel-extras" });
    i.extras.forEach(function (x) { extras.appendChild(el("li", { texto: x })); });
    mais.appendChild(extras);
    mais.appendChild(el("p", { classe: "imovel-custos", texto: (i.condominio ? "Condomínio " + moeda.format(i.condominio) + " por mês. " : "Sem condomínio. ") + "IPTU " + moeda.format(i.iptu) + " por ano." }));
    var acoes = el("div", { classe: "imovel-acoes" });
    var emComp = comparacao.indexOf(i.id) > -1;
    var bComp = el("button", { type: "button", classe: "botao botao-leve botao-mini botao-comparar", "aria-pressed": String(emComp), texto: emComp ? "Na comparação" : "Comparar" });
    bComp.addEventListener("click", function () { alternarComparacao(i.id); });
    var bSim = el("button", { type: "button", classe: "botao botao-leve botao-mini botao-simular", texto: "Simular parcela" });
    bSim.addEventListener("click", function () { preencherSimulador(i.preco); rolarPara("financiamento"); });
    var bVis = el("button", { type: "button", classe: "botao botao-destaque botao-mini botao-visitar", texto: "Agendar visita" });
    bVis.addEventListener("click", function () { vImovel.value = String(i.id); rolarPara("visita"); setTimeout(function () { $("#v-data").focus({ preventScroll: true }); }, 500); });
    acoes.appendChild(bComp); acoes.appendChild(bSim); acoes.appendChild(bVis);
    [preco, titulo, local, specs, mais, acoes].forEach(function (n) { corpo.appendChild(n); });
    li.appendChild(midia); li.appendChild(corpo);
    return li;
  }
  var ultimaAssinatura = "", primeiroDesenho = true;
  function desenharLista(forcar) {
    /* O evento "change" dispara ao sair do campo mesmo sem mudança nova; se nada mudou, não redesenha
       (um redesenho entre o toque e o soltar faria o botão sumir debaixo do dedo). */
    var assinatura = Object.keys(filtros).map(function (k) { return filtros[k].value; }).join("|");
    if (forcar !== true && assinatura === ultimaAssinatura) { return; }
    ultimaAssinatura = assinatura;
    var res = filtrar();
    lista.textContent = "";
    if (!res.length) {
      var vazio = el("li", { classe: "vazio" });
      vazio.appendChild(el("p", { texto: "Nenhum imóvel combina com esses filtros. Tente tirar a faixa de preço ou escolher outro bairro." }));
      var b = el("button", { type: "button", classe: "botao botao-leve", texto: "Limpar filtros" });
      b.addEventListener("click", limparFiltros);
      vazio.appendChild(b);
      lista.appendChild(vazio);
    } else {
      res.forEach(function (i) {
        var c = cartao(i);
        if (primeiroDesenho && observador) { c.classList.add("revelar"); revelar(c); }
        lista.appendChild(c);
      });
      primeiroDesenho = false;
    }
    conta.textContent = res.length === 0 ? "Nenhum imóvel encontrado." : res.length === 1 ? "1 imóvel encontrado." : res.length + " imóveis encontrados.";
  }
  function limparFiltros() {
    filtros.texto.value = ""; filtros.bairro.value = ""; filtros.tipo.value = ""; filtros.quartos.value = "0"; filtros.faixa.value = ""; filtros.ordem.value = "relevancia";
    desenharLista();
  }
  Object.keys(filtros).forEach(function (k) {
    filtros[k].addEventListener("input", desenharLista);
    filtros[k].addEventListener("change", desenharLista);
  });
  $("#filtros").addEventListener("submit", function (e) { e.preventDefault(); desenharLista(); });
  $("#filtros").addEventListener("reset", function (e) { e.preventDefault(); limparFiltros(); });
  $("#hero-busca").addEventListener("submit", function (e) {
    e.preventDefault();
    filtros.bairro.value = $("#hb-bairro").value;
    filtros.tipo.value = $("#hb-tipo").value;
    desenharLista();
    rolarPara("imoveis");
  });

  /* ---------- Função 2: comparador de até 3 imóveis ---------- */
  var compVazio = $("#comparar-vazio"), compArea = $("#comparar-area"), compCab = $("#comparar-cabecalho"), compCorpo = $("#comparar-corpo"), compNota = $("#comparar-nota");
  function alternarComparacao(id) {
    var pos = comparacao.indexOf(id);
    if (pos > -1) { comparacao.splice(pos, 1); }
    else if (comparacao.length >= 3) { compNota.textContent = "Já há três imóveis na comparação. Tire um para incluir outro."; rolarPara("comparar"); return; }
    else { comparacao.push(id); }
    atualizarBotoesComparar();
    desenharComparacao();
  }
  function atualizarBotoesComparar() {
    $$("#lista-imoveis .imovel").forEach(function (li) {
      var id = Number(li.getAttribute("data-id")), em = comparacao.indexOf(id) > -1;
      li.classList.toggle("na-comparacao", em);
      var b = $(".botao-comparar", li);
      b.setAttribute("aria-pressed", String(em));
      b.textContent = em ? "Na comparação" : "Comparar";
    });
  }
  function desenharComparacao() {
    var itens = comparacao.map(porId);
    compVazio.hidden = itens.length > 0;
    compArea.hidden = itens.length === 0;
    compCab.textContent = ""; compCorpo.textContent = "";
    if (!itens.length) { compNota.textContent = ""; return; }
    compCab.appendChild(el("td", { texto: "" }));
    itens.forEach(function (i) {
      var th = el("th", { scope: "col" });
      var bloco = el("div", { classe: "comparar-imovel" });
      bloco.appendChild(el("img", { src: "img/imovel-" + String(i.id).padStart(2, "0") + ".webp", width: "800", height: "600", alt: "" }));
      bloco.appendChild(el("strong", { texto: i.titulo }));
      var b = el("button", { type: "button", classe: "botao botao-leve botao-mini", texto: "Tirar", "aria-label": "Tirar " + i.codigo + " da comparação" });
      b.addEventListener("click", function () { alternarComparacao(i.id); });
      bloco.appendChild(b);
      th.appendChild(bloco);
      compCab.appendChild(th);
    });
    var linhas = [
      { nome: "Preço", v: function (i) { return i.preco; }, f: moeda.format, melhor: "min" },
      { nome: "Preço por m²", v: function (i) { return Math.round(i.preco / i.area); }, f: moeda.format, melhor: "min" },
      { nome: "Tipo", v: function (i) { return D.tipos[i.tipo]; } },
      { nome: "Bairro", v: function (i) { return bairroNome(i.bairro); } },
      { nome: "Área", v: function (i) { return i.area; }, f: function (v) { return numero.format(v) + " m²"; }, melhor: "max" },
      { nome: "Quartos", v: function (i) { return i.quartos; }, f: function (v) { return v || "Não se aplica"; }, melhor: "max" },
      { nome: "Banheiros", v: function (i) { return i.banheiros; }, f: function (v) { return v || "Não se aplica"; }, melhor: "max" },
      { nome: "Vagas", v: function (i) { return i.vagas; }, f: function (v) { return v || "Nenhuma"; }, melhor: "max" },
      { nome: "Condomínio", v: function (i) { return i.condominio; }, f: function (v) { return v ? moeda.format(v) + " por mês" : "Não tem"; }, melhor: "min" },
      { nome: "IPTU", v: function (i) { return i.iptu; }, f: function (v) { return moeda.format(v) + " por ano"; }, melhor: "min" },
      { nome: "Destaques", v: function (i) { return i.extras.join(", "); } }
    ];
    linhas.forEach(function (l) {
      var tr = el("tr");
      tr.appendChild(el("th", { scope: "row", texto: l.nome }));
      var valores = itens.map(l.v);
      var alvo = null;
      if (l.melhor && itens.length > 1) {
        var nums = valores.filter(function (v) { return typeof v === "number" && v > 0; });
        if (nums.length > 1) { alvo = l.melhor === "min" ? Math.min.apply(null, nums) : Math.max.apply(null, nums); }
        if (nums.every(function (v) { return v === alvo; })) { alvo = null; }
      }
      valores.forEach(function (v) {
        var td = el("td", { texto: l.f ? l.f(v) : String(v) });
        if (alvo !== null && v === alvo) { td.classList.add("melhor"); }
        tr.appendChild(td);
      });
      compCorpo.appendChild(tr);
    });
    compNota.textContent = itens.length === 1 ? "Escolha mais um ou dois imóveis para comparar de verdade." : itens.length + " imóveis na comparação. Em verde, o melhor valor de cada linha.";
  }
  $("#comparar-limpar").addEventListener("click", function () { comparacao = []; atualizarBotoesComparar(); desenharComparacao(); });

  /* ---------- Função 3: simulador de financiamento (Price e SAC) ---------- */
  var finValor = $("#fin-valor"), finEntrada = $("#fin-entrada"), finPrazo = $("#fin-prazo"), finTaxa = $("#fin-taxa"), finErro = $("#fin-erro");
  function lerReais(campo) { var n = Number(String(campo.value).replace(/[^\d]/g, "")); return isNaN(n) ? 0 : n; }
  function formatarCampoReais(campo) { var n = lerReais(campo); campo.value = n ? numero.format(n) : ""; }
  function preencherSimulador(preco) {
    finValor.value = numero.format(preco);
    finEntrada.value = numero.format(Math.round(preco * 0.2));
    simular();
  }
  function price(V, i, n) { return i === 0 ? V / n : V * i / (1 - Math.pow(1 + i, -n)); }
  function simular() {
    var V = lerReais(finValor), E = lerReais(finEntrada), anos = Number(finPrazo.value), taxaAno = Number(finTaxa.value);
    $("#fin-prazo-saida").textContent = anos + (anos === 1 ? " ano" : " anos");
    $("#fin-entrada-pct").textContent = V ? Math.round(E / V * 100) + "% do valor" : "";
    finValor.classList.remove("campo-invalido"); finEntrada.classList.remove("campo-invalido"); finTaxa.classList.remove("campo-invalido");
    var erro = "";
    if (V < 50000) { erro = "Informe o valor do imóvel (a partir de R$ 50 mil)."; finValor.classList.add("campo-invalido"); }
    else if (E >= V) { erro = "A entrada precisa ser menor que o valor do imóvel."; finEntrada.classList.add("campo-invalido"); }
    else if (E < V * 0.1) { erro = "Os bancos costumam pedir ao menos 10% de entrada (" + moeda.format(Math.ceil(V * 0.1)) + ")."; finEntrada.classList.add("campo-invalido"); }
    else if (!(taxaAno >= 1 && taxaAno <= 30)) { erro = "Informe uma taxa anual entre 1% e 30%."; finTaxa.classList.add("campo-invalido"); }
    finErro.hidden = !erro;
    finErro.textContent = erro;
    if (erro) { return; }
    var F = V - E, n = anos * 12, i = Math.pow(1 + taxaAno / 100, 1 / 12) - 1;
    var parcelaPrice = price(F, i, n), totalPrice = parcelaPrice * n;
    var amort = F / n, primeiraSac = amort + F * i, ultimaSac = amort + amort * i;
    var totalSac = 0, saldo = F, seriePrice = [], serieSac = [];
    for (var k = 1; k <= n; k++) {
      var pSac = amort + saldo * i; totalSac += pSac; saldo -= amort;
      if (k === 1 || k % 12 === 0 || k === n) { seriePrice.push(parcelaPrice); serieSac.push(pSac); }
    }
    $("#price-parcela").textContent = moedaCent.format(parcelaPrice);
    $("#price-financiado").textContent = moeda.format(F);
    $("#price-total").textContent = moeda.format(totalPrice);
    $("#price-juros").textContent = moeda.format(totalPrice - F);
    $("#price-renda").textContent = moeda.format(parcelaPrice / 0.3);
    $("#sac-primeira").textContent = moedaCent.format(primeiraSac);
    $("#sac-ultima").textContent = moedaCent.format(ultimaSac);
    $("#sac-financiado").textContent = moeda.format(F);
    $("#sac-total").textContent = moeda.format(totalSac);
    $("#sac-juros").textContent = moeda.format(totalSac - F);
    $("#sac-renda").textContent = moeda.format(primeiraSac / 0.3);
    desenharGrafico(seriePrice, serieSac, anos);
  }
  function desenharGrafico(sPrice, sSac, anos) {
    var caixa = $("#fin-grafico");
    var ns = "http://www.w3.org/2000/svg", W = Math.max(300, Math.min(600, caixa.clientWidth - 40)), H = Math.round(W / 3), mx = 46, my = 16;
    var max = Math.max.apply(null, sSac.concat(sPrice)) * 1.08, pontos = sSac.length;
    var cx = function (k) { return mx + (W - mx - 8) * (k / Math.max(1, pontos - 1)); };
    var cy = function (v) { return H - my - (H - 2 * my) * (v / max); };
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Gráfico: a parcela Price fica em " + moeda.format(sPrice[0]) + " o tempo todo; a parcela SAC começa em " + moeda.format(sSac[0]) + " e termina em " + moeda.format(sSac[pontos - 1]) + ".");
    [0, 0.5, 1].forEach(function (t) {
      var y = cy(max * t);
      var g = document.createElementNS(ns, "line");
      g.setAttribute("x1", mx); g.setAttribute("x2", W - 8); g.setAttribute("y1", y); g.setAttribute("y2", y); g.setAttribute("stroke", "#C3D2BB"); g.setAttribute("stroke-width", "1");
      svg.appendChild(g);
      var tx = document.createElementNS(ns, "text");
      tx.setAttribute("x", mx - 6); tx.setAttribute("y", y + 4); tx.setAttribute("text-anchor", "end"); tx.setAttribute("font-size", "12"); tx.setAttribute("fill", "#4C5A52");
      tx.textContent = t === 0 ? "0" : Math.round(max * t / 1000) + " mil";
      svg.appendChild(tx);
    });
    [[sPrice, "#155C94"], [sSac, "#1F4D3A"]].forEach(function (par) {
      var p = document.createElementNS(ns, "polyline");
      p.setAttribute("points", par[0].map(function (v, k) { return cx(k) + "," + cy(v); }).join(" "));
      p.setAttribute("fill", "none"); p.setAttribute("stroke", par[1]); p.setAttribute("stroke-width", "3"); p.setAttribute("stroke-linejoin", "round"); p.setAttribute("stroke-linecap", "round");
      svg.appendChild(p);
    });
    /* Hotspots: início e fim de cada linha, com o valor da parcela no toque, no foco ou ao passar o mouse */
    var pontosChave = [
      { s: sPrice, k: 0, nome: "Price, mês 1", lado: "abaixo" },
      { s: sPrice, k: pontos - 1, nome: "Price, último mês", lado: "acima" },
      { s: sSac, k: 0, nome: "SAC, mês 1", lado: "direita" },
      { s: sSac, k: pontos - 1, nome: "SAC, último mês", lado: "esquerda" }
    ];
    var hotspots = [];
    pontosChave.forEach(function (pc) {
      var x = cx(pc.k), y = cy(pc.s[pc.k]), texto = pc.nome + ": " + moedaCent.format(pc.s[pc.k]);
      var g = document.createElementNS(ns, "g");
      g.setAttribute("class", "hotspot"); g.setAttribute("tabindex", "0"); g.setAttribute("role", "img"); g.setAttribute("aria-label", texto);
      var alvo = document.createElementNS(ns, "circle");
      alvo.setAttribute("cx", x); alvo.setAttribute("cy", y); alvo.setAttribute("r", "14"); alvo.setAttribute("class", "hs-alvo");
      var halo = document.createElementNS(ns, "circle");
      halo.setAttribute("cx", x); halo.setAttribute("cy", y); halo.setAttribute("r", "5"); halo.setAttribute("class", "hs-halo");
      var nucleo = document.createElementNS(ns, "circle");
      nucleo.setAttribute("cx", x); nucleo.setAttribute("cy", y); nucleo.setAttribute("r", "5"); nucleo.setAttribute("class", "hs-nucleo");
      nucleo.setAttribute("stroke", pc.s === sPrice ? "#155C94" : "#1F4D3A");
      var largura = Math.round(texto.length * 6.4 + 18), altura = 24;
      var tx0 = pc.lado === "esquerda" || pc.lado === "acima" ? x - largura - 10 : x + 10;
      var ty0 = pc.lado === "acima" ? y - altura - 10 : pc.lado === "abaixo" ? y + 10 : y - altura / 2;
      tx0 = Math.max(2, Math.min(W - largura - 2, tx0)); ty0 = Math.max(2, Math.min(H - altura - 2, ty0));
      var dica = document.createElementNS(ns, "g");
      dica.setAttribute("class", "hs-dica"); dica.setAttribute("aria-hidden", "true");
      var caixaDica = document.createElementNS(ns, "rect");
      caixaDica.setAttribute("x", tx0); caixaDica.setAttribute("y", ty0); caixaDica.setAttribute("width", largura); caixaDica.setAttribute("height", altura); caixaDica.setAttribute("rx", "6");
      var t = document.createElementNS(ns, "text");
      t.setAttribute("x", tx0 + 9); t.setAttribute("y", ty0 + 16); t.setAttribute("font-size", "12");
      t.textContent = texto;
      dica.appendChild(caixaDica); dica.appendChild(t);
      [alvo, halo, nucleo, dica].forEach(function (n) { g.appendChild(n); });
      hotspots.push(g);
    });
    var rot = document.createElementNS(ns, "text");
    rot.setAttribute("x", W - 8); rot.setAttribute("y", H - 2); rot.setAttribute("text-anchor", "end"); rot.setAttribute("font-size", "12"); rot.setAttribute("fill", "#4C5A52");
    rot.textContent = "ano 1 até ano " + anos;
    svg.appendChild(rot);
    hotspots.forEach(function (g) { svg.appendChild(g); });
    caixa.textContent = "";
    caixa.appendChild(svg);
    var leg = el("ul", { classe: "fin-grafico-legenda" });
    leg.appendChild(el("li", { classe: "leg-price", texto: "Price: parcela fixa" }));
    leg.appendChild(el("li", { classe: "leg-sac", texto: "SAC: parcela cai todo ano" }));
    caixa.appendChild(leg);
  }
  [finValor, finEntrada].forEach(function (c) {
    c.addEventListener("input", simular);
    c.addEventListener("blur", function () { formatarCampoReais(c); simular(); });
  });
  finPrazo.addEventListener("input", simular);
  finTaxa.addEventListener("input", simular);
  $("#fin-form").addEventListener("submit", function (e) { e.preventDefault(); simular(); });
  var esperaRedimensionar;
  window.addEventListener("resize", function () { clearTimeout(esperaRedimensionar); esperaRedimensionar = setTimeout(simular, 150); });

  /* ---------- Função 4: agendamento de visita (valida e mostra resumo, sem enviar) ---------- */
  var vForm = $("#visita-form"), vErro = $("#v-erro"), vResumo = $("#visita-resumo"), vLista = $("#visita-resumo-lista"), vData = $("#v-data");
  function dataISO(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  var amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
  var limite = new Date(); limite.setDate(limite.getDate() + 60);
  vData.min = dataISO(amanha); vData.max = dataISO(limite);
  function telefoneValido(s) { var d = s.replace(/\D/g, ""); return (d.length === 10 || d.length === 11) && /^[1-9]{2}/.test(d); }
  function formatarTelefone(s) { var d = s.replace(/\D/g, ""); return d.length === 11 ? "(" + d.slice(0, 2) + ") " + d.slice(2, 3) + " " + d.slice(3, 7) + "-" + d.slice(7) : "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6); }
  vForm.addEventListener("submit", function (e) {
    e.preventDefault();
    $$(".campo-invalido", vForm).forEach(function (c) { c.classList.remove("campo-invalido"); });
    var imovel = porId(vImovel.value), data = vData.value, hora = vHora.value, nome = $("#v-nome").value.trim(), fone = $("#v-fone").value.trim();
    var contato = (vForm.querySelector("input[name=contato]:checked") || {}).value || "WhatsApp", obs = $("#v-obs").value.trim();
    var erro = "", campo = null;
    var dia = data ? new Date(data + "T12:00:00") : null;
    if (!imovel) { erro = "Escolha o imóvel que quer visitar."; campo = vImovel; }
    else if (!data || isNaN(dia)) { erro = "Escolha o dia da visita."; campo = vData; }
    else if (data < vData.min || data > vData.max) { erro = "Escolha um dia entre amanhã e os próximos 60 dias."; campo = vData; }
    else if (dia.getDay() === 0) { erro = "Não visitamos aos domingos. Escolha de segunda a sábado."; campo = vData; }
    else if (!hora) { erro = "Escolha um horário."; campo = vHora; }
    else if (nome.length < 3 || nome.indexOf(" ") === -1) { erro = "Escreva seu nome e sobrenome."; campo = $("#v-nome"); }
    else if (!telefoneValido(fone)) { erro = "Informe um telefone com DDD, com 10 ou 11 números."; campo = $("#v-fone"); }
    vErro.hidden = !erro; vErro.textContent = erro;
    if (erro) { campo.classList.add("campo-invalido"); campo.focus(); return; }
    var corretor = D.corretores[imovel.id % D.corretores.length];
    var protocolo = "VIS-" + data.replace(/-/g, "").slice(2) + "-" + String(imovel.id).padStart(2, "0") + hora.replace(":", "");
    vLista.textContent = "";
    [["Protocolo", protocolo], ["Imóvel", imovel.codigo + ", " + imovel.titulo], ["Endereço", bairroNome(imovel.bairro) + ", Cuiabá (o número é passado na confirmação)"],
      ["Quando", dia.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }) + ", às " + hora], ["Quem acompanha", corretor + ", corretor(a) da Varanda"],
      ["Visitante", nome], ["Contato", formatarTelefone(fone) + " por " + contato], obs ? ["Observação", obs] : null
    ].forEach(function (par) { if (par) { vLista.appendChild(el("div", null, [el("dt", { texto: par[0] }), el("dd", { texto: par[1] })])); } });
    vForm.hidden = true; vResumo.hidden = false; vResumo.focus();
  });
  $("#visita-outra").addEventListener("click", function () {
    vForm.reset(); vForm.hidden = false; vResumo.hidden = true; vErro.hidden = true; vImovel.focus();
  });

  /* ---------- Início ---------- */
  desenharLista();
  desenharComparacao();
  simular();
})();

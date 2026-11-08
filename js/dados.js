/* Dados fictícios da Varanda Imóveis. Nenhum imóvel, bairro, preço ou pessoa aqui existe de verdade.
   Os bairros são inventados para a demonstração. Preços em reais. Área em m². */
window.VARANDA = {
  bairros: [
    { id: "mangueiral", nome: "Jardim Mangueiral", regiao: "Norte" },
    { id: "alto-ipe", nome: "Alto do Ipê", regiao: "Leste" },
    { id: "cerradinho", nome: "Vila Cerradinho", regiao: "Sul" },
    { id: "morada-rio", nome: "Morada do Rio", regiao: "Oeste" },
    { id: "araras", nome: "Recanto das Araras", regiao: "Norte" },
    { id: "pequi", nome: "Bosque do Pequi", regiao: "Leste" }
  ],
  tipos: { casa: "Casa", apartamento: "Apartamento", terreno: "Terreno", comercial: "Sala comercial" },
  imoveis: [
    { id: 1, codigo: "VA-101", tipo: "casa", titulo: "Casa térrea com varanda e quintal", bairro: "mangueiral", preco: 520000, quartos: 3, banheiros: 2, vagas: 2, area: 160, condominio: 0, iptu: 1400, destaque: "Varanda de 18 m² voltada para o quintal, pé-direito alto e cozinha integrada.", extras: ["Varanda", "Quintal", "Área gourmet"] },
    { id: 2, codigo: "VA-102", tipo: "apartamento", titulo: "Apartamento de 2 quartos com sacada", bairro: "alto-ipe", preco: 365000, quartos: 2, banheiros: 1, vagas: 1, area: 62, condominio: 480, iptu: 720, destaque: "Sol da manhã, sacada com churrasqueira e prédio com piscina e salão de festas.", extras: ["Sacada", "Piscina", "Portaria 24h"] },
    { id: 3, codigo: "VA-103", tipo: "casa", titulo: "Casa em condomínio fechado, 4 suítes", bairro: "araras", preco: 1250000, quartos: 4, banheiros: 5, vagas: 4, area: 310, condominio: 950, iptu: 3900, destaque: "Lote de 600 m², piscina com deck, escritório e dependência completa.", extras: ["Piscina", "Condomínio fechado", "Escritório"] },
    { id: 4, codigo: "VA-104", tipo: "terreno", titulo: "Terreno plano de 450 m² em rua asfaltada", bairro: "cerradinho", preco: 180000, quartos: 0, banheiros: 0, vagas: 0, area: 450, condominio: 0, iptu: 520, destaque: "Frente de 15 metros, água e energia na calçada, pronto para construir.", extras: ["Plano", "Asfalto", "Escritura registrada"] },
    { id: 5, codigo: "VA-105", tipo: "apartamento", titulo: "Apartamento de 3 quartos, andar alto", bairro: "morada-rio", preco: 690000, quartos: 3, banheiros: 2, vagas: 2, area: 98, condominio: 820, iptu: 1500, destaque: "Vista livre para o rio no fim da tarde, varanda gourmet e duas vagas cobertas.", extras: ["Vista para o rio", "Varanda gourmet", "Academia"] },
    { id: 6, codigo: "VA-106", tipo: "casa", titulo: "Casa compacta de 2 quartos, ideal para começar", bairro: "cerradinho", preco: 298000, quartos: 2, banheiros: 1, vagas: 1, area: 78, condominio: 0, iptu: 610, destaque: "Reformada em 2025, com forro novo, piso porcelanato e muro alto.", extras: ["Reformada", "Quintal", "Aceita financiamento"] },
    { id: 7, codigo: "VA-107", tipo: "comercial", titulo: "Sala comercial de 48 m² com recepção", bairro: "alto-ipe", preco: 310000, quartos: 0, banheiros: 1, vagas: 1, area: 48, condominio: 560, iptu: 980, destaque: "Prédio com gerador, elevador e estacionamento para clientes.", extras: ["Elevador", "Gerador", "Estacionamento"] },
    { id: 8, codigo: "VA-108", tipo: "apartamento", titulo: "Studio mobiliado perto do centro", bairro: "morada-rio", preco: 245000, quartos: 1, banheiros: 1, vagas: 1, area: 34, condominio: 390, iptu: 450, destaque: "Entregue com móveis planejados, ar-condicionado e lavanderia coletiva.", extras: ["Mobiliado", "Ar-condicionado", "Lavanderia"] },
    { id: 9, codigo: "VA-109", tipo: "casa", titulo: "Sobrado de 3 suítes com piscina", bairro: "pequi", preco: 890000, quartos: 3, banheiros: 4, vagas: 3, area: 240, condominio: 0, iptu: 2600, destaque: "Piscina aquecida, área gourmet coberta e energia solar instalada.", extras: ["Piscina", "Energia solar", "Área gourmet"] },
    { id: 10, codigo: "VA-110", tipo: "terreno", titulo: "Chácara de 2.000 m² com pomar", bairro: "araras", preco: 420000, quartos: 0, banheiros: 0, vagas: 0, area: 2000, condominio: 0, iptu: 380, destaque: "Mangueiras, pequizeiros e poço artesiano. A 20 minutos do centro.", extras: ["Pomar", "Poço artesiano", "Cercada"] },
    { id: 11, codigo: "VA-111", tipo: "apartamento", titulo: "Cobertura duplex de 3 quartos", bairro: "alto-ipe", preco: 1480000, quartos: 3, banheiros: 3, vagas: 3, area: 210, condominio: 1350, iptu: 4100, destaque: "Terraço privativo com piscina, vista aberta da cidade e elevador que abre dentro do apartamento.", extras: ["Terraço", "Piscina privativa", "3 vagas"] },
    { id: 12, codigo: "VA-112", tipo: "casa", titulo: "Casa de 3 quartos com edícula", bairro: "mangueiral", preco: 445000, quartos: 3, banheiros: 2, vagas: 2, area: 140, condominio: 0, iptu: 1100, destaque: "Edícula nos fundos com banheiro, boa para renda extra ou escritório.", extras: ["Edícula", "Quintal", "Aceita financiamento"] },
    { id: 13, codigo: "VA-113", tipo: "comercial", titulo: "Loja de rua com 120 m² e mezanino", bairro: "cerradinho", preco: 560000, quartos: 0, banheiros: 2, vagas: 2, area: 120, condominio: 0, iptu: 2100, destaque: "Esquina movimentada, porta de vidro ampla e depósito no mezanino.", extras: ["Esquina", "Mezanino", "Depósito"] },
    { id: 14, codigo: "VA-114", tipo: "casa", titulo: "Casa de 2 quartos com varanda na frente", bairro: "pequi", preco: 335000, quartos: 2, banheiros: 2, vagas: 2, area: 95, condominio: 0, iptu: 760, destaque: "Varanda ampla na frente, garagem coberta e quintal com churrasqueira.", extras: ["Varanda", "Churrasqueira", "Garagem coberta"] }
  ],
  faixas: [
    { id: "", nome: "Qualquer preço", min: 0, max: Infinity },
    { id: "ate-300", nome: "Até R$ 300 mil", min: 0, max: 300000 },
    { id: "300-500", nome: "R$ 300 mil a R$ 500 mil", min: 300000, max: 500000 },
    { id: "500-900", nome: "R$ 500 mil a R$ 900 mil", min: 500000, max: 900000 },
    { id: "acima-900", nome: "Acima de R$ 900 mil", min: 900000, max: Infinity }
  ],
  horarios: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  corretores: ["Ana Lúcia", "Bruno", "Celina"]
};

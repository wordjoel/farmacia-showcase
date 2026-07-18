// ─────────────────────────────────────────────────────────────────────────────
// CATARINA FASHION OUTLET — Data Model
// Cores oficiais: terracota (#c45a2c), dourado areia (#e8c87a), creme (#fdf8f0)
// Mapa vetorial 2D baseado no mapa oficial de setores do outlet.
// ─────────────────────────────────────────────────────────────────────────────

export interface Store {
  id: string;
  name: string;
  logo?: string;        // emoji fallback
  categoria: string;
  setor: Sector;
  horario: string;
  telefone?: string;
  promo?: string;
  // Position on the SVG viewBox (0..1000 x 0..700)
  x: number;
  y: number;
  destaque?: boolean;
}

export type Sector =
  | "Vermelho"
  | "Azul"
  | "Amarelo"
  | "Lilás"
  | "Branco";

export interface RouteStep {
  icon: string;
  text: string;
}

export interface ParkingZone {
  code: string;
  color: string;
  label: string;
}

export const SETORES: { id: Sector; color: string }[] = [
  { id: "Vermelho", color: "#e85a4f" },
  { id: "Azul",     color: "#2b7cbf" },
  { id: "Amarelo",  color: "#e7b12b" },
  { id: "Lilás",    color: "#b068a8" },
  { id: "Branco",   color: "#ffffff" },
];

export const CATEGORIAS: { id: string; label: string; emoji: string }[] = [
  { id: "moda-feminina", label: "Moda Feminina", emoji: "👗" },
  { id: "moda-masculina", label: "Moda Masculina", emoji: "👔" },
  { id: "infantil",      label: "Infantil",      emoji: "🧒" },
  { id: "esporte",       label: "Esporte",       emoji: "🏃" },
  { id: "calcados",      label: "Calçados",      emoji: "👟" },
  { id: "luxo",          label: "Luxo",          emoji: "💎" },
  { id: "acessorios",    label: "Acessórios",    emoji: "👜" },
  { id: "cosmeticos",    label: "Cosméticos",    emoji: "💄" },
  { id: "alimentacao",   label: "Alimentação",   emoji: "🍽️" },
  { id: "servicos",      label: "Serviços",      emoji: "⚙️" },
];

export const SERVICOS: { id: string; label: string; emoji: string }[] = [
  { id: "banheiros",   label: "Banheiros",         emoji: "🚻" },
  { id: "elevadores",  label: "Elevadores",        emoji: "🛗" },
  { id: "caixas",      label: "Caixas Eletrônicos", emoji: "🏧" },
  { id: "farmacia",    label: "Farmácia",          emoji: "💊" },
  { id: "informacoes", label: "Informações",       emoji: "ℹ️" },
  { id: "bebedouros",  label: "Bebedouros",        emoji: "💧" },
  { id: "pcd",         label: "Banheiros PCD",     emoji: "♿" },
];

export const STORES: Store[] = [
  // Setor Vermelho (top)
  { id: "nike",        name: "Nike",         logo: "✔️", categoria: "esporte",       setor: "Vermelho", horario: "10h–22h", promo: "Até 50% OFF", x: 500, y: 290, destaque: true },
  { id: "adidas",      name: "Adidas",       logo: "▲", categoria: "esporte",       setor: "Vermelho", horario: "10h–22h", promo: "Peças a partir de R$79", x: 560, y: 260 },
  { id: "puma",        name: "Puma",         logo: "p", categoria: "esporte",       setor: "Vermelho", horario: "10h–22h", x: 740, y: 235 },
  { id: "polo-wear",   name: "Polo Wear",    logo: "P", categoria: "moda-masculina", setor: "Vermelho", horario: "10h–22h", x: 648, y: 86 },
  { id: "natura",      name: "Natura",       logo: "N", categoria: "cosmeticos",    setor: "Vermelho", horario: "10h–22h", x: 740, y: 150 },
  { id: "hering",      name: "Hering",       logo: "H", categoria: "moda-masculina", setor: "Vermelho", horario: "10h–22h", x: 770, y: 195 },
  { id: "calvin-klein",name: "Calvin Klein", logo: "CK",categoria: "moda-masculina", setor: "Vermelho", horario: "10h–22h", x: 685, y: 245, destaque: true },
  { id: "michael-kors",name: "Michael Kors", logo: "MK",categoria: "luxo",         setor: "Azul",     horario: "10h–22h", promo: "Outlet -40%", x: 800, y: 340 },
  { id: "lacoste",     name: "Lacoste",      logo: "🐊",categoria: "moda-masculina", setor: "Amarelo",  horario: "10h–22h", x: 580, y: 470 },
  { id: "outback",     name: "Outback",      logo: "🥩",categoria: "alimentacao",   setor: "Amarelo",  horario: "11h–23h", x: 640, y: 438 },
  { id: "gucci",       name: "Gucci",        logo: "G", categoria: "luxo",         setor: "Amarelo",  horario: "10h–22h", x: 728, y: 510 },
  { id: "dolce-gabbana",name:"Dolce & Gabbana", logo:"D&G", categoria:"luxo",      setor: "Amarelo",  horario: "10h–22h", x: 790, y: 440 },
  { id: "armani",      name: "Armani",       logo: "A", categoria: "luxo",         setor: "Amarelo",  horario: "10h–22h", x: 685, y: 560 },
  { id: "burberry",    name: "Burberry",     logo: "B", categoria: "luxo",         setor: "Branco",   horario: "10h–22h", x: 580, y: 600 },
  { id: "diesel",      name: "Diesel",       logo: "D", categoria: "moda-masculina", setor: "Lilás",  horario: "10h–22h", x: 320, y: 370 },
  { id: "levi-s",      name: "Levi's",       logo: "L", categoria: "moda-masculina", setor: "Lilás",  horario: "10h–22h", x: 260, y: 475, promo: "2 por R$199" },
  { id: "zara",        name: "Zara",         logo: "Z", categoria: "moda-feminina",  setor: "Lilás",  horario: "10h–22h", x: 220, y: 525 },
  { id: "renner",      name: "Renner",       logo: "R", categoria: "moda-feminina",  setor: "Branco", horario: "10h–22h", x: 285, y: 670 },
  { id: "nike-praca",  name: "Nike",         logo: "✔️", categoria: "esporte",       setor: "Amarelo", horario: "10h–22h", x: 480, y: 408 },
  { id: "centro",      name: "Praça Central",logo: "🌳", categoria: "servicos",      setor: "Branco",  horario: "-",      x: 160, y: 615 },
];

// Entrada principal (origem das rotas quando o visitante chega)
export const ENTRANCE = { x: 480, y: 700, label: "Entrada Principal" };

// Pontos de interesse / serviços
export const POIS: { id: string; label: string; emoji: string; x: number; y: number }[] = [
  { id: "banheiro-m",  label: "Banheiro Masc.", emoji: "🚹", x: 680, y: 130 },
  { id: "banheiro-f",  label: "Banheiro Fem.",  emoji: "🚺", x: 635, y: 130 },
  { id: "banheiro-pcd",label: "Banheiro PCD",   emoji: "♿", x: 718, y: 130 },
  { id: "info",        label: "Informações",    emoji: "ℹ️", x: 480, y: 205 },
  { id: "atm",         label: "Caixa 24h",      emoji: "🏧", x: 760, y: 260 },
  { id: "elevador",    label: "Elevador",       emoji: "🛗", x: 422, y: 345 },
  { id: "bebedouro",   label: "Bebedouro",      emoji: "💧", x: 380, y: 440 },
  { id: "farmacia",    label: "Farmácia",       emoji: "💊", x: 270, y: 635 },
];

// Zonas de estacionamento
export const PARKING_ZONES: ParkingZone[] = [
  { code: "A", color: "#2b7cbf", label: "Azul" },
  { code: "B", color: "#e85a4f", label: "Vermelha" },
  { code: "C", color: "#e7b12b", label: "Amarela" },
  { code: "D", color: "#b068a8", label: "Lilás" },
  { code: "E", color: "#2da96a", label: "Verde" },
];

// Rotas pré-definidas a partir da entrada (pontos-chave de waypoints,
// o SVG interpola a rota; o texto dos passos é gerado com base no destino)
export function buildRouteTo(target: { x: number; y: number }, name: string): { points: string; steps: RouteStep[]; meters: number } {
  // Desenha uma rota curva/suave da entrada até a loja via waypoints hardcoded
  // (simulação de roteamento indoor, suficiente para demo)
  const start = ENTRANCE;
  const mid = {
    x: start.x + (target.x - start.x) * 0.45,
    y: start.y - 220 + Math.sin((target.x - start.x) * 0.01) * 40,
  };
  const bend = {
    x: target.x * 0.6 + mid.x * 0.4,
    y: target.y + 80,
  };
  const points = `${start.x},${start.y} ${mid.x},${mid.y} ${bend.x},${bend.y} ${target.x},${target.y + 18}`;
  const meters = Math.round(
    Math.hypot(mid.x - start.x, mid.y - start.y) * 0.6 +
    Math.hypot(bend.x - mid.x, bend.y - mid.y) * 0.6 +
    Math.hypot(target.x - bend.x, target.y + 18 - bend.y) * 0.6,
  );
  const steps: RouteStep[] = [
    { icon: "🚶", text: `Você está na entrada` },
    { icon: "⬆️", text: `Siga em frente por ${Math.round(meters * 0.4)} metros` },
    { icon: "↪️", text: `Vire à ${target.x > start.x ? "direita" : "esquerda"}` },
    { icon: "📍", text: `${name} estará à sua ${target.x > start.x ? "direita" : "esquerda"}` },
  ];
  return { points, steps, meters };
}

// Ofertas / promoções do modo ocioso
export const ADS = [
  { id: 1, tipo: "image", titulo: "Queima de Estoque Nike", subtitulo: "Até 60% OFF em tênis selecionados", emoji: "✔️", bg: "from-red-500 to-orange-500" },
  { id: 2, tipo: "image", titulo: "Festival de Gastronomia", subtitulo: "Outback, Viena e mais com 20% OFF", emoji: "🥩", bg: "from-amber-700 to-red-600" },
  { id: 3, tipo: "image", titulo: "Luxo com desconto",     subtitulo: "Michael Kors, Armani e Burberry -40%", emoji: "💎", bg: "from-stone-800 to-amber-600" },
  { id: 4, tipo: "image", titulo: "Happy Hour 18h–20h",   subtitulo: "Chopp em dobro na Praça de Alimentação", emoji: "🍺", bg: "from-emerald-600 to-teal-700" },
];

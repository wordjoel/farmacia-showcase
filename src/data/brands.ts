export type Brand = {
  id: string;
  label: string;
  name: string;
  tagline: string;
  emblem: string;
  labelColor: string;
  nameColor: string;
  emblemBg: string;
  sideButton: string;
  accentButton: string;
  micButton: string;
};

export const BRANDS: Brand[] = [
  {
    id: "generic",
    label: "",
    name: "Sua Farmácia",
    tagline: "Marca neutra para demonstração",
    emblem: "⚕️",
    labelColor: "text-slate-400",
    nameColor: "text-slate-800",
    emblemBg: "from-slate-500 to-slate-700",
    sideButton: "bg-slate-800",
    accentButton: "bg-emerald-600",
    micButton: "bg-blue-600",
  },
  {
    id: "sao-joao",
    label: "Farmácias",
    name: "São João",
    tagline: "Rede São João",
    emblem: "💊",
    labelColor: "text-red-600",
    nameColor: "text-blue-900",
    emblemBg: "from-green-400 to-blue-500",
    sideButton: "bg-blue-900",
    accentButton: "bg-green-600",
    micButton: "bg-blue-600",
  },
  {
    id: "drogasil",
    label: "",
    name: "Drogasil",
    tagline: "Rede Drogasil",
    emblem: "➕",
    labelColor: "text-red-600",
    nameColor: "text-red-600",
    emblemBg: "from-red-500 to-red-700",
    sideButton: "bg-red-700",
    accentButton: "bg-red-900",
    micButton: "bg-red-600",
  },
  {
    id: "droga-raia",
    label: "",
    name: "Droga Raia",
    tagline: "Rede Droga Raia",
    emblem: "🌿",
    labelColor: "text-emerald-600",
    nameColor: "text-emerald-700",
    emblemBg: "from-emerald-500 to-teal-600",
    sideButton: "bg-emerald-800",
    accentButton: "bg-lime-600",
    micButton: "bg-emerald-600",
  },
  {
    id: "pague-menos",
    label: "",
    name: "Pague Menos",
    tagline: "Rede Pague Menos",
    emblem: "❤️",
    labelColor: "text-orange-600",
    nameColor: "text-red-600",
    emblemBg: "from-orange-500 to-red-600",
    sideButton: "bg-red-700",
    accentButton: "bg-orange-500",
    micButton: "bg-red-600",
  },
  {
    id: "panvel",
    label: "",
    name: "Panvel",
    tagline: "Rede Panvel",
    emblem: "⭐",
    labelColor: "text-orange-500",
    nameColor: "text-slate-800",
    emblemBg: "from-orange-400 to-red-500",
    sideButton: "bg-slate-900",
    accentButton: "bg-orange-500",
    micButton: "bg-orange-500",
  },
  {
    id: "eurofarma",
    label: "",
    name: "Eurofarma",
    tagline: "Eurofarma",
    emblem: "🧬",
    labelColor: "text-blue-600",
    nameColor: "text-indigo-900",
    emblemBg: "from-indigo-500 to-blue-700",
    sideButton: "bg-indigo-800",
    accentButton: "bg-sky-600",
    micButton: "bg-indigo-600",
  },
];

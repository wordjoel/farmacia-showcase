export type PromoFlyer = {
  id: string;
  productId: string;
  image: string;
  brand: string;
  name: string;
  tag: string;
  accent: string;
};

export const PROMO_FLYERS: PromoFlyer[] = [
  {
    id: "benegrip-multi",
    productId: "benegrip-multi",
    image: "/images/promos/benegrip-multi.jpg",
    brand: "Benegrip",
    name: "Benegrip Multi",
    tag: "Zero açúcares · uso a partir de 2 anos",
    accent: "from-orange-500 to-green-600",
  },
  {
    id: "flogoral-ache",
    productId: "flogoral-ache",
    image: "/images/promos/flogoral-ache.jpg",
    brand: "Achê",
    name: "Flogoral Benzidamina",
    tag: "Alívio rápido da dor de garganta · 12 pastilhas",
    accent: "from-pink-600 to-green-600",
  },
  {
    id: "strepsils",
    productId: "strepsils",
    image: "/images/promos/strepsils.jpg",
    brand: "Strepsils",
    name: "Strepsils Flurbiprofeno",
    tag: "Ação a partir de 4h · mel e limão",
    accent: "from-red-600 to-amber-500",
  },
  {
    id: "listerine-cool-mint",
    productId: "listerine-cool-mint",
    image: "/images/promos/listerine-cool-mint.jpg",
    brand: "Listerine",
    name: "Listerine Cool Mint 500ml",
    tag: "Elimina até 99,9% dos germes · leve mais, pague menos",
    accent: "from-teal-500 to-cyan-600",
  },
  {
    id: "oralb-fio-dental",
    productId: "oralb-fio-dental",
    image: "/images/promos/oralb-fio-dental.jpg",
    brand: "Oral-B",
    name: "Oral-B Expert Fio Dental",
    tag: "Limpeza profunda · 45 unidades",
    accent: "from-blue-700 to-blue-900",
  },
  {
    id: "pampers-supersec",
    productId: "pampers-supersec",
    image: "/images/promos/pampers-supersec.jpg",
    brand: "Pampers",
    name: "Pampers Supersec XXG",
    tag: "Agora maior · 30 fraldas",
    accent: "from-red-600 to-teal-600",
  },
];

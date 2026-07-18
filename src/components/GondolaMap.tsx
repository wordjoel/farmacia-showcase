import type { AthosProduct } from "../data/athos";

interface Props {
  selected?: AthosProduct;
  compact?: boolean;
}

export default function GondolaMap({ selected, compact = false }: Props) {
  const target = selected ? { x: selected.x, y: selected.y } : { x: 240, y: 150 };
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-blue-100 bg-[#f5f9fc] shadow-inner">
      <svg viewBox="0 0 1000 520" className="w-full" role="img" aria-label="Mapa interativo das gôndolas">
        <defs>
          <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8fbfd" />
            <stop offset="1" stopColor="#e6eff5" />
          </linearGradient>
          <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#17324d" floodOpacity="0.12" />
          </filter>
        </defs>
        <rect width="1000" height="520" fill="url(#floor)" />
        <rect x="18" y="18" width="964" height="484" rx="28" fill="none" stroke="#c9dce9" strokeWidth="3" />
        <rect x="42" y="430" width="916" height="48" rx="14" fill="#dbe8ef" />
        <text x="500" y="460" textAnchor="middle" fill="#6e8797" fontSize="16" fontWeight="700">ENTRADA PRINCIPAL</text>

        {/* department bands */}
        <rect x="48" y="46" width="214" height="60" rx="14" fill="#dbeafe" />
        <text x="155" y="82" textAnchor="middle" fill="#1d4ed8" fontSize="16" fontWeight="800">MIP / ANALGÉSICOS</text>
        <rect x="284" y="46" width="214" height="60" rx="14" fill="#dcfce7" />
        <text x="391" y="82" textAnchor="middle" fill="#15803d" fontSize="16" fontWeight="800">VITAMINAS</text>
        <rect x="520" y="46" width="214" height="60" rx="14" fill="#fef3c7" />
        <text x="627" y="82" textAnchor="middle" fill="#a16207" fontSize="16" fontWeight="800">INFANTIL</text>
        <rect x="756" y="46" width="196" height="60" rx="14" fill="#f3e8ff" />
        <text x="854" y="82" textAnchor="middle" fill="#7e22ce" fontSize="16" fontWeight="800">DERMO</text>

        {/* aisles */}
        {[0, 1, 2, 3].map((index) => {
          const x = 86 + index * 226;
          const aisle = String.fromCharCode(65 + index);
          return (
            <g key={aisle} filter="url(#mapShadow)">
              <rect x={x} y="140" width="170" height="214" rx="16" fill={index % 2 ? "#ffffff" : "#f8fcff"} stroke="#b9d3e2" strokeWidth="2" />
              {Array.from({ length: 4 }).map((_, shelf) => (
                <rect key={shelf} x={x + 18} y={158 + shelf * 45} width="134" height="18" rx="6" fill={index === 0 ? "#bfdbfe" : index === 1 ? "#bbf7d0" : index === 2 ? "#fde68a" : "#e9d5ff"} />
              ))}
              <text x={x + 85} y="388" textAnchor="middle" fill="#26465c" fontSize="18" fontWeight="900">CORREDOR {aisle}</text>
            </g>
          );
        })}

        {/* route from entrance to selected gondola */}
        <path d={`M 500 430 C 500 400, ${target.x} 390, ${target.x} ${target.y + 28}`} fill="none" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" opacity="0.12" />
        <path d={`M 500 430 C 500 400, ${target.x} 390, ${target.x} ${target.y + 28}`} fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" strokeDasharray="12 9" className="route-line" />

        {/* you are here */}
        <circle cx="500" cy="430" r="18" fill="#2563eb" opacity="0.2" />
        <circle cx="500" cy="430" r="8" fill="#2563eb" stroke="white" strokeWidth="3" />
        <text x="500" y="410" textAnchor="middle" fill="#1d4ed8" fontSize="13" fontWeight="800">VOCÊ ESTÁ AQUI</text>

        {/* target */}
        <circle cx={target.x} cy={target.y + 28} r="24" fill="#16a34a" opacity="0.18">
          <animate attributeName="r" values="15;30;15" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={target.x} cy={target.y + 28} r="10" fill="#16a34a" stroke="white" strokeWidth="3" />
        <text x={target.x} y={target.y + 32} textAnchor="middle" fill="white" fontSize="12">★</text>
        {selected && (
          <g>
            <rect x={Math.max(30, target.x - 74)} y={target.y - 22} width="148" height="28" rx="14" fill="#16a34a" />
            <text x={target.x} y={target.y - 3} textAnchor="middle" fill="white" fontSize="12" fontWeight="800">{selected.gondola}</text>
          </g>
        )}
      </svg>
      {!compact && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-blue-100 bg-white px-3 py-2 text-[10px] font-bold text-slate-600">
          <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">ENTRADA</span>
          <span>→</span>
          <span className="rounded-full bg-blue-50 px-2 py-1">{selected?.aisle ?? "Corredor A"}</span>
          <span>→</span>
          <span className="rounded-full bg-green-50 px-2 py-1 text-green-700">{selected?.gondola ?? "Gondola A04"}</span>
          <span>→</span>
          <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">{selected?.shelf ?? "Prateleira 3"}</span>
        </div>
      )}
    </div>
  );
}
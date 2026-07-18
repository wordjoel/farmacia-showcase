import type { Store } from "../data/catarina";
import { ENTRANCE, POIS, STORES } from "../data/catarina";

interface Props {
  selectedId?: string;
  onSelect?: (s: Store) => void;
  showRoute?: boolean;
  routePoints?: string;
  youAreHere?: { x: number; y: number };
  className?: string;
  showLabels?: boolean;
}

export default function OutletMap({
  selectedId,
  onSelect,
  showRoute,
  routePoints,
  youAreHere,
  className,
  showLabels = true,
}: Props) {
  return (
    <svg viewBox="0 0 1000 740" className={className} preserveAspectRatio="xMidYMid meet">
      {/* Gradientes e defs */}
      <defs>
        <linearGradient id="buildings" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4e7c8"/>
          <stop offset="100%" stopColor="#d9bf8a"/>
        </linearGradient>
        <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d88a54"/>
          <stop offset="100%" stopColor="#b25a2b"/>
        </linearGradient>
        <filter id="building-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
          <feOffset dx="0" dy="6" result="offsetblur"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Fundo (grama / estacionamento) */}
      <rect width="1000" height="740" fill="#f2ead6"/>

      {/* Estacionamento inferior */}
      <rect x="0" y="580" width="1000" height="160" fill="#d4c9a9"/>
      {/* Vagas */}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`p1-${i}`} x1={20 + i * 54} y1="600" x2={20 + i * 54} y2="660" stroke="#9b8c63" strokeWidth="1.5" strokeDasharray="2 3"/>
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`p2-${i}`} x1={20 + i * 54} y1="675" x2={20 + i * 54} y2="735" stroke="#9b8c63" strokeWidth="1.5" strokeDasharray="2 3"/>
      ))}
      {/* Via principal */}
      <rect x="0" y="555" width="1000" height="18" fill="#6b5e3b" opacity="0.5"/>
      <line x1="0" y1="564" x2="1000" y2="564" stroke="#fdf8f0" strokeWidth="1.5" strokeDasharray="18 12"/>

      {/* Áreas verdes */}
      <circle cx="100" cy="500" r="55" fill="#8ab76e"/>
      <circle cx="940" cy="500" r="45" fill="#8ab76e"/>
      <path d="M330 560 Q370 510 420 560 Q460 510 510 560 Z" fill="#8ab76e" opacity="0.9"/>

      {/* ── Estrutura do Outlet (silhueta baseada no mapa oficial) ── */}
      {/* Setor Branco (base) */}
      <g filter="url(#building-shadow)">
        <path d="M80 540 Q150 420 260 430 L380 410 Q440 440 500 430 L640 440 Q740 470 820 520 L870 560 Z"
              fill="url(#buildings)" stroke="#9b7a43" strokeWidth="2"/>
        <path d="M80 540 Q150 420 260 430 L380 410 Q440 440 500 430 L640 440 Q740 470 820 520 L870 560 Z"
              fill="url(#roof)" opacity="0.18"/>

        {/* Ala circular esquerda (setor lilás arco) */}
        <path d="M80 540 A 380 380 0 0 1 250 270" fill="url(#buildings)" stroke="#9b7a43" strokeWidth="2"/>
        <path d="M80 540 A 340 340 0 0 1 230 305" fill="none" stroke="#b068a8" strokeWidth="20" opacity="0.7"/>

        {/* Setor Lilás superior esquerdo */}
        <path d="M250 270 Q360 200 430 280 L420 360 L280 380 Z" fill="url(#buildings)" stroke="#9b7a43" strokeWidth="2"/>
        <path d="M250 270 Q360 200 430 280 L420 360 L280 380 Z" fill="#b068a8" opacity="0.18"/>

        {/* Setor Azul (topo esquerdo) */}
        <path d="M430 280 Q520 200 580 230 L600 340 L460 370 Z" fill="url(#buildings)" stroke="#9b7a43" strokeWidth="2"/>
        <path d="M430 280 Q520 200 580 230 L600 340 L460 370 Z" fill="#2b7cbf" opacity="0.18"/>

        {/* Setor Vermelho (direita) */}
        <path d="M580 230 Q740 140 830 200 L880 340 L680 390 L600 340 Z" fill="url(#buildings)" stroke="#9b7a43" strokeWidth="2"/>
        <path d="M580 230 Q740 140 830 200 L880 340 L680 390 L600 340 Z" fill="#e85a4f" opacity="0.18"/>

        {/* Setor Amarelo (inferior direito) */}
        <path d="M680 390 L880 340 Q920 440 870 520 L720 480 Z" fill="url(#buildings)" stroke="#9b7a43" strokeWidth="2"/>
        <path d="M680 390 L880 340 Q920 440 870 520 L720 480 Z" fill="#e7b12b" opacity="0.18"/>

        {/* Praça Central (circular em azul) */}
        <circle cx="160" cy="550" r="52" fill="#7ec5d8" opacity="0.6"/>
        <circle cx="160" cy="550" r="52" fill="none" stroke="#2d6d8a" strokeWidth="2" strokeDasharray="4 3"/>

        {/* Linhas divisoras dos setores */}
        {[
          "M280 380 L330 520",
          "M430 280 L440 520",
          "M580 230 L540 430",
          "M680 390 L720 480",
        ].map((d, i) => (
          <path key={i} d={d} stroke="#c45a2c" strokeWidth="2" strokeDasharray="6 4" opacity="0.5"/>
        ))}
      </g>

      {/* Labels dos setores */}
      {showLabels && [
        { label: "SETOR LILÁS",   x: 300, y: 225 },
        { label: "SETOR AZUL",    x: 520, y: 220 },
        { label: "SETOR VERMELHO",x: 780, y: 160 },
        { label: "SETOR AMARELO", x: 820, y: 460 },
        { label: "SETOR BRANCO",  x: 430, y: 640 },
      ].map(s => (
        <g key={s.label}>
          <rect x={s.x-52} y={s.y-10} width="104" height="18" rx="9" fill="#1a1814" opacity="0.85"/>
          <text x={s.x} y={s.y+2} textAnchor="middle" fontSize="10" fontWeight="800" fill="#e8c87a" letterSpacing="2">
            {s.label}
          </text>
        </g>
      ))}

      {/* Rota */}
      {showRoute && routePoints && (
        <>
          <polyline
            points={routePoints}
            fill="none"
            stroke="#c45a2c"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />
          <polyline
            points={routePoints}
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="route-line"
          />
        </>
      )}

      {/* Entrada */}
      <g>
        <rect x={ENTRANCE.x - 50} y={ENTRANCE.y - 20} width="100" height="36" rx="8" fill="#c45a2c"/>
        <text x={ENTRANCE.x} y={ENTRANCE.y + 3} textAnchor="middle" fontSize="11" fontWeight="800" fill="white">
          ENTRADA
        </text>
      </g>

      {/* POIs */}
      {POIS.map(p => (
        <g key={p.id} className="opacity-70">
          <circle cx={p.x} cy={p.y} r="11" fill="white" stroke="#1a1814" strokeWidth="1.5"/>
          <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11">{p.emoji}</text>
        </g>
      ))}

      {/* Lojas */}
      {STORES.map(s => {
        const isSelected = s.id === selectedId;
        return (
          <g
            key={s.id}
            style={{ cursor: onSelect ? "pointer" : "default" }}
            onClick={() => onSelect?.(s)}
          >
            {isSelected && (
              <circle cx={s.x} cy={s.y} r="26" fill="#c45a2c" opacity="0.2">
                <animate attributeName="r" from="18" to="36" dur="1.4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from="0.4" to="0" dur="1.4s" repeatCount="indefinite"/>
              </circle>
            )}
            <circle
              cx={s.x} cy={s.y}
              r={isSelected ? 13 : 9}
              fill={isSelected ? "#c45a2c" : s.destaque ? "#e8c87a" : "#fdf8f0"}
              stroke={isSelected ? "white" : "#1a1814"}
              strokeWidth={isSelected ? 3 : 1.5}
            />
            {showLabels && s.destaque && !isSelected && (
              <text x={s.x} y={s.y + 3} textAnchor="middle" fontSize="10" fontWeight="800" fill="#1a1814">
                {s.logo}
              </text>
            )}
            {isSelected && (
              <>
                <line x1={s.x} y1={s.y + 13} x2={s.x} y2={s.y + 38} stroke="#c45a2c" strokeWidth="2"/>
                <rect x={s.x - 60} y={s.y + 38} width="120" height="22" rx="11" fill="#1a1814"/>
                <text x={s.x} y={s.y + 53} textAnchor="middle" fontSize="11" fontWeight="800" fill="#e8c87a">
                  {s.name.toUpperCase()}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* You-are-here pin */}
      {youAreHere && (
        <g>
          <circle cx={youAreHere.x} cy={youAreHere.y} r="22" fill="#c45a2c" opacity="0.3">
            <animate attributeName="r" from="10" to="30" dur="1.6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.5" to="0" dur="1.6s" repeatCount="indefinite"/>
          </circle>
          <circle cx={youAreHere.x} cy={youAreHere.y} r="10" fill="#c45a2c" stroke="white" strokeWidth="3"/>
        </g>
      )}
    </svg>
  );
}

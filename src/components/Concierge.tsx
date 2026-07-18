// Painel do avatar da Concierge "Catarina" com elementos holográficos flutuantes
interface Props {
  mode?: "idle" | "welcome" | "routing" | "qr" | "pointing";
  className?: string;
}

const IMAGES: Record<string, string> = {
  idle: "/images/concierge.png",
  welcome: "/images/concierge.png",
  routing: "/images/concierge.png",
  qr: "/images/concierge.png",
  pointing: "/images/concierge.png",
};

export default function Concierge({ mode = "welcome", className }: Props) {
  const src = IMAGES[mode];
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <img
        src={src}
        alt="Catarina — Concierge Digital"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      {/* Gradient para o texto/content */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b33]/95 via-[#0b1b33]/25 to-transparent" />

      {/* Elementos holográficos flutuantes (discretos, premium) */}
      {mode === "routing" && (
        <>
          <div className="absolute right-6 top-[20%] flex items-center gap-2 rounded-full border border-[#e8c87a]/50 bg-[#e8c87a]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-[#f1dfa6] backdrop-blur-sm fade-in">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e8c87a] animate-pulse"/> Rota em tempo real
          </div>
          <div className="absolute right-6 top-[28%] rounded-xl border border-white/20 bg-white/5 p-2 backdrop-blur-md fade-in">
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#e8c87a" strokeWidth="1.5">
              <path d="M12 2 L12 10" strokeDasharray="2 2"/>
              <circle cx="12" cy="12" r="3" fill="#e8c87a"/>
              <path d="M12 15 L12 22"/>
              <path d="M9 22 L15 22"/>
            </svg>
          </div>
        </>
      )}
      {mode === "qr" && (
        <div className="absolute right-8 top-[22%] rounded-xl border border-white/20 bg-white p-2 shadow-2xl fade-in">
          <div className="grid grid-cols-7 gap-[1px]">
            {Array.from({ length: 49 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 w-1 rounded-[1px]",
                  // pseudo-qr pattern
                  (i * 7 + i * 3) % 3 === 0 ? "bg-[#0b1b33]" : "bg-transparent",
                )}
              />
            ))}
          </div>
        </div>
      )}
      {mode === "welcome" && (
        <>
          <div className="absolute right-8 top-[24%] flex items-center gap-2 rounded-full bg-[#c45a2c]/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow fade-in">
            <span>👋</span> Bem-vindo
          </div>
        </>
      )}
      {mode === "pointing" && (
        <div className="absolute right-6 top-[18%] flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#e8c87a] text-[#e8c87a] fade-in">
          📍
        </div>
      )}

      {/* Assinatura sutil */}
      <div className="absolute right-4 bottom-[40%] text-right">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#e8c87a]/70">Catarina</p>
        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/50">Digital Concierge</p>
      </div>
    </div>
  );
}

function cn(...c: (string | false | undefined | null)[]): string {
  return c.filter(Boolean).join(" ");
}

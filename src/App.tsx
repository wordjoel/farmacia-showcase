import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GondolaMap from "./components/GondolaMap";
import {
  ADS,
  CATEGORIES,
  PRODUCTS,
  PROMOTIONS,
  resolveQuery,
  type AthosProduct,
} from "./data/athos";
import { BRANDS, type Brand } from "./data/brands";

type Screen =
  | "idle" | "home" | "search" | "listening" | "processing" | "result"
  | "map" | "related" | "promos" | "qr" | "pwa" | "notfound"
  | "collaborator" | "accessibility" | "languages" | "final" | "demo";

const LANGUAGES = ["Português", "English", "Español", "日本語", "Deutsch", "Italiano", "Français"];
const VOICE_EXAMPLES = ["Estou com dor de cabeça.", "Onde encontro Dorflex?", "Quero vitamina C.", "Onde ficam as fraldas?"];
const WELCOME_TEXT = "Olá! Seja muito bem-vindo. Sou seu assistente virtual. Posso ajudá-lo a localizar medicamentos, vitaminas, produtos de higiene e muito mais. Como posso ajudar você hoje?";

function cn(...values: (string | false | null | undefined)[]) { return values.filter(Boolean).join(" "); }
function nowLabel() { return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); }

function Logo() {
  return <div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-xl text-white shadow-md">A</div><div className="leading-none"><p className="text-[9px] font-black uppercase tracking-[0.28em] text-blue-700">ATHOS</p><p className="text-[15px] font-black italic text-slate-900">Smart Totem</p></div></div>;
}

function IconMedSearch({ className }: { className?: string }) {
  return <svg viewBox="0 0 28 28" className={className} fill="none">
    <g transform="translate(1,7) rotate(-24 8 5)">
      <rect x="0" y="1" width="16" height="8" rx="4" fill="currentColor" fillOpacity="0.55" />
      <line x1="6" y1="1.5" x2="6" y2="8.5" stroke="white" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="10" y1="1.5" x2="10" y2="8.5" stroke="white" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="3" cy="5" r="0.9" fill="white" />
      <circle cx="13" cy="5" r="0.9" fill="white" />
    </g>
    <circle cx="17" cy="12" r="7" stroke="white" strokeWidth="2.3" />
    <line x1="22" y1="17" x2="27" y2="22" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
  </svg>;
}

function IconPin({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="white">
    <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.72 11.19 7.29 11.7a1 1 0 0 0 1.42 0C13.28 21.19 20 15.25 20 10c0-4.42-3.58-8-8-8Zm0 10.5A2.5 2.5 0 1 1 12 7.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>;
}

function IconHeart({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 21s-6.7-4.35-9.33-8.2C1.02 10.6 1.4 7.4 3.9 5.6c2.1-1.5 4.8-1.1 6.4.7l1.7 1.9 1.7-1.9c1.6-1.8 4.3-2.2 6.4-.7 2.5 1.8 2.88 5 1.23 7.2C18.7 16.65 12 21 12 21Z" />
  </svg>;
}

function IconMic({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>;
}

function IconGlobe({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9Z" />
  </svg>;
}

function IconHome({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 9.8V20h13V9.8" />
    <path d="M9.5 20v-6h5v6" />
  </svg>;
}

function IconAccessibility({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4.2" r="1.7" fill="currentColor" stroke="none" />
    <path d="M11 6.2v5l-3.3 5.3M11 11.2h6M11 8.7h3.3l2.9 5.8" />
    <circle cx="7.6" cy="17.6" r="2.5" />
  </svg>;
}

function BrandMark({ brand, onClick }: { brand: Brand; onClick: () => void }) {
  return <button onClick={onClick} className="flex min-w-0 items-center gap-2 rounded-2xl px-1 py-1 text-left active:scale-95">
    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xl shadow-md ring-2 ring-white/70", brand.emblemBg)}>{brand.emblem}</span>
    <span className="min-w-0 leading-none">
      {brand.label && <span className={cn("block truncate text-[9px] font-black uppercase tracking-[0.2em]", brand.labelColor)}>{brand.label}</span>}
      <span className={cn("block truncate text-lg font-black italic drop-shadow-sm", brand.nameColor)}>{brand.name}</span>
      {brand.id === "generic" && <span className="block truncate text-[9px] font-bold text-blue-100/90 drop-shadow-sm">Selecionar rede ›</span>}
    </span>
  </button>;
}

function BrandPicker({ open, current, onSelect, onClose }: { open: boolean; current: string; onSelect: (id: string) => void; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-[440px] rounded-3xl bg-white p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
      <div className="flex items-center justify-between"><h2 className="text-lg font-black text-blue-900">Selecionar rede</h2><button onClick={onClose} className="text-slate-400">✕</button></div>
      <p className="mt-1 text-xs text-slate-500">Escolha a identidade visual apresentada no totem. Use "Sua Farmácia" para demonstrações sem marca.</p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {BRANDS.map(brand => <button key={brand.id} onClick={() => { onSelect(brand.id); onClose(); }} className={cn("flex items-center gap-2 rounded-2xl border p-3 text-left transition-all active:scale-95", current === brand.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-slate-100 bg-white hover:border-slate-200")}>
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-base shadow-sm", brand.emblemBg)}>{brand.emblem}</span>
          <span className="min-w-0 leading-tight"><span className="block truncate text-[12px] font-black text-slate-900">{brand.name}</span><span className="block truncate text-[9px] font-semibold text-slate-400">{brand.tagline}</span></span>
        </button>)}
      </div>
    </div>
  </div>;
}

function Header({ onHome, onBack, showBack, onAccessibility, onLanguage, lang }: { onHome: () => void; onBack: () => void; showBack: boolean; onAccessibility: () => void; onLanguage: () => void; lang: string }) {
  return <header className="relative z-20 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-2.5"><div>{showBack ? <button onClick={onBack} className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 active:scale-95">‹ Voltar</button> : <button onClick={onHome} aria-label="Início"><Logo /></button>}</div><div className="flex items-center gap-2 text-right"><div className="hidden leading-none sm:block"><p className="text-[9px] font-semibold text-slate-400">24°C · Ensolarado</p><p className="text-[15px] font-black text-slate-900">{nowLabel()}</p></div><button onClick={onLanguage} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-black text-blue-700 active:scale-95">{lang}</button><button onClick={onAccessibility} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[13px] active:scale-95" aria-label="Acessibilidade">♿</button></div></header>;
}

function Avatar({ listening = false, speaking = false }: { listening?: boolean; speaking?: boolean }) {
  return <div className="relative h-full w-full overflow-hidden bg-blue-950"><img src={listening ? "/images/avatar-listening.png" : "/images/avatar-main.png"} alt="Assistente virtual ATHOS" className={cn("h-full w-full object-cover object-top", !listening && "breathe")} loading="eager" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent" />{speaking && <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-blue-600/90 px-3 py-2 shadow-lg">{[0,1,2,3,4].map((item) => <span key={item} className="sound-bar h-4 w-1 rounded-full bg-white" style={{ animationDelay: `${item * 100}ms` }} />)}</div>}</div>;
}

function MicButton({ onClick }: { onClick: () => void }) { return <button onClick={onClick} aria-label="Falar com o assistente" className="mic-pulse grid h-14 w-14 shrink-0 place-items-center rounded-full bg-blue-600 text-2xl text-white shadow-xl active:scale-90">🎤</button>; }

function QRCode({ size = 140 }: { size?: number }) {
  const n = 21; let seed = 11; const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const cells = Array.from({ length: n }, () => Array.from({ length: n }, () => random() > 0.5));
  const finder = (ox: number, oy: number) => { for (let y=0;y<7;y++) for (let x=0;x<7;x++) cells[oy+y][ox+x] = x===0||y===0||x===6||y===6||(x>=2&&x<=4&&y>=2&&y<=4); };
  finder(0,0); finder(14,0); finder(0,14); const cell = size / n;
  return <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="rounded-xl bg-white p-1">{cells.flatMap((row,y)=>row.map((active,x)=>active?<rect key={`${x}-${y}`} x={x*cell+1} y={y*cell+1} width={cell*.86} height={cell*.86} rx="1" fill="#0f2440"/>:null))}</svg>;
}

function ProductCard({ product, onSelect, delay = 0 }: { product: AthosProduct; onSelect: () => void; delay?: number }) {
  const gradientMap: Record<string, string> = {
    MIP: "from-blue-500 to-cyan-400",
    Vitaminas: "from-amber-500 to-orange-400",
    Higiene: "from-emerald-500 to-teal-400",
    Infantil: "from-pink-500 to-rose-400",
    Dermocosmeticos: "from-purple-500 to-violet-400",
    Casa: "from-slate-500 to-zinc-400",
  };
  const grad = gradientMap[product.category] || "from-blue-500 to-cyan-400";
  return <button onClick={onSelect} style={{ animationDelay: `${delay}ms` }} className="slide-up card-luxury flex w-full items-center gap-3 rounded-3xl border border-white/60 bg-white p-3.5 text-left shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50">
    <span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-3xl text-white shadow-lg", grad)}>
      {product.image}
    </span>
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-1.5">
        <span className="text-[14px] font-black text-slate-900">{product.name}</span>
        {product.promo && <span className="badge-bounce rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-2 py-0.5 text-[9px] font-black text-white shadow-md shadow-red-300/40">{product.promo}</span>}
      </span>
      <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">{product.brand} · {product.category}</span>
      <span className="mt-0.5 block truncate text-[11px] text-slate-500">{product.description}</span>
      <span className="mt-1.5 flex items-center justify-between">
        <span className="flex items-baseline gap-1.5">
          <span className="text-lg font-black text-emerald-600">{product.price}</span>
          {product.oldPrice && <span className="text-[10px] text-slate-400 line-through">{product.oldPrice}</span>}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-emerald-100">
          <span className="h-1 w-1 rounded-full bg-emerald-500"/> {product.gondola}
        </span>
      </span>
    </span>
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-50 text-sm text-slate-300 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500">›</span>
  </button>;
}

function Bottom({ brand, onHome, onMic, onSearch }: { brand: Brand; onHome: () => void; onMic: () => void; onSearch: () => void }) {
  return <footer className={cn("shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]", brand.sideButton)}>
    <div className="grid grid-cols-3 gap-1 p-2">
      <button onClick={onMic} className="flex flex-col items-center gap-1.5 rounded-2xl py-3 text-[9px] font-black text-white/90 transition-all active:scale-90 hover:bg-white/10">
        <span className={cn("grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg transition-all group-hover:scale-110", brand.micButton)}><IconMic className="h-5 w-5"/></span>
        <span className="tracking-wide drop-shadow-sm">Fale</span>
      </button>
      <button onClick={onSearch} className="flex flex-col items-center gap-1.5 rounded-2xl py-3 text-[9px] font-black text-white/90 transition-all active:scale-90 hover:bg-white/10">
        <span className={cn("grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg transition-all group-hover:scale-110", brand.accentButton)}><IconPin className="h-5 w-5"/></span>
        <span className="tracking-wide drop-shadow-sm">Encontrar</span>
      </button>
      <button onClick={onHome} className="flex flex-col items-center gap-1.5 rounded-2xl py-3 text-[9px] font-black text-white/90 transition-all active:scale-90 hover:bg-white/10">
        <span className={cn("grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg transition-all group-hover:scale-110", brand.micButton)}><IconHome className="h-5 w-5"/></span>
        <span className="tracking-wide drop-shadow-sm">Início</span>
      </button>
    </div>
    <div className="flex items-center justify-between border-t border-white/15 bg-black/10 px-4 py-1.5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse"/>
        <span className="text-[8px] font-semibold text-white/60 uppercase tracking-wider">Totem ATivo</span>
      </div>
      <span className="text-[8px] text-white/50">CAT-001</span>
      <span className="text-[8px] text-white/50">{nowLabel()}</span>
    </div>
  </footer>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [, setHistory] = useState<Screen[]>([]);
  const [selected, setSelected] = useState<AthosProduct>(PRODUCTS[0]);
  const [results, setResults] = useState<AthosProduct[]>([]);
  const [resultLabel, setResultLabel] = useState("Resultados");
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState(0);
  const [accessOpen, setAccessOpen] = useState(false);
  const [libras, setLibras] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [spoken, setSpoken] = useState("");
  const [demo, setDemo] = useState(false);
  const [offerIdx, setOfferIdx] = useState(0);
  const [brandId, setBrandId] = useState("sao-joao");
  const [brandPickerOpen, setBrandPickerOpen] = useState(false);
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);
  const [welcomeVideoOk, setWelcomeVideoOk] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);
  const welcomeGreetedRef = useRef(false);
  const welcomeVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
  const later = (fn: () => void, ms: number) => { const timer = setTimeout(fn, ms); timerRef.current.push(timer); };

  const pickVoice = () => {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const pt = voices.filter(v => v.lang?.toLowerCase().startsWith("pt"));
    return pt.find(v => /natural|online|neural/i.test(v.name))
      ?? pt.find(v => /(maria|francisca)/i.test(v.name))
      ?? pt[0];
  };
  const speak = useCallback((message: string) => { setSpeaking(true); try { const synth = window.speechSynthesis; synth?.cancel(); const utterance = new SpeechSynthesisUtterance(message); utterance.lang="pt-BR"; const voice = pickVoice(); if (voice) utterance.voice = voice; utterance.rate = 0.96; utterance.pitch = 1.03; utterance.onend=()=>setSpeaking(false); synth?.speak(utterance); } catch { later(()=>setSpeaking(false), Math.min(7000, 800+message.length*35)); } }, []);
  const triggerWelcome = () => {
    setShowGreeting(false);
    if (welcomeGreetedRef.current) return;
    welcomeGreetedRef.current = true;
    if (welcomeVideoOk) { setShowWelcomeVideo(true); later(()=>setShowWelcomeVideo(false), 6500); }
    else speak(WELCOME_TEXT);
  };
  useEffect(() => { const t = setTimeout(()=>setShowGreeting(false), 3000); return ()=>clearTimeout(t); }, []);
  useEffect(() => {
    if (!showWelcomeVideo || !welcomeVideoRef.current) return;
    const video = welcomeVideoRef.current;
    video.currentTime = 0;
    video.play().catch(() => { setWelcomeVideoOk(false); setShowWelcomeVideo(false); speak(WELCOME_TEXT); });
  }, [showWelcomeVideo, speak]);
  const go = useCallback((next: Screen) => { setHistory(items => [...items.slice(-14), screen]); setScreen(next); }, [screen]);
  const back = () => setHistory(items => { const previous=items[items.length-1]; if (!previous) { setScreen("home"); return []; } setScreen(previous === "idle" ? "home" : previous); return items.slice(0,-1); });
  const openProduct = (product: AthosProduct) => { setSelected(product); go("result"); };

  const process = useCallback((text: string) => { const intent=resolveQuery(text); if(intent.type==="product"){setSelected(intent.product);go("result");speak(`Encontrei ${intent.product.name}. ${intent.product.description}`);} if(intent.type==="list"){setResults(intent.products);setResultLabel(intent.label);go("related");speak(`Encontrei ${intent.products.length} opcoes para voce.`);} if(intent.type==="promotions"){go("promos");speak("Encontrei as melhores ofertas disponiveis hoje.");} if(intent.type==="notfound"){go("notfound");speak("Nao encontrei este produto, mas posso sugerir alternativas.");} }, [go,speak]);

  const listen = useCallback(() => { setSpoken(""); go("listening"); let finished=false; const finish=(message:string)=>{if(finished)return;finished=true;setSpoken(message);later(()=>go("processing"),650);later(()=>process(message),2250);}; const Recognition=(window as unknown as {SpeechRecognition?:new()=>{lang:string;interimResults:boolean;onresult:(event:{results:{[key:number]:{[key:number]:{transcript:string}}}})=>void;start:()=>void}}).SpeechRecognition; if(Recognition){try{const recognition=new Recognition();recognition.lang="pt-BR";recognition.interimResults=false;recognition.onresult=(event)=>finish(event.results[0][0].transcript);recognition.start();}catch{}} later(()=>{if(!finished)finish(VOICE_EXAMPLES[Math.floor(Math.random()*VOICE_EXAMPLES.length)]);},2600); }, [go,process]);
  useEffect(()=>{if(screen!=="home")return;const t=setInterval(()=>setOfferIdx(v=>(v+1)%ADS.length),3500);return()=>clearInterval(t);},[screen]);
  useEffect(()=>{if(screen==="idle"||demo)return;const t=setTimeout(()=>{clearTimers();setHistory([]);setScreen("idle");},120000);return()=>clearTimeout(t);},[screen,demo]);
  const runDemo=()=>{clearTimers();setDemo(true);setHistory([]);later(()=>{setScreen("home");speak("Ola! Seja muito bem-vindo. Sou seu assistente virtual. Posso localizar produtos, encontrar setores e responder duvidas.");},0);later(()=>{setSpoken("Estou com dor de cabeca.");setScreen("listening");},4500);later(()=>setScreen("processing"),7000);later(()=>{setSelected(PRODUCTS[0]);setScreen("result");},9000);later(()=>setScreen("map"),14000);later(()=>setScreen("qr"),19000);later(()=>setScreen("pwa"),23500);later(()=>setScreen("final"),28000);later(()=>{setDemo(false);setHistory([]);setScreen("idle");},34000);};

  const related = useMemo(()=>selected.related.map(id=>PRODUCTS.find(product=>product.id===id)).filter(Boolean) as AthosProduct[],[selected]);
  const currentLang=["PT","EN","ES","JA","DE","IT","FR"][language]; const isDark=highContrast;
  const brand = BRANDS.find(item=>item.id===brandId) ?? BRANDS[0];

  const openAccessibility = () => { setLibras(true); setAccessOpen(true); };
  const header=screen!=="idle"?<Header onHome={()=>{setHistory([]);setScreen("home");}} onBack={back} showBack={screen!=="home"} onAccessibility={openAccessibility} onLanguage={()=>go("languages")} lang={currentLang}/>:null;

  return <div className={cn("flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-3 sm:p-6",isDark&&"bg-black")}>
    <div className="hidden max-w-[250px] lg:block"><span className="rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-300">ATHOS SMART TOTEM</span><h1 className="mt-3 text-3xl font-black leading-tight text-white">Localização inteligente para o varejo.</h1><p className="mt-3 text-sm leading-relaxed text-slate-400">Produto, mapa de gôndolas, rota visual, QR/PWA e concierge humanizado em uma única experiência.</p><div className="mt-6 space-y-2 text-xs text-slate-400">{["Mapa indoor de gôndolas","Busca por voz e toque","QR Code para o celular","Acessibilidade universal","Modo demonstração"].map(item=><p key={item} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-400"/>{item}</p>)}</div><button onClick={runDemo} disabled={demo} className="mt-7 w-full rounded-2xl bg-blue-600 py-3 text-sm font-black text-white shadow-lg transition hover:bg-blue-500 disabled:opacity-50">{demo?"▶ Demonstração em andamento":"▶ Iniciar demo automática"}</button></div>
    <div className="w-full max-w-[460px]"><div className="rounded-[2.5rem] bg-slate-800 p-2.5 shadow-2xl ring-1 ring-white/10"><main className={cn("relative flex h-[min(90vh,860px)] min-h-[680px] flex-col overflow-hidden rounded-[2rem] bg-white",isDark&&"bg-black text-yellow-300")}>
      {screen==="idle"&&<div className="relative flex h-full flex-col overflow-hidden bg-blue-950" onClickCapture={triggerWelcome}>
        {showWelcomeVideo && welcomeVideoOk
          ? <video ref={welcomeVideoRef} src="/videos/avatar-welcome.mp4" playsInline className="absolute inset-0 h-full w-full object-cover object-top" onError={()=>{setWelcomeVideoOk(false);setShowWelcomeVideo(false);speak(WELCOME_TEXT);}} onEnded={()=>setShowWelcomeVideo(false)}/>
          : <img src="/images/avatar-main.png" alt="Farmacêutico" className="absolute inset-0 h-full w-full object-cover object-top breathe"/>}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/10 to-transparent"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"/>

        <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 py-4">
          <div className="min-w-0"><BrandMark brand={brand} onClick={()=>setBrandPickerOpen(true)}/></div>
          <div className="flex flex-col items-center rounded-2xl bg-white/70 px-3 py-1.5 text-center shadow-sm backdrop-blur-sm">
            <p className="flex items-center justify-center gap-1 text-[13px] font-bold text-slate-700">24°C <span>⛅</span></p>
            <p className="text-[13px] font-bold text-slate-700">{nowLabel()}</p>
          </div>
          <div />
        </div>

        <div className="relative z-10 mt-auto flex flex-col gap-3 p-4">
          {showGreeting && <div className="fade-up px-1 pb-1 transition-opacity duration-500">
            <p className="text-[16px] font-black text-white drop-shadow-lg">Olá! Seja muito bem-vindo</p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-white/90 drop-shadow-md">Sou seu assistente virtual e estou aqui para ajudar. Como posso auxiliar você hoje?</p>
          </div>}

          <div className="grid grid-cols-3 gap-2.5">
            <button onClick={()=>go("search")} className={cn("flex flex-col items-center justify-center gap-2 rounded-2xl py-4 text-center text-white shadow-lg transition-all active:scale-95", brand.sideButton)}>
              <IconMedSearch className="h-8 w-8 text-white"/>
              <span className="text-[11px] font-black leading-tight">Procurar<br/>Medicamentos</span>
            </button>
            <button onClick={listen} className={cn("flex flex-col items-center justify-center gap-2 rounded-2xl py-4 text-center text-white shadow-lg transition-all active:scale-95", brand.accentButton)}>
              <IconPin className="h-8 w-8"/>
              <span className="text-[11px] font-black leading-tight">Encontrar<br/>Produto</span>
            </button>
            <button onClick={()=>go("promos")} className={cn("flex flex-col items-center justify-center gap-2 rounded-2xl py-4 text-center text-white shadow-lg transition-all active:scale-95", brand.sideButton)}>
              <IconHeart className="h-8 w-8 text-red-500"/>
              <span className="text-[11px] font-black leading-tight">Promoções<br/>do Dia</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button onClick={openAccessibility} className="flex items-center gap-1.5 rounded-full bg-blue-900/80 px-3 py-2 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm active:scale-95"><IconAccessibility className="h-4 w-4"/> Acessibilidade</button>
            <button onClick={listen} className="flex flex-col items-center gap-1">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-blue-700 shadow-md active:scale-90"><IconMic className="h-4 w-4"/></span>
              <span className="text-[9px] font-semibold text-white/85 drop-shadow-sm">Toque ou fale para começar</span>
            </button>
            <button onClick={()=>go("languages")} className="flex items-center gap-1.5 rounded-full bg-blue-900/80 px-3 py-2 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm active:scale-95"><IconGlobe className="h-4 w-4"/> Idioma</button>
          </div>
        </div>
      </div>}
      {screen!=="idle"&&header}
      {screen!=="idle"&&<div className="relative min-h-0 flex-1 overflow-y-auto">
        {["listening","processing","final","collaborator"].includes(screen)&&<div className="relative h-full min-h-[280px] w-full overflow-hidden"><Avatar listening={screen==="listening"} speaking={speaking}/>{screen==="listening"&&<div className="absolute bottom-5 left-4 right-4 rounded-3xl bg-white p-4 text-center shadow-xl"><p className="text-lg font-black text-blue-900">Estou ouvindo você…</p><p className="mt-1 text-xs text-slate-500">Pode falar naturalmente</p><div className="mx-auto mt-3 flex h-8 items-end justify-center gap-1">{[.6,1,.5,1.4,.8,1.2,.6].map((height,index)=><span key={index} className="sound-bar w-1.5 rounded-full bg-blue-600" style={{height:`${height*26}px`,animationDelay:`${index*100}ms`}}/>)}</div>{spoken&&<p className="mt-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">"{spoken}"</p>}</div>}{screen==="processing"&&<div className="absolute bottom-5 left-4 right-4 rounded-3xl bg-white p-4 text-center shadow-xl"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"/><p className="mt-2 text-[16px] font-black text-blue-900">Estou localizando as melhores informações…</p></div>}{screen==="collaborator"&&<div className="absolute bottom-5 left-4 right-4 rounded-3xl bg-white p-4 text-center shadow-xl"><p className="text-[16px] font-black text-slate-900">Estou chamando um colaborador.</p><p className="mt-1 text-xs text-slate-500">Tempo estimado: menos de 2 minutos · Atendimento 042</p><div className="mx-auto mt-3 flex items-center justify-center gap-2 text-xs font-bold text-green-700"><span className="h-2 w-2 animate-ping rounded-full bg-green-500"/> Atendimento 042</div></div>}{screen==="final"&&<div className="absolute inset-0 flex items-center justify-center"><Avatar speaking={speaking}/></div>}</div>}

        {screen==="home"&&<div className="relative flex h-full flex-col"><div className="absolute inset-0 overflow-hidden"><Avatar/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20"/></div></div>}

        {screen==="search"&&<div className="flex h-full flex-col">
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Encontrar</p>
                <h2 className="text-2xl font-black italic text-slate-900">O que voce precisa?</h2>
              </div>
              <button onClick={listen} className="mic-glow grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xl text-white shadow-lg shadow-blue-500/30 active:scale-90">
                🎤
              </button>
            </div>
          </div>

          <div className="px-5 pb-3">
            <div className="glow-pulse flex items-center gap-3 rounded-2xl border border-blue-200 bg-white px-4 py-3.5 shadow-sm transition-all focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-100">
              <span className="text-lg text-blue-400">🔎</span>
              <input autoFocus value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>{if(event.key==="Enter")process(query);}} placeholder="Buscar por nome, marca ou categoria..." className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-slate-900 outline-none placeholder:text-slate-400"/>
              {query&&<button onClick={()=>setQuery("")} className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-sm text-slate-400 active:scale-90">✕</button>}
            </div>
            <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["Dor de cabeca","Vitamina C","Fraldas","Ofertas do dia"].map((suggestion,i)=>
                <button key={suggestion} onClick={()=>process(suggestion)} className="tag-pop shrink-0 rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-[11px] font-bold text-blue-700 shadow-sm transition-all active:scale-95 hover:border-blue-300 hover:shadow-md" style={{animationDelay:`${i*80}ms`}}>
                  {suggestion}
                </button>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
            <p className="mb-3 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Categorias</p>
            <div className="grid grid-cols-3 gap-2.5">
              {CATEGORIES.map((category,i)=>
                <button key={category.id} onClick={()=>{setResults(PRODUCTS.filter(product=>product.category===category.id));setResultLabel(category.label);go("related");}} className="slide-up group flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition-all active:scale-95 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50" style={{animationDelay:`${i*60}ms`}}>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-3xl transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-100/50">{category.icon}</span>
                  <span className="text-[11px] font-bold leading-tight text-slate-700 group-hover:text-blue-700">{category.label}</span>
                </button>
              )}
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-lg shadow-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20 text-2xl backdrop-blur-sm">✨</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Mais buscados</p>
                  <p className="mt-0.5 text-[13px] font-bold leading-snug">Protetor Solar, Vitamina C e Dorflex estao em alta</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {["Protetor Solar","Vitamina C","Dorflex"].map((item,i)=>
                  <button key={item} onClick={()=>process(item)} className="slide-up flex-1 rounded-xl bg-white/15 py-2.5 text-center text-[10px] font-bold text-white backdrop-blur-sm transition-all active:scale-95 hover:bg-white/25" style={{animationDelay:`${i*100+300}ms`}}>
                    {item}
                  </button>
                )}
              </div>
            </div>

            <button onClick={listen} className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 py-4 text-blue-600 transition-all active:scale-[0.98] hover:border-blue-400 hover:bg-blue-50">
              <span className="text-2xl">🎤</span>
              <div className="text-left">
                <p className="text-sm font-black">Prefiro falar</p>
                <p className="text-[10px] font-medium text-blue-400">Toque e fale naturalmente</p>
              </div>
            </button>
          </div>
        </div>}
        {screen==="processing"&&<div className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"/><p className="mt-4 text-xl font-black text-blue-900">Estou localizando as melhores informações…</p><p className="mt-2 text-sm text-slate-500">Consultando disponibilidade e rota da loja.</p></div>}
        {screen==="result"&&<div className="p-4"><div className="scale-in overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60"><div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-5 pb-12 text-white gradient-shift">{selected.promo&&<span className="absolute top-3 right-3 badge-bounce rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-[10px] font-black text-white ring-1 ring-white/30">{selected.promo}</span>}<div className="flex items-start gap-4"><span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-white/20 text-5xl backdrop-blur-sm shadow-lg ring-1 ring-white/20">{selected.image}</span><div className="min-w-0 flex-1"><p className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-200">{selected.brand}</p><h2 className="mt-1 text-xl font-black leading-tight">{selected.name}</h2><p className="mt-1 text-xs text-blue-200">{selected.category}</p></div></div></div><div className="relative -mt-6 px-4"><div className="rounded-2xl bg-white p-4 shadow-xl shadow-slate-200/40 ring-1 ring-slate-100"><div className="flex items-baseline gap-3"><span className="text-3xl font-black text-emerald-600">{selected.price}</span>{selected.oldPrice&&<span className="text-sm text-slate-400 line-through">{selected.oldPrice}</span>}</div><p className="mt-3 text-sm leading-relaxed text-slate-600">{selected.description}</p></div></div><div className="px-4 pt-3 pb-4"><div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 ring-1 ring-emerald-100"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700">📍 Localizacao na loja</p><div className="mt-1.5 flex items-center gap-2">{[selected.aisle,selected.gondola,selected.shelf].map(loc=><span key={loc} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">{loc}</span>)}</div><p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"/> {selected.availability}</p></div></div><div className="grid grid-cols-3 gap-2.5 px-4 pb-4"><button onClick={()=>go("map")} className="flex flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 py-3.5 text-white shadow-lg shadow-blue-300/40 transition-all active:scale-95 hover:shadow-xl"><span className="text-xl">🗺️</span><span className="text-[9px] font-black">Ver no mapa</span></button><button onClick={()=>{setResults(related);setResultLabel("Produtos semelhantes");go("related");}} className="flex flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 py-3.5 text-white shadow-lg shadow-amber-300/40 transition-all active:scale-95 hover:shadow-xl"><span className="text-xl">✨</span><span className="text-[9px] font-black">Semelhantes</span></button><button onClick={()=>go("qr")} className="flex flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 py-3.5 text-white shadow-lg shadow-purple-300/40 transition-all active:scale-95 hover:shadow-xl"><span className="text-xl">📱</span><span className="text-[9px] font-black">QR Code</span></button></div></div><p className="mt-3 rounded-2xl bg-amber-50/80 p-3 text-center text-[10px] leading-relaxed text-amber-700 ring-1 ring-amber-100">⚠️ As informacoes nao substituem orientacao medica.</p></div>}
        {screen==="map"&&<div className="p-4"><div className="scale-in overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60"><div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black italic">Mapa da loja</h2><p className="mt-0.5 text-[10px] text-blue-200">Rota ate {selected.name}</p></div><span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold backdrop-blur-sm">15 m · 2 min</span></div></div><div className="p-3"><GondolaMap selected={selected}/></div><div className="px-3 pb-3"><div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-3.5 ring-1 ring-blue-100"><p className="text-xs font-bold leading-relaxed text-slate-700">Siga em frente por aproximadamente 15 metros. Vire a direita e siga ate o {selected.aisle}. O produto esta na {selected.gondola}, {selected.shelf}.</p></div><button onClick={()=>go("qr")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-300/40 transition-all active:scale-95 hover:shadow-xl"><span className="text-lg">📱</span>Continuar no celular</button></div></div></div>}
        {screen==="related"&&<div className="p-4"><div className="mb-4"><p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Resultado</p><h2 className="text-2xl font-black italic text-slate-900">{resultLabel}</h2><p className="mt-1 text-xs text-slate-500">Escolha um item para ver localizacao e rota.</p></div><div className="space-y-3">{results.map((product,index)=><ProductCard key={product.id} product={product} delay={index*70} onSelect={()=>openProduct(product)}/>)}</div></div>}
        {screen==="promos"&&<div className="p-4"><div className="mb-4"><p className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500">Promocoes</p><h2 className="text-2xl font-black italic text-slate-900">Ofertas do Dia</h2><p className="mt-1 text-xs text-slate-500">Produtos selecionados com condicoes especiais.</p></div><div className="space-y-3">{PROMOTIONS.map((product,i)=><button key={product.id} onClick={()=>openProduct(product)} className="slide-up card-luxury flex w-full items-center gap-4 overflow-hidden rounded-3xl text-left shadow-lg shadow-slate-200/50" style={{animationDelay:`${i*80}ms`}}><div className="grid h-24 w-24 shrink-0 place-items-center bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 text-5xl text-white shadow-inner">{product.image}</div><div className="min-w-0 flex-1 py-3 pr-4"><span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-2 py-0.5 text-[9px] font-black text-white shadow-sm badge-bounce">{product.promo}</span><p className="mt-1.5 text-sm font-black text-slate-900">{product.name}</p><p className="mt-1 text-xl font-black text-emerald-600">{product.price}</p><p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-slate-400">📍 {product.gondola}</p></div><span className="mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-50 text-sm text-slate-300">›</span></button>)}</div></div>}
        {screen==="qr"&&<div className="flex flex-col items-center justify-center p-6 text-center"><div className="scale-in flex flex-col items-center"><div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 text-4xl text-white shadow-xl shadow-purple-300/40">📱</div><p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-purple-500">ATHOS PWA</p><h2 className="mt-2 text-2xl font-black leading-tight text-slate-900">Continue no celular</h2><p className="mt-2 max-w-xs text-[13px] leading-relaxed text-slate-400">Aponte a camera para o QR Code. O mapa e a rota abrem de onde voce parou.</p></div><div className="mt-6 rounded-[2rem] bg-white p-5 shadow-2xl ring-4 ring-purple-100"><QRCode size={170}/></div><div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400">{["Sem download","Sem login","Funciona no navegador"].map(f=><span key={f} className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-400"/>{f}</span>)}</div><button onClick={()=>go("pwa")} className="mt-6 w-full max-w-xs rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 py-4 text-sm font-black text-white shadow-xl shadow-purple-300/30 transition-all active:scale-95 hover:shadow-2xl">▶ Simular abertura do PWA</button></div>}
        {screen==="pwa"&&<div className="p-4"><div className="scale-in overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-violet-700 p-4 text-white shadow-xl shadow-purple-300/30 gradient-shift"><p className="text-[9px] font-black uppercase tracking-widest text-purple-200">ATHOS PWA · Sessao continuada</p><p className="mt-1 text-lg font-black">Voce esta navegando ate {selected.name}</p><p className="mt-1 text-xs text-purple-200">Sincronizado com o totem CAT-001</p></div><div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"><div className="flex items-center gap-3 p-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 text-3xl text-white shadow-lg">{selected.image}</span><div><p className="font-black text-slate-900">{selected.name}</p><p className="text-xs text-slate-500">{selected.gondola} · {selected.shelf}</p></div></div><div className="px-4 pb-4"><GondolaMap selected={selected} compact/></div></div><div className="mt-3 grid grid-cols-3 gap-2.5">{[{icon:"🗺️",label:"Mapa",grad:"from-blue-500 to-cyan-400"},{icon:"❤️",label:"Favoritos",grad:"from-rose-500 to-pink-400"},{icon:"🔥",label:"Ofertas",grad:"from-amber-500 to-orange-400"}].map(b=><button key={b.label} className={cn("flex flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-br py-3.5 text-white shadow-lg transition-all active:scale-95",b.grad)}><span className="text-xl">{b.icon}</span><span className="text-[10px] font-black">{b.label}</span></button>)}</div><button onClick={()=>go("final")} className="mt-3 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-300/30 transition-all active:scale-95">Concluir atendimento</button></div>}
        {screen==="notfound"&&<div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center"><div className="scale-in"><div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-5xl text-white shadow-xl shadow-orange-300/40">🔎</div></div><h2 className="mt-5 text-2xl font-black text-slate-900">Nao encontrei este produto.</h2><p className="mt-2 max-w-xs text-sm text-slate-500">Posso sugerir alternativas ou chamar um colaborador.</p><div className="mt-6 grid w-full max-w-xs gap-2.5">{[{fn:()=>{setResults(PRODUCTS.slice(0,4));setResultLabel("Sugestoes para voce");go("related");},label:"Produtos semelhantes",grad:"from-blue-500 to-blue-600",icon:"✨"},{fn:()=>go("search"),label:"Nova pesquisa",grad:"from-amber-400 to-orange-500",icon:"🔎"},{fn:()=>go("collaborator"),label:"Chamar colaborador",grad:"from-emerald-500 to-teal-500",icon:"👩‍💼"}].map(b=><button key={b.label} onClick={b.fn} className={cn("flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br py-3.5 text-sm font-black text-white shadow-lg transition-all active:scale-95",b.grad)}><span>{b.icon}</span>{b.label}</button>)}</div></div>}
        {screen==="collaborator"&&<div className="p-5"><div className="scale-in overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-center text-white shadow-xl shadow-emerald-300/30 gradient-shift"><div className="grid h-16 w-16 mx-auto place-items-center rounded-full bg-white/20 text-4xl backdrop-blur-sm ring-1 ring-white/30">👩‍💼</div><h2 className="mt-3 text-xl font-black">Estou chamando um colaborador.</h2><p className="mt-2 text-sm text-emerald-100">Atendimento 042 foi notificado.</p><div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-white"><span className="h-2 w-2 animate-ping rounded-full bg-white"/> Tempo estimado: menos de 2 minutos</div></div><button onClick={()=>go("home")} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-300/30 transition-all active:scale-95">Voltar ao inicio</button></div>}
        {screen==="accessibility"&&<div className="p-4"><h2 className="text-xl font-black italic text-blue-900">Acessibilidade</h2><p className="mt-1 text-xs text-slate-500">Personalize o atendimento para você.</p><div className="mt-4 space-y-2">{[{label:"♿ Libras",desc:"Intérprete digital em janela lateral",value:libras,set:setLibras},{label:"🔠 Texto ampliado",desc:"Aumenta a leitura da interface",value:largeText,set:setLargeText},{label:"◐ Alto contraste",desc:"Contraste reforçado para leitura",value:highContrast,set:setHighContrast}].map(item=><button key={item.label} onClick={()=>item.set(!item.value)} className={cn("flex w-full items-center gap-3 rounded-2xl border p-4 text-left",item.value?"border-blue-500 bg-blue-50":"border-slate-100 bg-white")}><span className="text-2xl">{item.label.split(" ")[0]}</span><span className="flex-1"><span className="block text-sm font-black text-slate-900">{item.label.slice(item.label.indexOf(" ")+1)}</span><span className="block text-[11px] text-slate-500">{item.desc}</span></span><span className={cn("h-6 w-11 rounded-full p-1 transition",item.value?"bg-green-500":"bg-slate-200")}><span className={cn("block h-4 w-4 rounded-full bg-white transition-transform",item.value&&"translate-x-5")}/></span></button>)}</div><button onClick={()=>go("home")} className="mt-5 w-full rounded-2xl bg-blue-600 py-3 text-sm font-black text-white">Salvar preferências</button></div>}
        {screen==="languages"&&<div className="p-4"><h2 className="text-xl font-black italic text-blue-900">Selecione o idioma</h2><div className="mt-4 grid gap-2">{LANGUAGES.map((item,index)=><button key={item} onClick={()=>{setLanguage(index);go("home");}} className={cn("rounded-2xl border px-4 py-3 text-left text-sm font-bold",language===index?"border-blue-600 bg-blue-600 text-white":"border-slate-100 bg-white text-slate-700")}>{item}<span className="float-right">{language===index?"✓":"›"}</span></button>)}</div></div>}
        {screen==="final"&&<div className="flex min-h-[270px] flex-col items-center justify-center p-5 text-center"><div className="scale-in"><div className="grid h-20 w-20 mx-auto place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-5xl text-white shadow-xl shadow-blue-300/40">💙</div></div><p className="mt-4 text-2xl font-black text-slate-900">Foi um prazer ajudar.</p><p className="mt-2 text-sm text-slate-500">Tenha uma excelente experiencia.</p><div className="mt-4 rounded-2xl bg-white p-2.5 shadow-xl ring-4 ring-blue-50"><QRCode size={90}/></div><p className="mt-2 text-[10px] font-bold text-slate-400">QR Code disponivel para continuar no celular</p></div>}
        {screen==="demo"&&<div className="flex min-h-[350px] flex-col items-center justify-center p-6 text-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"/><h2 className="mt-4 text-xl font-black text-blue-900">Demonstração em andamento</h2><p className="mt-2 text-sm text-slate-500">O ATHOS está apresentando a jornada completa automaticamente.</p></div>}
      </div>}
      {screen!=="idle"&&<Bottom brand={brand} onHome={()=>{clearTimers();setHistory([]);setScreen("home");}} onMic={listen} onSearch={()=>go("search")}/>}
      {libras&&<div className="absolute top-16 right-3 z-30 flex flex-col items-center gap-2 rounded-2xl border border-green-400/30 bg-black/30 p-3 backdrop-blur-md transition-all duration-500"><img src="/images/libras-avatar.png" alt="Intérprete de Libras" className="h-16 w-16 rounded-xl object-cover object-top ring-2 ring-green-400/60"/><span className="text-[8px] font-black uppercase tracking-wider text-green-300">♿ LIBRAS AO VIVO</span><span className="h-2 w-2 animate-ping rounded-full bg-green-400"/></div>}
    </main></div></div>
    <div className="mt-4 lg:hidden"><button onClick={runDemo} disabled={demo} className="rounded-2xl bg-blue-600 px-7 py-3 text-sm font-black text-white shadow-lg disabled:opacity-50">{demo?"▶ Demo em andamento":"▶ Demo automática"}</button></div>
    {accessOpen&&<div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={()=>setAccessOpen(false)}><div className="w-full max-w-[440px] rounded-3xl bg-white p-5 shadow-2xl" onClick={event=>event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-lg font-black text-blue-900">Acessibilidade</h2><button onClick={()=>setAccessOpen(false)} className="text-slate-400">✕</button></div><p className="mt-1 text-xs text-slate-500">Atendimento adaptado para todos.</p><div className="mt-4 grid grid-cols-3 gap-2"><button onClick={()=>setLibras(v=>!v)} className={cn("rounded-2xl p-3 text-center text-[11px] font-bold",libras?"bg-green-600 text-white":"bg-green-50 text-green-700")}>♿<br/>Libras</button><button onClick={()=>setLargeText(v=>!v)} className={cn("rounded-2xl p-3 text-center text-[11px] font-bold",largeText?"bg-blue-600 text-white":"bg-blue-50 text-blue-700")}>🔠<br/>Texto grande</button><button onClick={()=>setHighContrast(v=>!v)} className={cn("rounded-2xl p-3 text-center text-[11px] font-bold",highContrast?"bg-slate-900 text-yellow-300":"bg-slate-100 text-slate-700")}>◐<br/>Contraste</button></div><button onClick={()=>setAccessOpen(false)} className="mt-4 w-full rounded-2xl bg-blue-600 py-3 text-sm font-black text-white">Continuar</button></div></div>}
    {largeText&&<style>{`body { font-size: 18px; }`}</style>}
    <BrandPicker open={brandPickerOpen} current={brandId} onSelect={setBrandId} onClose={()=>setBrandPickerOpen(false)}/>
  </div>;
}

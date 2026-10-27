import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Swords, Calendar, Clock, MapPin, Building, Bus, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onNavigate: (tab: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  // Stadium LED Countdown to January 15, 2027 (09:00 Tunis Local Time)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2027-01-15T09:00:00+01:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-[#040812] overflow-hidden piste-bg">
      
      {/* Top Athletic Ticker Bar */}
      <div className="w-full bg-[#02050b] border-b border-[#0f1b2e] py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 font-extrabold uppercase text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
              TUNIS 2027
            </span>
            <span className="hidden md:inline font-mono text-slate-300">
              Série FIE Coupe du Monde Sabre Hommes & Dames &bull; Qualifications Olympiques
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">Palais des Sports de Radès</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="text-cyan-400 font-semibold">Protocole FIE Garanti</span>
          </div>
        </div>
      </div>

      {/* Main Cinematic Banner Display (User Image Centerpiece) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8">
        
        {/* Championship Visual Banner Container */}
        <div className="relative rounded-3xl overflow-hidden border border-[#1b2b46] shadow-2xl shadow-black/80 group">
          
          {/* Banner Graphic Provided by User */}
          <div className="relative w-full bg-[#071120]">
            <img
              src="/banner-gp-tunis-2027.png"
              alt="FIE GP Grand Prix 2026/27 - Tunis 15-17 January Sabre Official Banner"
              className="w-full h-auto object-cover object-center max-h-[460px] md:max-h-[520px] transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {/* Elegant sports editorial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/40 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#050a14]/80 via-transparent to-[#050a14]/40 pointer-events-none"></div>
          </div>

          {/* Overlay Content on Banner */}
          <div className="absolute inset-0 p-5 sm:p-8 md:p-10 flex flex-col justify-between pointer-events-none">
            
            {/* Top row badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#071122]/90 backdrop-blur-md border border-cyan-400/50 text-cyan-300 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2">
                  <Swords className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Grand Prix Sabre Tunis 2027</span>
                </span>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-[#071122]/90 backdrop-blur-md border border-white/20 text-slate-200 font-bold text-xs">
                  15 — 17 Janvier 2027
                </span>
              </div>

              {/* Stadium LED Clock */}
              <div className="bg-[#030712]/90 backdrop-blur-md border border-[#192842] rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-2 sm:gap-3 text-center">
                <div className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-slate-400 mr-1 hidden sm:flex">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Coup d'envoi :</span>
                </div>
                <div className="bg-[#091322] px-2.5 py-1 rounded-lg border border-sky-950 min-w-[44px]">
                  <div className="text-base sm:text-lg font-black text-white font-mono leading-none">{timeLeft.days}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Jours</div>
                </div>
                <div className="bg-[#091322] px-2.5 py-1 rounded-lg border border-sky-950 min-w-[44px]">
                  <div className="text-base sm:text-lg font-black text-white font-mono leading-none">{timeLeft.hours}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Heures</div>
                </div>
                <div className="bg-[#091322] px-2.5 py-1 rounded-lg border border-sky-950 min-w-[44px]">
                  <div className="text-base sm:text-lg font-black text-white font-mono leading-none">{timeLeft.minutes}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Min</div>
                </div>
                <div className="bg-[#091322] px-2.5 py-1 rounded-lg border border-sky-950 min-w-[44px]">
                  <div className="text-base sm:text-lg font-black text-cyan-300 font-mono leading-none">{timeLeft.seconds}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Sec</div>
                </div>
              </div>
            </div>

            {/* Bottom Hero Callout */}
            <div className="max-w-3xl pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#071329]/90 border border-sky-500/50 text-sky-300 text-[11px] font-bold mb-2.5 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Fédération Internationale d'Escrime (FIE) &bull; Fédération Tunisienne d'Escrime (FTE)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.98] drop-shadow-md">
                GRAND PRIX SABRE TUNIS 2027
              </h1>
              <p className="text-sm sm:text-base font-extrabold text-cyan-300 uppercase tracking-wider mt-1 mb-2">
                Official Accommodation & Transfer Platform
              </p>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-2xl drop-shadow">
                Portail officiel exclusif réservé aux fédérations nationales, athlètes, entraîneurs et arbitres internationaux. Réservation garantie des chambres aux <strong>Hôtels El Mouradi Gammarth (5★)</strong> et <strong>Golden Carthage (5★)</strong> avec navettes aéroports dédiées.
              </p>
            </div>

          </div>

        </div>

        {/* Quick Booking Floating Action Bar (Like World-Class Sports Portals) */}
        <div className="relative -mt-6 sm:-mt-8 z-20 max-w-5xl mx-auto">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#091427]/95 backdrop-blur-2xl border-2 border-[#1e3456] shadow-2xl shadow-black/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Hotel Pick */}
              <div 
                onClick={() => onNavigate('hotels')}
                className="p-3 rounded-xl bg-[#0e1c33] border border-sky-900/50 hover:border-cyan-400/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-bold mb-1">
                  <span>1. Établissement</span>
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="font-bold text-white text-sm">2 Hôtels 5★ Officiels</div>
                <div className="text-[11px] text-slate-400">El Mouradi &bull; Golden Carthage</div>
              </div>

              {/* Dates */}
              <div 
                onClick={() => onNavigate('booking')}
                className="p-3 rounded-xl bg-[#0e1c33] border border-sky-900/50 hover:border-cyan-400/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-bold mb-1">
                  <span>2. Dates du Séjour</span>
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="font-bold text-white text-sm">14 — 18 Janvier 2027</div>
                <div className="text-[11px] text-amber-400 font-medium">4 Nuits (Modifiables)</div>
              </div>

              {/* Roster & Rooms */}
              <div 
                onClick={() => onNavigate('booking')}
                className="p-3 rounded-xl bg-[#0e1c33] border border-sky-900/50 hover:border-cyan-400/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-bold mb-1">
                  <span>3. Chambres & Groupe</span>
                  <Swords className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="font-bold text-white text-sm">Single & Double / Twin</div>
                <div className="text-[11px] text-emerald-400 font-medium">Calcul automatique roster</div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onNavigate('booking')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Accéder aux Réservations</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>

        {/* 4 Pillars of the Tournament (Clean High-Contrast Cards) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('hotels')}
            className="tournament-card rounded-2xl p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Building className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/30">
                5★ Gammarth
              </span>
            </div>
            <h3 className="font-black text-white text-base group-hover:text-cyan-300 transition-colors uppercase">
              2 Hôtels Officiels
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              El Mouradi Gammarth (Bord de mer) & Golden Carthage (Colline). À 15 min de la piste de compétition.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Voir les hôtels & tarifs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('booking')}
            className="tournament-card rounded-2xl p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                <Calendar className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-600/30">
                Dispo Réelle
              </span>
            </div>
            <h3 className="font-black text-white text-base group-hover:text-cyan-300 transition-colors uppercase">
              Réservation Délégation
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              Tableau d'équipes, athlètes & entraîneurs avec calcul automatique des chambres et facture unique.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Configurer mon équipe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('shuttle')}
            className="tournament-card rounded-2xl p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Bus className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-600/30">
                Optimisé 45 min
              </span>
            </div>
            <h3 className="font-black text-white text-base group-hover:text-emerald-300 transition-colors uppercase">
              Navettes Aéroport
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              Prise en charge à Tunis-Carthage (TUN), Enfidha (NBE) ou Monastir (MIR) avec chauffeur WhatsApp officiel.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Réserver le transfert</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onNavigate('client')}
            className="tournament-card rounded-2xl p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/30">
                PDF & QR Code
              </span>
            </div>
            <h3 className="font-black text-white text-base group-hover:text-amber-300 transition-colors uppercase">
              Mon Dossier & Voucher
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              Téléchargez votre voucher officiel FIE, modifiez vos vols en direct et suivez votre statut d'accréditation.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Accéder à mon dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>

      {/* Fencing strip metallic piste divider */}
      <div className="piste-strip-divider my-2"></div>
    </section>
  );
};

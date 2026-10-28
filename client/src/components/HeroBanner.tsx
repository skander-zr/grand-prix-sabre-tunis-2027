import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Swords, Calendar, Clock, MapPin, Building2, Bus, ArrowRight, ShieldCheck, Banknote, Sparkles, ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onNavigate: (tab: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();

  // Official Tournament Countdown to January 15, 2027 (09:00 Tunis Local Time)
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
    <section className="relative w-full bg-[#050811] overflow-hidden piste-bg">
      
      {/* Official Top Athletic Ribbon */}
      <div className="w-full bg-[#03060C] border-b border-[#D4AF37]/20 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#101A2C] border border-[#D4AF37]/40 text-[#F5E8C7] font-bold uppercase tracking-wider text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              TUNIS 2027
            </span>
            <span className="font-medium text-slate-300">
              Coupe du Monde FIE Sabre Hommes &amp; Dames &bull; Qualifications Officielles
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px]">
            <span>Lieu : <strong className="text-white">Salle Omnisports de Radès</strong></span>
            <span>&bull;</span>
            <span className="text-[#D4AF37] font-semibold">Protocole Officiel FIE / FTE</span>
          </div>
        </div>
      </div>

      {/* Main Championship Architectural Frame */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        
        {/* Banner Frame with Regal Bevels */}
        <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-2xl shadow-black/90 group bg-[#080E1A]">
          
          {/* User's Authentic Tournament Banner Centerpiece */}
          <div className="relative w-full">
            <img
              src="/banner-gp-tunis-2027.png"
              alt="FIE Grand Prix Sabre 2026/27 - Tunis 15-17 January Official Banner"
              className="w-full h-auto object-cover object-center max-h-[460px] md:max-h-[520px] transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {/* Elegant deep Mediterranean vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/45 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#050811]/85 via-transparent to-[#050811]/50 pointer-events-none"></div>
          </div>

          {/* Overlay Content Directly on Banner Frame */}
          <div className="absolute inset-0 p-5 sm:p-8 md:p-10 flex flex-col justify-between pointer-events-none">
            
            {/* Top row: Official tournament badge & Precision Timing */}
            <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-md bg-[#060B14]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5E8C7] font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2">
                  <Swords className="w-4 h-4 text-[#D4AF37]" />
                  <span>Grand Prix Sabre Tunis 2027</span>
                </span>
                <span className="hidden sm:inline-flex px-3 py-1.5 rounded-md bg-[#060B14]/85 backdrop-blur-md border border-white/10 text-slate-200 font-medium text-xs font-mono">
                  15 — 17 Janvier 2027
                </span>
              </div>

              {/* Olympic Swiss-Style Timing Clock */}
              <div className="bg-[#050912]/95 backdrop-blur-md border border-[#D4AF37]/40 rounded-xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-2 sm:gap-3 text-center">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-[#D4AF37] mr-1 hidden sm:flex">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Coup d'envoi :</span>
                </div>
                <div className="bg-[#0A1220] px-2.5 py-1 rounded border border-[#D4AF37]/20 min-w-[44px]">
                  <div className="text-base sm:text-lg font-black text-white font-mono leading-none">{timeLeft.days}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Jours</div>
                </div>
                <div className="bg-[#0A1220] px-2.5 py-1 rounded border border-[#D4AF37]/20 min-w-[44px]">
                  <div className="text-base sm:text-lg font-black text-white font-mono leading-none">{timeLeft.hours}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Heures</div>
                </div>
                <div className="bg-[#0A1220] px-2.5 py-1 rounded border border-[#D4AF37]/20 min-w-[44px]">
                  <div className="text-base sm:text-lg font-black text-white font-mono leading-none">{timeLeft.minutes}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Min</div>
                </div>
                <div className="bg-[#0A1220] px-2.5 py-1 rounded border border-[#D4AF37]/20 min-w-[44px]">
                  <div className="text-base sm:text-lg font-black text-[#D4AF37] font-mono leading-none">{timeLeft.seconds}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Sec</div>
                </div>
              </div>
            </div>

            {/* Bottom Hero Callout: Exact Required Titles */}
            <div className="max-w-3xl pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#091122]/90 border border-[#D4AF37]/40 text-[#F5E8C7] text-[11px] font-bold mb-2 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                <span>Fédération Internationale d'Escrime (FIE) &bull; Fédération Tunisienne d'Escrime (FTE)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.98] drop-shadow-lg font-heading">
                GRAND PRIX SABRE TUNIS 2027
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#D4AF37] uppercase tracking-wider mt-1.5 mb-2 font-mono">
                Official Accommodation &amp; Transfer Platform
              </p>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-2xl drop-shadow">
                Portail officiel d'hébergement et de logistique réservé aux délégations nationales, athlètes, entraîneurs et arbitres internationaux. Réservation des 2 complexes 5 étoiles <strong>Hôtel El Mouradi Gammarth</strong> et <strong>Hôtel Golden Carthage</strong> avec navettes aéroport (TUN) et desserte de la Salle de Radès.
              </p>
            </div>

          </div>

        </div>

        {/* Official Protocol Strip: 100% Cash at Check-in & Exclusive Airport */}
        <div className="mt-4 p-4 rounded-xl bg-[#091222] border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#121E36] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-2">
                <span>Règlement Officiel de la Compétition : 100% Espèces sur Place</span>
                <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-[#F5E8C7] border border-[#D4AF37]/40">
                  Zéro Carte / Zéro Virement
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Le paiement intégral de l'hébergement et des prestations s'effectue en espèces (Euros € ou Dinars TND) directement lors de votre arrivée / check-in au bureau d'accréditation officiel.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('hotels')}
              className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Découvrir les 2 Hôtels 5★
            </button>
            <button
              type="button"
              onClick={() => onNavigate('booking')}
              className="px-4 py-2 rounded-lg bg-[#14223B] hover:bg-[#1A2C4C] text-[#F5E8C7] border border-[#D4AF37]/40 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Réserver Séjour
            </button>
          </div>
        </div>

        {/* 3 Pillars of Championship Excellence */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pillar 1: 2 Official 5★ Hotels in Gammarth */}
          <div
            onClick={() => onNavigate('hotels')}
            className="palace-card rounded-xl p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#121E38] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#060B14] transition-all">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider bg-[#060B14] px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
                Gammarth 5★
              </span>
            </div>
            <h3 className="font-heading font-black text-white text-base group-hover:text-[#F5E8C7] transition-colors uppercase">
              Les 2 Hôtels Officiels
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              El Mouradi Gammarth (Bord de mer) &amp; Golden Carthage (Colline). Tarifs négociés FIE, buffet athlète &amp; balnéothérapie.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
              <span>Voir les chambres &amp; galeries réelles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 2: Shuttles TUN & Radès */}
          <div
            onClick={() => onNavigate('shuttle')}
            className="palace-card rounded-xl p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#121E38] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#060B14] transition-all">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider bg-[#060B14] px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
                Aéroport TUN
              </span>
            </div>
            <h3 className="font-heading font-black text-white text-base group-hover:text-[#F5E8C7] transition-colors uppercase">
              Navettes &amp; Matériel 1m40
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              Transferts exclusifs Aéroport Tunis-Carthage (TUN), compartiments sécurisés pour housses d'armes et liaison Radès (~16 min).
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
              <span>Réserver le transfert aéroport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 3: Official Client File & A4 Voucher */}
          <div
            onClick={() => onNavigate('client')}
            className="palace-card rounded-xl p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#121E38] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#060B14] transition-all">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider bg-[#060B14] px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
                Code GPS2027
              </span>
            </div>
            <h3 className="font-heading font-black text-white text-base group-hover:text-[#F5E8C7] transition-colors uppercase">
              Mon Dossier &amp; Voucher A4
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              Consultez votre réservation, mettez à jour votre vol d'arrivée à Tunis-Carthage et imprimez votre voucher officiel FIE avec QR code.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
              <span>Consulter mon dossier</span>
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

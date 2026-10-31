import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Clock, MapPin, Building2, Bus, ArrowRight, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

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
    <section className="w-full bg-[#F8FAFC] py-6 sm:py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Authentic Official Tournament Banner Presentation (NO CROPPING & NO GIANT TEXT OVER FENCERS) */}
        <div className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-[#061225]">
          <img
            src="/banner-gp-tunis-2027.png"
            alt="FIE Grand Prix Sabre 2026/27 - Tunis 15-17 January Official Banner"
            className="w-full h-auto object-contain block mx-auto max-h-[460px]"
          />
        </div>

        {/* Institutional Title & Operations Summary */}
        <div className="inst-card p-6 sm:p-8 max-w-6xl mx-auto mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Title & Official Details (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#03396C] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#C8102E]"></span>
                <span>Fédération Internationale d'Escrime &bull; Fédération Tunisienne d'Escrime</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Grand Prix Sabre Tunis 2027
              </h1>
              
              <p className="text-sm sm:text-base font-semibold text-[#03396C]">
                Plateforme Officielle d'Hébergement &amp; de Transport des Délégations
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Portail officiel réservé aux délégations nationales, athlètes, entraîneurs et arbitres internationaux. Réservation exclusive auprès des 2 hôtels 5★ officiels à Gammarth avec service de navettes aéroports (TUN, NBE, MIR) et liaisons quotidiennes vers la Salle Omnisports de Radès.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('booking')}
                  className="btn-primary cursor-pointer text-sm font-semibold"
                >
                  <span>Réserver un Hôtel 5★</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('client')}
                  className="btn-secondary cursor-pointer text-sm font-semibold"
                >
                  <span>Gérer ma Réservation / Navette</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('hotels')}
                  className="btn-outline cursor-pointer text-sm font-semibold"
                >
                  <span>Consulter les 2 Hôtels</span>
                </button>
              </div>
            </div>

            {/* Precision Tournament Countdown (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#03396C]" />
                  <span>Coup d'envoi du tournoi</span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500">15 Janvier 2027</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-[#0F172A] font-mono leading-none">{timeLeft.days}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase mt-1">Jours</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-[#0F172A] font-mono leading-none">{timeLeft.hours}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase mt-1">Heures</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-[#0F172A] font-mono leading-none">{timeLeft.minutes}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase mt-1">Min</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-[#C8102E] font-mono leading-none">{timeLeft.seconds}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase mt-1">Sec</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Lieu officiel :</span>
                <strong className="text-slate-900">Salle Omnisports de Radès</strong>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Pillars of Official Organization */}
        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Pillar 1 */}
          <div
            onClick={() => onNavigate('hotels')}
            className="inst-card inst-card-hover p-6 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#03396C] flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#03396C] transition-colors">
              Les 2 Hôtels 5★ Partenaires
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Hôtel El Mouradi Gammarth (bord de mer) &amp; Hôtel Golden Carthage (colline). Tarifs négociés officiels avec buffets sportifs et balnéothérapie.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#03396C] group-hover:translate-x-1 transition-transform">
              <span>Voir les chambres &amp; photos réelles</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => onNavigate('shuttle')}
            className="inst-card inst-card-hover p-6 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#03396C] flex items-center justify-center mb-3">
              <Bus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#03396C] transition-colors">
              Navettes Aéroports Dédiées
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Prise en charge officielle depuis Tunis-Carthage (TUN), Enfidha (NBE) et Monastir (MIR) avec gestion prioritaire des sacs d'armes (1m40).
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#03396C] group-hover:translate-x-1 transition-transform">
              <span>Planifier un transfert aéroport</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => onNavigate('booking')}
            className="inst-card inst-card-hover p-6 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#C8102E] flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#C8102E] transition-colors">
              Paiement Sécurisé &amp; Facturation
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Paiement par carte bancaire en ligne (Stripe), virement bancaire pour les délégations, ou règlement sur place. Facture officielle et voucher PDF immédiats.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#C8102E] group-hover:translate-x-1 transition-transform">
              <span>Engager une réservation</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

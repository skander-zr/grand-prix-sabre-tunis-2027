import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Phone, Mail, MapPin, Building2, Bus, ShieldCheck, Lock, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#022345] text-slate-300 border-t border-blue-900/40 no-print">
      
      {/* Top Institutional Sponsor & Federation Band */}
      <div className="bg-[#01172E] py-6 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white text-[#03396C] flex items-center justify-center font-black text-lg shadow-xs">
              FIE
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-wide">
                Fédération Tunisienne d'Escrime (FTE)
              </div>
              <div className="text-xs text-blue-200">
                Organisateur officiel sous l'égide de la Fédération Internationale d'Escrime (FIE)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200 font-medium">
            <span className="text-white font-semibold">République Tunisienne</span>
            <span>&bull;</span>
            <span>Ministère de la Jeunesse et des Sports</span>
            <span>&bull;</span>
            <span>Comité National Olympique Tunisien (CNOT)</span>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Platform & Branding */}
          <div className="space-y-3">
            <div className="text-white font-extrabold text-base tracking-tight font-heading">
              GRAND PRIX SABRE TUNIS 2027
            </div>
            <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider font-mono">
              Official Accommodation &amp; Transfer Platform
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Plateforme centralisée pour la réservation d'hébergement 5★ à Gammarth, la coordination des transferts aéroports (TUN, NBE, MIR) et la délivrance des vouchers officiels FIE.
            </p>
            <div className="pt-1 text-xs text-blue-100 font-mono">
              Dates : <strong>15 — 17 Janvier 2027</strong>
            </div>
          </div>

          {/* Col 2: The 2 Hotels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Les 2 Hôtels Partenaires 5★
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hotels')}
                  className="hover:text-white transition-colors text-left cursor-pointer group"
                >
                  <strong className="text-white block group-hover:underline">1. Hôtel El Mouradi Gammarth (5★)</strong>
                  <span className="text-slate-400 text-[11px]">Village Officiel Athlètes &bull; Balnéothérapie &bull; Bord de Mer</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hotels')}
                  className="hover:text-white transition-colors text-left cursor-pointer group"
                >
                  <strong className="text-white block group-hover:underline">2. Hôtel Golden Carthage (5★)</strong>
                  <span className="text-slate-400 text-[11px]">QG Exécutif FIE, Corps Arbitral &bull; Colline de Gammarth</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Navigation Officielle
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hotels')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Catalogue des 2 Hôtels 5★
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('booking')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Formulaire de Réservation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shuttle')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Navettes Aéroports (TUN, NBE, MIR)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('client')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Mes Réservations &amp; Voucher A4
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Venue */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Permanence &amp; Coordination
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Salle Omnisports de Radès, Cité Olympique, Tunis</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-300 shrink-0" />
                <a href="tel:+21671840500" className="hover:text-white font-mono">
                  +216 71 840 500
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                <a href="mailto:contact@escrime-tunis2027.com" className="hover:text-white">
                  contact@escrime-tunis2027.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Discreet Admin Access */}
        <div className="mt-10 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; 2026—2027 Fédération Internationale d'Escrime (FIE) &bull; Fédération Tunisienne d'Escrime (FTE). Tous droits réservés.
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Accès Espace Hôte &amp; Admin</span>
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
};

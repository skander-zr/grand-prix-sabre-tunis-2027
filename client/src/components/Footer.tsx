import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Swords, Phone, Mail, MapPin, Building2, Bus, ShieldCheck, Lock, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#03060C] text-slate-300 border-t border-[#D4AF37]/20 no-print">
      
      {/* Top Institutional Sponsor & Federation Band */}
      <div className="bg-[#050912] py-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#0C1527] p-0.5 border border-[#D4AF37]/40 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#070D18] rounded flex flex-col items-center justify-center text-center p-1 font-bold">
                <span className="text-[11px] text-[#D4AF37] font-black">FIE</span>
                <span className="text-[7px] text-[#F5E8C7] font-bold">TUNIS</span>
              </div>
            </div>
            <div>
              <div className="text-white font-black text-sm uppercase tracking-wider font-heading">
                Fédération Tunisienne d'Escrime (FTE)
              </div>
              <div className="text-xs text-slate-400">
                Organisateur officiel sous l'égide de la Fédération Internationale d'Escrime (FIE)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1.5 text-white font-bold">
              <span>🇹🇳</span> République Tunisienne
            </span>
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
            <div className="flex items-center gap-2 text-white font-black text-base uppercase tracking-wider font-heading">
              <Swords className="w-5 h-5 text-[#D4AF37]" />
              <span>GRAND PRIX SABRE TUNIS 2027</span>
            </div>
            <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider font-mono">
              Official Accommodation &amp; Transfer Platform
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Plateforme centralisée pour la réservation d'hébergement 5★ à Gammarth, la coordination des transferts exclusifs Aéroport Tunis-Carthage (TUN) et la délivrance des vouchers officiels FIE.
            </p>
            <div className="pt-2 text-xs text-slate-300 font-mono">
              Tournoi Mondial : <strong className="text-[#F5E8C7]">15 — 17 Janvier 2027</strong>
            </div>
          </div>

          {/* Col 2: The 2 Hotels */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Les 2 Hôtels Partenaires 5★
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hotels')}
                  className="hover:text-[#F5E8C7] transition-colors text-left cursor-pointer group"
                >
                  <strong className="text-white block group-hover:text-[#D4AF37]">1. Hôtel El Mouradi Gammarth (5★)</strong>
                  <span className="text-slate-400 text-[11px]">Village Officiel Athlètes &amp; Délégations (Bord de Mer)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hotels')}
                  className="hover:text-[#F5E8C7] transition-colors text-left cursor-pointer group"
                >
                  <strong className="text-white block group-hover:text-[#D4AF37]">2. Hôtel Golden Carthage (5★)</strong>
                  <span className="text-slate-400 text-[11px]">QG Directoire Technique, Arbitres &amp; VIPs (Colline)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Navigation Officielle
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button type="button" onClick={() => onNavigate('hotels')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  &bull; Hôtels Officiels &amp; Tarifs Négociés FIE
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('booking')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  &bull; Réservation Délégation &amp; Formule Individuelle
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('shuttle')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  &bull; Navettes Aéroport Tunis-Carthage (TUN)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('client')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  &bull; Mon Dossier &amp; Voucher Officiel PDF (A4)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Assistance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Permanence FIE / FTE 24/7
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Salle Omnisports de Radès, Tunis</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="font-mono">Support : +216 71 840 500 / +216 98 440 112</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>logistique@escrime-tunisie.tn</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#070D18] border border-[#D4AF37]/20 text-[11px] text-slate-300">
              Desk permanent ouvert 24h/24 à l'Aéroport International de Tunis-Carthage (Terminal 1 Sortie).
            </div>
          </div>

        </div>

        {/* Bottom Bar with Discreet Admin Access */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026-2027 Fédération Tunisienne d'Escrime (FTE) &amp; Fédération Internationale d'Escrime (FIE). Tous droits réservés.
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-500 hover:text-[#D4AF37] transition-colors text-[11px] cursor-pointer"
              title="Accès Administrateur / Établissement (PIN requis)"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portail Hôte &amp; Directoire FIE</span>
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
};

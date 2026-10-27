import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Swords, Phone, Mail, MapPin, Building2, Bus, ShieldCheck, ExternalLink, Calendar } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#02050b] text-slate-300 border-t border-[#122037] no-print">
      
      {/* Top Institutional Sponsor & Federation Band */}
      <div className="bg-[#040812] py-6 border-b border-[#0f1b2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 via-[#0048c4] to-[#050b17] p-0.5 border border-sky-400/40 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#070e1c] rounded-[10px] flex flex-col items-center justify-center text-center p-1 font-bold">
                <span className="text-[11px] text-sky-400 font-black">FIE</span>
                <span className="text-[7px] text-amber-400 font-bold">TUNIS</span>
              </div>
            </div>
            <div>
              <div className="text-white font-black text-sm uppercase tracking-tight">Fédération Tunisienne d'Escrime (FTE)</div>
              <div className="text-xs text-slate-400">Organisateur officiel sous l'égide de la Fédération Internationale d'Escrime (FIE)</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
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
            <div className="flex items-center gap-2 text-white font-black text-base uppercase tracking-tight">
              <Swords className="w-5 h-5 text-cyan-400" />
              <span>GRAND PRIX SABRE TUNIS 2027</span>
            </div>
            <p className="text-xs text-sky-400 font-bold uppercase tracking-wider">
              Official Accommodation & Transfer Platform
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Plateforme centralisée pour la réservation d'hébergement, la coordination des navettes aéroport (TUN / NBE / MIR) et la délivrance des vouchers officiels FIE.
            </p>
            <div className="pt-2 text-xs text-slate-300 font-mono">
              Tournoi Mondial : <strong>15 — 17 Janvier 2027</strong>
            </div>
          </div>

          {/* Col 2: The 2 Hotels */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Les 2 Hôtels Partenaires 5★
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hotels')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer group"
                >
                  <strong className="text-white block group-hover:text-cyan-300">1. Hôtel El Mouradi Gammarth (5★)</strong>
                  <span className="text-slate-400 text-[11px]">Village Officiel Athlètes & Délégations (Mer & Spa)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hotels')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer group"
                >
                  <strong className="text-white block group-hover:text-cyan-300">2. Hôtel Golden Carthage (5★)</strong>
                  <span className="text-slate-400 text-[11px]">QG Exécutif FIE, Arbitres & Directoire (Colline)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Navigation Rapide
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button type="button" onClick={() => onNavigate('hotels')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  &bull; Hôtels Officiels & Tarifs Négociés
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('booking')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  &bull; Réservation Individuelle & Groupe Fédération
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('shuttle')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  &bull; Navettes Aéroport TUN / NBE / MIR
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('client')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  &bull; Mon Dossier & Voucher Officiel PDF
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenAdmin} className="text-amber-400 hover:text-amber-300 transition-colors font-bold cursor-pointer">
                  &bull; 🔑 Accès Hôte & Admin (Gestion Hôtelière & FIE)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Assistance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Assistance Délégations 24/7
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Salle Omnisports de Radès, Tunis</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">Hotline : +216 71 889 000 / +216 98 440 112</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>transport@escrime-tunisie.tn</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#081324] border border-[#14233c] text-[11px] text-slate-300">
              Desk permanent ouvert 24h/24 à l'Aéroport International de Tunis-Carthage (Terminal 1 Sortie).
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#122037] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026-2027 Fédération Tunisienne d'Escrime (FTE) & Fédération Internationale d'Escrime (FIE). Tous droits réservés.
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Règlement FIE 2026/27</span>
            <span>&bull;</span>
            <span>Protocole Sanitaire & Sécurité</span>
            <span>&bull;</span>
            <span>Mentions Légales</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

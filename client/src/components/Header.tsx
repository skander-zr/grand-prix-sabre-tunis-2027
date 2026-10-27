import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, CalendarRange, Bus, Ticket, ShieldCheck, Menu, X, Swords, Globe, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hotels', label: lang === 'fr' ? 'Hôtels Officiels 5★' : 'Official 5★ Hotels', icon: Building2 },
    { id: 'booking', label: lang === 'fr' ? 'Réserver Tournoi' : 'Tournament Booking', icon: CalendarRange },
    { id: 'shuttle', label: lang === 'fr' ? 'Navettes Aéroport' : 'Airport Transfers', icon: Bus },
    { id: 'client', label: lang === 'fr' ? 'Mon Dossier & Voucher' : 'My File & Voucher', icon: Ticket },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050913]/95 backdrop-blur-xl border-b border-[#14233c] shadow-2xl no-print">
      
      {/* Official FIE Competition Top Bar with Scoreboard Touché Lights */}
      <div className="bg-[#03060c] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#0f1a2e] text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-300">
          
          {/* Fencing electronic scoring cues + Event label */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#091120] px-2.5 py-0.5 rounded-full border border-sky-950">
              <span className="w-2 h-2 rounded-full touche-green" title="Signal Lampe Verte (Touche Droite)"></span>
              <span className="w-2 h-2 rounded-full touche-red" title="Signal Lampe Rouge (Touche Gauche)"></span>
              <span className="font-mono font-bold text-sky-400 tracking-wider ml-1 uppercase text-[10px]">
                FIE GP SABRE 2026/27
              </span>
            </div>

            <span className="hidden sm:inline text-slate-600">/</span>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="text-amber-400 font-bold">15 - 17 Janvier 2027</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                Salle Omnisports de Radès, Tunis 🇹🇳
              </span>
            </div>
          </div>

          {/* Right Tools: Support Hotline & Lang switch */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Official Tournament Logistics Hotline */}
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[10px]">
              <span className="text-slate-500">Support Officiel FIE :</span>
              <a href="tel:+21671840500" className="font-mono text-sky-400 hover:text-white font-bold transition-colors">
                +216 71 840 500
              </a>
            </div>

            {/* Language Selector */}
            <div className="inline-flex items-center bg-[#0a1324] rounded-lg p-0.5 border border-sky-950 text-[11px] font-bold">
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  lang === 'fr'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FR 🇫🇷
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  lang === 'en'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN 🇬🇧
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Official Emblem & Championship Title */}
          <div
            onClick={() => setActiveTab('hotels')}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            {/* Official FIE / FTE Sabre Medallion */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 via-[#0048c4] to-[#050b17] p-0.5 shadow-lg shadow-sky-950/60 flex items-center justify-center border border-sky-400/40 group-hover:border-cyan-400 transition-all">
                <div className="w-full h-full bg-[#070e1c] rounded-[10px] flex flex-col items-center justify-center text-center p-1">
                  <div className="flex items-center gap-0.5 text-sky-400 font-black text-[11px] tracking-tight leading-none">
                    <Swords className="w-3 h-3 text-cyan-400" />
                    <span>FIE</span>
                  </div>
                  <span className="text-[8px] font-extrabold text-amber-400 leading-tight">SABRE</span>
                  <span className="text-[7px] text-rose-400 font-bold tracking-wider">TUNIS</span>
                </div>
              </div>
              {/* Tunisian Flag Pin */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0a1324] border border-slate-700 flex items-center justify-center text-[10px] shadow">
                🇹🇳
              </div>
            </div>

            {/* Typography for Header Title */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight uppercase group-hover:text-cyan-300 transition-colors">
                  GRAND PRIX SABRE TUNIS 2027
                </span>
                <span className="hidden xl:inline text-[9px] font-black uppercase px-2 py-0.5 rounded bg-sky-950 text-cyan-400 border border-sky-800 tracking-wider">
                  OFFICIAL
                </span>
              </div>
              <p className="text-xs font-semibold text-sky-400 tracking-wide uppercase">
                Official Accommodation & Transfer Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isHost = item.isHost;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25 border border-sky-400/50'
                      : 'text-slate-300 hover:text-white hover:bg-[#0e1b30] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Quick Action Book Button */}
            <button
              onClick={() => setActiveTab('booking')}
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-slate-950 uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Réserver' : 'Book Now'}</span>
            </button>
          </nav>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#0d182b] text-slate-300 hover:text-white border border-[#1a2d4c]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070e1c] border-b border-[#14233c] px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-[#0f1c33]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

    </header>
  );
};

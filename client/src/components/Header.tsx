import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, CalendarRange, Bus, Ticket, ShieldCheck, Menu, X, Swords, Phone, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAdmin }) => {
  const { lang, setLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'hotels',
      label: lang === 'fr' ? 'Hôtels Officiels 5★' : 'Official 5★ Hotels',
      badge: 'Gammarth',
      icon: Building2
    },
    {
      id: 'booking',
      label: lang === 'fr' ? 'Réservation Tournoi' : 'Tournament Booking',
      badge: lang === 'fr' ? '100% Cash sur place' : '100% Cash on site',
      icon: CalendarRange
    },
    {
      id: 'shuttle',
      label: lang === 'fr' ? 'Navettes Aéroport TUN' : 'Airport Transfers (TUN)',
      badge: 'Radès & Gammarth',
      icon: Bus
    },
    {
      id: 'client',
      label: lang === 'fr' ? 'Mon Dossier & Voucher' : 'My File & Voucher',
      badge: 'A4 PDF',
      icon: Ticket
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060B14]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-2xl no-print">
      
      {/* Official FIE Competition Top Bar with Favero Scoreboard Touché Lights */}
      <div className="bg-[#04070D] py-2 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-300">
          
          {/* Fencing electronic scoring indicators + Official FIE Sanction */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#09101E] px-2.5 py-1 rounded border border-[#D4AF37]/30 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full touche-lamp-red" title="Lampe Rouge (Touche Gauche)"></span>
              <span className="w-2 h-2 rounded-full touche-lamp-white" title="Lampe Blanche (Non-Valable)"></span>
              <span className="w-2.5 h-2.5 rounded-full touche-lamp-green" title="Lampe Verte (Touche Droite)"></span>
              <span className="font-mono font-bold text-[#F5E8C7] tracking-wider ml-1 uppercase text-[10px]">
                FIE GP SABRE 2026/27
              </span>
            </div>

            <span className="hidden sm:inline text-slate-600">&bull;</span>

            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <span className="text-[#D4AF37] font-bold tracking-wider">15 — 17 JANVIER 2027</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-300">Salle Omnisports de Radès &bull; Hôtels 5★ Gammarth</span>
            </div>
          </div>

          {/* Right Tools: Official Logistics Hotline & Language Switcher */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Official Tournament Logistics Hotline */}
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[10px]">
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-slate-400">Permanence FIE / FTE :</span>
              <a href="tel:+21671840500" className="font-mono text-[#F5E8C7] hover:text-white font-bold transition-colors">
                +216 71 840 500
              </a>
            </div>

            {/* Language Selector */}
            <div className="inline-flex items-center bg-[#091120] rounded p-0.5 border border-[#D4AF37]/30 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-[#D4AF37] text-[#060B14] font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FR 🇫🇷
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#D4AF37] text-[#060B14] font-black shadow-sm'
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
            {/* Official Tournament Crest */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#121E36] via-[#091122] to-[#04070D] p-0.5 shadow-lg border border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-all flex items-center justify-center">
              <div className="w-full h-full rounded flex items-center justify-center bg-[#060B14]/80">
                <Swords className="w-6 h-6 text-[#D4AF37] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            {/* Exact Official Tournament Title */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-white text-base sm:text-lg tracking-wider uppercase leading-none">
                  GRAND PRIX SABRE TUNIS 2027
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
                  FIE
                </span>
              </div>
              <p className="text-[11px] text-[#C59B27] font-medium tracking-wide mt-1 uppercase">
                Official Accommodation &amp; Transfer Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 py-2 rounded-md font-medium text-xs xl:text-sm tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'text-[#F5E8C7] bg-[#101B2E] border border-[#D4AF37]/40 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0F192C] text-slate-200 border border-[#D4AF37]/30 hover:text-white cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070D18] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#121F38] text-[#F5E8C7] border border-[#D4AF37]/40'
                    : 'text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#D4AF37] border border-[#D4AF37]/20">
                  {item.badge}
                </span>
              </button>
            );
          })}

          {/* Subtle Mobile Admin Link */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>Salle Omnisports de Radès &bull; Tunis 2027</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 text-slate-500 hover:text-[#D4AF37] text-[11px]"
              >
                <Lock className="w-3 h-3" />
                <span>Accès Espace Hôte</span>
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};

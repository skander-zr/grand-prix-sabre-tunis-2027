import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, CalendarRange, Bus, Ticket, Menu, X, Shield, Lock, Phone } from 'lucide-react';

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
      icon: Building2
    },
    {
      id: 'booking',
      label: lang === 'fr' ? 'Réservation Tournoi' : 'Tournament Booking',
      icon: CalendarRange
    },
    {
      id: 'shuttle',
      label: lang === 'fr' ? 'Navettes Aéroport' : 'Airport Transfers',
      icon: Bus
    },
    {
      id: 'client',
      label: lang === 'fr' ? 'Mes Réservations' : 'My Bookings',
      icon: Ticket
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-xs no-print">
      
      {/* Official Top Institutional Bar */}
      <div className="bg-[#03396C] text-white py-2 px-4 sm:px-6 lg:px-8 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Exact required title */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C8102E]"></span>
            <span className="font-semibold text-white tracking-wide">
              GRAND PRIX SABRE TUNIS 2027 - Official Accommodation &amp; Transfer Platform
            </span>
            <span className="hidden md:inline text-blue-200">|</span>
            <span className="hidden md:inline text-blue-100 text-[11px]">
              15 — 17 Janvier 2027 &bull; Salle Omnisports de Radès
            </span>
          </div>

          {/* Right Tools: Hotline & Functional Language Selector */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden lg:flex items-center gap-1.5 text-blue-100 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-blue-300" />
              <span>Permanence FIE / FTE :</span>
              <a href="tel:+21671840500" className="text-white font-mono font-semibold hover:underline">
                +216 71 840 500
              </a>
            </div>

            {/* Language Switcher */}
            <div className="inline-flex items-center bg-[#022345] rounded-md p-0.5 border border-blue-400/30 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-white text-[#03396C] font-bold shadow-xs'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-[#03396C] font-bold shadow-xs'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Identity */}
          <div
            onClick={() => setActiveTab('hotels')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-lg bg-[#03396C] text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-[#005B96] transition-colors">
              FIE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#0F172A] text-base tracking-tight font-heading group-hover:text-[#03396C] transition-colors">
                  Grand Prix Sabre Tunis 2027
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  Coupe du Monde
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Fédération Internationale d'Escrime &bull; Fédération Tunisienne d'Escrime
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#03396C] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Admin Access Gate */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Portail Sécurisé Comité & Directoire"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Espace Admin</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1 shadow-md">
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-[#03396C] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                onOpenAdmin?.();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Accès Espace Admin (Directoire &amp; Hôtels)</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};

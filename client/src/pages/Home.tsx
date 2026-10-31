import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { HotelsSection } from '../components/HotelsSection';
import { BookingModule } from '../components/BookingModule';
import { ShuttleModule } from '../components/ShuttleModule';
import { ClientPortal } from '../components/ClientPortal';
import { SuperAdminDashboard } from '../components/SuperAdminDashboard';
import { AdminAuthGate } from '../components/AdminAuthGate';
import { Footer } from '../components/Footer';
import { Reservation } from '../types/gp';

export default function Home() {
  const [location, setLocation] = useLocation();

  const getInitialTab = () => {
    if (location === '/admin' || location === '/hote' || location === '/espace-hote') return 'admin';
    if (location === '/reservation') return 'booking';
    if (location === '/navettes') return 'shuttle';
    if (location === '/mes-reservations') return 'client';
    return 'hotels';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [preselectedHotelId, setPreselectedHotelId] = useState<'el-mouradi-gammarth' | 'golden-carthage'>('el-mouradi-gammarth');
  const [shuttleBookingCode, setShuttleBookingCode] = useState<string>('');

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gps2027_admin_auth') === 'true';
  });
  const [adminRole, setAdminRole] = useState<'el-mouradi-gammarth' | 'golden-carthage' | 'super-admin'>(() => {
    return (sessionStorage.getItem('gps2027_admin_role') as any) || 'super-admin';
  });

  const handleAdminLogin = (role: 'el-mouradi-gammarth' | 'golden-carthage' | 'super-admin') => {
    setIsAdminAuthenticated(true);
    setAdminRole(role);
    sessionStorage.setItem('gps2027_admin_auth', 'true');
    sessionStorage.setItem('gps2027_admin_role', role);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('gps2027_admin_auth');
    sessionStorage.removeItem('gps2027_admin_role');
    setActiveTab('hotels');
  };

  // Sync tab with URL location
  useEffect(() => {
    if (location === '/admin' || location === '/hote' || location === '/espace-hote') {
      setActiveTabState('admin');
    } else if (location === '/reservation') {
      setActiveTabState('booking');
    } else if (location === '/navettes') {
      setActiveTabState('shuttle');
    } else if (location === '/mes-reservations') {
      setActiveTabState('client');
    } else if (location === '/hotels') {
      setActiveTabState('hotels');
    }
  }, [location]);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (tab === 'admin') setLocation('/admin');
    else if (tab === 'booking') setLocation('/reservation');
    else if (tab === 'shuttle') setLocation('/navettes');
    else if (tab === 'client') setLocation('/mes-reservations');
    else setLocation('/hotels');
  };

  // When user clicks "Choisir cet hôtel" in HotelsSection
  const handleSelectHotel = (hotelId: 'el-mouradi-gammarth' | 'golden-carthage') => {
    setPreselectedHotelId(hotelId);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When a booking completes successfully
  const handleBookingSuccess = (reservation: Reservation) => {
    setShuttleBookingCode(reservation.id);
  };

  // Direct transition from booking confirmation to shuttle reservation
  const handleGoToShuttle = (code: string) => {
    setShuttleBookingCode(code);
    setActiveTab('shuttle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      
      {/* Platform Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'admin' ? (
          <div className="animate-fadeIn">
            {!isAdminAuthenticated ? (
              <AdminAuthGate
                onSuccess={(role) => handleAdminLogin(role)}
                onCancel={() => setActiveTab('hotels')}
              />
            ) : (
              <>
                {/* Official Session Header */}
                <div className="bg-white border-b border-slate-200 no-print py-2.5 px-4 sm:px-6 shadow-xs">
                  <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span className="text-slate-600">
                        Session Accréditée :{' '}
                        <strong className="text-[#03396C]">
                          {adminRole === 'super-admin'
                            ? 'Comité Directeur FIE / FTE (Super-Admin)'
                            : adminRole === 'el-mouradi-gammarth'
                            ? 'Direction Hôtel El Mouradi Gammarth'
                            : 'Direction Hôtel Golden Carthage'}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <button
                        onClick={() => setActiveTab('hotels')}
                        className="text-[#03396C] hover:underline font-semibold cursor-pointer"
                      >
                        &larr; Consulter le site public
                      </button>
                      <button
                        onClick={handleAdminLogout}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-[11px] font-semibold cursor-pointer"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
                <SuperAdminDashboard />
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Show full HeroBanner on hotels homepage */}
            {activeTab === 'hotels' && (
              <HeroBanner
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Compact Official Breadcrumb for other tabs */}
            {activeTab !== 'hotels' && (
              <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 no-print">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-bold text-[#03396C]">Grand Prix Sabre Tunis 2027</span>
                    <span>&bull;</span>
                    <span className="text-slate-700 font-medium">
                      {activeTab === 'booking' && 'Formulaire Officiel d\'Engagement & Réservation Hôtelière 5★'}
                      {activeTab === 'shuttle' && 'Transferts Aéroports Officiels (TUN, NBE, MIR)'}
                      {activeTab === 'client' && 'Portail Délégations & Voucher / Facture A4'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('hotels')}
                    className="text-[#03396C] hover:underline font-semibold text-xs cursor-pointer"
                  >
                    &larr; Retour aux Hôtels 5★
                  </button>
                </div>
              </div>
            )}

            {/* Active Content Section */}
            <div className="animate-fadeIn">
              {activeTab === 'hotels' && (
                <HotelsSection onSelectHotel={handleSelectHotel} />
              )}

              {activeTab === 'booking' && (
                <BookingModule
                  preselectedHotelId={preselectedHotelId}
                  onBookingSuccess={handleBookingSuccess}
                  onGoToShuttle={handleGoToShuttle}
                />
              )}

              {activeTab === 'shuttle' && (
                <ShuttleModule
                  initialCode={shuttleBookingCode}
                  onShuttleSuccess={handleBookingSuccess}
                  onNavigateToBooking={() => setActiveTab('booking')}
                />
              )}

              {activeTab === 'client' && (
                <ClientPortal
                  initialCode={shuttleBookingCode}
                  onGoToShuttleBooking={(code) => {
                    setShuttleBookingCode(code);
                    setActiveTab('shuttle');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Platform Institutional Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

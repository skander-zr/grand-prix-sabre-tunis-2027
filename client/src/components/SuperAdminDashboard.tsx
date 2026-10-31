import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReservation } from '../contexts/ReservationContext';
import { Reservation, EmailLog, Hotel } from '../types/gp';
import {
  ShieldCheck,
  Building,
  Users,
  Bus,
  FileSpreadsheet,
  Mail,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Edit,
  Save,
  Lock,
  Eye,
  Filter,
  Send,
  Plane,
  Download,
  Calendar,
  Bed,
  BedDouble,
  Bell,
  Volume2
} from 'lucide-react';
import { VoucherModal } from './VoucherModal';
import { EmailPreviewModal } from './EmailPreviewModal';
import { toast } from 'sonner';

export const SuperAdminDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const {
    hotels,
    reservations,
    shuttleGroups,
    emailLogs,
    updateHotelRates,
    blockRooms,
    simulateSendEmail,
    exportReservationsCSV,
    acknowledgeFlightModification
  } = useReservation();

  // Web Audio API Synthesizer Chime for Live Flight Alerts
  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1 (587.33 Hz - D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2 (880 Hz - A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.15);
      gain2.gain.setValueAtTime(0.35, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  };

  // Ask for Web Notification API permissions on Admin mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Live Flight Modification Listener (Event + BroadcastChannel)
  useEffect(() => {
    const handleFlightAlert = (e: any) => {
      const data = e.detail || e.data?.payload;
      if (!data) return;

      playAlertChime();

      // Native browser notification if permitted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`[ALERTE NAVETTE] Vol Modifié : ${data.code}`, {
            body: `${data.delegation}\nAncien: ${data.oldFlight?.flightNumber} ➔ Nouveau: ${data.newFlight?.flightNumber}\nHeure d'arrivée: ${data.newFlight?.dateTime}`,
            icon: '/banner-gp-tunis-2027.png'
          });
        } catch (err) {
          console.warn('Notification error:', err);
        }
      }

      toast.warning(`[ALERTE NAVETTE] Vol modifié pour le dossier ${data.code}`, {
        description: `${data.delegation} : Ancien vol ${data.oldFlight?.flightNumber} ➔ Nouveau vol ${data.newFlight?.flightNumber} (${data.newFlight?.dateTime})`,
        duration: 10000
      });
    };

    window.addEventListener('gps2027_flight_alert', handleFlightAlert);

    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('gps2027_alerts');
      channel.onmessage = (msg) => {
        if (msg.data?.type === 'flight_alert') {
          handleFlightAlert({ detail: msg.data.payload });
        }
      };
    }

    return () => {
      window.removeEventListener('gps2027_flight_alert', handleFlightAlert);
      if (channel) channel.close();
    };
  }, []);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'reservations' | 'shuttles' | 'prices' | 'emails'>('reservations');

  // Filters for Reservations Table
  const [filterHotel, setFilterHotel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRoomType, setFilterRoomType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rate Editing State
  const [ratesForm, setRatesForm] = useState({
    elmSingle: hotels['el-mouradi-gammarth']?.roomTypes?.single?.pricePerNight ?? 130,
    elmDouble: hotels['el-mouradi-gammarth']?.roomTypes?.double?.pricePerNight ?? 180,
    gcSingle: hotels['golden-carthage']?.roomTypes?.single?.pricePerNight ?? 140,
    gcDouble: hotels['golden-carthage']?.roomTypes?.double?.pricePerNight ?? 190
  });

  // Room Block State
  const [blockForm, setBlockForm] = useState({
    elmSingleBlocked: hotels['el-mouradi-gammarth']?.roomTypes?.single?.blockedInventory ?? 15,
    elmDoubleBlocked: hotels['el-mouradi-gammarth']?.roomTypes?.double?.blockedInventory ?? 20,
    gcSingleBlocked: hotels['golden-carthage']?.roomTypes?.single?.blockedInventory ?? 10,
    gcDoubleBlocked: hotels['golden-carthage']?.roomTypes?.double?.blockedInventory ?? 15
  });

  // Modals
  const [selectedVoucherReservation, setSelectedVoucherReservation] = useState<Reservation | null>(null);
  const [selectedEmailLog, setSelectedEmailLog] = useState<EmailLog | null>(null);

  // Computed KPIs
  const totalBookings = reservations.length;
  const totalGuests = reservations.reduce((acc, r) => acc + (r.totalGuestsCount || 0), 0);
  const totalSingleRooms = reservations.reduce((acc, r) => acc + (r.singleRoomCount || 0), 0);
  const totalDoubleRooms = reservations.reduce((acc, r) => acc + (r.doubleRoomCount || 0), 0);
  const totalRevenueEUR = reservations.reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  // FTE Detailed Financial Breakdown
  const totalRoomRevenue = reservations.reduce((acc, r) => acc + (r.subtotalAmount || 0), 0);
  const totalLateCheckoutRevenue = reservations.reduce((acc, r) => acc + (r.upsells?.lateCheckout ? (r.upsells.lateCheckoutPrice || (50 * (r.singleRoomCount + r.doubleRoomCount))) : 0), 0);
  const totalVipVanRevenue = reservations.reduce((acc, r) => acc + (r.upsells?.vipShuttle ? (r.upsells.vipShuttlePrice || 90) : 0), 0);
  const totalPhysioRevenue = reservations.reduce((acc, r) => acc + (r.upsells?.physioRoomDays ? (r.upsells.physioRoomPrice || (100 * r.upsells.physioRoomDays)) : 0), 0);
  const totalAirportSurchargeRevenue = reservations.reduce((acc, r) => acc + (r.airportSurcharge || 0), 0);
  const totalOnsiteAdminRevenue = reservations.reduce((acc, r) => acc + (r.onsiteAdminSurcharge || 0), 0);
  const totalUpsellsRevenue = totalLateCheckoutRevenue + totalVipVanRevenue + totalPhysioRevenue + totalAirportSurchargeRevenue;

  // Occupancy Rates
  const elmSingleTotal = hotels['el-mouradi-gammarth']?.roomTypes?.single?.totalInventory ?? 90;
  const elmDoubleTotal = hotels['el-mouradi-gammarth']?.roomTypes?.double?.totalInventory ?? 130;
  const elmSingleBooked = reservations.filter(r => r.hotelId === 'el-mouradi-gammarth').reduce((a, b) => a + (b.singleRoomCount || 0), 0);
  const elmDoubleBooked = reservations.filter(r => r.hotelId === 'el-mouradi-gammarth').reduce((a, b) => a + (b.doubleRoomCount || 0), 0);
  const elmOccupancyRate = Math.round(((elmSingleBooked + elmDoubleBooked) / (elmSingleTotal + elmDoubleTotal)) * 100);

  const gcSingleTotal = hotels['golden-carthage']?.roomTypes?.single?.totalInventory ?? 70;
  const gcDoubleTotal = hotels['golden-carthage']?.roomTypes?.double?.totalInventory ?? 110;
  const gcSingleBooked = reservations.filter(r => r.hotelId === 'golden-carthage').reduce((a, b) => a + (b.singleRoomCount || 0), 0);
  const gcDoubleBooked = reservations.filter(r => r.hotelId === 'golden-carthage').reduce((a, b) => a + (b.doubleRoomCount || 0), 0);
  const gcOccupancyRate = Math.round(((gcSingleBooked + gcDoubleBooked) / (gcSingleTotal + gcDoubleTotal)) * 100);

  // Filtered Reservations
  const filteredReservations = reservations.filter(r => {
    if (filterHotel !== 'all' && r.hotelId !== filterHotel) return false;
    if (filterStatus !== 'all' && r.paymentStatus !== filterStatus) return false;
    if (filterRoomType === 'single' && r.singleRoomCount === 0) return false;
    if (filterRoomType === 'double' && r.doubleRoomCount === 0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const codeMatch = r.id.toLowerCase().includes(q);
      const nameMatch = r.type === 'group'
        ? r.federationGroup?.federationName.toLowerCase().includes(q)
        : `${r.individualLead?.firstName} ${r.individualLead?.lastName}`.toLowerCase().includes(q);
      if (!codeMatch && !nameMatch) return false;
    }
    return true;
  });

  // Arrivals Sorted Chronologically for Shuttle Dispatch
  const incomingShuttles = reservations
    .filter(r => r.hasShuttle && r.shuttle?.arrivalDateTime)
    .sort((a, b) => (a.shuttle?.arrivalDateTime || '').localeCompare(b.shuttle?.arrivalDateTime || ''));

  // Save Price Updates
  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateHotelRates('el-mouradi-gammarth', ratesForm.elmSingle, ratesForm.elmDouble);
    updateHotelRates('golden-carthage', ratesForm.gcSingle, ratesForm.gcDouble);
    toast.success('Tarifs officiels mis à jour et synchronisés.');
  };

  // Save Room Blocks
  const handleSaveBlocks = (e: React.FormEvent) => {
    e.preventDefault();
    blockRooms('el-mouradi-gammarth', 'single', blockForm.elmSingleBlocked);
    blockRooms('el-mouradi-gammarth', 'double', blockForm.elmDoubleBlocked);
    blockRooms('golden-carthage', 'single', blockForm.gcSingleBlocked);
    blockRooms('golden-carthage', 'double', blockForm.gcDoubleBlocked);
    toast.success('Quotas de blocage de sécurité enregistrés.');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F8FAFC] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Dashboard Top Header (Stripe / Linear Style) */}
        <div className="inst-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#03396C] border border-blue-200 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-[#03396C] font-bold border border-blue-200">
                  Comité Exécutif FIE / FTE &bull; Super Admin
                </span>
                <span className="text-xs text-slate-500 font-mono">Grand Prix Sabre Tunis 2027</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">
                Tableau de Bord Administratif &bull; Hôtellerie &amp; Navettes
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Supervision en temps réel des réservations, quotas hôteliers 5★, dispatch navettes aéroports et exports comptables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportReservationsCSV}
              className="btn-primary cursor-pointer text-xs font-semibold px-4 py-2.5 shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exporter Excel (.CSV)</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="inst-card p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Total Délégations &bull; Dossiers</span>
              <Users className="w-4 h-4 text-[#03396C]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F172A] font-mono">{totalBookings}</div>
            <div className="text-xs text-slate-500 mt-1">
              <strong>{totalGuests}</strong> participants hébergés
            </div>
          </div>

          <div className="inst-card p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Occupation El Mouradi (5★)</span>
              <Building className="w-4 h-4 text-[#03396C]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F172A] font-mono">{elmOccupancyRate}%</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-[#03396C] h-1.5 rounded-full" style={{ width: `${Math.min(100, elmOccupancyRate)}%` }}></div>
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex justify-between">
              <span>{elmSingleBooked + elmDoubleBooked} chambres occupées</span>
              <span>{elmSingleTotal + elmDoubleTotal} total</span>
            </div>
          </div>

          <div className="inst-card p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Occupation Golden Carthage (5★)</span>
              <Building className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F172A] font-mono">{gcOccupancyRate}%</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, gcOccupancyRate)}%` }}></div>
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex justify-between">
              <span>{gcSingleBooked + gcDoubleBooked} chambres occupées</span>
              <span>{gcSingleTotal + gcDoubleTotal} total</span>
            </div>
          </div>

          <div className="inst-card p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Volume Financier Global FTE</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F172A] font-mono">{totalRevenueEUR} €</div>
            <div className="text-xs text-slate-500 mt-1">
              ~{Math.round(totalRevenueEUR * 3.3)} TND (TTC, Buffets &amp; Options)
            </div>
          </div>

        </div>

        {/* FTE Detailed Financial Breakdown Panel (Chambres + Suppléments) */}
        <div className="inst-card p-6 bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#03396C]"></span>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Ventilation Détaillée des Revenus de la Fédération (FTE)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#03396C] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Total Encaissé / Facturé : {totalRevenueEUR} €
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-medium mb-1">1. Base Hébergement</div>
              <div className="text-lg font-black font-mono text-slate-900">{totalRoomRevenue} €</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Nuitées 5★ officielles</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200">
              <div className="text-[#03396C] font-medium mb-1">2. Late Check-out 19h</div>
              <div className="text-lg font-black font-mono text-[#03396C]">+{totalLateCheckoutRevenue} €</div>
              <div className="text-[10px] text-slate-500 mt-0.5">+50 € / chambre</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200">
              <div className="text-[#03396C] font-medium mb-1">3. Vans VIP Privatifs</div>
              <div className="text-lg font-black font-mono text-[#03396C]">+{totalVipVanRevenue} €</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Transferts dédiés</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200">
              <div className="text-[#03396C] font-medium mb-1">4. Salles Kiné / Matériel</div>
              <div className="text-lg font-black font-mono text-[#03396C]">+{totalPhysioRevenue} €</div>
              <div className="text-[10px] text-slate-500 mt-0.5">+100 € / jour</div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
              <div className="text-amber-800 font-medium mb-1">5. Suppléments NBE/MIR</div>
              <div className="text-lg font-black font-mono text-amber-900">+{totalAirportSurchargeRevenue} €</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Liaisons longue distance</div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
              <div className="text-amber-800 font-medium mb-1">6. Frais Règlement Sur Place</div>
              <div className="text-lg font-black font-mono text-amber-900">+{totalOnsiteAdminRevenue} €</div>
              <div className="text-[10px] text-slate-500 mt-0.5">+15 € / nuit / chambre</div>
            </div>

          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'reservations', label: `Réservations (${reservations.length})`, icon: Building },
            { id: 'shuttles', label: `Arrivées & Navettes (${incomingShuttles.length})`, icon: Bus },
            { id: 'prices', label: 'Tarifs & Quotas Hôteliers', icon: DollarSign },
            { id: 'emails', label: `Emails Automatiques (${emailLogs.length})`, icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${isActive
                    ? 'bg-[#03396C] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: RESERVATIONS TABLE */}
        {activeTab === 'reservations' && (
          <div className="space-y-4 animate-fadeIn">

            {/* Filter Bar */}
            <div className="inst-card p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherche par code, pays ou nom..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs"
                  />
                </div>

                {/* Filter Hotel */}
                <select
                  value={filterHotel}
                  onChange={(e) => setFilterHotel(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="all">Tous les Hôtels</option>
                  <option value="el-mouradi-gammarth">El Mouradi Gammarth (5★)</option>
                  <option value="golden-carthage">Golden Carthage (5★)</option>
                </select>

                {/* Filter Room Type */}
                <select
                  value={filterRoomType}
                  onChange={(e) => setFilterRoomType(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="all">Tous types de chambres</option>
                  <option value="single">Avec Chambre Single</option>
                  <option value="double">Avec Chambre Double</option>
                </select>

                {/* Filter Payment Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="all">Tous les règlements</option>
                  <option value="paid">Payé en ligne</option>
                  <option value="pending_verification">Virement en attente</option>
                  <option value="pending_onsite">Sur place au check-in</option>
                </select>
              </div>

              <span className="text-xs text-slate-500 font-mono font-semibold">
                {filteredReservations.length} dossier{filteredReservations.length > 1 ? 's' : ''} affiché{filteredReservations.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto inst-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Délégation / Bénéficiaire</th>
                    <th className="py-3 px-4">Hôtel 5★</th>
                    <th className="py-3 px-4">Dates &amp; Nuits</th>
                    <th className="py-3 px-4">Chambres</th>
                    <th className="py-3 px-4">Montant TTC</th>
                    <th className="py-3 px-4">Règlement</th>
                    <th className="py-3 px-4">Navette</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredReservations.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-[#03396C]">
                        {res.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {res.type === 'group'
                            ? res.federationGroup?.federationName
                            : `${res.individualLead?.firstName} ${res.individualLead?.lastName}`}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {res.federationGroup?.country || res.individualLead?.nationality} &bull; {res.totalGuestsCount} pers.
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {res.hotelId === 'el-mouradi-gammarth' ? 'El Mouradi Gammarth' : 'Golden Carthage'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {res.checkInDate} &rarr; {res.checkOutDate} ({res.nightsCount}n)
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {res.singleRoomCount > 0 && `${res.singleRoomCount}S `}
                        {res.doubleRoomCount > 0 && `${res.doubleRoomCount}D`}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {res.totalAmount} €
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${res.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : res.paymentMethod === 'bank_transfer'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                          {res.paymentStatus === 'paid' ? 'Payé CB' : res.paymentMethod === 'bank_transfer' ? 'Virement FIE' : 'Sur Place'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {res.hasShuttle ? (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 font-mono">
                            <Bus className="w-3.5 h-3.5" />
                            <span>{res.shuttle?.airport}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedVoucherReservation(res)}
                          className="p-1.5 text-[#03396C] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="Voir le Voucher / Facture"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: SHUTTLES & ARRIVALS DISPATCH */}
        {activeTab === 'shuttles' && (
          <div className="space-y-6 animate-fadeIn">

            {/* Alert Banner if any modified flights pending acknowledgement */}
            {incomingShuttles.some(s => s.flightModifiedRecently) && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950">
                      {incomingShuttles.filter(s => s.flightModifiedRecently).length} Vol(s) modifié(s) récemment par les délégations
                    </h4>
                    <p className="text-xs text-amber-800">
                      Les coordonnées d'arrivée ont été mises à jour depuis l'espace client. Veuillez vérifier les horaires et affectations de véhicules ci-dessous.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={playAlertChime}
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Tester Alerte Sonore</span>
                </button>
              </div>
            )}

            <div className="inst-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-1">
                    Dispatching des Arrivées Aéroports (TUN &bull; NBE &bull; MIR)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Planning chronologique des vols d'arrivée et regroupement automatique des délégations par tranche de 45 minutes pour l'affectation des véhicules.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Date &amp; Heure Arrivée</th>
                      <th className="py-3 px-4">Aéroport</th>
                      <th className="py-3 px-4">Vol &amp; Compagnie</th>
                      <th className="py-3 px-4">Délégation</th>
                      <th className="py-3 px-4">Passagers</th>
                      <th className="py-3 px-4">Housses Sabre</th>
                      <th className="py-3 px-4">WhatsApp Chauffeur</th>
                      <th className="py-3 px-4">Hôtel Destination</th>
                      <th className="py-3 px-4">Véhicule Assigné</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                    {incomingShuttles.map(res => {
                      const isModified = Boolean(res.flightModifiedRecently);
                      return (
                        <tr
                          key={res.id}
                          className={`transition-colors ${
                            isModified
                              ? 'bg-amber-50/90 border-l-4 border-l-amber-500 hover:bg-amber-100/70'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div>{res.shuttle?.arrivalDateTime ? res.shuttle.arrivalDateTime.replace('T', ' ') : 'N/A'}</div>
                            {isModified && res.previousFlightDetails?.dateTime && (
                              <div className="text-[10px] text-amber-800 font-normal line-through">
                                Précédent: {res.previousFlightDetails.dateTime}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-[#03396C] font-bold border border-blue-200">
                              {res.shuttle?.airport}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-sans">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <strong>{res.shuttle?.arrivalFlightNumber}</strong> ({res.shuttle?.arrivalAirline})
                              {isModified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow-xs animate-pulse">
                                  <span>⚠️ Vol modifié récemment</span>
                                </span>
                              )}
                            </div>
                            {isModified && res.previousFlightDetails?.flightNumber && (
                              <div className="text-[10px] text-amber-800 mt-0.5">
                                Ancien vol : <span className="line-through">{res.previousFlightDetails.flightNumber}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-sans font-semibold">
                            <div>
                              {res.type === 'group'
                                ? res.federationGroup?.federationName
                                : `${res.individualLead?.firstName} ${res.individualLead?.lastName}`}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 font-normal">
                              {res.id}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-bold">
                            {res.shuttle?.passengerCount}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-[#C8102E]">
                            {res.shuttle?.weaponBagsCount}
                          </td>
                          <td className="py-3 px-4 font-sans text-xs">
                            {res.shuttle?.driverWhatsApp}
                          </td>
                          <td className="py-3 px-4 font-sans text-xs">
                            {res.hotelId === 'el-mouradi-gammarth' ? 'El Mouradi Gammarth' : 'Golden Carthage'}
                          </td>
                          <td className="py-3 px-4 font-sans text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-emerald-800">
                                {res.shuttle?.assignedVehicle || 'Minibus Sprinter #1'}
                              </span>
                              {isModified && (
                                <button
                                  type="button"
                                  onClick={() => acknowledgeFlightModification(res.id)}
                                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold shrink-0 transition-colors cursor-pointer shadow-xs"
                                  title="Acquitter et retirer le badge d'alerte"
                                >
                                  ✓ Acquitter
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: PRICES & ROOM QUOTAS */}
        {activeTab === 'prices' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">

            {/* Price Editor */}
            <div className="inst-card p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#03396C]" />
                  <span>Gestion des Tarifs par Nuitée (EUR)</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Les modifications de prix s'appliquent en direct sur les formulaires de réservation publics.
                </p>
              </div>

              <form onSubmit={handleSaveRates} className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hôtel El Mouradi Gammarth (5★)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Chambre Single (€)</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={ratesForm.elmSingle}
                        onChange={(e) => setRatesForm({ ...ratesForm, elmSingle: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Chambre Double (€)</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={ratesForm.elmDouble}
                        onChange={(e) => setRatesForm({ ...ratesForm, elmDouble: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hôtel Golden Carthage (5★)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Chambre Single (€)</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={ratesForm.gcSingle}
                        onChange={(e) => setRatesForm({ ...ratesForm, gcSingle: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Chambre Double (€)</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={ratesForm.gcDouble}
                        onChange={(e) => setRatesForm({ ...ratesForm, gcDouble: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary cursor-pointer text-xs font-semibold py-2.5 px-5"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Tarifs</span>
                </button>
              </form>
            </div>

            {/* Quota & Room Blocking Editor */}
            <div className="inst-card p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <span>Blocage de Chambres &amp; Quotas FIE</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Définissez le nombre de chambres réservées exclusivement pour le comité d'arbitrage et le directoire.
                </p>
              </div>

              <form onSubmit={handleSaveBlocks} className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quotas Bloqués &bull; El Mouradi</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Single Bloquées</label>
                      <input
                        type="number"
                        min={0}
                        max={90}
                        value={blockForm.elmSingleBlocked}
                        onChange={(e) => setBlockForm({ ...blockForm, elmSingleBlocked: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Double Bloquées</label>
                      <input
                        type="number"
                        min={0}
                        max={130}
                        value={blockForm.elmDoubleBlocked}
                        onChange={(e) => setBlockForm({ ...blockForm, elmDoubleBlocked: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quotas Bloqués &bull; Golden Carthage</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Single Bloquées</label>
                      <input
                        type="number"
                        min={0}
                        max={70}
                        value={blockForm.gcSingleBlocked}
                        onChange={(e) => setBlockForm({ ...blockForm, gcSingleBlocked: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Double Bloquées</label>
                      <input
                        type="number"
                        min={0}
                        max={110}
                        value={blockForm.gcDoubleBlocked}
                        onChange={(e) => setBlockForm({ ...blockForm, gcDoubleBlocked: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-secondary cursor-pointer text-xs font-semibold py-2.5 px-5"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Quotas</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 4: AUTOMATIC EMAILS LOGS & 48H REMINDERS */}
        {activeTab === 'emails' && (
          <div className="inst-card p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#03396C]" />
                <span>Centre de Messagerie &amp; Notifications Automatiques</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Suivi des confirmations envoyées aux délégations et programmation des rappels de convocation 48h avant le début des épreuves.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date &amp; Heure</th>
                    <th className="py-3 px-4">Dossier</th>
                    <th className="py-3 px-4">Destinataire</th>
                    <th className="py-3 px-4">Type de Message</th>
                    <th className="py-3 px-4">Objet de l'Email</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {emailLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {log.sentAt ? log.sentAt.replace('T', ' ').substring(0, 16) : 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#03396C]">
                        {log.bookingCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{log.recipientName}</div>
                        <div className="text-[11px] text-slate-500">{log.recipientEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.type === 'flight_modified_alert'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.type === 'booking_confirmation' && 'Confirmation Immédiate'}
                          {log.type === 'shuttle_assignment' && 'Attribution Navette'}
                          {log.type === 'reminder_48h' && 'Rappel J-2 Tournoi'}
                          {log.type === 'flight_modified_alert' && '⚠️ Alerte Vol Modifié'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {log.subject}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Délivré</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedEmailLog(log)}
                          className="p-1.5 text-[#03396C] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Aperçu de l'email"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Trigger 48h Reminder for all reservations */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Déclencher un rappel 48h pour les délégations arrivant le 14 janvier :
              </span>
              <button
                type="button"
                onClick={() => {
                  simulateSendEmail('GPS2027-FR48', 'reminder_48h');
                  toast.success('Rappels automatiques 48h expédiés aux délégations.');
                }}
                className="btn-secondary cursor-pointer text-xs font-semibold px-4 py-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simuler Envoi Rappel J-2</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Voucher Modal */}
      {selectedVoucherReservation && (
        <VoucherModal
          reservation={selectedVoucherReservation}
          hotel={hotels[selectedVoucherReservation.hotelId]}
          onClose={() => setSelectedVoucherReservation(null)}
        />
      )}

      {/* Email Preview Modal */}
      {selectedEmailLog && (
        <EmailPreviewModal
          emailLog={selectedEmailLog}
          onClose={() => setSelectedEmailLog(null)}
        />
      )}

    </div>
  );
};

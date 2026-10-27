import React, { useState } from 'react';
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
  Plane
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
    exportReservationsCSV
  } = useReservation();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'reservations' | 'shuttles' | 'prices' | 'export'>('reservations');

  // Filters for Reservations Table
  const [filterHotel, setFilterHotel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rate Editing State
  const [ratesForm, setRatesForm] = useState({
    elmSingle: hotels['el-mouradi-gammarth'].roomTypes.single.pricePerNight,
    elmDouble: hotels['el-mouradi-gammarth'].roomTypes.double.pricePerNight,
    gcSingle: hotels['golden-carthage'].roomTypes.single.pricePerNight,
    gcDouble: hotels['golden-carthage'].roomTypes.double.pricePerNight
  });

  // Room Block State
  const [blockForm, setBlockForm] = useState({
    elmSingleBlocked: hotels['el-mouradi-gammarth'].roomTypes.single.blockedInventory,
    elmDoubleBlocked: hotels['el-mouradi-gammarth'].roomTypes.double.blockedInventory,
    gcSingleBlocked: hotels['golden-carthage'].roomTypes.single.blockedInventory,
    gcDoubleBlocked: hotels['golden-carthage'].roomTypes.double.blockedInventory
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
  const totalRevenueTND = Math.round(totalRevenueEUR * 3.35);

  // Occupancy Rates
  const elmSingleTotal = hotels['el-mouradi-gammarth'].roomTypes.single.totalInventory;
  const elmDoubleTotal = hotels['el-mouradi-gammarth'].roomTypes.double.totalInventory;
  const elmSingleBooked = reservations.filter(r => r.hotelId === 'el-mouradi-gammarth').reduce((a, b) => a + b.singleRoomCount, 0);
  const elmDoubleBooked = reservations.filter(r => r.hotelId === 'el-mouradi-gammarth').reduce((a, b) => a + b.doubleRoomCount, 0);
  const elmOccupancyRate = Math.round(((elmSingleBooked + elmDoubleBooked) / (elmSingleTotal + elmDoubleTotal)) * 100);

  const gcSingleTotal = hotels['golden-carthage'].roomTypes.single.totalInventory;
  const gcDoubleTotal = hotels['golden-carthage'].roomTypes.double.totalInventory;
  const gcSingleBooked = reservations.filter(r => r.hotelId === 'golden-carthage').reduce((a, b) => a + b.singleRoomCount, 0);
  const gcDoubleBooked = reservations.filter(r => r.hotelId === 'golden-carthage').reduce((a, b) => a + b.doubleRoomCount, 0);
  const gcOccupancyRate = Math.round(((gcSingleBooked + gcDoubleBooked) / (gcSingleTotal + gcDoubleTotal)) * 100);

  // Filtered Reservations
  const filteredReservations = reservations.filter(r => {
    if (filterHotel !== 'all' && r.hotelId !== filterHotel) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
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
  };

  // Save Room Blocks
  const handleSaveBlocks = (e: React.FormEvent) => {
    e.preventDefault();
    blockRooms('el-mouradi-gammarth', 'single', blockForm.elmSingleBlocked);
    blockRooms('el-mouradi-gammarth', 'double', blockForm.elmDoubleBlocked);
    blockRooms('golden-carthage', 'single', blockForm.gcSingleBlocked);
    blockRooms('golden-carthage', 'double', blockForm.gcDoubleBlocked);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#030713] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin & Host Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#091730] via-[#0b2147] to-[#091730] border-2 border-amber-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                  ESPACE HÔTE & SUPER ADMIN
                </span>
                <span className="text-xs text-slate-400 font-mono">Gestion Hôtelière & Comité FIE/FTE</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Espace Hôte & Dashboard Super Admin • Grand Prix Sabre 2027
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Portail de gestion pour les hôteliers (El Mouradi Gammarth & Golden Carthage) et le comité d'organisation officiel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportReservationsCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('admin.exportCsv')}</span>
            </button>
          </div>
        </div>

        {/* Hotel Quick Switcher Bar for Hoteliers */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-sky-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Vue Établissement Hôtelier :</span>
            <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setFilterHotel('all')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  filterHotel === 'all' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏢 Tous les Hôtels ({reservations.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterHotel('el-mouradi-gammarth')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  filterHotel === 'el-mouradi-gammarth' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏖️ El Mouradi Gammarth ({reservations.filter(r => r.hotelId === 'el-mouradi-gammarth').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterHotel('golden-carthage')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  filterHotel === 'golden-carthage' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏛️ Golden Carthage ({reservations.filter(r => r.hotelId === 'golden-carthage').length})
              </button>
            </div>
          </div>
          <div className="text-slate-400 text-[11px]">
            Mode gestionnaire actif &bull; Quotas & listes synchronisés en temps réel
          </div>
        </div>

        {/* 5 Key Metric KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="p-4 rounded-xl bg-[#081326] border border-sky-900/50 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t('admin.kpi.bookings')}</span>
              <Building className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalBookings}</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>100% Confirmées</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#081326] border border-sky-900/50 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t('admin.kpi.guests')}</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300">{totalGuests}</div>
            <div className="text-[11px] text-slate-400 mt-1">Athlètes & Délégués</div>
          </div>

          <div className="p-4 rounded-xl bg-[#081326] border border-sky-900/50 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t('admin.kpi.single')}</span>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950 px-1.5 py-0.5 rounded">1 Pers</span>
            </div>
            <div className="text-2xl font-black text-amber-300">{totalSingleRooms}</div>
            <div className="text-[11px] text-slate-400 mt-1">Chambres simples</div>
          </div>

          <div className="p-4 rounded-xl bg-[#081326] border border-sky-900/50 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t('admin.kpi.double')}</span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.5 rounded">2 Pers</span>
            </div>
            <div className="text-2xl font-black text-white">{totalDoubleRooms}</div>
            <div className="text-[11px] text-slate-400 mt-1">Chambres doubles/twin</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-gradient-to-br from-amber-950/60 to-[#081326] border border-amber-500/40 shadow-lg">
            <div className="flex items-center justify-between text-amber-300 text-xs mb-1 font-bold">
              <span>{t('admin.kpi.revenue')}</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{totalRevenueEUR.toLocaleString()} €</div>
            <div className="text-[11px] text-slate-300 mt-1">~{totalRevenueTND.toLocaleString()} TND &bull; Cash sur place</div>
          </div>

        </div>

        {/* Real-time Occupancy Gauges for the 2 Hotels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* El Mouradi Gammarth */}
          <div className="p-5 rounded-2xl bg-[#081326] border border-sky-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Hôtel El Mouradi Gammarth (5★)</h3>
                <div className="text-xs text-slate-400">Village Officiel des Athlètes • Bord de mer</div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-cyan-400">{elmOccupancyRate}%</span>
                <span className="text-[11px] text-slate-400 block">Taux d'occupation</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(elmOccupancyRate, 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                Single : <strong>{elmSingleBooked} réservées</strong> / {elmSingleTotal} tot. (Bloquées : {hotels['el-mouradi-gammarth'].roomTypes.single.blockedInventory})
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                Double : <strong>{elmDoubleBooked} réservées</strong> / {elmDoubleTotal} tot. (Bloquées : {hotels['el-mouradi-gammarth'].roomTypes.double.blockedInventory})
              </div>
            </div>
          </div>

          {/* Golden Carthage */}
          <div className="p-5 rounded-2xl bg-[#081326] border border-sky-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Hôtel Golden Carthage (5★)</h3>
                <div className="text-xs text-slate-400">QG FIE, Arbitres & Corps Exécutif • Colline</div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-400">{gcOccupancyRate}%</span>
                <span className="text-[11px] text-slate-400 block">Taux d'occupation</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(gcOccupancyRate, 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                Single : <strong>{gcSingleBooked} réservées</strong> / {gcSingleTotal} tot. (Bloquées : {hotels['golden-carthage'].roomTypes.single.blockedInventory})
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                Double : <strong>{gcDoubleBooked} réservées</strong> / {gcDoubleTotal} tot. (Bloquées : {hotels['golden-carthage'].roomTypes.double.blockedInventory})
              </div>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-sky-950 pb-2">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reservations'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{t('admin.tab.reservations')} ({filteredReservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shuttles')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shuttles'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>{t('admin.tab.shuttles')} ({incomingShuttles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prices'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{t('admin.tab.prices')}</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'export'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{t('admin.tab.export')} ({emailLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: ALL RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Filters Bar */}
            <div className="p-4 rounded-xl bg-[#081326] border border-sky-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Code, délégation, nom..."
                    className="bg-transparent text-white focus:outline-none text-xs w-44"
                  />
                </div>

                <select
                  value={filterHotel}
                  onChange={(e) => setFilterHotel(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="all">Tous les Hôtels</option>
                  <option value="el-mouradi-gammarth">El Mouradi Gammarth</option>
                  <option value="golden-carthage">Golden Carthage</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="all">Tous les Statuts</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="pending">En attente</option>
                </select>
              </div>

              <div className="text-slate-400">
                Affichage : <strong>{filteredReservations.length} dossiers</strong>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="overflow-x-auto rounded-2xl border border-sky-900/50 bg-[#081326] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050c1b] text-slate-400 uppercase tracking-wider font-semibold border-b border-sky-950">
                  <tr>
                    <th className="py-3 px-4">Code Ref</th>
                    <th className="py-3 px-4">Délégation / Titulaire</th>
                    <th className="py-3 px-4">Hôtel</th>
                    <th className="py-3 px-4 text-center">Dates (Nuits)</th>
                    <th className="py-3 px-4 text-center">Chambres</th>
                    <th className="py-3 px-4 text-right">Montant EUR</th>
                    <th className="py-3 px-4 text-center">Navette</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-950/60">
                  {filteredReservations.map((res) => {
                    const isGroup = res.type === 'group';
                    const name = isGroup ? res.federationGroup?.federationName : `${res.individualLead?.firstName} ${res.individualLead?.lastName}`;
                    const hotelName = res.hotelId === 'el-mouradi-gammarth' ? 'El Mouradi' : 'Golden Carthage';

                    return (
                      <tr key={res.id} className="hover:bg-sky-950/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {res.id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          <div>{name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {isGroup ? `${res.totalGuestsCount} pers. • Chef : ${res.federationGroup?.contactPersonName}` : res.individualLead?.email}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            res.hotelId === 'el-mouradi-gammarth'
                              ? 'bg-sky-950 text-cyan-300 border border-sky-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {hotelName}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-300">
                          <div>{res.checkInDate} → {res.checkOutDate}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{res.nightsCount} nuits</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-semibold text-white">
                            {res.singleRoomCount > 0 && <span className="text-amber-300">{res.singleRoomCount} Sgl </span>}
                            {res.doubleRoomCount > 0 && <span className="text-cyan-300">{res.doubleRoomCount} Dbl</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-amber-400">
                          {res.totalAmount} €
                        </td>
                        <td className="py-3 px-4 text-center">
                          {res.hasShuttle ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                              <Bus className="w-3 h-3" />
                              <span>{res.shuttle?.assignedGroupCode || 'OUI'}</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Non</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                            {res.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedVoucherReservation(res)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-sky-600 text-white transition-colors"
                              title="Voir Voucher / Facture PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => simulateSendEmail(res.id, 'booking_confirmation')}
                              className="p-1.5 rounded bg-slate-800 hover:bg-cyan-600 text-white transition-colors"
                              title="Renvoyer Email Confirmation"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: SHUTTLES & AIRPORT ARRIVALS DISPATCH */}
        {activeTab === 'shuttles' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Smart Grouping Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-[#071d2b] border border-emerald-500/40 flex items-center justify-between text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <Bus className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-white block">Algorithme d'Optimisation des Navettes Actif</strong>
                  Les vols arrivant dans la même tranche horaire de 45 minutes pour la même destination sont automatiquement groupés pour mutualiser les véhicules.
                </div>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-900/80 font-bold text-emerald-300 border border-emerald-600 text-xs shrink-0">
                {shuttleGroups.length} Convois Planifiés
              </span>
            </div>

            {/* Grouped Shuttles Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shuttleGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-5 rounded-2xl bg-[#081326] border-2 border-emerald-500/30 shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
                    <span className="font-mono text-xs font-bold text-amber-300">{group.id}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-xs border border-emerald-800">
                      {group.totalPassengers} / {group.vehicleCapacity} places
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div><strong>Créneau :</strong> {group.date} • {group.timeWindow}</div>
                    <div><strong>Aéroport → Destination :</strong> {group.airport} → <span className="text-cyan-300 font-bold">{group.destinationHotel}</span></div>
                    <div><strong>Véhicule & Chauffeur :</strong> {group.assignedVehicle} &bull; {group.driverName} ({group.driverPhone})</div>
                  </div>

                  {/* Passengers in this shuttle */}
                  <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                    <div className="text-slate-400 font-semibold text-[11px] uppercase">Délégations & Athlètes à Bord :</div>
                    {group.reservations.map((r, rIdx) => (
                      <div key={rIdx} className="flex items-center justify-between p-2 rounded bg-slate-950 text-[11px]">
                        <div>
                          <strong>{r.delegationOrName}</strong> ({r.passengers} pers.)
                          <div className="text-slate-400">{r.airline} {r.flightNumber} • Arrivée {r.arrivalTime}</div>
                        </div>
                        <span className="font-mono text-amber-400 text-[10px]">{r.bookingCode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Chronological Flight Timeline Table */}
            <div className="rounded-2xl border border-sky-900/50 bg-[#081326] p-6 shadow-xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plane className="w-4 h-4 text-cyan-400" />
                <span>Planning Chronologique des Arrivées Aéroport (TUN / NBE / MIR)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#050c1b] text-slate-400 uppercase tracking-wider font-semibold border-b border-sky-950">
                    <tr>
                      <th className="py-2.5 px-3">Date / Heure</th>
                      <th className="py-2.5 px-3">Vol & Compagnie</th>
                      <th className="py-2.5 px-3">Aéroport</th>
                      <th className="py-2.5 px-3">Délégation</th>
                      <th className="py-2.5 px-3 text-center">Passagers</th>
                      <th className="py-2.5 px-3">Hôtel</th>
                      <th className="py-2.5 px-3 text-center">Navette Attribuée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-950/60">
                    {incomingShuttles.map((res) => (
                      <tr key={res.id} className="hover:bg-sky-950/20">
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {res.shuttle?.arrivalDateTime?.replace('T', ' à ')}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-cyan-300">
                          {res.shuttle?.arrivalAirline} {res.shuttle?.arrivalFlightNumber}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {res.shuttle?.airport}
                        </td>
                        <td className="py-2.5 px-3 text-white font-medium">
                          {res.type === 'group' ? res.federationGroup?.federationName : `${res.individualLead?.firstName} ${res.individualLead?.lastName}`}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                          {res.shuttle?.passengerCount}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {res.hotelId === 'el-mouradi-gammarth' ? 'El Mouradi' : 'Golden Carthage'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {res.shuttle?.assignedGroupCode}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PRICE & INVENTORY MANAGEMENT */}
        {activeTab === 'prices' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            
            {/* Price Editor */}
            <form onSubmit={handleSaveRates} className="p-6 rounded-2xl bg-[#081326] border border-sky-500/30 shadow-xl space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-sky-950 text-sm font-bold text-white">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>Configuration des Tarifs Officiels par Nuit</span>
              </div>

              {/* El Mouradi Gammarth Rates */}
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/40 space-y-3">
                <div className="font-bold text-white text-xs">Hôtel El Mouradi Gammarth (5★)</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Chambre Single (€ / nuit)</label>
                    <input
                      type="number"
                      value={ratesForm.elmSingle}
                      onChange={(e) => setRatesForm({ ...ratesForm, elmSingle: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Chambre Double (€ / nuit)</label>
                    <input
                      type="number"
                      value={ratesForm.elmDouble}
                      onChange={(e) => setRatesForm({ ...ratesForm, elmDouble: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Golden Carthage Rates */}
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/40 space-y-3">
                <div className="font-bold text-white text-xs">Hôtel Golden Carthage (5★)</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Chambre Single (€ / nuit)</label>
                    <input
                      type="number"
                      value={ratesForm.gcSingle}
                      onChange={(e) => setRatesForm({ ...ratesForm, gcSingle: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Chambre Double (€ / nuit)</label>
                    <input
                      type="number"
                      value={ratesForm.gcDouble}
                      onChange={(e) => setRatesForm({ ...ratesForm, gcDouble: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{t('admin.savePrices')}</span>
              </button>
            </form>

            {/* Room Block Manager */}
            <form onSubmit={handleSaveBlocks} className="p-6 rounded-2xl bg-[#081326] border border-sky-500/30 shadow-xl space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-sky-950 text-sm font-bold text-white">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span>Blocage de Chambres & Quotas FIE / Arbitres</span>
              </div>

              <p className="text-xs text-slate-300">
                Les chambres bloquées sont réservées d'office pour les arbitres internationaux, directoire technique FIE et officiels. Elles ne sont pas disponibles à la réservation publique en ligne.
              </p>

              {/* El Mouradi Blocks */}
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/40 space-y-3 text-xs">
                <div className="font-bold text-white">Quotas El Mouradi Gammarth</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Single Bloquées</label>
                    <input
                      type="number"
                      value={blockForm.elmSingleBlocked}
                      onChange={(e) => setBlockForm({ ...blockForm, elmSingleBlocked: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Double Bloquées</label>
                    <input
                      type="number"
                      value={blockForm.elmDoubleBlocked}
                      onChange={(e) => setBlockForm({ ...blockForm, elmDoubleBlocked: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Golden Carthage Blocks */}
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/40 space-y-3 text-xs">
                <div className="font-bold text-white">Quotas Golden Carthage</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Single Bloquées</label>
                    <input
                      type="number"
                      value={blockForm.gcSingleBlocked}
                      onChange={(e) => setBlockForm({ ...blockForm, gcSingleBlocked: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Double Bloquées</label>
                    <input
                      type="number"
                      value={blockForm.gcDoubleBlocked}
                      onChange={(e) => setBlockForm({ ...blockForm, gcDoubleBlocked: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{t('admin.blockRooms')}</span>
              </button>
            </form>

          </div>
        )}

        {/* TAB 4: EXPORT & EMAIL DISPATCH LOG */}
        {activeTab === 'export' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Quick Email Simulation Trigger Strip */}
            <div className="p-5 rounded-2xl bg-[#081326] border border-sky-500/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm">Système d'Envoi Automatique d'Emails</h3>
                <p className="text-xs text-slate-400">
                  Déclenchement automatique des emails de confirmation et des rappels 48h avant la compétition.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => simulateSendEmail('GPS2027-FR48', 'reminder_48h')}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('admin.sendReminder')}</span>
                </button>
              </div>
            </div>

            {/* Email Logs Table */}
            <div className="overflow-x-auto rounded-2xl border border-sky-900/50 bg-[#081326] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050c1b] text-slate-400 uppercase tracking-wider font-semibold border-b border-sky-950">
                  <tr>
                    <th className="py-3 px-4">Date & Heure</th>
                    <th className="py-3 px-4">Code Ref</th>
                    <th className="py-3 px-4">Destinataire</th>
                    <th className="py-3 px-4">Objet de l'Email</th>
                    <th className="py-3 px-4 text-center">Type</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-center">Aperçu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-950/60">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-sky-950/20">
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {new Date(log.sentAt).toLocaleString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {log.bookingCode}
                      </td>
                      <td className="py-3 px-4 text-white">
                        <div className="font-semibold">{log.recipientName}</div>
                        <div className="text-[10px] text-slate-400">{log.recipientEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-200 font-medium">
                        {log.subject}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-cyan-300">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedEmailLog(log)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-sky-600 text-white transition-colors"
                          title="Voir l'email"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

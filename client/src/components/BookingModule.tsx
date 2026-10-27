import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReservation } from '../contexts/ReservationContext';
import { ReservationType, RoleType, GroupMember, PaymentMethod, Reservation } from '../types/gp';
import { COUNTRIES_LIST } from '../data/mockData';
import {
  Calendar,
  Building2,
  Users,
  User,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Shield,
  AlertCircle,
  FileText,
  Bus,
  Sparkles,
  Lock,
  ArrowRight,
  Info,
  Swords,
  Bed,
  BedDouble,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingModuleProps {
  preselectedHotelId?: 'el-mouradi-gammarth' | 'golden-carthage';
  onBookingSuccess: (reservation: Reservation) => void;
  onGoToShuttle: (code: string) => void;
}

export const BookingModule: React.FC<BookingModuleProps> = ({
  preselectedHotelId = 'el-mouradi-gammarth',
  onBookingSuccess,
  onGoToShuttle
}) => {
  const { lang, t } = useLanguage();
  const { hotels, createReservation } = useReservation();

  // Booking Type: 'group' | 'individual'
  const [bookingType, setBookingType] = useState<ReservationType>('group');

  // Selected Hotel
  const [hotelId, setHotelId] = useState<'el-mouradi-gammarth' | 'golden-carthage'>(preselectedHotelId);

  useEffect(() => {
    if (preselectedHotelId) {
      setHotelId(preselectedHotelId);
    }
  }, [preselectedHotelId]);

  // Dates (Default Grand Prix Tunis 2027: 14 to 18 January 2027)
  const [checkInDate, setCheckInDate] = useState('2027-01-14');
  const [checkOutDate, setCheckOutDate] = useState('2027-01-18');
  const [nightsCount, setNightsCount] = useState(4);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNightsCount(diffDays > 0 ? diffDays : 1);
    }
  }, [checkInDate, checkOutDate]);

  // Individual counters
  const [individualSingleQty, setIndividualSingleQty] = useState(1);
  const [individualDoubleQty, setIndividualDoubleQty] = useState(0);

  // Individual Form Data
  const [individualData, setIndividualData] = useState({
    firstName: '',
    lastName: '',
    nationality: 'France',
    federation: '',
    email: '',
    phone: '',
    passportNumber: '',
    role: 'athlete' as RoleType
  });

  // Group / Federation Data
  const [federationData, setFederationData] = useState({
    federationName: '',
    country: 'France',
    contactPersonName: '',
    contactRole: 'Chef de Délégation',
    contactEmail: '',
    contactPhone: ''
  });

  // Group Members Roster
  const [members, setMembers] = useState<GroupMember[]>([
    {
      id: 'm-1',
      firstName: '',
      lastName: '',
      gender: 'M',
      role: 'athlete',
      passportNumber: '',
      roomPreference: 'single',
      roommateName: ''
    },
    {
      id: 'm-2',
      firstName: '',
      lastName: '',
      gender: 'M',
      role: 'athlete',
      passportNumber: '',
      roomPreference: 'double',
      roommateName: ''
    },
    {
      id: 'm-3',
      firstName: '',
      lastName: '',
      gender: 'M',
      role: 'athlete',
      passportNumber: '',
      roomPreference: 'double',
      roommateName: ''
    }
  ]);

  // Payment Options (Strictly Cash On-Site as per official rules)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('onsite_federation');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [notes, setNotes] = useState('');
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  // Hotel & Pricing
  const selectedHotel = hotels[hotelId];
  const singlePrice = selectedHotel.roomTypes.single.pricePerNight;
  const doublePrice = selectedHotel.roomTypes.double.pricePerNight;

  // Auto-calculation of rooms for group
  const autoGroupSingleCount = members.filter(m => m.roomPreference === 'single').length;
  const doublePreferencesCount = members.filter(m => m.roomPreference === 'double').length;
  const autoGroupDoubleCount = Math.ceil(doublePreferencesCount / 2);

  const effectiveSingleRooms = bookingType === 'group' ? autoGroupSingleCount : individualSingleQty;
  const effectiveDoubleRooms = bookingType === 'group' ? autoGroupDoubleCount : individualDoubleQty;
  const effectiveGuestsCount = bookingType === 'group'
    ? members.length
    : (individualSingleQty * 1 + individualDoubleQty * 2);

  const subtotal = (effectiveSingleRooms * singlePrice * nightsCount) +
                   (effectiveDoubleRooms * doublePrice * nightsCount);
  const cityTax = 3 * effectiveGuestsCount * nightsCount;
  const totalAmount = subtotal + cityTax;

  const addMember = () => {
    setMembers(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        firstName: '',
        lastName: '',
        gender: 'M',
        role: 'athlete',
        passportNumber: '',
        roomPreference: 'double',
        roommateName: ''
      }
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length <= 1) {
      toast.warning('La délégation doit comporter au moins 1 membre.');
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<GroupMember>) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (bookingType === 'individual') {
      if (!individualData.firstName || !individualData.lastName || !individualData.email || !individualData.passportNumber) {
        toast.error('Veuillez renseigner tous les champs obligatoires (Nom, Prénom, Email, Passeport).');
        return;
      }
      if (effectiveSingleRooms === 0 && effectiveDoubleRooms === 0) {
        toast.error('Veuillez sélectionner au moins une chambre Single ou Double.');
        return;
      }
    } else {
      if (!federationData.federationName || !federationData.contactPersonName || !federationData.contactEmail) {
        toast.error('Veuillez renseigner le nom de la Fédération et le contact officiel.');
        return;
      }
      const invalidMembers = members.filter(m => !m.firstName || !m.lastName);
      if (invalidMembers.length > 0) {
        toast.error('Veuillez renseigner le Nom et Prénom pour tous les membres de la délégation.');
        return;
      }
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const reservation = createReservation({
        type: bookingType,
        hotelId,
        checkInDate,
        checkOutDate,
        nightsCount,
        singleRoomCount: effectiveSingleRooms,
        doubleRoomCount: effectiveDoubleRooms,
        totalGuestsCount: effectiveGuestsCount,
        individualLead: bookingType === 'individual' ? individualData : undefined,
        federationGroup: bookingType === 'group' ? {
          ...federationData,
          members
        } : undefined,
        paymentMethod,
        notes
      });

      setCreatedReservation(reservation);
      onBookingSuccess(reservation);
    }, 1100);
  };

  return (
    <section id="booking-section" className="py-14 sm:py-20 bg-[#040812] text-white piste-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#14233c] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b172a] border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
              <Swords className="w-3.5 h-3.5 text-cyan-400" />
              <span>Module Officiel d'Engagement FIE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Réservation Hôtelière Tournoi 2027
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Système de réservation avec calcul automatique des chambres Single et Double pour délégations sportives, tarifs négociés et disponibilité en temps réel.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full touche-green"></span>
            <span className="text-slate-300">Quotas Officiels FIE Ouverts</span>
          </div>
        </div>

        {/* Main Booking Form Grid */}
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Area (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Hôtel & Dates */}
            <div className="tournament-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#14233c]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-mono font-black text-sm">
                    01
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Choix de l'Hôtel & Période du Séjour
                  </h3>
                </div>
                <span className="text-xs text-amber-400 font-mono font-bold">2 Hôtels Partenaires 5★</span>
              </div>

              {/* The 2 Hotels Selection */}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Sélectionnez l'un des 2 Hôtels Officiels
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Hotel 1 */}
                  <div
                    onClick={() => setHotelId('el-mouradi-gammarth')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      hotelId === 'el-mouradi-gammarth'
                        ? 'border-cyan-400 bg-[#0d1e38] shadow-xl shadow-cyan-950/60'
                        : 'border-[#16253f] bg-[#070f1e] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-white text-sm uppercase">Hôtel El Mouradi Gammarth</span>
                      <span className="text-xs text-amber-400 font-bold">5 ★★★★★</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">Village Officiel Athlètes &bull; Front de mer &bull; Spa</p>
                    <div className="p-2 rounded-xl bg-[#040812] border border-sky-950 flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold">Single: {hotels['el-mouradi-gammarth'].roomTypes.single.pricePerNight} €</span>
                      <span className="text-cyan-300 font-bold">Double: {hotels['el-mouradi-gammarth'].roomTypes.double.pricePerNight} €</span>
                    </div>
                  </div>

                  {/* Hotel 2 */}
                  <div
                    onClick={() => setHotelId('golden-carthage')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      hotelId === 'golden-carthage'
                        ? 'border-cyan-400 bg-[#0d1e38] shadow-xl shadow-cyan-950/60'
                        : 'border-[#16253f] bg-[#070f1e] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-white text-sm uppercase">Hôtel Golden Carthage</span>
                      <span className="text-xs text-amber-400 font-bold">5 ★★★★★</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">QG Exécutif FIE &bull; Arbitres &bull; Colline Gammarth</p>
                    <div className="p-2 rounded-xl bg-[#040812] border border-sky-950 flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold">Single: {hotels['golden-carthage'].roomTypes.single.pricePerNight} €</span>
                      <span className="text-cyan-300 font-bold">Double: {hotels['golden-carthage'].roomTypes.double.pricePerNight} €</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                    Date d'Arrivée (Check-in)
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                    Date de Départ (Check-out)
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                    Durée Totale
                  </label>
                  <div className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2.5 text-sm font-black font-mono text-cyan-300 flex items-center justify-between">
                    <span>{nightsCount} Nuits</span>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Grand Prix FIE</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Step 2: Mode de Réservation (Individuel vs Groupe Fédération) */}
            <div className="tournament-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#14233c]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-black text-sm">
                    02
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Formule de Réservation & Composition
                  </h3>
                </div>
              </div>

              {/* Formula Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBookingType('group')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    bookingType === 'group'
                      ? 'border-cyan-400 bg-[#0d213d] text-white shadow-xl shadow-cyan-950/50'
                      : 'border-[#16253f] bg-[#070f1e] text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>B) Réservation Groupe / Fédération</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType('individual')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    bookingType === 'individual'
                      ? 'border-cyan-400 bg-[#0d213d] text-white shadow-xl shadow-cyan-950/50'
                      : 'border-[#16253f] bg-[#070f1e] text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>A) Réservation Individuelle (1 Personne)</span>
                </button>
              </div>

              {/* INDIVIDUAL FORM */}
              {bookingType === 'individual' && (
                <div className="space-y-6 animate-fadeIn pt-2">
                  
                  {/* Room counters for individual */}
                  <div className="p-4 rounded-2xl bg-[#081224] border border-[#162640]">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-300 mb-3">
                      Choix de la Chambre Individuelle
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b172a] border border-[#1a2d4c]">
                        <div>
                          <div className="font-bold text-white text-sm">Chambre Single</div>
                          <div className="text-xs text-amber-400 font-mono font-bold">{singlePrice} € / nuit</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIndividualSingleQty(Math.max(0, individualSingleQty - 1))}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
                          >-</button>
                          <span className="w-6 text-center font-bold font-mono text-cyan-300">{individualSingleQty}</span>
                          <button
                            type="button"
                            onClick={() => setIndividualSingleQty(individualSingleQty + 1)}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
                          >+</button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b172a] border border-[#1a2d4c]">
                        <div>
                          <div className="font-bold text-white text-sm">Chambre Double / Twin</div>
                          <div className="text-xs text-cyan-300 font-mono font-bold">{doublePrice} € / nuit</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIndividualDoubleQty(Math.max(0, individualDoubleQty - 1))}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
                          >-</button>
                          <span className="w-6 text-center font-bold font-mono text-cyan-300">{individualDoubleQty}</span>
                          <button
                            type="button"
                            onClick={() => setIndividualDoubleQty(individualDoubleQty + 1)}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Prénom *</label>
                      <input
                        type="text"
                        value={individualData.firstName}
                        onChange={(e) => setIndividualData({ ...individualData, firstName: e.target.value })}
                        placeholder="Ex: Fares"
                        className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Nom de Famille *</label>
                      <input
                        type="text"
                        value={individualData.lastName}
                        onChange={(e) => setIndividualData({ ...individualData, lastName: e.target.value })}
                        placeholder="Ex: Ferjani"
                        className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Nationalité *</label>
                      <select
                        value={individualData.nationality}
                        onChange={(e) => setIndividualData({ ...individualData, nationality: e.target.value })}
                        className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                      >
                        {COUNTRIES_LIST.map((c) => (
                          <option key={c.code} value={c.nameFr}>{c.flag} {c.nameFr}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Fédération Nationale / Club</label>
                      <input
                        type="text"
                        value={individualData.federation}
                        onChange={(e) => setIndividualData({ ...individualData, federation: e.target.value })}
                        placeholder="Ex: Fédération Tunisienne d'Escrime"
                        className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Officiel *</label>
                      <input
                        type="email"
                        value={individualData.email}
                        onChange={(e) => setIndividualData({ ...individualData, email: e.target.value })}
                        placeholder="contact@escrime.org"
                        className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Téléphone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={individualData.phone}
                        onChange={(e) => setIndividualData({ ...individualData, phone: e.target.value })}
                        placeholder="+216 20 123 456"
                        className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">N° Passeport *</label>
                      <input
                        type="text"
                        value={individualData.passportNumber}
                        onChange={(e) => setIndividualData({ ...individualData, passportNumber: e.target.value })}
                        placeholder="Numéro officiel"
                        className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Fonction / Rôle *</label>
                      <select
                        value={individualData.role}
                        onChange={(e) => setIndividualData({ ...individualData, role: e.target.value as RoleType })}
                        className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                      >
                        <option value="athlete">Tireur / Athlète Sabre</option>
                        <option value="coach">Entraîneur / Coach</option>
                        <option value="referee">Arbitre FIE</option>
                        <option value="medical">Staff Médical / Kiné</option>
                        <option value="delegate">Chef de Délégation</option>
                        <option value="guest">Accompagnateur / VIP</option>
                      </select>
                    </div>
                  </div>

                </div>
              )}

              {/* GROUP FEDERATION ROSTER */}
              {bookingType === 'group' && (
                <div className="space-y-6 animate-fadeIn pt-2">
                  
                  {/* Federation info */}
                  <div className="p-4 rounded-2xl bg-[#081224] border border-[#162640] space-y-4">
                    <div className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Coordonnées de la Fédération & Chef de Délégation</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Nom de la Fédération / Équipe *</label>
                        <input
                          type="text"
                          value={federationData.federationName}
                          onChange={(e) => setFederationData({ ...federationData, federationName: e.target.value })}
                          placeholder="Ex: Fédération Française d'Escrime (FFE)"
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Pays Représenté *</label>
                        <select
                          value={federationData.country}
                          onChange={(e) => setFederationData({ ...federationData, country: e.target.value })}
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                        >
                          {COUNTRIES_LIST.map((c) => (
                            <option key={c.code} value={c.nameFr}>{c.flag} {c.nameFr}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Chef de Délégation (Nom & Prénom) *</label>
                        <input
                          type="text"
                          value={federationData.contactPersonName}
                          onChange={(e) => setFederationData({ ...federationData, contactPersonName: e.target.value })}
                          placeholder="Ex: Jean-Christophe Durand"
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Officiel Fédération *</label>
                        <input
                          type="email"
                          value={federationData.contactEmail}
                          onChange={(e) => setFederationData({ ...federationData, contactEmail: e.target.value })}
                          placeholder="contact@escrime.fr"
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3.5 py-2 text-xs text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delegation Members Roster Manifest */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                          <span>Feuille d'Engagement Délégation (Roster)</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono font-bold">
                            {members.length} inscrits
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Renseignez chaque tireur, entraîneur et arbitre. Le système calcule automatiquement le nombre de chambres Single et Twin nécessaires.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addMember}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un Tireur / Membre</span>
                      </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-2xl border border-[#14233c] bg-[#070f1f]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#050b17] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#14233c]">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Nom & Prénom *</th>
                            <th className="py-2.5 px-3">Rôle / Discipline</th>
                            <th className="py-2.5 px-3">Passeport</th>
                            <th className="py-2.5 px-3">Chambre Souhaitée</th>
                            <th className="py-2.5 px-3">Colocataire si Double</th>
                            <th className="py-2.5 px-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#14233c]">
                          {members.map((member, mIdx) => (
                            <tr key={member.id} className="hover:bg-[#0c1a33]/40 transition-colors">
                              <td className="py-2.5 px-3 text-slate-500 font-mono font-bold">{mIdx + 1}</td>
                              
                              <td className="py-2 px-3">
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={member.firstName}
                                    onChange={(e) => updateMember(member.id, { firstName: e.target.value })}
                                    placeholder="Prénom"
                                    className="w-24 bg-[#0a1529] border border-[#1a2d4c] rounded px-2 py-1 text-xs text-white"
                                    required
                                  />
                                  <input
                                    type="text"
                                    value={member.lastName}
                                    onChange={(e) => updateMember(member.id, { lastName: e.target.value })}
                                    placeholder="Nom"
                                    className="w-24 bg-[#0a1529] border border-[#1a2d4c] rounded px-2 py-1 text-xs text-white font-bold"
                                    required
                                  />
                                </div>
                              </td>

                              <td className="py-2 px-3">
                                <select
                                  value={member.role}
                                  onChange={(e) => updateMember(member.id, { role: e.target.value as RoleType })}
                                  className="bg-[#0a1529] border border-[#1a2d4c] rounded px-2 py-1 text-xs text-white"
                                >
                                  <option value="athlete">Athlète Sabre</option>
                                  <option value="coach">Entraîneur</option>
                                  <option value="referee">Arbitre FIE</option>
                                  <option value="medical">Kiné / Médical</option>
                                  <option value="delegate">Chef Délégation</option>
                                  <option value="guest">Accompagnateur</option>
                                </select>
                              </td>

                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={member.passportNumber}
                                  onChange={(e) => updateMember(member.id, { passportNumber: e.target.value })}
                                  placeholder="N° Passeport"
                                  className="w-28 bg-[#0a1529] border border-[#1a2d4c] rounded px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>

                              <td className="py-2 px-3">
                                <select
                                  value={member.roomPreference}
                                  onChange={(e) => updateMember(member.id, { roomPreference: e.target.value as 'single' | 'double' })}
                                  className={`rounded px-2 py-1 text-xs font-bold ${
                                    member.roomPreference === 'single'
                                      ? 'bg-amber-950/80 border border-amber-600/60 text-amber-300'
                                      : 'bg-sky-950/80 border border-sky-600/60 text-cyan-300'
                                  }`}
                                >
                                  <option value="single">Single (1 pers)</option>
                                  <option value="double">Double / Twin</option>
                                </select>
                              </td>

                              <td className="py-2 px-3">
                                {member.roomPreference === 'double' ? (
                                  <input
                                    type="text"
                                    value={member.roommateName || ''}
                                    onChange={(e) => updateMember(member.id, { roommateName: e.target.value })}
                                    placeholder="Nom du colocataire"
                                    className="w-32 bg-[#0a1529] border border-[#1a2d4c] rounded px-2 py-1 text-xs text-slate-300"
                                  />
                                ) : (
                                  <span className="text-[11px] text-slate-500 italic">Non applicable</span>
                                )}
                              </td>

                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeMember(member.id)}
                                  className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                                  title="Supprimer ce membre"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Automatic Room Calculator Banner */}
                    <div className="p-4 rounded-2xl bg-[#09152b] border border-cyan-400/40 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Calculateur Automatique de Chambres FIE</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Facture globale unique et confirmation instantanée délivrées au nom de la Fédération.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-bold">
                        <div className="bg-[#050b18] px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 font-mono">
                          Single requises : <span className="text-base font-black text-white ml-1">{autoGroupSingleCount}</span>
                        </div>
                        <div className="bg-[#050b18] px-3 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-300 font-mono">
                          Double requises : <span className="text-base font-black text-white ml-1">{autoGroupDoubleCount}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Step 3: Paiement Sécurisé & Prise en Charge */}
            <div className="tournament-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#14233c]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-black text-sm">
                    03
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Modalités de Règlement & Facturation Officielle
                  </h3>
                </div>
              </div>

              {/* Unique Payment Mode: Cash Sur Place */}
              <div className="p-5 rounded-2xl border-2 border-emerald-500/60 bg-[#081729] shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-white text-base">Paiement en Espèces (Cash) sur Place à l'Arrivée</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-700">
                        RÈGLEMENT OFFICIEL AU CHECK-IN
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Aucun prépaiement par carte ni virement n'est requis en ligne. La totalité de votre réservation sera réglée directement <strong>en espèces (Cash)</strong> à la réception de votre hôtel lors de votre check-in et de la remise de votre badge d'accréditation FIE.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-300">
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <span>💶</span> Devises acceptées : Euros (€) ou Dinars Tunisiens (TND)
                      </span>
                      <span className="text-slate-500">&bull;</span>
                      <span className="text-emerald-300">
                        ✓ Facture et reçu fiscal FIE remis immédiatement
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special requests */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Remarques ou consignes particulières délégation
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Régime alimentaire spécifique athlète, arrivée décalée, matériel d'escrime lourd..."
                  className="w-full bg-[#081224] border border-[#162640] rounded-xl px-3 py-2 text-xs text-white"
                ></textarea>
              </div>

            </div>

          </div>

          {/* Right Sticky Summary (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            <div className="tournament-card-gold rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-amber-500/40">
              
              <div className="flex items-center justify-between pb-4 border-b border-amber-900/40 mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span className="font-black text-white text-base uppercase">Bilan Financier FIE</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600">
                  OFFICIEL
                </span>
              </div>

              {/* Selected Hotel */}
              <div className="mb-4 text-xs space-y-1">
                <span className="text-slate-400">Établissement retenu :</span>
                <div className="font-black text-white text-sm uppercase">{selectedHotel.name} (5★)</div>
                <div className="text-slate-300 text-[11px]">{selectedHotel.location}</div>
              </div>

              {/* Lines */}
              <div className="space-y-2.5 text-xs py-3 border-y border-[#182842] mb-4 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Période :</span>
                  <span className="font-bold text-white">{nightsCount} Nuits</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Chambres Single :</span>
                  <span className="font-bold text-white">
                    {effectiveSingleRooms} × {singlePrice} € = {effectiveSingleRooms * singlePrice * nightsCount} €
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Chambres Double :</span>
                  <span className="font-bold text-white">
                    {effectiveDoubleRooms} × {doublePrice} € = {effectiveDoubleRooms * doublePrice * nightsCount} €
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Participants Totaux :</span>
                  <span className="font-bold text-cyan-300">{effectiveGuestsCount} Personnes</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Taxe & Frais FIE (3€/n/pers) :</span>
                  <span className="font-bold text-white">{cityTax} €</span>
                </div>
              </div>

              {/* Total Display */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-black uppercase text-slate-300">Total à Régler :</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-amber-400 font-mono">{totalAmount} €</div>
                    <div className="text-xs text-slate-400 font-mono">(~{Math.round(totalAmount * 3.35)} TND)</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Facture officielle émise au nom de la délégation.</div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-4 px-4 rounded-2xl text-slate-950 font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Validation Sécurisée FIE...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirmer la Réservation</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paiement sécurisé crypté SSL &bull; Code unique GPS2027</span>
              </div>

            </div>

            {/* Hint Box: Airport Transfer Unlock */}
            <div className="p-4 rounded-2xl bg-[#081324] border border-sky-900/50 text-xs text-slate-300 flex gap-3">
              <Bus className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Navette Aéroport Incluse</strong>
                Une fois votre réservation validée, vous recevrez votre code unique pour programmer immédiatement votre navette aéroport gratuite ou personnalisée.
              </div>
            </div>

          </div>

        </form>

      </div>

      {/* Booking Success Modal */}
      {createdReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl tournament-card rounded-3xl p-6 sm:p-8 text-center text-white border-2 border-cyan-400 shadow-2xl">
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
              Réservation Validée avec Succès !
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 font-medium">
              Votre réservation pour le <strong>Grand Prix Sabre Tunis 2027</strong> a été confirmée et enregistrée.
            </p>

            {/* Code */}
            <div className="p-4 rounded-2xl bg-[#040812] border border-cyan-400/60 mb-6">
              <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">
                VOTRE CODE DE RÉSERVATION UNIQUE
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-widest select-all">
                {createdReservation.id}
              </div>
              <p className="text-[11px] text-cyan-300 mt-1">
                Conservez ce code. Il est indispensable pour réserver votre navette aéroport et télécharger votre voucher officiel.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  const code = createdReservation.id;
                  setCreatedReservation(null);
                  onGoToShuttle(code);
                }}
                className="w-full py-3.5 px-4 rounded-2xl text-slate-950 font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Bus className="w-4 h-4" />
                <span>Réserver la Navette Aéroport Maintenant →</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatedReservation(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                Fermer & Continuer
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

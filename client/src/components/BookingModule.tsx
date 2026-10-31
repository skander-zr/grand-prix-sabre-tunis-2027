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
  AlertCircle,
  FileText,
  Bus,
  Lock,
  ArrowRight,
  Bed,
  BedDouble,
  ChevronRight,
  Download,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';
import { VoucherModal } from './VoucherModal';

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

  // Dynamic Group Members Roster
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

  // Payment Options: 'stripe_card' | 'bank_transfer' | 'onsite_federation'
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe_card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Stripe Card Simulation Fields
  const [stripeCard, setStripeCard] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '123',
    cardHolder: ''
  });

  const [notes, setNotes] = useState('');
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Hotel & Pricing
  const selectedHotel = hotels[hotelId] || hotels['el-mouradi-gammarth'];
  const singlePrice = selectedHotel.roomTypes?.single?.pricePerNight ?? 130;
  const doublePrice = selectedHotel.roomTypes?.double?.pricePerNight ?? 180;

  // Upsells & FTE Revenue Options
  const [trainingCampActive, setTrainingCampActive] = useState(false);
  const [lateCheckout, setLateCheckout] = useState(false);
  const [vipShuttle, setVipShuttle] = useState(false);
  const [physioRoom, setPhysioRoom] = useState(false);
  const [requestShuttle, setRequestShuttle] = useState(true);
  const [shuttleAirport, setShuttleAirport] = useState<'TUN' | 'NBE' | 'MIR'>('TUN');
  const [shuttleTripType, setShuttleTripType] = useState<'arrival' | 'departure' | 'roundtrip'>('roundtrip');
  const [shuttleFlightNumber, setShuttleFlightNumber] = useState('');
  const [shuttleAirline, setShuttleAirline] = useState('Air France');
  const [shuttleDriverWhatsApp, setShuttleDriverWhatsApp] = useState('');

  // Auto-calculation of rooms for group
  const autoGroupSingleCount = members.filter(m => m.roomPreference === 'single').length;
  const doublePreferencesCount = members.filter(m => m.roomPreference === 'double').length;
  const autoGroupDoubleCount = Math.ceil(doublePreferencesCount / 2);

  const effectiveSingleRooms = bookingType === 'group' ? autoGroupSingleCount : individualSingleQty;
  const effectiveDoubleRooms = bookingType === 'group' ? autoGroupDoubleCount : individualDoubleQty;
  const effectiveGuestsCount = bookingType === 'group'
    ? members.length
    : (individualSingleQty * 1 + individualDoubleQty * 2);

  const totalRooms = effectiveSingleRooms + effectiveDoubleRooms;

  // Base rooms subtotal
  const subtotal = (effectiveSingleRooms * singlePrice * nightsCount) +
                   (effectiveDoubleRooms * doublePrice * nightsCount);

  // All extra services & transfers are included at 0 EUR (Room price is the only billed amount)
  const lateCheckoutCost = 0;
  const isRoundTrip = shuttleTripType === 'roundtrip';
  const tripMultiplier = isRoundTrip ? 2 : 1;
  const vipShuttleCost = 0;
  const physioRoomCost = 0;
  const airportSurcharge = 0;
  const isOnsitePayment = paymentMethod === 'onsite_federation';
  const onsiteAdminSurcharge = 0;
  const upsellsTotal = 0;
  const cityTax = 0;
  const grandTotal = subtotal; // Strictly Single / Double Room Price × Nights

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
        notes,
        upsells: {
          lateCheckout,
          lateCheckoutPrice: lateCheckoutCost,
          vipShuttle,
          vipShuttlePrice: vipShuttleCost,
          physioRoomDays: physioRoom ? nightsCount : 0,
          physioRoomPrice: physioRoomCost,
          trainingCamp: trainingCampActive
        },
        upsellsAmount: upsellsTotal,
        onsiteAdminSurcharge,
        airportSurcharge,
        shuttle: requestShuttle ? {
          tripType: shuttleTripType,
          airport: shuttleAirport,
          isVipVan: vipShuttle,
          surchargeEur: airportSurcharge,
          arrivalAirline: shuttleAirline,
          arrivalFlightNumber: shuttleFlightNumber,
          driverWhatsApp: shuttleDriverWhatsApp || (bookingType === 'individual' ? individualData.phone : federationData.contactPhone),
          passengerCount: effectiveGuestsCount,
          luggageCount: effectiveGuestsCount * 2,
          weaponBagsCount: effectiveGuestsCount,
          status: 'pending'
        } : undefined
      });

      setCreatedReservation(reservation);
      onBookingSuccess(reservation);
      toast.success(`Réservation ${reservation.id} enregistrée avec succès.`);
    }, 900);
  };

  return (
    <section id="booking-section" className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#03396C] text-xs font-semibold mb-2.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Engagement Officiel FIE &bull; Hôtellerie 5★</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Réservation Hôtelière Tournoi 2027
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
              Formulaire officiel pour délégations nationales et sportifs indépendants. Tarifs négociés FIE avec buffets sportifs et balnéothérapie inclus.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Quotas Officiels FIE Ouverts</span>
          </div>
        </div>

        {/* Avantages Exclusifs Pack Officiel FTE Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8102E]"></span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#03396C]">
                Avantages Exclusifs Pack Officiel FTE
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Tarif Pré-réservation Garanti jusqu'au 25 Décembre 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900 mb-0.5">1. Accréditation Directe Hôtel</div>
              <div className="text-[11px] text-slate-600">Remise des badges FIE à votre hôtel sans queue à la salle.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900 mb-0.5">2. Navettes Radès Toutes les 30 min</div>
              <div className="text-[11px] text-slate-600">Liaisons directes cadencées Hôtel ↔ Salle d'Armes FIE.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900 mb-0.5">3. Buffet Sportif &amp; Balnéo</div>
              <div className="text-[11px] text-slate-600">Pension complète diététique et récupération athlétique.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900 mb-0.5">4. Transport Housses 1m40</div>
              <div className="text-[11px] text-slate-600">Minibus aménagés pour le matériel et armes sabre.</div>
            </div>
          </div>
        </div>

        {/* Main Booking Form */}
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Area (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Hôtel & Dates */}
            <div className="inst-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-blue-50 text-[#03396C] border border-blue-200 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Choix de l'Hôtel &amp; Dates du Séjour
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">2 Hôtels 5★ à Gammarth</span>
              </div>

              {/* The 2 Hotels Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Sélectionnez l'Hôtel Officiel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Hotel 1 */}
                  <div
                    onClick={() => setHotelId('el-mouradi-gammarth')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      hotelId === 'el-mouradi-gammarth'
                        ? 'border-[#03396C] bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-[#0F172A]">Hôtel El Mouradi Gammarth</span>
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">5★ Luxe</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2.5">
                      Village officiel en bord de mer &bull; Balnéothérapie 1200 m² &bull; Buffet athlètes
                    </p>
                    <div className="text-xs font-semibold text-[#03396C] flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <span>Single: 130 € / Double: 180 €</span>
                      {hotelId === 'el-mouradi-gammarth' && <CheckCircle2 className="w-4 h-4 text-[#03396C]" />}
                    </div>
                  </div>

                  {/* Hotel 2 */}
                  <div
                    onClick={() => setHotelId('golden-carthage')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      hotelId === 'golden-carthage'
                        ? 'border-[#03396C] bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-[#0F172A]">Hôtel Golden Carthage</span>
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">5★ Palace</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2.5">
                      QG Exécutif FIE sur la colline &bull; Panorama Golfe de Tunis &bull; Salles diplomatiques
                    </p>
                    <div className="text-xs font-semibold text-[#03396C] flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <span>Single: 145 € / Double: 195 €</span>
                      {hotelId === 'golden-carthage' && <CheckCircle2 className="w-4 h-4 text-[#03396C]" />}
                    </div>
                  </div>

                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date d'Arrivée (Check-in)
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => {
                      setCheckInDate(e.target.value);
                      if (e.target.value <= '2027-01-12') {
                        setTrainingCampActive(true);
                      }
                    }}
                    required
                    className="w-full px-3.5 py-2.5"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Arrivée conseillée : 14 Janv.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date de Départ (Check-out)
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Départ conseillé : 18 Janv.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Durée du Séjour
                  </label>
                  <div className="h-[42px] px-3.5 flex items-center bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-[#0F172A] font-mono">
                    {nightsCount} Nuitée{nightsCount > 1 ? 's' : ''}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Calcul automatique</span>
                </div>
              </div>

              {/* Forfait Stage Pré-Compétition Button & Info */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!trainingCampActive) {
                      setCheckInDate('2027-01-11');
                      setTrainingCampActive(true);
                      toast.success('Stage Pré-Compétition Activé : Arrivée le 11 Janvier avec accès aux pistes.');
                    } else {
                      setCheckInDate('2027-01-14');
                      setTrainingCampActive(false);
                      toast.info('Dates réinitialisées au tournoi officiel (14 Janvier).');
                    }
                  }}
                  className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    trainingCampActive
                      ? 'bg-blue-50 border-[#03396C] text-[#03396C]'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#03396C] text-white text-[10px] font-bold uppercase">
                      Option Stage
                    </span>
                    <span className="font-bold">
                      {trainingCampActive ? 'Stage Pré-Compétition Activé (Arrivée 11 Janv.)' : 'Activer le Forfait Stage Pré-Compétition (11–14 Janvier 2027)'}
                    </span>
                  </div>
                  <span className="text-[11px] underline">
                    {trainingCampActive ? 'Désactiver (14 Janv.)' : 'Avancer l\'arrivée au 11 Janvier'}
                  </span>
                </button>
                {trainingCampActive && (
                  <p className="text-[11px] text-blue-700 mt-1.5 pl-1">
                    ✓ Votre délégation bénéficie d'un accès anticipé aux pistes officielles d'entraînement de la Salle Omnisports de Radès dès le 11 janvier 2027.
                  </p>
                )}
              </div>

            </div>

            {/* Step 2: Mode de Réservation (A ou B) */}
            <div className="inst-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-blue-50 text-[#03396C] border border-blue-200 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Mode de Réservation
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">Individuel ou Délégation</span>
              </div>

              {/* Selector Tabs A / B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setBookingType('group')}
                  className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    bookingType === 'group'
                      ? 'border-[#03396C] bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#0F172A]">Mode B : Délégation / Groupe</span>
                    {bookingType === 'group' && <CheckCircle2 className="w-4 h-4 text-[#03396C]" />}
                  </div>
                  <p className="text-xs text-slate-600">
                    Pour Chefs de Délégation, Fédérations et Équipes. Tableau nominatif des membres, calcul automatique des chambres et facture unique.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType('individual')}
                  className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    bookingType === 'individual'
                      ? 'border-[#03396C] bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#0F172A]">Mode A : Réservation Individuelle</span>
                    {bookingType === 'individual' && <CheckCircle2 className="w-4 h-4 text-[#03396C]" />}
                  </div>
                  <p className="text-xs text-slate-600">
                    Pour athlète indépendant, arbitre, entraîneur ou officiel venant à titre individuel.
                  </p>
                </button>
              </div>

              {/* Mode A: Individuel Fields */}
              {bookingType === 'individual' && (
                <div className="pt-4 border-t border-slate-200 space-y-5 animate-fadeIn">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Coordonnées de l'Athlète / Officiel
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        required
                        value={individualData.lastName}
                        onChange={(e) => setIndividualData({ ...individualData, lastName: e.target.value })}
                        placeholder="ex: Dubois"
                        className="w-full px-3.5 py-2.5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                      <input
                        type="text"
                        required
                        value={individualData.firstName}
                        onChange={(e) => setIndividualData({ ...individualData, firstName: e.target.value })}
                        placeholder="ex: Alexandre"
                        className="w-full px-3.5 py-2.5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nationalité *</label>
                      <select
                        value={individualData.nationality}
                        onChange={(e) => setIndividualData({ ...individualData, nationality: e.target.value })}
                        className="w-full px-3.5 py-2.5"
                      >
                        {COUNTRIES_LIST.map(c => (
                          <option key={c.code} value={lang === 'fr' ? c.nameFr : c.nameEn}>
                            {c.flag} {lang === 'fr' ? c.nameFr : c.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de Passeport *</label>
                      <input
                        type="text"
                        required
                        value={individualData.passportNumber}
                        onChange={(e) => setIndividualData({ ...individualData, passportNumber: e.target.value })}
                        placeholder="ex: 24FA19283"
                        className="w-full px-3.5 py-2.5 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Email Officiel *' : 'Official Email *'}</label>
                      <input
                        type="email"
                        required
                        value={individualData.email}
                        onChange={(e) => setIndividualData({ ...individualData, email: e.target.value })}
                        placeholder="alexandre@escrime.fr"
                        className="w-full px-3.5 py-2.5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Téléphone de contact *' : 'Contact Phone Number *'}</label>
                      <input
                        type="tel"
                        required
                        value={individualData.phone}
                        onChange={(e) => setIndividualData({ ...individualData, phone: e.target.value })}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-3.5 py-2.5 font-mono"
                      />
                    </div>
                  </div>

                  {/* Room Selection for Individual */}
                  <div className="pt-4 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Choix du Type de Chambre
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-[#0F172A]">Chambre Single (1 pers)</div>
                          <div className="text-xs text-slate-500 font-mono">{singlePrice} € / nuit</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIndividualSingleQty(Math.max(0, individualSingleQty - 1))}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-sm font-mono">{individualSingleQty}</span>
                          <button
                            type="button"
                            onClick={() => setIndividualSingleQty(individualSingleQty + 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-[#0F172A]">Chambre Double (2 pers)</div>
                          <div className="text-xs text-slate-500 font-mono">{doublePrice} € / nuit</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIndividualDoubleQty(Math.max(0, individualDoubleQty - 1))}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-sm font-mono">{individualDoubleQty}</span>
                          <button
                            type="button"
                            onClick={() => setIndividualDoubleQty(individualDoubleQty + 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode B: Groupe / Fédération */}
              {bookingType === 'group' && (
                <div className="pt-4 border-t border-slate-200 space-y-6 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Coordonnées de la Fédération &amp; Contact Officiel
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de la Fédération / Organisation *</label>
                        <input
                          type="text"
                          required
                          value={federationData.federationName}
                          onChange={(e) => setFederationData({ ...federationData, federationName: e.target.value })}
                          placeholder="ex: Fédération Française d'Escrime (FFE)"
                          className="w-full px-3.5 py-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Pays *</label>
                        <select
                          value={federationData.country}
                          onChange={(e) => setFederationData({ ...federationData, country: e.target.value })}
                          className="w-full px-3.5 py-2.5"
                        >
                          {COUNTRIES_LIST.map(c => (
                            <option key={c.code} value={lang === 'fr' ? c.nameFr : c.nameEn}>
                              {c.flag} {lang === 'fr' ? c.nameFr : c.nameEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nom &amp; Prénom du Chef de Délégation *</label>
                        <input
                          type="text"
                          required
                          value={federationData.contactPersonName}
                          onChange={(e) => setFederationData({ ...federationData, contactPersonName: e.target.value })}
                          placeholder="ex: Jean-Christophe Durand"
                          className="w-full px-3.5 py-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle / Fonction *</label>
                        <input
                          type="text"
                          required
                          value={federationData.contactRole}
                          onChange={(e) => setFederationData({ ...federationData, contactRole: e.target.value })}
                          placeholder="ex: Chef de Délégation / DTN"
                          className="w-full px-3.5 py-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Officiel *</label>
                        <input
                          type="email"
                          required
                          value={federationData.contactEmail}
                          onChange={(e) => setFederationData({ ...federationData, contactEmail: e.target.value })}
                          placeholder="delegation@escrime.fr"
                          className="w-full px-3.5 py-2.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Téléphone de contact *' : 'Contact Phone Number *'}</label>
                        <input
                          type="tel"
                          required
                          value={federationData.contactPhone}
                          onChange={(e) => setFederationData({ ...federationData, contactPhone: e.target.value })}
                          placeholder="+33 6 12 34 56 78"
                          className="w-full px-3.5 py-2.5 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Members Table */}
                  <div className="pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Liste des Membres de la Délégation ({members.length} inscrits)
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Renseignez le souhait de chambre (Single ou Double) et le binôme de partage pour chaque athlète.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={addMember}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#03396C] hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter un membre</span>
                      </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Nom *</th>
                            <th className="py-2.5 px-3">Prénom *</th>
                            <th className="py-2.5 px-3">Rôle</th>
                            <th className="py-2.5 px-3">Passeport</th>
                            <th className="py-2.5 px-3">Type Chambre</th>
                            <th className="py-2.5 px-3">Binôme (si Double)</th>
                            <th className="py-2.5 px-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {members.map((member, idx) => (
                            <tr key={member.id} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3 text-slate-400 font-mono font-bold">{idx + 1}</td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  required
                                  value={member.lastName}
                                  onChange={(e) => updateMember(member.id, { lastName: e.target.value })}
                                  placeholder="Nom"
                                  className="w-28 px-2 py-1 text-xs"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  required
                                  value={member.firstName}
                                  onChange={(e) => updateMember(member.id, { firstName: e.target.value })}
                                  placeholder="Prénom"
                                  className="w-28 px-2 py-1 text-xs"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <select
                                  value={member.role}
                                  onChange={(e) => updateMember(member.id, { role: e.target.value as RoleType })}
                                  className="px-2 py-1 text-xs"
                                >
                                  <option value="athlete">Athlète</option>
                                  <option value="coach">Entraîneur</option>
                                  <option value="referee">Arbitre</option>
                                  <option value="delegate">Délégué</option>
                                  <option value="medical">Médical</option>
                                </select>
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  value={member.passportNumber}
                                  onChange={(e) => updateMember(member.id, { passportNumber: e.target.value })}
                                  placeholder="N° Passeport"
                                  className="w-24 px-2 py-1 text-xs font-mono"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <select
                                  value={member.roomPreference}
                                  onChange={(e) => updateMember(member.id, { roomPreference: e.target.value as 'single' | 'double' })}
                                  className="px-2 py-1 text-xs font-semibold"
                                >
                                  <option value="single">Single (1 lit)</option>
                                  <option value="double">Double (2 lits)</option>
                                </select>
                              </td>
                              <td className="py-2.5 px-3">
                                {member.roomPreference === 'double' ? (
                                  <input
                                    type="text"
                                    value={member.roommateName || ''}
                                    onChange={(e) => updateMember(member.id, { roommateName: e.target.value })}
                                    placeholder="Partagé avec..."
                                    className="w-32 px-2 py-1 text-xs"
                                  />
                                ) : (
                                  <span className="text-slate-400 text-[11px]">— Usage Single —</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeMember(member.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                  title="Supprimer ce membre"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Auto Calculated Rooms Summary Banner */}
                    <div className="mt-3 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#03396C]">Calcul automatique des chambres :</span>
                        <span><strong>{autoGroupSingleCount}</strong> Chambre{autoGroupSingleCount > 1 ? 's' : ''} Single</span>
                        <span>&bull;</span>
                        <span><strong>{autoGroupDoubleCount}</strong> Chambre{autoGroupDoubleCount > 1 ? 's' : ''} Double ({doublePreferencesCount} athlètes)</span>
                      </div>
                      <span className="text-slate-500 font-medium">Facturation unique pour toute la délégation</span>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Step 3: Services & Logistique FTE Inclus (0 €) */}
            <div className="inst-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-blue-50 text-[#03396C] border border-blue-200 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    {lang === 'fr' ? 'Services & Logistique FIE / FTE Inclus (0 €)' : 'Included FIE / FTE Services & Logistics (0 €)'}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {lang === 'fr' ? '0 € de frais supplémentaires' : 'Zero extra fees'}
                </span>
              </div>

              {/* Inclusions Selection */}
              <div className="space-y-3.5">
                
                {/* Inclusion 1: Late Check-out */}
                <label className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  lateCheckout ? 'border-[#03396C] bg-blue-50/30 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={lateCheckout}
                    onChange={(e) => setLateCheckout(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#03396C] rounded border-slate-300 focus:ring-[#03396C]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F172A]">
                        {lang === 'fr' ? 'Late Check-out Compétition (Dimanche 17 Janvier jusqu\'à 19h00)' : 'Competition Late Check-out (Sunday Jan 17 until 19:00)'}
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {lang === 'fr' ? 'Inclus (0 €)' : 'Included (0 €)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'fr'
                        ? 'Permet aux athlètes de garder leur chambre pour se doucher, se reposer et se préparer après les finales avant leur vol du soir.'
                        : 'Allows athletes to keep their rooms to shower, rest and prepare after finals before their evening flight.'}
                    </p>
                  </div>
                </label>

                {/* Inclusion 2: Dedicated Airport Shuttle */}
                <label className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  vipShuttle ? 'border-[#03396C] bg-blue-50/30 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={vipShuttle}
                    onChange={(e) => setVipShuttle(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#03396C] rounded border-slate-300 focus:ring-[#03396C]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F172A]">
                        {lang === 'fr' ? 'Accueil Dédié & Navettes FIE Aéroports (TUN, NBE, MIR)' : 'Dedicated Reception & FIE Airport Shuttles (TUN, NBE, MIR)'}
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {lang === 'fr' ? 'Inclus (0 €)' : 'Included (0 €)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'fr'
                        ? 'Accueil personnalisé aux terminaux avec prise en charge directe des athlètes et des sacs de sabre volumineux.'
                        : 'Personalized terminal meet & greet with direct transfer for athletes and fencing weapon bags.'}
                    </p>
                  </div>
                </label>

                {/* Inclusion 3: Private Physio Room */}
                <label className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  physioRoom ? 'border-[#03396C] bg-blue-50/30 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={physioRoom}
                    onChange={(e) => setPhysioRoom(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#03396C] rounded border-slate-300 focus:ring-[#03396C]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F172A]">
                        {lang === 'fr' ? 'Salle privée Kiné / Récupération & Stockage Matériel Sécurisé' : 'Private Physio / Recovery & Equipment Storage Room'}
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {lang === 'fr' ? 'Inclus sur demande (0 €)' : 'Included on request (0 €)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'fr'
                        ? 'Salon privatisé au sein de l\'hôtel officiel pour les tables de massage des kinésithérapeutes de la délégation et le stockage sécurisé des armes.'
                        : 'Dedicated private salon at official hotel for delegation physio massage tables and secure fencing weapons storage.'}
                    </p>
                  </div>
                </label>

              </div>

              {/* Shuttle Airport Logistics */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-[#03396C]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {lang === 'fr' ? 'Transfert Aéroport Officiel & Véhicules Dédiés' : 'Official Airport Transfer & Dedicated Shuttles'}
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestShuttle}
                      onChange={(e) => setRequestShuttle(e.target.checked)}
                      className="rounded text-[#03396C]"
                    />
                    <span>{lang === 'fr' ? 'Inclure les navettes aéroport (0 €)' : 'Include airport shuttles (0 €)'}</span>
                  </label>
                </div>

                {requestShuttle && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {lang === 'fr' ? 'Aéroport d\'Arrivée (Liste Officielle FIE) *' : 'Arrival Airport (Official FIE List) *'}
                        </label>
                        <select
                          value={shuttleAirport}
                          onChange={(e) => setShuttleAirport(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs font-medium"
                        >
                          <option value="TUN">Tunis-Carthage (TUN) — {lang === 'fr' ? 'Inclus à 0 €' : '0 € Included'}</option>
                          <option value="NBE">Enfidha-Hammamet (NBE - 100 km) — {lang === 'fr' ? 'Inclus à 0 €' : '0 € Included'}</option>
                          <option value="MIR">Monastir Habib-Bourguiba (MIR - 165 km) — {lang === 'fr' ? 'Inclus à 0 €' : '0 € Included'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {lang === 'fr' ? 'Type de Trajet' : 'Trip Type'}
                        </label>
                        <select
                          value={shuttleTripType}
                          onChange={(e) => setShuttleTripType(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs font-medium"
                        >
                          <option value="roundtrip">{lang === 'fr' ? 'Aller-Retour (Aéroport ↔ Hôtel)' : 'Roundtrip (Airport ↔ Hotel)'}</option>
                          <option value="arrival">{lang === 'fr' ? 'Arrivée uniquement (Aéroport → Hôtel)' : 'Arrival only (Airport → Hotel)'}</option>
                          <option value="departure">{lang === 'fr' ? 'Départ uniquement (Hôtel → Aéroport)' : 'Departure only (Hotel → Airport)'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Inclusive 0 EUR notice for all airports */}
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {lang === 'fr'
                            ? 'Transfert aéroportuaire 100% inclus dans le pack officiel FTE (0 € de supplément pour TUN, NBE et MIR).'
                            : 'Airport transfer 100% included in official FTE pack (0 € extra fee for TUN, NBE, and MIR).'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700">0 €</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === 'fr' ? 'Compagnie Aérienne' : 'Airline'}
                        </label>
                        <input
                          type="text"
                          value={shuttleAirline}
                          onChange={(e) => setShuttleAirline(e.target.value)}
                          placeholder="ex: Air France, Tunisair..."
                          className="w-full px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === 'fr' ? 'Numéro de Vol' : 'Flight Number'}
                        </label>
                        <input
                          type="text"
                          value={shuttleFlightNumber}
                          onChange={(e) => setShuttleFlightNumber(e.target.value)}
                          placeholder="ex: AF1184"
                          className="w-full px-2.5 py-1.5 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === 'fr' ? 'Téléphone Chauffeur / Régie' : 'Driver / Coordinator Phone'}
                        </label>
                        <input
                          type="text"
                          value={shuttleDriverWhatsApp}
                          onChange={(e) => setShuttleDriverWhatsApp(e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                          className="w-full px-2.5 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* Step 4: Paiement Sécurisé (3 Modes) */}
            <div className="inst-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-blue-50 text-[#03396C] border border-blue-200 flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Mode de Règlement Sécurisé
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">3 Options Officielles</span>
              </div>

              {/* Payment Methods Cards */}
              <div className="space-y-3">
                
                {/* Method 1: Stripe Card */}
                <div
                  onClick={() => setPaymentMethod('stripe_card')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'stripe_card'
                      ? 'border-[#03396C] bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-[#03396C] flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0F172A]">Paiement en ligne par carte (Stripe)</div>
                        <div className="text-xs text-slate-600">Visa, Mastercard, Carte Bancaire &bull; Reçu et confirmation immédiats</div>
                      </div>
                    </div>
                    {paymentMethod === 'stripe_card' && <CheckCircle2 className="w-5 h-5 text-[#03396C]" />}
                  </div>

                  {paymentMethod === 'stripe_card' && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-fadeIn">
                      <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Tarif officiel Pré-réservation garanti (0 € de frais administratifs supplémentaires).</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Numéro de Carte Bancaire</label>
                          <input
                            type="text"
                            value={stripeCard.cardNumber}
                            onChange={(e) => setStripeCard({ ...stripeCard, cardNumber: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiration / CVC</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={stripeCard.cardExpiry}
                              onChange={(e) => setStripeCard({ ...stripeCard, cardExpiry: e.target.value })}
                              className="w-1/2 px-2 py-2 text-xs font-mono text-center"
                            />
                            <input
                              type="text"
                              value={stripeCard.cardCvc}
                              onChange={(e) => setStripeCard({ ...stripeCard, cardCvc: e.target.value })}
                              className="w-1/2 px-2 py-2 text-xs font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Method 2: Bank Transfer (IBAN/SWIFT) */}
                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#03396C] bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-[#03396C] flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0F172A]">Virement Bancaire Officiel (IBAN / SWIFT)</div>
                        <div className="text-xs text-slate-600">Recommandé pour Fédérations &bull; Facture proforma émise instantanément</div>
                      </div>
                    </div>
                    {paymentMethod === 'bank_transfer' && <CheckCircle2 className="w-5 h-5 text-[#03396C]" />}
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-fadeIn">
                      <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Tarif officiel Pré-réservation garanti (0 € de frais administratifs supplémentaires).</span>
                      </div>
                      <div className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 space-y-1 font-mono">
                        <div><strong>Bénéficiaire :</strong> Fédération Tunisienne d'Escrime (Grand Prix 2027)</div>
                        <div><strong>Banque :</strong> Banque Internationale Arabe de Tunisie (BIAT)</div>
                        <div><strong>IBAN :</strong> TN59 0800 1000 1234 5678 9012</div>
                        <div><strong>SWIFT / BIC :</strong> BIATTNTT</div>
                        <div className="text-blue-700 pt-1"><strong>Référence :</strong> Votre code GPS2027-XXXX généré à la validation</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Method 3: On-site Payment */}
                <div
                  onClick={() => setPaymentMethod('onsite_federation')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'onsite_federation'
                      ? 'border-[#03396C] bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-[#03396C] flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0F172A]">{lang === 'fr' ? 'Règlement sur Place pour Fédérations' : 'On-site Payment for Delegations'}</div>
                        <div className="text-xs text-slate-600">{lang === 'fr' ? 'Règlement direct lors de l\'accréditation officielle FIE & check-in hôtel' : 'Direct payment during official FIE accreditation & hotel check-in'}</div>
                      </div>
                    </div>
                    {paymentMethod === 'onsite_federation' && <CheckCircle2 className="w-5 h-5 text-[#03396C]" />}
                  </div>

                  {paymentMethod === 'onsite_federation' && (
                    <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-emerald-900 bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 animate-fadeIn space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{lang === 'fr' ? 'Tarif officiel identique garanti (0 € de frais supplémentaires)' : 'Identical official rate guaranteed (0 € extra fee)'}</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        {lang === 'fr'
                          ? 'Règlement autorisé directement au bureau d\'accréditation FIE lors du check-in à l\'hôtel. Le montant facturé est strictement identique à un paiement en ligne.'
                          : 'Payment authorized directly at official FIE accreditation desk during hotel check-in. The billed amount is strictly identical to online payment.'}
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Notes */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'fr' ? 'Remarques Spécifiques & Régimes Alimentaires (Optionnel)' : 'Specific Requests & Dietary Requirements (Optional)'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder={lang === 'fr' ? 'Besoins spécifiques en matériel, régimes sportifs, demandes particulières...' : 'Specific equipment needs, athletic diet, special requests...'}
                  className="w-full px-3.5 py-2.5 text-xs"
                />
              </div>

            </div>

          </div>

          {/* Right Sticky Summary (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            <div className="inst-card p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#03396C]" />
                  <span className="font-bold text-[#0F172A] text-base">{lang === 'fr' ? 'Récapitulatif Officiel' : 'Official Summary'}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#03396C] font-bold border border-blue-200">
                  FIE 2027
                </span>
              </div>

              {/* Selected Hotel */}
              <div className="mb-4 text-xs space-y-1">
                <span className="text-slate-500">{lang === 'fr' ? 'Établissement retenu :' : 'Selected Hotel:'}</span>
                <div className="font-bold text-[#0F172A] text-sm">{selectedHotel.name} (5★)</div>
                <div className="text-slate-500 text-[11px]">{selectedHotel.location}</div>
              </div>

              {/* Calculation Lines */}
              <div className="space-y-2.5 text-xs py-3 border-y border-slate-200 mb-4 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'fr' ? 'Période :' : 'Period:'}</span>
                  <span className="font-bold text-[#0F172A]">{nightsCount} {lang === 'fr' ? 'Nuitées' : 'Nights'}</span>
                </div>
                {effectiveSingleRooms > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{effectiveSingleRooms} × Single ({singlePrice} €) :</span>
                    <span className="font-bold text-[#0F172A]">{effectiveSingleRooms * singlePrice * nightsCount} €</span>
                  </div>
                )}
                {effectiveDoubleRooms > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{effectiveDoubleRooms} × Double ({doublePrice} €) :</span>
                    <span className="font-bold text-[#0F172A]">{effectiveDoubleRooms * doublePrice * nightsCount} €</span>
                  </div>
                )}
                {requestShuttle && (
                  <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <span>{lang === 'fr' ? 'Navettes Aéroports (TUN/NBE/MIR) :' : 'Airport Shuttles (TUN/NBE/MIR):'}</span>
                    <span className="font-bold">{lang === 'fr' ? 'Inclus (0 €)' : 'Included (0 €)'}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'fr' ? 'Frais supplémentaires :' : 'Extra Fees:'}</span>
                  <span className="font-bold text-emerald-700">0 €</span>
                </div>
              </div>

              {/* Total Display */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    {lang === 'fr' ? 'Montant Total Facturé :' : 'Total Billed Amount:'}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#0F172A] font-mono">{grandTotal} €</div>
                    <div className="text-xs text-slate-500 font-mono">(~{Math.round(grandTotal * 3.3)} TND)</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lang === 'fr'
                    ? 'Chambres × Nuitées • Buffets sportifs & petits déjeuners inclus • TVA comprise.'
                    : 'Rooms × Nights • Sports buffets & breakfasts included • VAT included.'}
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full btn-primary cursor-pointer text-sm font-semibold py-3.5 shadow-sm disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{lang === 'fr' ? 'Validation du dossier FIE...' : 'Validating FIE booking...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Confirmer la Réservation' : 'Confirm Reservation'}</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'fr' ? 'Validation instantanée • Code unique GPS2027' : 'Instant validation • Unique GPS2027 Code'}</span>
              </div>

            </div>

            {/* Hint Box: Airport Transfer Unlock */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex gap-3">
              <Bus className="w-5 h-5 text-[#03396C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#03396C] block mb-0.5">
                  {lang === 'fr' ? 'Navette Aéroport Incluse (0 €)' : 'Airport Shuttle Included (0 €)'}
                </strong>
                {lang === 'fr'
                  ? 'Une fois votre hébergement confirmé, votre code de réservation vous permettra de planifier immédiatement vos navettes aéroport (TUN, NBE, MIR).'
                  : 'Once your accommodation is confirmed, your booking code will allow you to schedule airport shuttles (TUN, NBE, MIR) at zero extra fee.'}
              </div>
            </div>

          </div>

        </form>

      </div>

      {/* Booking Success Confirmation Modal */}
      {createdReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg inst-card p-6 sm:p-8 text-center shadow-2xl">
            
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-1">
              {lang === 'fr' ? 'Réservation Confirmée avec Succès' : 'Reservation Successfully Confirmed'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              {lang === 'fr'
                ? 'Votre dossier pour le Grand Prix Sabre Tunis 2027 a été enregistré. Un email de confirmation automatique a été consigné.'
                : 'Your booking file for the Sabre Grand Prix Tunis 2027 has been registered. An automated confirmation email has been logged.'}
            </p>

            {/* Code */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {lang === 'fr' ? 'VOTRE CODE DE RÉSERVATION UNIQUE' : 'YOUR UNIQUE BOOKING CODE'}
              </div>
              <div className="text-3xl font-black text-[#03396C] font-mono tracking-wider select-all">
                {createdReservation.id}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 font-medium">
                {lang === 'fr'
                  ? 'Conservez ce code. Il est indispensable pour réserver votre navette aéroport et accéder à votre dossier officiel.'
                  : 'Keep this code safe. It is required to schedule your airport shuttle and access your official file.'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  const code = createdReservation.id;
                  setCreatedReservation(null);
                  onGoToShuttle(code);
                }}
                className="w-full btn-primary cursor-pointer text-sm font-semibold py-3"
              >
                <Bus className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Réserver la Navette Aéroport Maintenant →' : 'Book Airport Shuttle Now →'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowVoucherModal(true);
                }}
                className="w-full btn-outline cursor-pointer text-sm font-semibold py-2.5"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>{lang === 'fr' ? 'Télécharger le Voucher & Facture PDF' : 'Download Voucher & PDF Invoice'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatedReservation(null)}
                className="w-full text-xs text-slate-500 hover:text-slate-800 py-1 font-semibold cursor-pointer"
              >
                {lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Voucher & Invoice Modal */}
      {showVoucherModal && createdReservation && (
        <VoucherModal
          reservation={createdReservation}
          hotel={selectedHotel}
          onClose={() => setShowVoucherModal(false)}
        />
      )}

    </section>
  );
};

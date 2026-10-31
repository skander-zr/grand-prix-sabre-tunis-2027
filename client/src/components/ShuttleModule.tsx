import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReservation } from '../contexts/ReservationContext';
import { ShuttleDetails, Reservation } from '../types/gp';
import {
  Bus,
  Plane,
  Clock,
  Users,
  Luggage,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Search,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

interface ShuttleModuleProps {
  initialCode?: string;
  onShuttleSuccess: (reservation: Reservation) => void;
  onNavigateToBooking?: () => void;
}

export const ShuttleModule: React.FC<ShuttleModuleProps> = ({
  initialCode = '',
  onShuttleSuccess,
  onNavigateToBooking
}) => {
  const { lang, t } = useLanguage();
  const { getReservation, bookShuttle } = useReservation();

  const [bookingCode, setBookingCode] = useState(initialCode);
  const [verifiedReservation, setVerifiedReservation] = useState<Reservation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setBookingCode(initialCode);
      const res = getReservation(initialCode);
      if (res) {
        setVerifiedReservation(res);
        setPassengerCount(res.totalGuestsCount || 1);
        setHasSearched(true);
      }
    }
  }, [initialCode]);

  // Shuttle Form Fields
  const [tripType, setTripType] = useState<'arrival' | 'departure' | 'roundtrip'>('roundtrip');
  const [airport, setAirport] = useState<'TUN' | 'NBE' | 'MIR'>('TUN');
  const [isVipVan, setIsVipVan] = useState(false);
  const [passengerCount, setPassengerCount] = useState(2);
  const [luggageCount, setLuggageCount] = useState(2);
  const [weaponBagsCount, setWeaponBagsCount] = useState(2);
  const [driverWhatsApp, setDriverWhatsApp] = useState('+33 6 12 34 56 78');
  const [specialRequests, setSpecialRequests] = useState('');

  // All 3 airports (TUN, NBE, MIR) are included at 0 EUR for confirmed hotel reservations
  const shuttlePriceEur = 0;

  // Flights
  const [arrivalAirline, setArrivalAirline] = useState('Air France');
  const [arrivalFlightNumber, setArrivalFlightNumber] = useState('AF1184');
  const [arrivalDateTime, setArrivalDateTime] = useState('2027-01-14T14:15');

  const [departureAirline, setDepartureAirline] = useState('Air France');
  const [departureFlightNumber, setDepartureFlightNumber] = useState('AF1185');
  const [departureDateTime, setDepartureDateTime] = useState('2027-01-18T17:30');

  const handleVerifyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    const cleanCode = bookingCode.trim().toUpperCase();
    const res = getReservation(cleanCode);
    if (res) {
      setVerifiedReservation(res);
      setPassengerCount(res.totalGuestsCount || 1);
      toast.success(lang === 'fr' ? `Dossier ${res.id} vérifié avec succès !` : `Booking ${res.id} verified successfully!`);
    } else {
      setVerifiedReservation(null);
      toast.error(lang === 'fr' ? 'Code introuvable. Veuillez vérifier votre référence (ex: GPS2027-FR48).' : 'Code not found. Please verify your reference (e.g. GPS2027-FR48).');
    }
  };

  const handleSubmitShuttle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedReservation) {
      toast.error(lang === 'fr' ? 'Veuillez d\'abord valider votre code de réservation.' : 'Please verify your booking reference first.');
      return;
    }

    if (!driverWhatsApp) {
      toast.error(lang === 'fr' ? 'Veuillez renseigner un numéro de téléphone de contact.' : 'Please provide a contact phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const details: ShuttleDetails = {
        tripType,
        airport,
        isVipVan: false,
        surchargeEur: 0,
        arrivalAirline: (tripType === 'arrival' || tripType === 'roundtrip') ? arrivalAirline : undefined,
        arrivalFlightNumber: (tripType === 'arrival' || tripType === 'roundtrip') ? arrivalFlightNumber : undefined,
        arrivalDateTime: (tripType === 'arrival' || tripType === 'roundtrip') ? arrivalDateTime : undefined,
        departureAirline: (tripType === 'departure' || tripType === 'roundtrip') ? departureAirline : undefined,
        departureFlightNumber: (tripType === 'departure' || tripType === 'roundtrip') ? departureFlightNumber : undefined,
        departureDateTime: (tripType === 'departure' || tripType === 'roundtrip') ? departureDateTime : undefined,
        passengerCount,
        luggageCount,
        weaponBagsCount,
        driverWhatsApp,
        specialRequests,
        assignedGroupCode: `SHT-${airport}-${verifiedReservation.hotelId === 'el-mouradi-gammarth' ? 'ELM' : 'GDC'}-14H`,
        assignedVehicle: passengerCount > 4 ? 'Minibus Mercedes Sprinter FIE #1' : 'Berline VIP Officielle FIE #3',
        status: 'grouped'
      };

      const success = bookShuttle(verifiedReservation.id, details);
      if (success) {
        setIsSuccess(true);
        toast.success(lang === 'fr' ? `Navette aéroport assignée au dossier ${verifiedReservation.id}` : `Airport shuttle assigned to booking ${verifiedReservation.id}`);
        onShuttleSuccess({
          ...verifiedReservation,
          hasShuttle: true,
          shuttle: details
        });
      }
    }, 700);
  };

  return (
    <section id="shuttle-section" className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#03396C] text-xs font-semibold mb-2.5">
              <Bus className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Service Officiel de Transport FIE • Aéroports de Tunisie' : 'Official FIE Transport Service • Tunisia Airports'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {lang === 'fr' ? 'Réservation Navettes Aéroport • Grand Prix Sabre 2027' : 'Airport Shuttle Booking • Sabre Grand Prix 2027'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
              {lang === 'fr'
                ? 'Prise en charge officielle réservée aux délégations enregistrées. Desserte des 3 aéroports internationaux (TUN, NBE, MIR) vers les 2 hôtels 5★ de Gammarth avec véhicules dédiés et transport sécurisé des housses d\'escrime (0 € de supplément).'
                : 'Official transfer service reserved for registered delegations. Serving the 3 international airports (TUN, NBE, MIR) to both 5★ Gammarth hotels with dedicated vehicles and secure fencing bag transport (0 € extra fee).'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>{lang === 'fr' ? 'Aéroports : TUN • NBE • MIR (0 € Inclus)' : 'Airports: TUN • NBE • MIR (0 € Included)'}</span>
          </div>
        </div>

        {/* LOCKED GATE: If no verified hotel reservation is found */}
        {!verifiedReservation ? (
          <div className="max-w-2xl mx-auto inst-card p-8 sm:p-10 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#03396C] border border-blue-200 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                {lang === 'fr' ? 'Accès Verrouillé par Réservation Hôtelière' : 'Locked by Hotel Reservation'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {lang === 'fr' ? (
                  <>Ce module de navette officielle est réservé exclusivement aux délégations et athlètes disposant déjà d'une réservation hôtelière confirmée (code format <strong>GPS2027-XXXX</strong>).</>
                ) : (
                  <>This official shuttle module is exclusively available to delegations and athletes holding a confirmed hotel reservation (format <strong>GPS2027-XXXX</strong>).</>
                )}
              </p>
            </div>

            {/* Code Verification Form */}
            <form onSubmit={handleVerifyCode} className="max-w-md mx-auto space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  placeholder="ex: GPS2027-FR48"
                  className="flex-1 px-4 py-3 font-mono font-bold uppercase tracking-wider text-sm"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary cursor-pointer text-sm font-semibold px-5"
                >
                  <Search className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Vérifier' : 'Verify'}</span>
                </button>
              </div>

              {hasSearched && !verifiedReservation && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{lang === 'fr' ? 'Aucun dossier trouvé avec ce code. Vérifiez votre référence ou effectuez votre réservation hôtelière.' : 'No file found with this code. Please check your reference or complete your hotel booking.'}</span>
                </div>
              )}
            </form>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span>{lang === 'fr' ? 'Vous n\'avez pas encore réservé votre hôtel ? ' : 'Haven\'t booked your hotel yet? '}</span>
              <button
                type="button"
                onClick={onNavigateToBooking}
                className="text-[#03396C] font-semibold underline underline-offset-4 cursor-pointer hover:text-[#005B96]"
              >
                {lang === 'fr' ? 'Réserver votre hébergement 5★ ici' : 'Book your 5★ hotel here'}
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED SHUTTLE CONFIGURATION FORM */
          <form onSubmit={handleSubmitShuttle} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column (8 cols): Flight & Trip Details */}
            <div className="lg:col-span-8 space-y-6">

              {/* Verified File Summary Header */}
              <div className="inst-card p-5 bg-blue-50/50 border-blue-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#03396C] text-white flex items-center justify-center font-bold text-sm">
                    FIE
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F172A]">{lang === 'fr' ? 'Dossier Validé :' : 'Verified Booking:'}</span>
                      <span className="font-mono font-black text-[#03396C] text-base">{verifiedReservation.id}</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {verifiedReservation.type === 'group'
                        ? verifiedReservation.federationGroup?.federationName
                        : `${verifiedReservation.individualLead?.firstName} ${verifiedReservation.individualLead?.lastName}`}
                      {' '}&bull; {verifiedReservation.hotelId === 'el-mouradi-gammarth' ? 'Hôtel El Mouradi Gammarth' : 'Hôtel Golden Carthage'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setVerifiedReservation(null);
                    setBookingCode('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  {lang === 'fr' ? 'Changer de dossier' : 'Change booking'}
                </button>
              </div>

              {/* Step 1: Trip Type & Airport Dropdown (MANDATORY 3 AIRPORTS) */}
              <div className="inst-card p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-[#0F172A] pb-3 border-b border-slate-200">
                  {lang === 'fr' ? '1. Sélection du Trajet & Aéroport d\'Arrivée' : '1. Route & Arrival Airport Selection'}
                </h3>

                {/* Trip Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {lang === 'fr' ? 'Type de Transfert Souhaité' : 'Transfer Type'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTripType('arrival')}
                      className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer text-center transition-all ${tripType === 'arrival'
                        ? 'border-[#03396C] bg-blue-50 text-[#03396C] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {lang === 'fr' ? 'Arrivée Simple (Aéroport → Hôtel)' : 'One-way Arrival (Airport → Hotel)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('departure')}
                      className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer text-center transition-all ${tripType === 'departure'
                        ? 'border-[#03396C] bg-blue-50 text-[#03396C] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {lang === 'fr' ? 'Départ Simple (Hôtel → Aéroport)' : 'One-way Departure (Hotel → Airport)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('roundtrip')}
                      className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer text-center transition-all ${tripType === 'roundtrip'
                        ? 'border-[#03396C] bg-blue-50 text-[#03396C] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {lang === 'fr' ? 'Aller-Retour Complet' : 'Roundtrip Transfer'}
                    </button>
                  </div>
                </div>

                {/* MANDATORY DROPDOWN WITH THE 3 AIRPORTS */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {lang === 'fr' ? 'Aéroport d\'Atterrissage / Décollage *' : 'Airport of Arrival / Departure *'}
                  </label>
                  <select
                    value={airport}
                    onChange={(e) => setAirport(e.target.value as 'TUN' | 'NBE' | 'MIR')}
                    className="w-full px-3.5 py-3 text-sm font-semibold"
                  >
                    <option value="TUN">Tunis-Carthage (TUN) — {lang === 'fr' ? 'Inclus à 0 €' : '0 € Included'}</option>
                    <option value="NBE">Enfidha-Hammamet (NBE - 100 km) — {lang === 'fr' ? 'Inclus à 0 €' : '0 € Included'}</option>
                    <option value="MIR">Monastir Habib-Bourguiba (MIR - 165 km) — {lang === 'fr' ? 'Inclus à 0 €' : '0 € Included'}</option>
                  </select>

                  {/* Guaranteed 0 € badge for all 3 airports */}
                  <div className="mt-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {lang === 'fr' ? (
                        <><strong>Inclus dans le Pack Officiel FTE :</strong> Transferts 100% pris en charge à 0 € pour les aéroports de Tunis-Carthage (TUN), Enfidha (NBE) et Monastir (MIR).</>
                      ) : (
                        <><strong>Included in Official FTE Pack:</strong> 100% free transfers (0 €) for Tunis-Carthage (TUN), Enfidha (NBE), and Monastir (MIR) airports.</>
                      )}
                    </span>
                  </div>
                </div>

              </div>

              {/* Step 2: Flight Details */}
              <div className="inst-card p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-[#0F172A] pb-3 border-b border-slate-200">
                  {lang === 'fr' ? '2. Coordonnées des Vols' : '2. Flight Details'}
                </h3>

                {/* Arrival Flight */}
                {(tripType === 'arrival' || tripType === 'roundtrip') && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Plane className="w-4 h-4 text-emerald-600 rotate-45" />
                      <span>{lang === 'fr' ? 'Vol Aller (Arrivée en Tunisie)' : 'Inbound Flight (Arrival in Tunisia)'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Compagnie Aérienne *</label>
                        <input
                          type="text"
                          required
                          value={arrivalAirline}
                          onChange={(e) => setArrivalAirline(e.target.value)}
                          placeholder="ex: Air France / Tunisair"
                          className="w-full px-3.5 py-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de Vol *</label>
                        <input
                          type="text"
                          required
                          value={arrivalFlightNumber}
                          onChange={(e) => setArrivalFlightNumber(e.target.value)}
                          placeholder="ex: AF 1184 / TU 712"
                          className="w-full px-3.5 py-2.5 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Date &amp; Heure d'Atterrissage *</label>
                        <input
                          type="datetime-local"
                          required
                          value={arrivalDateTime}
                          onChange={(e) => setArrivalDateTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Departure Flight */}
                {(tripType === 'departure' || tripType === 'roundtrip') && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Plane className="w-4 h-4 text-blue-600 -rotate-45" />
                      <span>{lang === 'fr' ? 'Vol Retour (Départ de Tunisie)' : 'Outbound Flight (Departure from Tunisia)'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Compagnie Aérienne *' : 'Airline *'}</label>
                        <input
                          type="text"
                          required
                          value={departureAirline}
                          onChange={(e) => setDepartureAirline(e.target.value)}
                          placeholder="ex: Air France / Tunisair"
                          className="w-full px-3.5 py-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Numéro de Vol *' : 'Flight Number *'}</label>
                        <input
                          type="text"
                          required
                          value={departureFlightNumber}
                          onChange={(e) => setDepartureFlightNumber(e.target.value)}
                          placeholder="ex: AF 1185 / TU 713"
                          className="w-full px-3.5 py-2.5 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Date & Heure de Décollage *' : 'Departure Date & Time *'}</label>
                        <input
                          type="datetime-local"
                          required
                          value={departureDateTime}
                          onChange={(e) => setDepartureDateTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Step 3: Passengers & Equipment Logistics */}
              <div className="inst-card p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-[#0F172A] pb-3 border-b border-slate-200">
                  {lang === 'fr' ? '3. Passagers, Bagages & Sacs d\'Armes d\'Escrime' : '3. Passengers, Luggage & Sabre Bags'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lang === 'fr' ? 'Nombre de Passagers *' : 'Number of Passengers *'}</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Luggage className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lang === 'fr' ? 'Valises Standards' : 'Standard Luggage'}</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={luggageCount}
                      onChange={(e) => setLuggageCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C8102E]"></span>
                      <span>{lang === 'fr' ? 'Housses de Sabre (1m40) *' : 'Sabre Bags (1m40) *'}</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={weaponBagsCount}
                      onChange={(e) => setWeaponBagsCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Driver Contact Phone */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'fr' ? 'Numéro de Téléphone Chauffeur / Régie *' : 'Driver / Coordinator Phone Number *'}</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={driverWhatsApp}
                    onChange={(e) => setDriverWhatsApp(e.target.value)}
                    placeholder="+33 6 12 34 56 78 ou +216 ..."
                    className="w-full px-3.5 py-2.5 text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {lang === 'fr'
                      ? 'Le coordinateur des transports FIE vous contactera sur ce numéro direct dès l\'atterrissage de votre vol.'
                      : 'The official FIE transport coordinator will reach you at this number upon flight landing.'}
                  </p>
                </div>

              </div>

            </div>

            {/* Right Column (4 cols): Summary & Automatic Grouping */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">

              <div className="inst-card p-6 shadow-sm">
                <h4 className="text-sm font-bold text-[#0F172A] pb-3 border-b border-slate-200 mb-4 flex items-center gap-2">
                  <Bus className="w-4 h-4 text-[#03396C]" />
                  <span>{lang === 'fr' ? 'Protocole Navette FIE' : 'FIE Shuttle Protocol'}</span>
                </h4>

                <div className="space-y-3 text-xs text-slate-600 mb-6">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>{lang === 'fr' ? 'Aéroport :' : 'Airport:'}</span>
                    <strong className="text-slate-900 font-mono">{airport}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>{lang === 'fr' ? 'Trajet :' : 'Route:'}</span>
                    <strong className="text-slate-900 capitalize">
                      {tripType === 'roundtrip' ? (lang === 'fr' ? 'Aller-Retour' : 'Roundtrip') : (tripType === 'arrival' ? (lang === 'fr' ? 'Arrivée' : 'Arrival') : (lang === 'fr' ? 'Départ' : 'Departure'))}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>{lang === 'fr' ? 'Passagers :' : 'Passengers:'}</span>
                    <strong className="text-slate-900 font-mono">{passengerCount} pers.</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>{lang === 'fr' ? 'Housses de sabre :' : 'Sabre Bags:'}</span>
                    <strong className="text-[#C8102E] font-mono">{weaponBagsCount} sacs 1m40</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>{lang === 'fr' ? 'Hôtel de destination :' : 'Destination Hotel:'}</span>
                    <strong className="text-slate-900 text-right">
                      {verifiedReservation.hotelId === 'el-mouradi-gammarth' ? 'El Mouradi Gammarth' : 'Golden Carthage'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>{lang === 'fr' ? 'Véhicule assigné :' : 'Assigned Vehicle:'}</span>
                    <strong className="text-slate-900 text-right">
                      {lang === 'fr' ? 'Minibus Officiel FIE Sprinter' : 'Official FIE Sprinter Minibus'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 text-slate-900 font-bold">
                    <span>{lang === 'fr' ? 'Tarif Transfert :' : 'Transfer Cost:'}</span>
                    <span className="font-mono text-emerald-700 text-sm font-black">
                      {lang === 'fr' ? 'Inclus dans le pack (0 €)' : 'Included in pack (0 €)'}
                    </span>
                  </div>
                </div>

                {/* Grouping explanation */}
                <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-slate-700 mb-6 leading-relaxed">
                  <strong className="text-[#03396C] block mb-1">
                    {lang === 'fr' ? 'Optimisation & Regroupement FIE :' : 'FIE Grouping & Optimization:'}
                  </strong>
                  {lang === 'fr'
                    ? 'Le régisseur FIE regroupe automatiquement les délégations atterrissant sur le même aéroport dans un créneau de 45 minutes pour des convois directs et sécurisés vers Gammarth.'
                    : 'The FIE coordinator automatically groups delegations arriving at the same airport within a 45-minute window for direct, secured convoys to Gammarth.'}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary cursor-pointer text-sm font-semibold py-3.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{lang === 'fr' ? 'Enregistrement Navette...' : 'Saving Shuttle...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === 'fr' ? 'Valider ma Navette Officielle' : 'Confirm Official Shuttle'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Success Banner */}
              {isSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-0.5">
                      {lang === 'fr' ? 'Navette Confirmée avec Succès' : 'Shuttle Successfully Confirmed'}
                    </strong>
                    {lang === 'fr'
                      ? 'Votre itinéraire a été synchronisé. Vous pouvez retrouver les détails et modifier vos horaires à tout moment dans l\'onglet « Mes Réservations ».'
                      : 'Your transfer itinerary is synchronized. You can review details and update flight times anytime in "My Bookings".'}
                  </div>
                </div>
              )}

            </div>

          </form>
        )}

      </div>
    </section>
  );
};

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

  // Smart Airport Pricing Calculation
  const isRoundTrip = tripType === 'roundtrip';
  const tripMultiplier = isRoundTrip ? 2 : 1;

  let shuttlePriceEur = 0;
  if (airport === 'TUN') {
    shuttlePriceEur = isVipVan ? (90 * tripMultiplier) : 0;
  } else if (airport === 'NBE') {
    shuttlePriceEur = isVipVan ? (160 * tripMultiplier) : (35 * passengerCount * tripMultiplier);
  } else if (airport === 'MIR') {
    shuttlePriceEur = isVipVan ? (220 * tripMultiplier) : (45 * passengerCount * tripMultiplier);
  }

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
      toast.success(`Dossier ${res.id} vérifié avec succès !`);
    } else {
      setVerifiedReservation(null);
      toast.error('Code introuvable. Veuillez vérifier votre référence (ex: GPS2027-FR48).');
    }
  };

  const handleSubmitShuttle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedReservation) {
      toast.error('Veuillez d\'abord valider votre code de réservation.');
      return;
    }

    if (!driverWhatsApp) {
      toast.error('Veuillez renseigner un numéro WhatsApp pour la coordination du chauffeur.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const details: ShuttleDetails = {
        tripType,
        airport,
        isVipVan,
        surchargeEur: shuttlePriceEur,
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
        assignedVehicle: isVipVan
          ? 'Van VIP Privatif Dédié Mercedes V-Class (Sans Attente)'
          : (passengerCount > 4 ? 'Minibus Mercedes Sprinter FIE #1' : 'Berline VIP Officielle FIE #3'),
        status: 'grouped'
      };

      const success = bookShuttle(verifiedReservation.id, details);
      if (success) {
        setIsSuccess(true);
        toast.success(`Navette aéroport assignée au dossier ${verifiedReservation.id}`);
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
              <span>Service Officiel de Transport FIE &bull; Aéroports de Tunisie</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Réservation Navettes Aéroport &bull; Grand Prix Sabre 2027
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
              Prise en charge officielle réservée aux délégations enregistrées. Desserte des 3 aéroports internationaux vers les 2 hôtels 5★ de Gammarth avec véhicules dédiés et transport sécurisé des housses d'escrime.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Aéroports : TUN &bull; NBE &bull; MIR</span>
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
                Accès Verrouillé par Réservation Hôtelière
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Ce module de navette officielle est réservé exclusivement aux délégations et athlètes disposant déjà d'une réservation hôtelière confirmée (code format <strong>GPS2027-XXXX</strong>).
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
                  <span>Vérifier</span>
                </button>
              </div>

              {hasSearched && !verifiedReservation && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Aucun dossier trouvé avec ce code. Vérifiez votre référence ou effectuez votre réservation hôtelière.</span>
                </div>
              )}
            </form>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span>Vous n'avez pas encore réservé votre hôtel ? </span>
              <button
                type="button"
                onClick={onNavigateToBooking}
                className="text-[#03396C] font-semibold underline underline-offset-4 cursor-pointer hover:text-[#005B96]"
              >
                Réserver votre hébergement 5★ ici
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
                      <span className="text-sm font-bold text-[#0F172A]">Dossier Validé :</span>
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
                  Changer de dossier
                </button>
              </div>

              {/* Step 1: Trip Type & Airport Dropdown (MANDATORY 3 AIRPORTS) */}
              <div className="inst-card p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-[#0F172A] pb-3 border-b border-slate-200">
                  1. Sélection du Trajet &amp; Aéroport d'Arrivée
                </h3>

                {/* Trip Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Type de Transfert Souhaité
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
                      Arrivée Simple (Aéroport &rarr; Hôtel)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('departure')}
                      className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer text-center transition-all ${tripType === 'departure'
                        ? 'border-[#03396C] bg-blue-50 text-[#03396C] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      Départ Simple (Hôtel &rarr; Aéroport)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('roundtrip')}
                      className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer text-center transition-all ${tripType === 'roundtrip'
                        ? 'border-[#03396C] bg-blue-50 text-[#03396C] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      Aller-Retour Complet
                    </button>
                  </div>
                </div>

                {/* MANDATORY DROPDOWN WITH THE 3 AIRPORTS */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Aéroport d'Atterrissage / Décollage *
                  </label>
                  <select
                    value={airport}
                    onChange={(e) => setAirport(e.target.value as 'TUN' | 'NBE' | 'MIR')}
                    className="w-full px-3.5 py-3 text-sm font-semibold"
                  >
                    <option value="TUN">Tunis-Carthage (TUN) — Aéroport Principal (0 € inclus dans le pack officiel)</option>
                    <option value="NBE">Enfidha-Hammamet (NBE - 100 km) — Supplément longue distance 35 €/pers</option>
                    <option value="MIR">Monastir Habib-Bourguiba (MIR - 165 km) — Supplément longue distance 45 €/pers</option>
                  </select>

                  {/* Pricing alert based on airport */}
                  <div className="mt-2.5">
                    {airport === 'TUN' ? (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong>Inclus dans le Pack Officiel :</strong> Transfert 0 € en navette cadencée toutes les 45 min.</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Transfert Longue Distance {airport === 'NBE' ? 'Enfidha (100 km)' : 'Monastir (165 km)'} :</strong>
                          <div className="text-[11px] text-amber-800 mt-0.5">
                            Supplément automatique de {airport === 'NBE' ? '35 €' : '45 €'} / passager {isRoundTrip ? '(aller-retour comptabilisé)' : '(aller simple)'} en navette groupée officielle (ou forfait Van VIP dédié).
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Van VIP Toggle */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="shuttle-vip-van"
                      checked={isVipVan}
                      onChange={(e) => setIsVipVan(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#03396C] rounded border-slate-300"
                    />
                    <label htmlFor="shuttle-vip-van" className="text-xs text-slate-800 cursor-pointer">
                      <div className="font-bold text-[#0F172A] flex items-center gap-2">
                        <span>Privatiser un Van VIP Mercedes (Sans aucune attente)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#03396C] font-black">
                          {airport === 'TUN' ? '+90 €/trajet' : (airport === 'NBE' ? '+160 €/trajet' : '+220 €/trajet')}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Accueil personnalisé avec pancarte nominative à la sortie bagages et départ immédiat vers votre hôtel 5★.
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Step 2: Flight Details */}
              <div className="inst-card p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-[#0F172A] pb-3 border-b border-slate-200">
                  2. Coordonnées des Vols
                </h3>

                {/* Arrival Flight */}
                {(tripType === 'arrival' || tripType === 'roundtrip') && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Plane className="w-4 h-4 text-emerald-600 rotate-45" />
                      <span>Vol Aller (Arrivée en Tunisie)</span>
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
                      <span>Vol Retour (Départ de Tunisie)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Compagnie Aérienne *</label>
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de Vol *</label>
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Date &amp; Heure de Décollage *</label>
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
                  3. Passagers, Bagages &amp; Sacs d'Armes d'Escrime
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Nombre de Passagers *</span>
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
                      <span>Valises Standards</span>
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
                      <span>Housses de Sabre (1m40) *</span>
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

                {/* WhatsApp Phone for Driver */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Numéro de Téléphone WhatsApp pour le Chauffeur / Régisseur *</span>
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
                    Le coordinateur des transports FIE vous contactera sur ce numéro dès l'atterrissage de votre vol.
                  </p>
                </div>

              </div>

            </div>

            {/* Right Column (4 cols): Summary & Automatic Grouping */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">

              <div className="inst-card p-6 shadow-sm">
                <h4 className="text-sm font-bold text-[#0F172A] pb-3 border-b border-slate-200 mb-4 flex items-center gap-2">
                  <Bus className="w-4 h-4 text-[#03396C]" />
                  <span>Protocole Navette FIE</span>
                </h4>

                <div className="space-y-3 text-xs text-slate-600 mb-6">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Aéroport :</span>
                    <strong className="text-slate-900 font-mono">{airport}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Trajet :</span>
                    <strong className="text-slate-900 capitalize">{tripType === 'roundtrip' ? 'Aller-Retour' : tripType}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Passagers :</span>
                    <strong className="text-slate-900 font-mono">{passengerCount} pers.</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Housses de sabre :</span>
                    <strong className="text-[#C8102E] font-mono">{weaponBagsCount} sacs 1m40</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Hôtel de destination :</span>
                    <strong className="text-slate-900 text-right">
                      {verifiedReservation.hotelId === 'el-mouradi-gammarth' ? 'El Mouradi Gammarth' : 'Golden Carthage'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Véhicule sélectionné :</span>
                    <strong className="text-slate-900 text-right">
                      {isVipVan ? 'Van VIP Mercedes Dédié' : 'Navette Minibus FIE'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 text-slate-900 font-bold">
                    <span>Tarif Transfert :</span>
                    <span className="font-mono text-[#03396C] text-sm">
                      {shuttlePriceEur === 0 ? 'Inclus dans le pack (0 €)' : `+${shuttlePriceEur} €`}
                    </span>
                  </div>
                </div>

                {/* Grouping explanation */}
                <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-slate-700 mb-6 leading-relaxed">
                  <strong className="text-[#03396C] block mb-1">Optimisation &amp; Regroupement :</strong>
                  Le régisseur FIE regroupe automatiquement les délégations atterrissant sur le même aéroport dans un créneau de 45 minutes pour des convois sécurisés vers Gammarth.
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
                      <span>Enregistrement Navette...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valider ma Navette Officielle</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Success Banner */}
              {isSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-0.5">Navette Confirmée avec Succès</strong>
                    Votre itinéraire a été synchronisé. Vous pouvez retrouver les détails et modifier vos horaires à tout moment dans l'onglet « Mes Réservations ».
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

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
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Swords,
  Search,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface ShuttleModuleProps {
  initialCode?: string;
  onShuttleSuccess: (reservation: Reservation) => void;
}

export const ShuttleModule: React.FC<ShuttleModuleProps> = ({
  initialCode = '',
  onShuttleSuccess
}) => {
  const { lang, t } = useLanguage();
  const { getReservation, bookShuttle } = useReservation();

  const [bookingCode, setBookingCode] = useState(initialCode);
  const [verifiedReservation, setVerifiedReservation] = useState<Reservation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setBookingCode(initialCode);
      const res = getReservation(initialCode);
      if (res) {
        setVerifiedReservation(res);
        setHasSearched(true);
      }
    }
  }, [initialCode]);

  // Shuttle Form Fields - Exclusively TUN
  const [tripType, setTripType] = useState<'arrival' | 'departure' | 'roundtrip'>('roundtrip');
  const airport = 'TUN';
  const [arrivalAirline, setArrivalAirline] = useState('Air France');
  const [arrivalFlightNumber, setArrivalFlightNumber] = useState('AF1184');
  const [arrivalDateTime, setArrivalDateTime] = useState('2027-01-14T14:15');
  const [departureAirline, setDepartureAirline] = useState('Air France');
  const [departureFlightNumber, setDepartureFlightNumber] = useState('AF1185');
  const [departureDateTime, setDepartureDateTime] = useState('2027-01-18T17:30');
  const [passengerCount, setPassengerCount] = useState(2);
  const [luggageCount, setLuggageCount] = useState(2);
  const [weaponBagsCount, setWeaponBagsCount] = useState(2);
  const [driverContactPhone, setDriverContactPhone] = useState('+216 98 440 112');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleVerifyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    const res = getReservation(bookingCode);
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

    const details: ShuttleDetails = {
      tripType,
      airport: 'TUN',
      arrivalAirline: (tripType === 'arrival' || tripType === 'roundtrip') ? arrivalAirline : undefined,
      arrivalFlightNumber: (tripType === 'arrival' || tripType === 'roundtrip') ? arrivalFlightNumber : undefined,
      arrivalDateTime: (tripType === 'arrival' || tripType === 'roundtrip') ? arrivalDateTime : undefined,
      departureAirline: (tripType === 'departure' || tripType === 'roundtrip') ? departureAirline : undefined,
      departureFlightNumber: (tripType === 'departure' || tripType === 'roundtrip') ? departureFlightNumber : undefined,
      departureDateTime: (tripType === 'departure' || tripType === 'roundtrip') ? departureDateTime : undefined,
      passengerCount,
      luggageCount,
      weaponBagsCount,
      driverWhatsApp: driverContactPhone,
      specialRequests,
      status: 'grouped'
    };

    const success = bookShuttle(verifiedReservation.id, details);
    if (success) {
      const updated = getReservation(verifiedReservation.id);
      if (updated) {
        setVerifiedReservation(updated);
        onShuttleSuccess(updated);
      }
    }
  };

  return (
    <section id="shuttle-section" className="py-14 sm:py-20 bg-[#050811] text-white piste-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#D4AF37]/25 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#091222] border border-[#D4AF37]/40 text-[#F5E8C7] text-xs font-bold uppercase tracking-wider mb-2">
              <Bus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Service de Transfert Officiel Aéroport TUN — Hôtels Gammarth</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase font-heading">
              Navettes &amp; Accueil Délégations
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Service officiel de transport réservé aux participants munis d'un code de réservation hôtelière validé. Coordination directe avec le desk d'accueil officiel FTE à l'Aéroport Tunis-Carthage (TUN) et véhicules avec compartiments pour housses d'armes (1m40).
            </p>
          </div>

          <div className="text-left md:text-right shrink-0 bg-[#091222] p-3.5 rounded-xl border border-[#D4AF37]/30">
            <span className="text-[11px] text-slate-400 block font-mono">Accueil garanti 24/7 :</span>
            <span className="text-sm font-bold text-[#F5E8C7]">Aéroport Tunis-Carthage (TUN) Terminal 1</span>
          </div>
        </div>

        {/* Verification Card (Enforcing condition) */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="palace-card rounded-2xl p-6 sm:p-8 text-center border border-[#D4AF37]/35 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5E8C7] mb-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Vérification Obligatoire de la Réservation Hôtelière</span>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Saisissez votre code unique de réservation pour débloquer votre navette et lier votre vol à votre dossier officiel.
            </p>

            <form onSubmit={handleVerifyCode} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                  placeholder="Ex: GPS2027-FR48 ou GPS2027-IT92"
                  className="w-full bg-[#060B14] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-sm font-mono uppercase tracking-widest text-[#F5E8C7] placeholder:text-slate-600 focus:outline-none focus:border-[#D4AF37] text-center sm:text-left font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                Vérifier mon Code
              </button>
            </form>

            {/* Quick Test Codes */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>Dossiers de démonstration :</span>
              <button
                type="button"
                onClick={() => { setBookingCode('GPS2027-FR48'); const r = getReservation('GPS2027-FR48'); if (r) setVerifiedReservation(r); setHasSearched(true); }}
                className="px-2 py-0.5 rounded bg-[#091122] hover:bg-[#101C32] text-[#F5E8C7] font-mono border border-[#D4AF37]/30 cursor-pointer"
              >
                🇫🇷 GPS2027-FR48
              </button>
              <button
                type="button"
                onClick={() => { setBookingCode('GPS2027-IT92'); const r = getReservation('GPS2027-IT92'); if (r) setVerifiedReservation(r); setHasSearched(true); }}
                className="px-2 py-0.5 rounded bg-[#091122] hover:bg-[#101C32] text-[#F5E8C7] font-mono border border-[#D4AF37]/30 cursor-pointer"
              >
                🇮🇹 GPS2027-IT92
              </button>
              <button
                type="button"
                onClick={() => { setBookingCode('GPS2027-TN01'); const r = getReservation('GPS2027-TN01'); if (r) setVerifiedReservation(r); setHasSearched(true); }}
                className="px-2 py-0.5 rounded bg-[#091122] hover:bg-[#101C32] text-[#F5E8C7] font-mono border border-[#D4AF37]/30 cursor-pointer"
              >
                🇹🇳 GPS2027-TN01
              </button>
            </div>

            {/* Success Banner */}
            {hasSearched && verifiedReservation && (
              <div className="mt-4 p-4 rounded-xl bg-[#0B1A24] border border-emerald-500/40 text-left flex items-start gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-300 uppercase tracking-wide">
                    Dossier Hôtelier Confirmé : {verifiedReservation.id}
                  </div>
                  <div className="text-slate-300 mt-1">
                    <strong>Hôtel Assigné :</strong> {verifiedReservation.hotelId === 'el-mouradi-gammarth' ? 'Hôtel El Mouradi Gammarth (5★)' : 'Hôtel Golden Carthage (5★)'}
                    {' '}&bull;{' '}
                    <strong>Délégation :</strong> {verifiedReservation.type === 'group' ? verifiedReservation.federationGroup?.federationName : `${verifiedReservation.individualLead?.firstName} ${verifiedReservation.individualLead?.lastName}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Container (Rendered when reservation is verified) */}
        {verifiedReservation && (
          <form onSubmit={handleSubmitShuttle} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="palace-card rounded-2xl p-6 sm:p-8 space-y-6">
                
                {/* Trip Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Type de Trajet Navette
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTripType('arrival')}
                      className={`p-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tripType === 'arrival'
                          ? 'border-[#D4AF37] bg-[#121F38] text-[#F5E8C7] shadow-lg'
                          : 'border-white/[0.08] bg-[#070D18] text-slate-400 hover:text-white'
                      }`}
                    >
                      Arrivée (Aéroport → Hôtel)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('departure')}
                      className={`p-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tripType === 'departure'
                          ? 'border-[#D4AF37] bg-[#121F38] text-[#F5E8C7] shadow-lg'
                          : 'border-white/[0.08] bg-[#070D18] text-slate-400 hover:text-white'
                      }`}
                    >
                      Départ (Hôtel → Aéroport)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('roundtrip')}
                      className={`p-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tripType === 'roundtrip'
                          ? 'border-[#D4AF37] bg-[#121F38] text-[#F5E8C7] shadow-lg'
                          : 'border-white/[0.08] bg-[#070D18] text-slate-400 hover:text-white'
                      }`}
                    >
                      Aller-Retour (Aéroport ⇄ Hôtel)
                    </button>
                  </div>
                </div>

                {/* Exclusive Official Airport: Tunis-Carthage (TUN) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Aéroport International Officiel Exclusif
                  </label>
                  <div className="p-4 rounded-xl bg-[#091222] border border-[#D4AF37]/35 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#121E36] text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          Aéroport International de Tunis-Carthage (TUN)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Terminal 1 &bull; Accueil officiel des délégations &amp; navettes directes FIE (~18 km • ~20 min de Gammarth)
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#060B14] text-[#D4AF37] font-mono text-[10px] font-bold border border-[#D4AF37]/30 shrink-0">
                      HUB OFFICIEL UNIQUE
                    </span>
                  </div>
                </div>

                {/* Arrival Flight */}
                {(tripType === 'arrival' || tripType === 'roundtrip') && (
                  <div className="p-4 rounded-xl bg-[#070D18] border border-white/[0.08] space-y-3">
                    <div className="text-[11px] font-bold text-[#F5E8C7] uppercase tracking-wider flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#D4AF37]" />
                      <span>Vol d'Arrivée &amp; Horaires d'Atterrissage (TUN)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">Compagnie Aérienne *</label>
                        <input
                          type="text"
                          value={arrivalAirline}
                          onChange={(e) => setArrivalAirline(e.target.value)}
                          placeholder="Ex: Tunisair, Air France..."
                          className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg px-3 py-2 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">Numéro de Vol *</label>
                        <input
                          type="text"
                          value={arrivalFlightNumber}
                          onChange={(e) => setArrivalFlightNumber(e.target.value)}
                          placeholder="Ex: AF1184, TU721"
                          className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">Date &amp; Heure d'Atterrissage *</label>
                        <input
                          type="datetime-local"
                          value={arrivalDateTime}
                          onChange={(e) => setArrivalDateTime(e.target.value)}
                          className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Departure Flight */}
                {(tripType === 'departure' || tripType === 'roundtrip') && (
                  <div className="p-4 rounded-xl bg-[#070D18] border border-white/[0.08] space-y-3">
                    <div className="text-[11px] font-bold text-[#F5E8C7] uppercase tracking-wider flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#D4AF37] rotate-45" />
                      <span>Vol de Départ (TUN &rarr; Retour)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">Compagnie Aérienne *</label>
                        <input
                          type="text"
                          value={departureAirline}
                          onChange={(e) => setDepartureAirline(e.target.value)}
                          placeholder="Ex: Tunisair, Air France..."
                          className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg px-3 py-2 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">Numéro de Vol *</label>
                        <input
                          type="text"
                          value={departureFlightNumber}
                          onChange={(e) => setDepartureFlightNumber(e.target.value)}
                          placeholder="Ex: AF1185, TU722"
                          className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">Date &amp; Heure de Décollage *</label>
                        <input
                          type="datetime-local"
                          value={departureDateTime}
                          onChange={(e) => setDepartureDateTime(e.target.value)}
                          className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Passenger & Equipment Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Nombre de Passagers
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg px-3 py-2 text-sm text-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Valises Standards
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={luggageCount}
                      onChange={(e) => setLuggageCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg px-3 py-2 text-sm text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1 text-[#F5E8C7]">
                      Sacs d'Escrime (Housses 1m40)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={weaponBagsCount}
                      onChange={(e) => setWeaponBagsCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#091122] border border-[#D4AF37]/40 rounded-lg px-3 py-2 text-sm text-[#F5E8C7] font-bold"
                    />
                  </div>
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Numéro de Téléphone Mobile pour le Chauffeur Accrédité *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={driverContactPhone}
                      onChange={(e) => setDriverContactPhone(e.target.value)}
                      placeholder="+216 98 123 456 ou +33 6 12 34 56 78"
                      className="w-full bg-[#091122] border border-[#D4AF37]/25 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Le coordinateur de quai officiel et le chauffeur de navette vous contacteront via ce numéro dès votre atterrissage.
                  </p>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Consignes Particulières (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Ex: Sacs volumineux nécessitant un utilitaire dédié, assistance PMR..."
                    className="w-full bg-[#091122] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl text-[#060B14] font-black text-xs uppercase tracking-wider bg-[#D4AF37] hover:bg-[#C59B27] shadow-xl shadow-black/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Enregistrer &amp; Valider ma Navette Officielle</span>
                </button>

              </div>

            </div>

            {/* Right Manifest Pillar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="palace-card rounded-2xl p-6 border border-[#D4AF37]/30 shadow-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#091222] border border-[#D4AF37]/40 text-[#F5E8C7] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Regroupement Intelligent Actif</span>
                </div>

                <h4 className="font-heading font-black text-white text-base uppercase tracking-tight">
                  Optimisation des Convois FIE
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Le système mutualise les navettes pour les délégations atterrissant dans la même tranche de 45 minutes afin de garantir un départ immédiat vers votre hôtel à Gammarth avec un véhicule adapté au matériel d'escrime.
                </p>

                <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#D4AF37]/25 text-xs space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase text-[11px]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Point d'Accueil Officiel</span>
                  </div>
                  <div>
                    Aéroport Tunis-Carthage (TUN) &bull; Terminal 1, Sortie Arrivées, <strong>Desk d'Accueil Officiel Fédération Tunisienne d'Escrime (FTE)</strong>.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060B14] border border-white/[0.08] text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-200 font-bold uppercase text-[11px]">
                    <Bus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Flotte Officielle FIE</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Autocars Mercedes Tourismo grand confort, Minibus Sprinter et Vans VIP climatisés équipés pour les housses d'armes 1m40.
                  </div>
                </div>
              </div>

            </div>

          </form>
        )}

      </div>
    </section>
  );
};

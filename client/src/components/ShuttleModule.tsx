import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReservation } from '../contexts/ReservationContext';
import { ShuttleDetails, Reservation } from '../types/gp';
import { AIRPORTS } from '../data/mockData';
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

  // Shuttle Form Fields
  const [tripType, setTripType] = useState<'arrival' | 'departure' | 'roundtrip'>('roundtrip');
  const [airport, setAirport] = useState<'TUN' | 'NBE' | 'MIR'>('TUN');
  const [arrivalAirline, setArrivalAirline] = useState('Air France');
  const [arrivalFlightNumber, setArrivalFlightNumber] = useState('AF1184');
  const [arrivalDateTime, setArrivalDateTime] = useState('2027-01-14T14:15');
  const [departureAirline, setDepartureAirline] = useState('Air France');
  const [departureFlightNumber, setDepartureFlightNumber] = useState('AF1185');
  const [departureDateTime, setDepartureDateTime] = useState('2027-01-18T17:30');
  const [passengerCount, setPassengerCount] = useState(2);
  const [luggageCount, setLuggageCount] = useState(2);
  const [weaponBagsCount, setWeaponBagsCount] = useState(2);
  const [driverWhatsApp, setDriverWhatsApp] = useState('+216 98 440 112');
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
      airport,
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
    <section id="shuttle-section" className="py-14 sm:py-20 bg-[#040812] text-white piste-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#14233c] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b172a] border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <Bus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Service de Transfert Officiel Aéroport - Hôtel</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Navettes & Accueil Délégations
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Service exclusif de transport dédié aux participants munis d'un code de réservation hôtelière validé. Coordination directe avec chauffeur WhatsApp et comptoirs d'accueil officiels.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 block font-mono">Accueil garanti 24/7 :</span>
            <span className="text-sm font-bold text-emerald-400">Aéroport Tunis-Carthage (TUN) Terminal 1</span>
          </div>
        </div>

        {/* Verification Card (Enforcing condition) */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="tournament-card rounded-3xl p-6 sm:p-8 text-center border-2 border-sky-500/40 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-300 mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Vérification Obligatoire de la Réservation Hôtelière</span>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Saisissez votre code unique pour débloquer votre navette et lier votre vol à votre dossier.
            </p>

            <form onSubmit={handleVerifyCode} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                  placeholder="Ex: GPS2027-FR48 ou GPS2027-IT92"
                  className="w-full bg-[#040812] border border-[#1a2d4c] rounded-2xl pl-10 pr-4 py-3 text-sm font-mono uppercase tracking-widest text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-center sm:text-left font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Vérifier mon Code
              </button>
            </form>

            {/* Quick Test Codes */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>Codes rapides de démonstration :</span>
              <button
                type="button"
                onClick={() => { setBookingCode('GPS2027-FR48'); const r = getReservation('GPS2027-FR48'); if (r) setVerifiedReservation(r); setHasSearched(true); }}
                className="px-2 py-0.5 rounded bg-[#0a1529] hover:bg-[#0e1d38] text-cyan-300 font-mono border border-sky-900"
              >
                🇫🇷 GPS2027-FR48
              </button>
              <button
                type="button"
                onClick={() => { setBookingCode('GPS2027-IT92'); const r = getReservation('GPS2027-IT92'); if (r) setVerifiedReservation(r); setHasSearched(true); }}
                className="px-2 py-0.5 rounded bg-[#0a1529] hover:bg-[#0e1d38] text-cyan-300 font-mono border border-sky-900"
              >
                🇮🇹 GPS2027-IT92
              </button>
              <button
                type="button"
                onClick={() => { setBookingCode('GPS2027-TN01'); const r = getReservation('GPS2027-TN01'); if (r) setVerifiedReservation(r); setHasSearched(true); }}
                className="px-2 py-0.5 rounded bg-[#0a1529] hover:bg-[#0e1d38] text-cyan-300 font-mono border border-sky-900"
              >
                🇹🇳 GPS2027-TN01
              </button>
            </div>

            {/* Success Banner */}
            {hasSearched && verifiedReservation && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-left flex items-start gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-black text-emerald-200 uppercase tracking-wide">
                    Dossier Hôtelier Validé : {verifiedReservation.id}
                  </div>
                  <div className="text-slate-300 mt-1">
                    <strong>Hôtel Associé :</strong> {verifiedReservation.hotelId === 'el-mouradi-gammarth' ? 'Hôtel El Mouradi Gammarth (5★)' : 'Hôtel Golden Carthage (5★)'}
                    {' '}&bull;{' '}
                    <strong>Délégation :</strong> {verifiedReservation.type === 'group' ? verifiedReservation.federationGroup?.federationName : `${verifiedReservation.individualLead?.firstName} ${verifiedReservation.individualLead?.lastName}`}
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {hasSearched && !verifiedReservation && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-left flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-200">
                  Code de réservation introuvable. Veuillez vérifier votre référence (format: GPS2027-XXXX).
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shuttle Form (Visible only when code verified) */}
        {verifiedReservation && (
          <form onSubmit={handleSubmitShuttle} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Left Inputs (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="tournament-card rounded-3xl p-6 sm:p-8 space-y-6">
                
                {/* Trip Type */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Type de Trajet Navette
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTripType('arrival')}
                      className={`p-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        tripType === 'arrival'
                          ? 'border-cyan-400 bg-[#0d213d] text-white shadow-lg'
                          : 'border-[#16253f] bg-[#070f1e] text-slate-400 hover:text-white'
                      }`}
                    >
                      Arrivée (Aéroport → Hôtel)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('departure')}
                      className={`p-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        tripType === 'departure'
                          ? 'border-cyan-400 bg-[#0d213d] text-white shadow-lg'
                          : 'border-[#16253f] bg-[#070f1e] text-slate-400 hover:text-white'
                      }`}
                    >
                      Départ (Hôtel → Aéroport)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('roundtrip')}
                      className={`p-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        tripType === 'roundtrip'
                          ? 'border-cyan-400 bg-[#0d213d] text-white shadow-lg'
                          : 'border-[#16253f] bg-[#070f1e] text-slate-400 hover:text-white'
                      }`}
                    >
                      Aller-Retour (Aéroport ⇄ Hôtel)
                    </button>
                  </div>
                </div>

                {/* Official Airport Card : Tunis-Carthage (TUN) */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Aéroport International Officiel du Tournoi
                  </label>
                  <div className="p-4 rounded-2xl bg-[#081224] border-2 border-emerald-500/50 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shrink-0">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-white text-sm">
                          Aéroport International de Tunis-Carthage (TUN)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Terminal 1 • Accueil officiel délégations & navettes directes FIE (~18 km • ~20 min de Gammarth)
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-700 shrink-0">
                      HUB OFFICIEL UNIQUE
                    </span>
                  </div>
                </div>

                {/* Arrival Flight */}
                {(tripType === 'arrival' || tripType === 'roundtrip') && (
                  <div className="p-4 rounded-2xl bg-[#081224] border border-[#162640] space-y-3">
                    <div className="text-[11px] font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                      <Plane className="w-4 h-4 text-cyan-400" />
                      <span>Vol d'Arrivée & Horaires d'Atterrissage</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Compagnie Aérienne *</label>
                        <input
                          type="text"
                          value={arrivalAirline}
                          onChange={(e) => setArrivalAirline(e.target.value)}
                          placeholder="Ex: Tunisair, Air France..."
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3 py-2 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Numéro de Vol *</label>
                        <input
                          type="text"
                          value={arrivalFlightNumber}
                          onChange={(e) => setArrivalFlightNumber(e.target.value)}
                          placeholder="Ex: AF1184, TU721"
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3 py-2 text-xs text-white font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Date & Heure Atterrissage *</label>
                        <input
                          type="datetime-local"
                          value={arrivalDateTime}
                          onChange={(e) => setArrivalDateTime(e.target.value)}
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3 py-2 text-xs text-white font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Departure Flight */}
                {(tripType === 'departure' || tripType === 'roundtrip') && (
                  <div className="p-4 rounded-2xl bg-[#081224] border border-[#162640] space-y-3">
                    <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <Plane className="w-4 h-4 text-amber-400 rotate-45" />
                      <span>Vol de Retour / Départ</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Compagnie Décollage</label>
                        <input
                          type="text"
                          value={departureAirline}
                          onChange={(e) => setDepartureAirline(e.target.value)}
                          placeholder="Ex: Air France"
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Numéro de Vol Retour</label>
                        <input
                          type="text"
                          value={departureFlightNumber}
                          onChange={(e) => setDepartureFlightNumber(e.target.value)}
                          placeholder="Ex: AF1185"
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Date & Heure Décollage</label>
                        <input
                          type="datetime-local"
                          value={departureDateTime}
                          onChange={(e) => setDepartureDateTime(e.target.value)}
                          className="w-full bg-[#0b172a] border border-[#1a2d4c] rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Passengers, Luggage & Weapon Bags */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Nombre de Passagers *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3 py-2 text-sm text-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Valises Standards
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={luggageCount}
                      onChange={(e) => setLuggageCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3 py-2 text-sm text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Sacs d'Escrime / Housses de Sabre
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={weaponBagsCount}
                      onChange={(e) => setWeaponBagsCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3 py-2 text-sm text-white font-bold text-cyan-300"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-1">
                    Numéro de Téléphone WhatsApp pour le Chauffeur *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={driverWhatsApp}
                      onChange={(e) => setDriverWhatsApp(e.target.value)}
                      placeholder="+216 98 123 456 ou +33 6 12 34 56 78"
                      className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl pl-10 pr-3 py-2.5 text-sm text-white"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Le coordinateur de quai et le chauffeur de navette vous contacteront via ce numéro dès votre atterrissage.
                  </p>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Consignes Particulières (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Ex: Sacs volumineux nécessitant un utilitaire dédié, assistance PMR..."
                    className="w-full bg-[#081224] border border-[#162640] rounded-xl px-3 py-2 text-xs text-white"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl text-slate-950 font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Enregistrer & Optimiser ma Navette</span>
                </button>

              </div>

            </div>

            {/* Right Grouping Manifest (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="tournament-card rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Regroupement Intelligent Actif</span>
                </div>

                <h4 className="font-black text-white text-base uppercase tracking-tight">
                  Optimisation des Convois FIE
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Le système analyse les vols des délégations arrivant dans la même tranche horaire de 45 minutes pour mutualiser les navettes et vous garantir un départ immédiat avec un véhicule adapté au matériel d'escrime.
                </p>

                <div className="p-3.5 rounded-2xl bg-[#050b18] border border-emerald-900/40 text-xs space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Point de Rendez-Vous Officiel</span>
                  </div>
                  <div>
                    Aéroport Tunis-Carthage (TUN) &bull; Terminal 1, Sortie Arrivées, <strong>Desk d'Accueil Officiel Fédération Tunisienne d'Escrime (FTE)</strong>.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#050b18] border border-sky-900/40 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-[11px]">
                    <Bus className="w-4 h-4" />
                    <span>Flotte Officielle Autocars & Minibus</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Autocars Mercedes Tourismo (30 places), Minibus Sprinter (18 places) et Vans VIP climatisés adaptés au transport des sacs d'escrime.
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

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReservation } from '../contexts/ReservationContext';
import { Reservation, Hotel, ShuttleDetails } from '../types/gp';
import {
  Search,
  Building2,
  Bus,
  Calendar,
  Clock,
  Plane,
  Download,
  Edit,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Shield,
  ExternalLink,
  Save,
  X,
  Swords,
  QrCode,
  Award
} from 'lucide-react';
import { VoucherModal } from './VoucherModal';
import { toast } from 'sonner';

interface ClientPortalProps {
  initialCode?: string;
  onGoToShuttleBooking?: (code: string) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  initialCode = '',
  onGoToShuttleBooking
}) => {
  const { lang, t } = useLanguage();
  const { getReservation, hotels, updateFlightInfo } = useReservation();

  const [searchCode, setSearchCode] = useState(initialCode || 'GPS2027-FR48');
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Flight Edit Modal
  const [isEditingFlight, setIsEditingFlight] = useState(false);
  const [editFlightData, setEditFlightData] = useState<Partial<ShuttleDetails>>({
    arrivalAirline: '',
    arrivalFlightNumber: '',
    arrivalDateTime: '',
    departureAirline: '',
    departureFlightNumber: '',
    departureDateTime: '',
    driverWhatsApp: ''
  });

  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  const handleSearch = (codeToSearch?: string) => {
    const code = (codeToSearch || searchCode).trim().toUpperCase();
    if (!code) {
      toast.warning('Veuillez saisir votre code de réservation.');
      return;
    }
    setHasSearched(true);
    const res = getReservation(code);
    if (res) {
      setActiveReservation(res);
      toast.success(`Dossier ${res.id} chargé avec succès !`);
    } else {
      setActiveReservation(null);
      toast.error('Aucune réservation trouvée pour ce code.');
    }
  };

  useEffect(() => {
    if (initialCode) {
      setSearchCode(initialCode);
      handleSearch(initialCode);
    } else {
      handleSearch('GPS2027-FR48');
    }
  }, [initialCode]);

  const handleOpenEditFlight = () => {
    if (!activeReservation?.shuttle) {
      toast.info('Aucune navette configurée.');
      return;
    }
    setEditFlightData({
      arrivalAirline: activeReservation.shuttle.arrivalAirline || '',
      arrivalFlightNumber: activeReservation.shuttle.arrivalFlightNumber || '',
      arrivalDateTime: activeReservation.shuttle.arrivalDateTime || '',
      departureAirline: activeReservation.shuttle.departureAirline || '',
      departureFlightNumber: activeReservation.shuttle.departureFlightNumber || '',
      departureDateTime: activeReservation.shuttle.departureDateTime || '',
      driverWhatsApp: activeReservation.shuttle.driverWhatsApp || ''
    });
    setIsEditingFlight(true);
  };

  const handleSaveFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReservation) return;

    const success = updateFlightInfo(activeReservation.id, editFlightData);
    if (success) {
      const updated = getReservation(activeReservation.id);
      if (updated) setActiveReservation(updated);
      setIsEditingFlight(false);
    }
  };

  const selectedHotel: Hotel | null = activeReservation ? hotels[activeReservation.hotelId] : null;

  return (
    <section id="client-section" className="py-14 sm:py-20 bg-[#050811] text-white piste-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#D4AF37]/25 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#091222] border border-[#D4AF37]/40 text-[#F5E8C7] text-xs font-bold uppercase tracking-wider mb-2">
              <Swords className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Espace Délégations &amp; Athlètes FIE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase font-heading">
              Mon Dossier &amp; Voucher Tournoi
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Consultez vos réservations hôtelières 5★ à Gammarth, la coordination de vos transferts à l'Aéroport Tunis-Carthage (TUN), téléchargez votre voucher officiel A4 avec QR Code d'accréditation et mettez à jour vos numéros de vol.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#F5E8C7] font-bold bg-[#091222] px-3.5 py-2 rounded-xl border border-[#D4AF37]/30">
              Permanence FIE / FTE : +216 71 840 500
            </span>
          </div>
        </div>

        {/* Search Bar & Quick Picks */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="palace-card rounded-2xl p-5 sm:p-7 border border-[#D4AF37]/35 shadow-2xl">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
              Saisissez votre Référence Officielle (Format GPS2027-XXXX)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  placeholder="Ex: GPS2027-FR48 ou GPS2027-IT92"
                  className="w-full bg-[#060B14] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-sm sm:text-base font-mono uppercase tracking-widest text-[#F5E8C7] font-bold placeholder:text-slate-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                Rechercher Dossier
              </button>
            </div>

            {/* Quick demo pills */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span>Dossiers d'équipes enregistrés :</span>
              <button
                type="button"
                onClick={() => { setSearchCode('GPS2027-FR48'); handleSearch('GPS2027-FR48'); }}
                className="px-2.5 py-1 rounded-lg bg-[#091122] hover:bg-[#101C32] text-[#F5E8C7] font-mono text-[11px] border border-[#D4AF37]/30 cursor-pointer font-bold"
              >
                🇫🇷 FFE France (10 pers)
              </button>
              <button
                type="button"
                onClick={() => { setSearchCode('GPS2027-IT92'); handleSearch('GPS2027-IT92'); }}
                className="px-2.5 py-1 rounded-lg bg-[#091122] hover:bg-[#101C32] text-[#F5E8C7] font-mono text-[11px] border border-[#D4AF37]/30 cursor-pointer font-bold"
              >
                🇮🇹 FIS Italie (8 pers)
              </button>
              <button
                type="button"
                onClick={() => { setSearchCode('GPS2027-TN01'); handleSearch('GPS2027-TN01'); }}
                className="px-2.5 py-1 rounded-lg bg-[#091122] hover:bg-[#101C32] text-[#F5E8C7] font-mono text-[11px] border border-[#D4AF37]/30 cursor-pointer font-bold"
              >
                🇹🇳 Ferjani (Tunisie)
              </button>
              <button
                type="button"
                onClick={() => { setSearchCode('GPS2027-US15'); handleSearch('GPS2027-US15'); }}
                className="px-2.5 py-1 rounded-lg bg-[#091122] hover:bg-[#101C32] text-[#F5E8C7] font-mono text-[11px] border border-[#D4AF37]/30 cursor-pointer font-bold"
              >
                🇺🇸 US Fencing (7 pers)
              </button>
            </div>
          </div>
        </div>

        {/* Loaded Reservation Display */}
        {activeReservation && selectedHotel && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Pass Card: Olympic / FIE Official Accreditation Pass */}
            <div className="palace-card rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/45 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#F5E8C7] tracking-wider">
                    {activeReservation.id}
                  </span>
                  <span className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {activeReservation.status === 'confirmed' ? '✓ RÉSERVATION CONFIRMÉE' : activeReservation.status}
                  </span>
                  <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[#0C1527] text-[#D4AF37] border border-[#D4AF37]/40">
                    Règlement : 100% Cash sur Place (€ / TND)
                  </span>
                </div>

                <div className="text-sm font-bold text-white">
                  Délégation / Titulaire : <span className="text-[#F5E8C7] text-base">{activeReservation.type === 'group' ? activeReservation.federationGroup?.federationName : `${activeReservation.individualLead?.firstName} ${activeReservation.individualLead?.lastName}`}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Enregistré pour le <strong>Grand Prix Sabre Tunis 2027</strong> &bull; Salle Omnisports de Radès &bull; Hôtels 5★ Gammarth
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVoucherOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Imprimer Voucher A4 Officiel</span>
                </button>

                {activeReservation.hasShuttle ? (
                  <button
                    type="button"
                    onClick={handleOpenEditFlight}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0F1A2E] hover:bg-[#14233C] text-white font-bold text-xs uppercase tracking-wider transition-colors border border-[#D4AF37]/30 cursor-pointer"
                  >
                    <Edit className="w-4 h-4 text-[#D4AF37]" />
                    <span>Modifier Coordonnées Vol</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onGoToShuttleBooking?.(activeReservation.id)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#121F38] hover:bg-[#1A2C4C] text-[#F5E8C7] border border-[#D4AF37]/40 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    <Bus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Réserver la Navette Aéroport TUN</span>
                  </button>
                )}
              </div>

            </div>

            {/* Split Cards: Hotel & Shuttle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Hotel Summary */}
              <div className="palace-card rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white font-heading">
                    <Building2 className="w-5 h-5 text-[#D4AF37]" />
                    <span>Hébergement Officiel Attribué</span>
                  </div>
                  <span className="text-xs text-[#D4AF37] font-bold">5 ★★★★★</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xl font-black text-white uppercase font-heading">{selectedHotel.name}</div>
                  <div className="text-xs text-slate-400">{selectedHotel.location}</div>
                  <div className="p-2.5 rounded-lg bg-[#060B14] border border-[#D4AF37]/20 text-xs text-slate-300 mt-2">
                    Trajet vers la Salle de Radès : <strong>{selectedHotel.competitionDistance.distanceKm} km</strong> (~{selectedHotel.competitionDistance.travelTimeMin} min via navettes FIE directes)
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#D4AF37]/20 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Arrivée</span>
                    <strong className="text-white">{activeReservation.checkInDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Départ</span>
                    <strong className="text-white">{activeReservation.checkOutDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Durée</span>
                    <strong className="text-[#F5E8C7]">{activeReservation.nightsCount} nuits</strong>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-slate-400">Chambres attribuées :</div>
                  <div className="font-bold text-white text-sm">
                    {activeReservation.singleRoomCount > 0 && `${activeReservation.singleRoomCount} Chambre(s) Single`}
                    {activeReservation.singleRoomCount > 0 && activeReservation.doubleRoomCount > 0 && ' • '}
                    {activeReservation.doubleRoomCount > 0 && `${activeReservation.doubleRoomCount} Chambre(s) Double / Twin`}
                  </div>
                  <div className="text-slate-300 pt-1">
                    Montant à Régler : <strong className="text-[#F5E8C7] font-mono text-base">{activeReservation.totalAmount} € (~{Math.round(activeReservation.totalAmount * 3.35)} TND)</strong> &bull; <span className="text-emerald-400 font-semibold">En Espèces (Cash) au Check-in</span>
                  </div>
                </div>
              </div>

              {/* Shuttle Summary */}
              <div className="palace-card rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white font-heading">
                    <Bus className="w-5 h-5 text-[#D4AF37]" />
                    <span>Navette &amp; Transfert Aéroport TUN</span>
                  </div>
                  {activeReservation.hasShuttle ? (
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-600/40 px-2.5 py-0.5 rounded font-mono">
                      ✓ CONFIRMÉ (TUN)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#D4AF37] bg-[#0E1728] border border-[#D4AF37]/30 px-2.5 py-0.5 rounded">
                      Non Programmée
                    </span>
                  )}
                </div>

                {activeReservation.hasShuttle && activeReservation.shuttle ? (
                  <div className="space-y-4 text-xs">
                    
                    <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#D4AF37]/25 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Code Convoi FIE :</div>
                        <div className="font-mono text-sm font-bold text-white">{activeReservation.shuttle.assignedGroupCode || 'SHT-TUN-OPT'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Véhicule Assigné :</div>
                        <div className="font-bold text-[#F5E8C7]">{activeReservation.shuttle.assignedVehicle || 'Minibus Mercedes Sprinter'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-slate-300 font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-sans">Aéroport Officiel</span>
                        <strong className="text-white font-sans">Tunis-Carthage (TUN)</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-sans">Passagers / Sacs armes</span>
                        <strong className="text-white font-sans">{activeReservation.shuttle.passengerCount} pers. &bull; {activeReservation.shuttle.weaponBagsCount} housses 1m40</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-sans">Vol Arrivée</span>
                        <strong className="text-white font-sans">{activeReservation.shuttle.arrivalAirline} {activeReservation.shuttle.arrivalFlightNumber}</strong>
                        <div className="text-[10px] text-slate-400">{activeReservation.shuttle.arrivalDateTime?.replace('T', ' à ')}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-sans">Vol Départ</span>
                        <strong className="text-white font-sans">{activeReservation.shuttle.departureAirline || 'N/A'} {activeReservation.shuttle.departureFlightNumber || ''}</strong>
                        <div className="text-[10px] text-slate-400">{activeReservation.shuttle.departureDateTime?.replace('T', ' à ') || 'Non renseigné'}</div>
                      </div>
                    </div>

                    {/* Driver Direct Contact */}
                    <div className="p-3.5 rounded-xl bg-[#081224] border border-[#D4AF37]/25 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#D4AF37]" />
                        <div>
                          <div className="font-bold text-white text-xs">Chauffeur / Desk Accueil FTE (TUN)</div>
                          <div className="text-slate-300 font-mono text-[11px]">{activeReservation.shuttle.driverWhatsApp}</div>
                        </div>
                      </div>
                      <a
                        href={`tel:${activeReservation.shuttle.driverWhatsApp.replace(/[^0-9+]/g, '')}`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-bold text-xs transition-colors shadow-sm"
                      >
                        Appeler
                      </a>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400 space-y-3">
                    <p>Aucune navette configurée pour ce séjour.</p>
                    <button
                      type="button"
                      onClick={() => onGoToShuttleBooking?.(activeReservation.id)}
                      className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-bold text-xs cursor-pointer"
                    >
                      Programmer ma Navette Aéroport TUN
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Delegation Member Roster (If Group) */}
            {activeReservation.type === 'group' && activeReservation.federationGroup?.members && (
              <div className="palace-card rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white font-heading">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    <span>Feuille d'Engagement Délégation ({activeReservation.federationGroup.members.length} participants)</span>
                  </div>
                  <span className="text-xs text-slate-400">Chef de Délégation : {activeReservation.federationGroup.contactPersonName}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeReservation.federationGroup.members.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#060B14] border border-white/[0.08] text-xs">
                      <div className="font-bold text-white text-sm">{m.firstName} {m.lastName}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Rôle : <span className="text-[#F5E8C7] font-bold uppercase">{m.role}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Hébergement : <strong>{m.roomPreference === 'single' ? 'Chambre Single' : `Double (Colocataire : ${m.roommateName || 'À attribuer'})`}</strong>
                      </div>
                      {m.passportNumber && (
                        <div className="text-[10px] text-slate-500 font-mono mt-1">Passeport : {m.passportNumber}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Flight Modification Modal */}
      {isEditingFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg palace-card rounded-2xl border border-[#D4AF37]/50 shadow-2xl p-6 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-4">
              <h3 className="font-heading font-black text-white text-base uppercase tracking-tight flex items-center gap-2">
                <Plane className="w-5 h-5 text-[#D4AF37]" />
                <span>Modifier mes coordonnées de vol (Aéroport TUN)</span>
              </h3>
              <button
                onClick={() => setIsEditingFlight(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlight} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Compagnie Aérienne Arrivée</label>
                <input
                  type="text"
                  value={editFlightData.arrivalAirline}
                  onChange={(e) => setEditFlightData({ ...editFlightData, arrivalAirline: e.target.value })}
                  className="w-full bg-[#060B14] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Numéro de Vol Arrivée (TUN)</label>
                <input
                  type="text"
                  value={editFlightData.arrivalFlightNumber}
                  onChange={(e) => setEditFlightData({ ...editFlightData, arrivalFlightNumber: e.target.value })}
                  className="w-full bg-[#060B14] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Date et Heure d'Atterrissage</label>
                <input
                  type="datetime-local"
                  value={editFlightData.arrivalDateTime}
                  onChange={(e) => setEditFlightData({ ...editFlightData, arrivalDateTime: e.target.value })}
                  className="w-full bg-[#060B14] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Numéro Téléphone Mobile de Contact</label>
                <input
                  type="tel"
                  value={editFlightData.driverWhatsApp}
                  onChange={(e) => setEditFlightData({ ...editFlightData, driverWhatsApp: e.target.value })}
                  className="w-full bg-[#060B14] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingFlight(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Voucher Printable Modal */}
      {isVoucherOpen && activeReservation && selectedHotel && (
        <VoucherModal
          reservation={activeReservation}
          hotel={selectedHotel}
          onClose={() => setIsVoucherOpen(false)}
        />
      )}

    </section>
  );
};

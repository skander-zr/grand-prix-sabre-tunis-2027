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
  QrCode
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
    <section id="client-section" className="py-14 sm:py-20 bg-[#040812] text-white piste-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#14233c] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b172a] border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Espace Délégations & Athlètes FIE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Mon Dossier & Voucher Tournoi
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Consultez vos réservations hôtelières et transferts aéroports, téléchargez votre voucher officiel avec QR Code d'accréditation et modifiez vos horaires de vol en direct.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold bg-[#081324] px-3 py-1.5 rounded-xl border border-sky-900">
              Assistance 24/7 : +216 71 889 000
            </span>
          </div>
        </div>

        {/* Search Bar & Quick Picks */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="tournament-card rounded-3xl p-5 sm:p-7 border border-[#1a2d4c] shadow-2xl">
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
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
                  className="w-full bg-[#050b17] border border-[#1a2d4c] rounded-2xl pl-10 pr-4 py-3 text-sm sm:text-base font-mono uppercase tracking-widest text-amber-300 font-bold placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Rechercher Dossier
              </button>
            </div>

            {/* Quick demo pills */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span>Dossiers d'équipes enregistrés :</span>
              <button
                type="button"
                onClick={() => { setSearchCode('GPS2027-FR48'); handleSearch('GPS2027-FR48'); }}
                className="px-2.5 py-1 rounded-lg bg-[#081224] hover:bg-[#0c1a33] text-cyan-300 font-mono text-[11px] border border-sky-900 cursor-pointer font-bold"
              >
                🇫🇷 FFE France (10 pers)
              </button>
              <button
                type="button"
                onClick={() => { setSearchCode('GPS2027-IT92'); handleSearch('GPS2027-IT92'); }}
                className="px-2.5 py-1 rounded-lg bg-[#081224] hover:bg-[#0c1a33] text-cyan-300 font-mono text-[11px] border border-sky-900 cursor-pointer font-bold"
              >
                🇮🇹 FIS Italie (8 pers)
              </button>
              <button
                type="button"
                onClick={() => { setSearchCode('GPS2027-TN01'); handleSearch('GPS2027-TN01'); }}
                className="px-2.5 py-1 rounded-lg bg-[#081224] hover:bg-[#0c1a33] text-cyan-300 font-mono text-[11px] border border-sky-900 cursor-pointer font-bold"
              >
                🇹🇳 Ferjani (Tunisie)
              </button>
              <button
                type="button"
                onClick={() => { setSearchCode('GPS2027-US15'); handleSearch('GPS2027-US15'); }}
                className="px-2.5 py-1 rounded-lg bg-[#081224] hover:bg-[#0c1a33] text-cyan-300 font-mono text-[11px] border border-sky-900 cursor-pointer font-bold"
              >
                🇺🇸 US Fencing (7 pers)
              </button>
            </div>
          </div>
        </div>

        {/* Loaded Reservation Display */}
        {activeReservation && selectedHotel && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Pass Card (Like an Olympic / FIE Accreditation Pass) */}
            <div className="tournament-card-gold rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-wider">
                    {activeReservation.id}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
                    {activeReservation.status === 'confirmed' ? '✓ RÉSERVATION CONFIRMÉE' : activeReservation.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Règlement : Cash sur Place (€ / TND)
                  </span>
                </div>

                <div className="text-sm font-bold text-white">
                  Délégation / Titulaire : <span className="text-cyan-300 text-base">{activeReservation.type === 'group' ? activeReservation.federationGroup?.federationName : `${activeReservation.individualLead?.firstName} ${activeReservation.individualLead?.lastName}`}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Enregistré pour le <strong>Grand Prix Sabre Tunis 2027</strong> &bull; Salle Omnisports de Radès
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVoucherOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Télécharger Voucher PDF / Facture</span>
                </button>

                {activeReservation.hasShuttle ? (
                  <button
                    type="button"
                    onClick={handleOpenEditFlight}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#09152b] hover:bg-[#0d1e3a] text-white font-bold text-xs uppercase tracking-wider transition-colors border border-sky-900 cursor-pointer"
                  >
                    <Edit className="w-4 h-4 text-cyan-400" />
                    <span>Modifier Coordonnées Vol</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onGoToShuttleBooking?.(activeReservation.id)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    <Bus className="w-4 h-4" />
                    <span>Réserver la Navette Aéroport</span>
                  </button>
                )}
              </div>

            </div>

            {/* Split Cards: Hotel & Shuttle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Hotel Summary */}
              <div className="tournament-card rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#14233c]">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
                    <Building2 className="w-5 h-5 text-sky-400" />
                    <span>Hébergement Officiel Attribué</span>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">5 ★★★★★</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xl font-black text-white uppercase">{selectedHotel.name}</div>
                  <div className="text-xs text-slate-400">{selectedHotel.location}</div>
                  <div className="p-2.5 rounded-xl bg-[#050b17] border border-sky-950 text-xs text-slate-300 mt-2">
                    Trajet vers la piste d'armes : <strong>{selectedHotel.competitionDistance.distanceKm} km</strong> (~{selectedHotel.competitionDistance.travelTimeMin} min via navettes FIE)
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#14233c] text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Arrivée</span>
                    <strong className="text-white">{activeReservation.checkInDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Départ</span>
                    <strong className="text-white">{activeReservation.checkOutDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Durée</span>
                    <strong className="text-cyan-300">{activeReservation.nightsCount} nuits</strong>
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
                    Montant à Régler : <strong className="text-amber-400 font-mono text-base">{activeReservation.totalAmount} € (~{Math.round(activeReservation.totalAmount * 3.35)} TND)</strong> &bull; <span className="text-emerald-400 font-semibold">En Espèces (Cash) sur Place</span>
                  </div>
                </div>
              </div>

              {/* Shuttle Summary */}
              <div className="tournament-card rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#14233c]">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
                    <Bus className="w-5 h-5 text-emerald-400" />
                    <span>Navette & Transfert Aéroport</span>
                  </div>
                  {activeReservation.hasShuttle ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-600/40 px-2.5 py-0.5 rounded-full font-mono">
                      ✓ REGROUPÉ & CONFIRMÉ
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-600/40 px-2.5 py-0.5 rounded-full">
                      Non Réservée
                    </span>
                  )}
                </div>

                {activeReservation.hasShuttle && activeReservation.shuttle ? (
                  <div className="space-y-4 text-xs">
                    
                    <div className="p-3.5 rounded-2xl bg-[#050b18] border border-emerald-900/40 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Code Convoi FIE :</div>
                        <div className="font-mono text-sm font-bold text-white">{activeReservation.shuttle.assignedGroupCode || 'SHT-TUN-OPT'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Véhicule Assigné :</div>
                        <div className="font-bold text-cyan-300">{activeReservation.shuttle.assignedVehicle || 'Minibus Mercedes Sprinter'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-slate-300 font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-sans">Aéroport</span>
                        <strong className="text-white font-sans">{activeReservation.shuttle.airport}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-sans">Passagers / Sacs armes</span>
                        <strong className="text-white font-sans">{activeReservation.shuttle.passengerCount} pers. &bull; {activeReservation.shuttle.weaponBagsCount} housses</strong>
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

                    {/* WhatsApp driver direct button */}
                    <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-bold text-white text-xs">Chauffeur / Coordinateur FTE</div>
                          <div className="text-slate-300 font-mono text-[11px]">{activeReservation.shuttle.driverWhatsApp}</div>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${activeReservation.shuttle.driverWhatsApp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        WhatsApp Direct
                      </a>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400 space-y-3">
                    <p>Aucune navette configurée pour ce séjour.</p>
                    <button
                      type="button"
                      onClick={() => onGoToShuttleBooking?.(activeReservation.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Programmer ma Navette Aéroport
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Delegation Member Roster (If Group) */}
            {activeReservation.type === 'group' && activeReservation.federationGroup?.members && (
              <div className="tournament-card rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#14233c]">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span>Feuille d'Engagement Délégation ({activeReservation.federationGroup.members.length} participants)</span>
                  </div>
                  <span className="text-xs text-slate-400">Chef de Délégation : {activeReservation.federationGroup.contactPersonName}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeReservation.federationGroup.members.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#050b18] border border-[#14233c] text-xs">
                      <div className="font-black text-white text-sm">{m.firstName} {m.lastName}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Rôle : <span className="text-cyan-300 font-bold uppercase">{m.role}</span>
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
          <div className="relative w-full max-w-lg tournament-card rounded-3xl border-2 border-cyan-400 shadow-2xl p-6 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#14233c] mb-4">
              <h3 className="font-black text-white text-base uppercase tracking-tight flex items-center gap-2">
                <Plane className="w-5 h-5 text-cyan-400" />
                <span>Modifier mes coordonnées de vol</span>
              </h3>
              <button
                onClick={() => setIsEditingFlight(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
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
                  className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Numéro de Vol Arrivée</label>
                <input
                  type="text"
                  value={editFlightData.arrivalFlightNumber}
                  onChange={(e) => setEditFlightData({ ...editFlightData, arrivalFlightNumber: e.target.value })}
                  className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Date et Heure d'Atterrissage</label>
                <input
                  type="datetime-local"
                  value={editFlightData.arrivalDateTime}
                  onChange={(e) => setEditFlightData({ ...editFlightData, arrivalDateTime: e.target.value })}
                  className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Numéro WhatsApp pour le Chauffeur</label>
                <input
                  type="tel"
                  value={editFlightData.driverWhatsApp}
                  onChange={(e) => setEditFlightData({ ...editFlightData, driverWhatsApp: e.target.value })}
                  className="w-full bg-[#081224] border border-[#1a2d4c] rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="pt-3 border-t border-[#14233c] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingFlight(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
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

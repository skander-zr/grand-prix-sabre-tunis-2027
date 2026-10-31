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
  ShieldCheck,
  Save,
  X,
  Printer,
  CreditCard
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
  const { getReservation, findReservationByEmailAndPassport, hotels, updateFlightInfo } = useReservation();

  const [searchMode, setSearchMode] = useState<'code' | 'credentials'>('code');
  const [searchCode, setSearchCode] = useState(initialCode);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPassport, setSearchPassport] = useState('');
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Flight Edit Modal
  const [isEditingFlight, setIsEditingFlight] = useState(false);
  const [editFlightData, setEditFlightData] = useState<Partial<ShuttleDetails>>({
    airport: 'TUN',
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
    setHasSearched(true);
    if (searchMode === 'code') {
      const code = (codeToSearch || searchCode).trim().toUpperCase();
      if (!code) {
        toast.warning(lang === 'fr' ? 'Veuillez saisir votre code de réservation.' : 'Please enter your booking reference code.');
        return;
      }
      const res = getReservation(code);
      if (res) {
        setActiveReservation(res);
        toast.success(lang === 'fr' ? `Dossier ${res.id} chargé avec succès.` : `Booking file ${res.id} successfully retrieved.`);
      } else {
        setActiveReservation(null);
        toast.error(lang === 'fr' ? 'Aucune réservation trouvée pour ce code.' : 'No reservation found for this reference code.');
      }
    } else {
      if (!searchEmail && !searchPassport) {
        toast.warning(lang === 'fr' ? 'Veuillez renseigner votre Email et votre Numéro de Passeport.' : 'Please enter your official Email and Passport Number.');
        return;
      }
      const res = findReservationByEmailAndPassport(searchEmail, searchPassport);
      if (res) {
        setActiveReservation(res);
        setSearchCode(res.id);
        toast.success(lang === 'fr' ? `Dossier ${res.id} retrouvé via votre passeport !` : `Booking ${res.id} retrieved via your passport!`);
      } else {
        setActiveReservation(null);
        toast.error(lang === 'fr' ? 'Aucun dossier ne correspond à cet email et ce numéro de passeport.' : 'No record matching this email and passport.');
      }
    }
  };

  useEffect(() => {
    if (initialCode) {
      setSearchCode(initialCode);
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleOpenEditFlight = () => {
    if (!activeReservation?.shuttle) {
      toast.info(lang === 'fr' ? 'Aucune navette configurée pour ce dossier.' : 'No shuttle scheduled for this file.');
      return;
    }
    setEditFlightData({
      airport: activeReservation.shuttle.airport || 'TUN',
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
      setActiveReservation({
        ...activeReservation,
        shuttle: {
          ...activeReservation.shuttle!,
          ...editFlightData
        }
      });
      setIsEditingFlight(false);
      toast.success(lang === 'fr' ? 'Coordonnées de vol mises à jour avec succès.' : 'Flight information updated successfully.');
    }
  };

  const hotel = activeReservation ? hotels[activeReservation.hotelId] : null;

  return (
    <section id="client-portal-section" className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#03396C] text-xs font-semibold mb-2.5">
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Espace Délégations • Suivi de Dossier Officiel' : 'Delegations Portal • Official File Tracking'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {lang === 'fr' ? 'Mes Réservations & Documents Officiels' : 'My Bookings & Official Documents'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
              {lang === 'fr'
                ? 'Consultez les détails de votre hébergement 5★, téléchargez vos vouchers et factures officiels avec QR Code, et ajustez vos coordonnées de vol à tout moment.'
                : 'Review your 5★ hotel details, download official vouchers & invoices with QR Code, and adjust your flight details anytime.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>{lang === 'fr' ? 'Portail Accréditation Sécurisé' : 'Secure Accreditation Portal'}</span>
          </div>
        </div>

        {/* Dual Search Card */}
        <div className="max-w-2xl mx-auto inst-card p-6 sm:p-8 mb-10 shadow-xs">
          
          {/* Search Mode Tabs */}
          <div className="flex border-b border-slate-200 mb-5">
            <button
              type="button"
              onClick={() => setSearchMode('code')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                searchMode === 'code'
                  ? 'border-[#03396C] text-[#03396C]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'fr' ? 'Recherche par Code Dossier (GPS2027)' : 'Search by Booking Code (GPS2027)'}
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('credentials')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                searchMode === 'credentials'
                  ? 'border-[#03396C] text-[#03396C]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'fr' ? 'Code oublié ? Recherche par Email + Passeport' : 'Forgot code? Search by Email + Passport'}
            </button>
          </div>

          {searchMode === 'code' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {lang === 'fr' ? 'Saisissez votre code de réservation' : 'Enter your booking code'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="ex: GPS2027-FR48"
                  className="flex-1 px-4 py-3 font-mono font-bold uppercase tracking-wider text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="btn-primary cursor-pointer text-sm font-semibold px-6"
                >
                  <Search className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Consulter' : 'View Booking'}</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">
                {lang === 'fr'
                  ? 'Saisissez le code de réservation à 11 caractères délivré lors de votre confirmation.'
                  : 'Enter the 11-character booking reference provided upon confirmation.'}
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'fr' ? 'Retrouvez votre réservation sans votre code' : 'Find your booking without your code'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">{lang === 'fr' ? 'Email Officiel' : 'Official Email'}</label>
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="ex: contact.france@escrime-ffe.fr"
                    className="w-full px-3.5 py-2.5 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">{lang === 'fr' ? 'Numéro de Passeport' : 'Passport Number'}</label>
                  <input
                    type="text"
                    value={searchPassport}
                    onChange={(e) => setSearchPassport(e.target.value)}
                    placeholder="ex: 24FA19283"
                    className="w-full px-3.5 py-2.5 text-xs font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                className="w-full btn-primary cursor-pointer text-sm font-semibold py-2.5 mt-2"
              >
                <Search className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Rechercher mon dossier' : 'Find my booking'}</span>
              </button>
            </div>
          )}

        </div>

        {/* Display Verified Reservation File */}
        {activeReservation && hotel && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            
            {/* Top Pass / File Summary Card */}
            <div className="inst-card p-6 sm:p-8 border-t-4 border-t-[#03396C]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#03396C] text-white flex flex-col items-center justify-center font-bold">
                    <span className="text-sm font-black">FIE</span>
                    <span className="text-[9px] text-blue-200 uppercase font-mono">2027</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] font-mono tracking-wider">
                        {activeReservation.id}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirmé</span>
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700 mt-0.5">
                      {activeReservation.type === 'group'
                        ? activeReservation.federationGroup?.federationName
                        : `${activeReservation.individualLead?.firstName} ${activeReservation.individualLead?.lastName}`}
                      {' '}&bull; {activeReservation.federationGroup?.country || activeReservation.individualLead?.nationality}
                    </div>
                  </div>
                </div>

                {/* PDF Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsVoucherOpen(true)}
                    className="btn-primary cursor-pointer text-xs font-semibold px-4 py-2.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Imprimer Voucher & Facture A4' : 'Print A4 Voucher & Invoice'}</span>
                  </button>
                </div>
              </div>

              {/* Grid 3 Columns: Hotel, Pricing, Shuttle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                
                {/* 1. Hotel & Stay */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-[#03396C]" />
                    <span>{lang === 'fr' ? 'Hébergement 5★ Retenu' : 'Confirmed 5★ Hotel'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <strong className="text-sm text-[#0F172A] block">{hotel.name}</strong>
                    <div className="text-slate-600">{hotel.location}</div>
                    <div className="text-slate-700 font-mono pt-1">
                      {lang === 'fr' ? 'Du' : 'From'} <strong>{activeReservation.checkInDate}</strong> {lang === 'fr' ? 'au' : 'to'} <strong>{activeReservation.checkOutDate}</strong> ({activeReservation.nightsCount} {lang === 'fr' ? 'nuits' : 'nights'})
                    </div>
                    <div className="text-slate-600 pt-1">
                      {activeReservation.singleRoomCount > 0 && `${activeReservation.singleRoomCount} Single `}
                      {activeReservation.doubleRoomCount > 0 && `• ${activeReservation.doubleRoomCount} Double (Twin)`}
                    </div>
                  </div>
                </div>

                {/* 2. Financial & Payment */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-[#03396C]" />
                    <span>{lang === 'fr' ? 'Règlement & Facturation' : 'Payment & Invoicing'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'fr' ? 'Total Séjour TTC :' : 'Total Stay (VAT incl.):'}</span>
                      <strong className="text-[#0F172A] text-sm">{activeReservation.totalAmount} €</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'fr' ? 'Équivalent local :' : 'Local equivalent:'}</span>
                      <span>~{Math.round(activeReservation.totalAmount * 3.3)} TND</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-slate-600">{lang === 'fr' ? 'Mode :' : 'Method:'}</span>
                      <span className="font-sans font-bold text-xs text-[#03396C]">
                        {activeReservation.paymentMethod === 'stripe_card' && (lang === 'fr' ? 'Carte Bancaire (Stripe)' : 'Credit Card (Stripe)')}
                        {activeReservation.paymentMethod === 'bank_transfer' && (lang === 'fr' ? 'Virement Bancaire FIE' : 'Official Bank Transfer')}
                        {activeReservation.paymentMethod === 'onsite_federation' && (lang === 'fr' ? 'Règlement sur Place' : 'On-site Payment')}
                      </span>
                    </div>
                    <div className="text-emerald-700 font-sans font-semibold text-[11px] flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {activeReservation.paymentStatus === 'paid' 
                          ? (lang === 'fr' ? 'Payé & Encaissé' : 'Paid & Confirmed') 
                          : (lang === 'fr' ? 'Enregistré & Validé' : 'Registered & Validated')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Airport Shuttle Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <Bus className="w-4 h-4 text-[#03396C]" />
                      <span>{lang === 'fr' ? 'Transfert Aéroport' : 'Airport Shuttle'}</span>
                    </div>
                    {activeReservation.hasShuttle && (
                      <button
                        type="button"
                        onClick={handleOpenEditFlight}
                        className="text-xs text-[#03396C] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>{lang === 'fr' ? 'Modifier vol' : 'Edit flight'}</span>
                      </button>
                    )}
                  </div>

                  {activeReservation.hasShuttle && activeReservation.shuttle ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === 'fr' ? 'Aéroport :' : 'Airport:'}</span>
                        <strong className="text-slate-900 font-mono">{activeReservation.shuttle.airport}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === 'fr' ? 'Trajet :' : 'Route:'}</span>
                        <strong className="text-slate-900 capitalize">{activeReservation.shuttle.tripType}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === 'fr' ? 'Vol Arrivée :' : 'Inbound Flight:'}</span>
                        <strong className="text-slate-900 font-mono">
                          {activeReservation.shuttle.arrivalFlightNumber || 'N/A'} ({activeReservation.shuttle.arrivalDateTime ? activeReservation.shuttle.arrivalDateTime.replace('T', ' ') : 'N/A'})
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === 'fr' ? 'Téléphone chauffeur / régie :' : 'Driver / coordinator phone:'}</span>
                        <strong className="text-slate-900 font-mono">{activeReservation.shuttle.driverWhatsApp}</strong>
                      </div>
                      <div className="pt-2 border-t border-slate-200 text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'fr' ? `Véhicule assigné : ${activeReservation.shuttle.assignedVehicle || 'Minibus Officiel FIE'}` : `Assigned vehicle: ${activeReservation.shuttle.assignedVehicle || 'Official FIE Minibus'}`}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
                      <p>{lang === 'fr' ? 'Aucune navette aéroport n\'a encore été programmée pour ce dossier.' : 'No airport shuttle scheduled yet for this booking.'}</p>
                      <button
                        type="button"
                        onClick={() => onGoToShuttleBooking?.(activeReservation.id)}
                        className="w-full btn-primary text-xs py-2"
                      >
                        {lang === 'fr' ? 'Programmer ma Navette Maintenant' : 'Book My Shuttle Now'}
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Delegation Members Roster (if Group) */}
              {activeReservation.type === 'group' && activeReservation.federationGroup?.members && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    {lang === 'fr' 
                      ? `Membres Enregistrés de la Délégation (${activeReservation.federationGroup.members.length} participants)`
                      : `Registered Delegation Members (${activeReservation.federationGroup.members.length} participants)`}
                  </h4>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">{lang === 'fr' ? 'Nom & Prénom' : 'Full Name'}</th>
                          <th className="py-2.5 px-3">{lang === 'fr' ? 'Rôle' : 'Role'}</th>
                          <th className="py-2.5 px-3">{lang === 'fr' ? 'Passeport' : 'Passport'}</th>
                          <th className="py-2.5 px-3">{lang === 'fr' ? 'Chambre' : 'Room'}</th>
                          <th className="py-2.5 px-3">{lang === 'fr' ? 'Binôme de Chambre' : 'Roommate'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {activeReservation.federationGroup.members.map((m, i) => (
                          <tr key={m.id || i} className="hover:bg-slate-50/70">
                            <td className="py-2 px-3 text-slate-400 font-mono">{i + 1}</td>
                            <td className="py-2 px-3 font-semibold text-slate-900">{m.firstName} {m.lastName}</td>
                            <td className="py-2 px-3 capitalize text-slate-600">{m.role}</td>
                            <td className="py-2 px-3 font-mono text-slate-600">{m.passportNumber || '—'}</td>
                            <td className="py-2 px-3 font-semibold text-[#03396C]">
                              {m.roomPreference === 'single' ? (lang === 'fr' ? 'Chambre Single' : 'Single Room') : (lang === 'fr' ? 'Chambre Double' : 'Double Room')}
                            </td>
                            <td className="py-2 px-3 text-slate-600">{m.roommateName || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Not Found Notice */}
        {hasSearched && !activeReservation && (
          <div className="max-w-md mx-auto p-6 bg-white border border-slate-200 rounded-xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">{lang === 'fr' ? 'Aucun Dossier Trouvé' : 'No Reservation Found'}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'fr'
                ? "Vérifiez le code de réservation saisi. Assurez-vous d'avoir finalisé votre réservation d'hôtel pour obtenir une référence GPS2027."
                : "Please check your booking reference code. Ensure you completed your hotel booking to receive a GPS2027 reference."}
            </p>
          </div>
        )}

      </div>

      {/* Edit Flight Information Modal */}
      {isEditingFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg inst-card p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#03396C]" />
                <span>{lang === 'fr' ? 'Modifier les Informations de Vol' : 'Edit Flight Information'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingFlight(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlight} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Aéroport de Prise en Charge *' : 'Pick-up Airport *'}</label>
                <select
                  value={editFlightData.airport}
                  onChange={(e) => setEditFlightData({ ...editFlightData, airport: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-semibold"
                >
                  <option value="TUN">Tunis-Carthage (TUN) - 0 €</option>
                  <option value="NBE">Enfidha-Hammamet (NBE) - 0 €</option>
                  <option value="MIR">Monastir Habib-Bourguiba (MIR) - 0 €</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Compagnie Aérienne' : 'Airline'}</label>
                  <input
                    type="text"
                    value={editFlightData.arrivalAirline}
                    onChange={(e) => setEditFlightData({ ...editFlightData, arrivalAirline: e.target.value })}
                    className="w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Numéro de Vol' : 'Flight Number'}</label>
                  <input
                    type="text"
                    value={editFlightData.arrivalFlightNumber}
                    onChange={(e) => setEditFlightData({ ...editFlightData, arrivalFlightNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? "Date & Heure d'Atterrissage" : 'Arrival Date & Time'}</label>
                <input
                  type="datetime-local"
                  value={editFlightData.arrivalDateTime}
                  onChange={(e) => setEditFlightData({ ...editFlightData, arrivalDateTime: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Numéro de Téléphone Chauffeur / Régie' : 'Driver / Coordinator Phone Number'}</label>
                <input
                  type="tel"
                  value={editFlightData.driverWhatsApp}
                  onChange={(e) => setEditFlightData({ ...editFlightData, driverWhatsApp: e.target.value })}
                  placeholder="+216 20 000 000"
                  className="w-full px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingFlight(false)}
                  className="btn-outline text-xs px-4 py-2"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Enregistrer les modifications' : 'Save changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Voucher & Invoice Modal */}
      {isVoucherOpen && activeReservation && hotel && (
        <VoucherModal
          reservation={activeReservation}
          hotel={hotel}
          onClose={() => setIsVoucherOpen(false)}
        />
      )}

    </section>
  );
};

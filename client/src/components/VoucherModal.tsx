import React from 'react';
import { Reservation, Hotel } from '../types/gp';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Printer, Download, CheckCircle2, QrCode, Shield, MapPin, Calendar, Bus } from 'lucide-react';

interface VoucherModalProps {
  reservation: Reservation | null;
  hotel: Hotel | null;
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ reservation, hotel, onClose }) => {
  const { lang, t } = useLanguage();

  if (!reservation || !hotel) return null;

  const handlePrint = () => {
    window.print();
  };

  const isGroup = reservation.type === 'group';
  const delegationName = isGroup ? reservation.federationGroup?.federationName : `${reservation.individualLead?.firstName} ${reservation.individualLead?.lastName}`;
  const contactEmail = isGroup ? reservation.federationGroup?.contactEmail : reservation.individualLead?.email;
  const contactPhone = isGroup ? reservation.federationGroup?.contactPhone : reservation.individualLead?.phone;
  const country = isGroup ? reservation.federationGroup?.country : reservation.individualLead?.nationality;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#071329] text-white border-b border-sky-950 no-print">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="font-bold text-sky-300">VOUCHER & FACTURE OFFICIELLE FIE / FTE</span>
            <span className="text-slate-400 font-mono">[{reservation.id}]</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('btn.print')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto printable-voucher font-sans text-xs sm:text-sm">
          
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Crests & Federation Titles */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#09152b] text-white p-2 flex flex-col items-center justify-center text-center font-bold border border-slate-700">
                  <span className="text-[12px] text-sky-400 font-black">FIE</span>
                  <span className="text-[9px] text-amber-400">GP 2027</span>
                  <span className="text-[8px] text-rose-400">TUNIS</span>
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                    FÉDÉRATION INTERNATIONALE D'ESCRIME & FÉDÉRATION TUNISIENNE D'ESCRIME
                  </h2>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                    GRAND PRIX SABRE TUNIS 2027
                  </h1>
                  <p className="text-xs font-semibold text-sky-700">
                    Official Accommodation & Airport Transfer Voucher / Facture Officielle
                  </p>
                </div>
              </div>

              {/* Booking Code & QR Code Box */}
              <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-900 bg-slate-50 text-right">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    CODE DE RÉSERVATION
                  </div>
                  <div className="text-lg sm:text-xl font-black font-mono text-slate-900 tracking-wider">
                    {reservation.id}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>CONFIRMÉ & ENREGISTRÉ</span>
                  </div>
                </div>

                {/* SVG Visual QR Code */}
                <div className="w-16 h-16 bg-white p-1 border border-slate-300 rounded flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center rounded text-[8px] font-mono leading-none p-1">
                    <div className="font-bold">FIE-QR</div>
                    <div className="text-[6px] text-sky-400 mt-1">{reservation.id}</div>
                    <div className="text-[5px] text-slate-400">TUNIS 2027</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 1: Reservation & Delegation Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-100 border border-slate-300 mb-6">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Bénéficiaire / Délégation
              </div>
              <div className="text-base font-black text-slate-900">{delegationName}</div>
              <div className="text-xs text-slate-700 mt-0.5">
                <strong>Pays :</strong> {country} &bull; <strong>Type :</strong> {isGroup ? 'Délégation Officielle Groupe' : 'Athlète / Officiel Individuel'}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Email : {contactEmail} &bull; Tél : {contactPhone}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Établissement Hôtelier Officiel
              </div>
              <div className="text-base font-black text-slate-900">{hotel.name} (5 Étoiles)</div>
              <div className="text-xs text-slate-700">{hotel.location}</div>
              <div className="text-xs text-sky-800 font-semibold mt-0.5">
                Distance Salle de Compétition : {hotel.competitionDistance.distanceKm} km (~{hotel.competitionDistance.travelTimeMin} min)
              </div>
            </div>
          </div>

          {/* Section 2: Hotel Stay & Room Details Table */}
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
              Détails de l'Hébergement & Tarification
            </h3>
            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead className="bg-slate-200 font-bold text-slate-800">
                <tr>
                  <th className="p-2.5 border border-slate-300">Prestation</th>
                  <th className="p-2.5 border border-slate-300 text-center">Dates</th>
                  <th className="p-2.5 border border-slate-300 text-center">Quantité</th>
                  <th className="p-2.5 border border-slate-300 text-center">Nuits</th>
                  <th className="p-2.5 border border-slate-300 text-right">Prix / Nuit</th>
                  <th className="p-2.5 border border-slate-300 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reservation.singleRoomCount > 0 && (
                  <tr>
                    <td className="p-2.5 border border-slate-300 font-semibold">
                      Chambre Single ({hotel.name})
                    </td>
                    <td className="p-2.5 border border-slate-300 text-center">
                      {reservation.checkInDate} → {reservation.checkOutDate}
                    </td>
                    <td className="p-2.5 border border-slate-300 text-center font-bold">
                      {reservation.singleRoomCount}
                    </td>
                    <td className="p-2.5 border border-slate-300 text-center">
                      {reservation.nightsCount}
                    </td>
                    <td className="p-2.5 border border-slate-300 text-right">
                      {reservation.singleRoomPricePerNight} €
                    </td>
                    <td className="p-2.5 border border-slate-300 text-right font-bold">
                      {reservation.singleRoomCount * reservation.singleRoomPricePerNight * reservation.nightsCount} €
                    </td>
                  </tr>
                )}
                {reservation.doubleRoomCount > 0 && (
                  <tr>
                    <td className="p-2.5 border border-slate-300 font-semibold">
                      Chambre Double / Twin ({hotel.name})
                    </td>
                    <td className="p-2.5 border border-slate-300 text-center">
                      {reservation.checkInDate} → {reservation.checkOutDate}
                    </td>
                    <td className="p-2.5 border border-slate-300 text-center font-bold">
                      {reservation.doubleRoomCount}
                    </td>
                    <td className="p-2.5 border border-slate-300 text-center">
                      {reservation.nightsCount}
                    </td>
                    <td className="p-2.5 border border-slate-300 text-right">
                      {reservation.doubleRoomPricePerNight} €
                    </td>
                    <td className="p-2.5 border border-slate-300 text-right font-bold">
                      {reservation.doubleRoomCount * reservation.doubleRoomPricePerNight * reservation.nightsCount} €
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50">
                  <td colSpan={4} className="p-2.5 border border-slate-300 font-semibold text-slate-700">
                    Taxe de séjour municipale & Frais logistiques FIE (3 € / nuit / pers.)
                  </td>
                  <td className="p-2.5 border border-slate-300 text-right font-semibold">
                    {reservation.totalGuestsCount} pers.
                  </td>
                  <td className="p-2.5 border border-slate-300 text-right font-bold">
                    {reservation.cityTaxAmount} €
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900">
                <tr>
                  <td colSpan={5} className="p-3 border border-slate-300 text-right uppercase tracking-wider text-sm">
                    Montant Total Réglé / Dû :
                  </td>
                  <td className="p-3 border border-slate-300 text-right text-base text-slate-950">
                    {reservation.totalAmount} € <span className="text-[11px] text-slate-500 font-normal">(~{Math.round(reservation.totalAmount * 3.35)} TND)</span>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Mode de règlement : <strong>Paiement en Espèces (Cash) sur Place au Check-in (€ / TND)</strong> &bull; Statut : <strong className="text-emerald-700 uppercase">Confirmé & Garanti</strong></span>
              <span>TVA 7% & Taxes Hôtelières Incluses</span>
            </div>
          </div>

          {/* Section 3: Airport Shuttle Transfer Details */}
          {reservation.hasShuttle && reservation.shuttle && (
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 mb-6">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-2">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Bus className="w-4 h-4 text-emerald-700" />
                  <span>Voucher Officiel Navette Aéroport - Hôtel</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                  Groupe : {reservation.shuttle.assignedGroupCode || 'OPTIMISÉ'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-800">
                <div>
                  <strong>Trajet :</strong> {reservation.shuttle.tripType === 'roundtrip' ? 'Aller-Retour' : reservation.shuttle.tripType}
                  <div className="text-slate-600">Aéroport : <strong>{reservation.shuttle.airport}</strong></div>
                </div>
                <div>
                  <strong>Vol d'Arrivée :</strong> {reservation.shuttle.arrivalAirline} {reservation.shuttle.arrivalFlightNumber || 'N/A'}
                  <div className="text-slate-600">Date/Heure : {reservation.shuttle.arrivalDateTime ? reservation.shuttle.arrivalDateTime.replace('T', ' à ') : 'N/A'}</div>
                </div>
                <div>
                  <strong>Coordination Chauffeur :</strong>
                  <div className="text-emerald-800 font-semibold">WhatsApp : {reservation.shuttle.driverWhatsApp}</div>
                  <div className="text-[11px] text-slate-600">Point d'accueil : Terminal 1 Sortie Desk FTE</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Delegation Member Roster (If Group) */}
          {isGroup && reservation.federationGroup?.members && reservation.federationGroup.members.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
                Liste des Membres de la Délégation ({reservation.federationGroup.members.length} personnes)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                {reservation.federationGroup.members.map((m, idx) => (
                  <div key={idx} className="p-2 rounded border border-slate-200 bg-slate-50">
                    <div className="font-bold text-slate-900">{m.firstName} {m.lastName}</div>
                    <div className="text-slate-600 text-[10px]">
                      {m.role.toUpperCase()} &bull; Ch. {m.roomPreference} {m.roommateName ? `(avec ${m.roommateName})` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Official Signatures, Seal & Terms */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-slate-600 items-end">
            <div>
              <div className="font-bold text-slate-800 mb-1">CONDITIONS GÉNÉRALES & RÈGLEMENT FIE :</div>
              <p className="leading-relaxed">
                Ce voucher constitue l'attestation officielle d'hébergement requise pour l'accréditation FIE au Grand Prix Sabre Tunis 2027.
                Présenter ce document au desk d'accueil de l'Aéroport Tunis-Carthage et à la réception de l'hôtel.
              </p>
            </div>

            {/* Official Stamp & Signature */}
            <div className="flex flex-col items-sm-end text-center sm:text-right">
              <div className="font-bold text-slate-900 uppercase">Pour le Comité d'Organisation :</div>
              <div className="text-[10px] text-slate-600">Fédération Tunisienne d'Escrime (FTE) & FIE</div>
              <div className="mt-3 inline-block px-4 py-2 border-2 border-sky-900 rounded-lg text-sky-950 font-bold text-center self-end">
                <div className="text-[9px] uppercase tracking-widest text-sky-800">VISA COMITÉ D'ORGANISATION</div>
                <div className="font-mono text-xs font-black">GP-TUNIS-2027-VALIDE</div>
                <div className="text-[8px] text-slate-500">Tunis, le {new Date().toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

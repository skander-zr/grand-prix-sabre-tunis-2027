import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReservation } from '../contexts/ReservationContext';
import { Hotel } from '../types/gp';
import {
  MapPin,
  Clock,
  Wifi,
  Dumbbell,
  Waves,
  Utensils,
  Bus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  BedDouble,
  Bed,
  CreditCard,
  Building2,
  Users,
  Award
} from 'lucide-react';
import { MapModal } from './MapModal';

interface HotelsSectionProps {
  onSelectHotel: (hotelId: 'el-mouradi-gammarth' | 'golden-carthage') => void;
}

export const HotelsSection: React.FC<HotelsSectionProps> = ({ onSelectHotel }) => {
  const { lang, t } = useLanguage();
  const { hotels } = useReservation();

  const [photoIndexes, setPhotoIndexes] = useState<Record<string, number>>({
    'el-mouradi-gammarth': 0,
    'golden-carthage': 0
  });

  const [selectedMapHotel, setSelectedMapHotel] = useState<Hotel | null>(null);

  const getLoc = (val: any, fallback = ''): string => {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    return val[lang] || val['fr'] || val['en'] || fallback;
  };

  const nextPhoto = (hotelId: string, max: number) => {
    setPhotoIndexes(prev => ({
      ...prev,
      [hotelId]: (prev[hotelId] + 1) % max
    }));
  };

  const prevPhoto = (hotelId: string, max: number) => {
    setPhotoIndexes(prev => ({
      ...prev,
      [hotelId]: (prev[hotelId] - 1 + max) % max
    }));
  };

  const hotelList = [hotels['el-mouradi-gammarth'], hotels['golden-carthage']];

  return (
    <section id="hotels-section" className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#03396C] text-xs font-semibold mb-2.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Hébergement Officiel FIE • Gammarth, Tunisie' : 'Official FIE Accommodation • Gammarth, Tunisia'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {lang === 'fr' ? 'Les 2 Hôtels 5★ Officiels de la Compétition' : 'The 2 Official 5★ Tournament Hotels'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
              {lang === 'fr'
                ? 'Deux prestigieux complexes hôteliers 5 étoiles situés sur la côte de Gammarth, réservés exclusivement pour les délégations du Grand Prix Sabre Tunis 2027. Nutrition sportive adaptée, balnéothérapie de récupération et liaisons directes vers la Salle de Radès.'
                : 'Two prestigious 5-star seaside resorts located on the Gammarth coast, exclusively reserved for Sabre Grand Prix Tunis 2027 delegations. Tailored sports nutrition, balneotherapy recovery, and direct shuttles to Radès Venue.'}
            </p>
          </div>

          <div className="shrink-0 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 block font-medium">
              {lang === 'fr' ? 'Distance vers la Salle Omnisports de Radès :' : 'Distance to Radès Sports Venue:'}
            </span>
            <span className="text-base font-bold text-[#03396C] font-mono">13 - 14 KM &bull; ~16 MIN</span>
            <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
              {lang === 'fr' ? 'Navettes FIE directes toutes les 20 min' : 'Direct FIE shuttles every 20 mins'}
            </span>
          </div>
        </div>

        {/* Avantages Exclusifs Pack Officiel FTE Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]"></span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#03396C]">
                {lang === 'fr' ? 'Avantages Exclusifs Inclus dans le Pack Officiel FTE' : 'Exclusive Benefits Included in Official FTE Pack'}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              {lang === 'fr' ? 'Réservé aux délégations inscrites via la plateforme officielle' : 'Reserved for delegations registered via official platform'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-xs text-[#0F172A] mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-[#03396C] flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                <span>{lang === 'fr' ? 'Accréditation Directe Hôtel' : 'Direct Hotel Accreditation'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'fr'
                  ? 'Remise des badges FIE directement au desk officiel de votre hôtel, sans aucune file d\'attente à la salle.'
                  : 'FIE badges delivered directly at your hotel official desk, zero waiting lines at venue.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-xs text-[#0F172A] mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-[#03396C] flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                <span>{lang === 'fr' ? 'Navettes Directes Radès' : 'Direct Radès Shuttles'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'fr'
                  ? 'Liaisons cadencées Hôtel ↔ Salle Omnisports de Radès toutes les 30 min, dédiées aux tireurs et staffs.'
                  : 'Scheduled transfers Hotel ↔ Radès Arena every 30 mins dedicated to athletes and staff.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-xs text-[#0F172A] mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-[#03396C] flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                <span>{lang === 'fr' ? 'Buffet Sportif Haut Niveau' : 'Pro Athletic Buffets'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'fr'
                  ? 'Pension complète avec menus diététiques pour sportifs de haut niveau et accès balnéothérapie.'
                  : 'Full board with dietary nutrition tailored for elite athletes and balneotherapy access.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-xs text-[#0F172A] mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-[#03396C] flex items-center justify-center text-[10px] font-black shrink-0">4</span>
                <span>{lang === 'fr' ? 'Transport Housses 1m40' : '1m40 Sabre Bag Transfer'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'fr'
                  ? 'Véhicules dimensionnés et sécurisés spécialement pour les rouleaux et housses de sabre volumineuses.'
                  : 'Vehicles sized and secured specifically for rollbags and large sabre bags.'}
              </p>
            </div>
          </div>

          {/* Official Pack Guarantee Notice */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wide">
                {lang === 'fr' ? 'Tarifs Officiels FIE' : 'Official FIE Rates'}
              </span>
              <span>
                {lang === 'fr' ? (
                  <>Tarifs de <strong>Pré-réservation officielle</strong> garantis pour toutes les délégations.</>
                ) : (
                  <>Official <strong>pre-booking rates</strong> guaranteed for all delegations.</>
                )}
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              {lang === 'fr'
                ? 'Navettes Aéroports (TUN, NBE, MIR) incluses à 0 € • Zéro frais supplémentaires'
                : 'Airport Shuttles (TUN, NBE, MIR) included at 0 € • Zero extra fees'}
            </span>
          </div>
        </div>

        {/* The 2 Official Hotels Cards */}
        <div className="space-y-12">
          {hotelList.map((hotel) => {
            const currentPhotoIdx = photoIndexes[hotel.id] || 0;
            const singlePriceEur = hotel.roomTypes?.single?.pricePerNight ?? 130;
            const doublePriceEur = hotel.roomTypes?.double?.pricePerNight ?? 180;
            const singlePriceTnd = Math.round(singlePriceEur * 3.3);
            const doublePriceTnd = Math.round(doublePriceEur * 3.3);

            // Availability stats
            const singleAvail = (hotel.roomTypes?.single?.totalInventory ?? 90) - (hotel.roomTypes?.single?.blockedInventory ?? 15);
            const doubleAvail = (hotel.roomTypes?.double?.totalInventory ?? 130) - (hotel.roomTypes?.double?.blockedInventory ?? 20);

            return (
              <div
                key={hotel.id}
                className="inst-card overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Photo Gallery Column (5 cols) */}
                  <div className="lg:col-span-5 relative bg-slate-100 min-h-[340px] sm:min-h-[420px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
                    
                    {/* Active Photo Container */}
                    <div className="relative w-full h-full flex-1 overflow-hidden group">
                      <img
                        src={hotel.photos[currentPhotoIdx]?.url}
                        alt={getLoc(hotel.photos[currentPhotoIdx]?.caption, hotel.name)}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                      />
                      
                      {/* Gradient for caption legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none"></div>

                      {/* Photo Navigation Controls */}
                      <button
                        type="button"
                        onClick={() => prevPhoto(hotel.id, hotel.photos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md transition-all cursor-pointer"
                        title="Photo précédente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => nextPhoto(hotel.id, hotel.photos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md transition-all cursor-pointer"
                        title="Photo suivante"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Official Designation Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-md bg-white/95 text-[#03396C] font-bold text-xs flex items-center gap-1.5 shadow-xs">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>5 ★★★★★ LUXE</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#03396C]/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                          {hotel.id === 'el-mouradi-gammarth' ? 'VILLAGE ATHLÈTES' : 'QG OFFICIEL & VIP'}
                        </span>
                      </div>

                      {/* Photo Caption & Counter */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                        <span className="font-medium truncate pr-2 drop-shadow-sm">
                          {getLoc(hotel.photos[currentPhotoIdx]?.caption, '')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/70 font-mono text-[10px] shrink-0 font-bold">
                          {currentPhotoIdx + 1} / {hotel.photos.length}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Strip with Real Photos */}
                    <div className="p-2.5 bg-slate-900 flex items-center gap-2 overflow-x-auto">
                      {hotel.photos.map((photo, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setPhotoIndexes(prev => ({ ...prev, [hotel.id]: pIdx }))}
                          className={`relative rounded-md overflow-hidden w-16 h-11 shrink-0 border-2 transition-all cursor-pointer ${
                            currentPhotoIdx === pIdx ? 'border-[#C8102E] scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                  </div>

                  {/* Hotel Details Column (7 cols) */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
                    <div>
                      
                      {/* Category Tagline & Google Maps Button */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-blue-50 text-[#03396C] border border-blue-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#03396C]" />
                          <span>{hotel.id === 'el-mouradi-gammarth' ? 'Village Officiel des Délégations & Athlètes' : 'QG Directoire Technique, Arbitres & Officiels'}</span>
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => setSelectedMapHotel(hotel)}
                          className="inline-flex items-center gap-1.5 text-xs text-[#03396C] hover:text-[#005B96] font-semibold transition-colors cursor-pointer group"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                          <span className="underline underline-offset-4">Voir sur Google Maps</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#03396C]" />
                        </button>
                      </div>

                      {/* Hotel Name */}
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                        {hotel.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 mt-1 mb-4">
                        {getLoc(hotel.tagline, '')}
                      </p>

                      {/* Distance to Radès Competition Venue Banner */}
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 mb-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="w-4 h-4 text-[#C8102E] shrink-0" />
                          <span>
                            <strong>Salle de Radès :</strong> <span className="font-mono text-slate-900 font-bold">{hotel.competitionDistance.distanceKm} km</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 font-mono">
                          <Clock className="w-4 h-4 text-[#03396C] shrink-0" />
                          <span>~{hotel.competitionDistance.travelTimeMin} min de route directe</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                          <Bus className="w-4 h-4 shrink-0" />
                          <span>Navette FIE toutes les 20 min</span>
                        </div>
                      </div>

                      {/* Editorial Hotel Description */}
                      <p className="text-sm text-slate-600 leading-relaxed mb-5">
                        {getLoc(hotel.description, '')}
                      </p>

                      {/* Athletic & Hospitality Amenities */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                        {hotel.amenities?.slice(0, 6).map((amenity, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#03396C] shrink-0"></span>
                            <span className="truncate">{getLoc(amenity.label || (amenity as any).name, '')}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Room Types & Official Negotiated Rates Strip */}
                    <div className="border-t border-slate-200 pt-5">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                        <span>{lang === 'fr' ? 'Tarifs Officiels Négociés FIE (TTC & Buffets Inclus)' : 'Official Negotiated FIE Rates (VAT & Buffets Included)'}</span>
                        <span className="text-[#03396C] font-semibold">{lang === 'fr' ? 'Par nuitée' : 'Per night'}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        
                        {/* Single Room */}
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-[#03396C] shadow-xs">
                              <Bed className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {lang === 'fr' ? 'Chambre Single' : 'Single Room'}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {lang === 'fr' ? '1 Athlète / Officiel' : '1 Athlete / Official'}
                              </div>
                              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                                {singleAvail} {lang === 'fr' ? 'chambres disp.' : 'rooms left'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-black text-[#0F172A] font-mono tabular-price">
                              {singlePriceEur} €
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              ~{singlePriceTnd} TND
                            </div>
                          </div>
                        </div>

                        {/* Double Room */}
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-[#03396C] shadow-xs">
                              <BedDouble className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {lang === 'fr' ? 'Chambre Double' : 'Double / Twin Room'}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {lang === 'fr' ? '2 Lits séparés Twin' : '2 Ergonomic Twin Beds'}
                              </div>
                              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                                {doubleAvail} {lang === 'fr' ? 'chambres disp.' : 'rooms left'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-black text-[#0F172A] font-mono tabular-price">
                              {doublePriceEur} €
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              ~{doublePriceTnd} TND
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Payment Methods Notice (Stripe, Transfer, Onsite) */}
                      <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 mb-4 flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-[#03396C] shrink-0" />
                        <span className="text-xs text-slate-700">
                          {lang === 'fr' ? (
                            <><strong>Paiement au choix :</strong> Carte bancaire en ligne (Stripe), virement bancaire pour les délégations, ou règlement sur place au bureau d'accréditation sans aucun frais supplémentaire.</>
                          ) : (
                            <><strong>Flexible payment:</strong> Online card (Stripe), official bank transfer, or on-site payment upon hotel accreditation with zero additional fees.</>
                          )}
                        </span>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => onSelectHotel(hotel.id)}
                        className="w-full btn-primary cursor-pointer text-sm font-semibold py-3"
                      >
                        <span>{lang === 'fr' ? `Réserver à l'${hotel.name}` : `Book at ${hotel.name}`}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Google Maps Modal */}
      {selectedMapHotel && (
        <MapModal
          hotel={selectedMapHotel}
          onClose={() => setSelectedMapHotel(null)}
        />
      )}
    </section>
  );
};

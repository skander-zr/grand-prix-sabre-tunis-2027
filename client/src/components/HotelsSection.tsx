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
  Swords,
  BedDouble,
  Bed,
  Banknote,
  Sparkles,
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
    <section id="hotels-section" className="py-14 sm:py-20 bg-[#050811] text-slate-100 piste-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Championship Hospitality Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#D4AF37]/25 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#091222] border border-[#D4AF37]/40 text-[#F5E8C7] text-xs font-bold uppercase tracking-wider mb-3">
              <Swords className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Hébergement Officiel FIE &bull; Gammarth, Tunisie</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase font-heading">
              Les 2 Hôtels 5★ Officiels de la Compétition
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Deux prestigieux complexes hôteliers 5 étoiles situés sur la côte de Gammarth, réservés exclusivement pour les délégations de la Coupe du Monde de Sabre 2027. Nutrition sportive sur-mesure, balnéothérapie de récupération et liaisons directes vers Radès.
            </p>
          </div>

          <div className="text-left md:text-right shrink-0 bg-[#0A1222] p-4 rounded-xl border border-[#D4AF37]/30">
            <span className="text-[11px] text-slate-400 block font-mono">Distance vers Salle Omnisports de Radès :</span>
            <span className="text-lg font-black text-[#D4AF37] font-mono">13 - 14 KM &bull; ~16 MIN</span>
            <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">Navettes FIE directes toutes les 20 min</span>
          </div>
        </div>

        {/* The 2 Luxury Hotels Showcase */}
        <div className="space-y-16">
          {hotelList.map((hotel) => {
            const currentPhotoIdx = photoIndexes[hotel.id] || 0;
            const singlePrice = hotel.roomTypes.single.pricePerNight;
            const doublePrice = hotel.roomTypes.double.pricePerNight;

            return (
              <div
                key={hotel.id}
                className="palace-card rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Photo Gallery Column (5 cols) */}
                  <div className="lg:col-span-5 relative bg-[#04070E] min-h-[360px] sm:min-h-[440px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20">
                    
                    {/* Active Photo Container */}
                    <div className="relative w-full h-full flex-1 overflow-hidden group">
                      <img
                        src={hotel.photos[currentPhotoIdx]?.url}
                        alt={hotel.photos[currentPhotoIdx]?.caption[lang]}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Rich Mediterranean Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-black/40 pointer-events-none"></div>

                      {/* Photo Navigation Controls */}
                      <button
                        type="button"
                        onClick={() => prevPhoto(hotel.id, hotel.photos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#060B14]/80 hover:bg-[#D4AF37] text-white hover:text-[#060B14] backdrop-blur border border-white/20 transition-all cursor-pointer"
                        title="Photo précédente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => nextPhoto(hotel.id, hotel.photos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#060B14]/80 hover:bg-[#D4AF37] text-white hover:text-[#060B14] backdrop-blur border border-white/20 transition-all cursor-pointer"
                        title="Photo suivante"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Official Designation Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded bg-[#060B14]/90 backdrop-blur border border-[#D4AF37]/50 text-[#F5E8C7] font-bold text-xs flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>5 ★★★★★ LUXE</span>
                        </span>
                        <span className="px-2.5 py-1 rounded bg-[#121F38]/90 backdrop-blur text-[#D4AF37] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                          {hotel.id === 'el-mouradi-gammarth' ? 'VILLAGE ATHLÈTES' : 'QG OFFICIEL & VIP'}
                        </span>
                      </div>

                      {/* Photo Caption & Counter */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                        <span className="font-semibold truncate pr-2 drop-shadow">
                          {hotel.photos[currentPhotoIdx]?.caption[lang]}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] shrink-0 border border-white/10 font-bold text-[#F5E8C7]">
                          {currentPhotoIdx + 1} / {hotel.photos.length}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Strip with Real Authentic Photos */}
                    <div className="p-2.5 bg-[#03060C] border-t border-[#D4AF37]/20 flex items-center gap-2 overflow-x-auto">
                      {hotel.photos.map((photo, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setPhotoIndexes(prev => ({ ...prev, [hotel.id]: pIdx }))}
                          className={`relative rounded overflow-hidden w-16 h-11 shrink-0 border-2 transition-all cursor-pointer ${
                            currentPhotoIdx === pIdx ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                  </div>

                  {/* Hotel Details Column (7 cols) */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div>
                      
                      {/* Category Tagline & Google Maps Button */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-[#0C1527] border border-[#D4AF37]/30 text-[#F5E8C7]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{hotel.id === 'el-mouradi-gammarth' ? 'Village Officiel des Délégations & Athlètes' : 'QG Directoire Technique, Arbitres & Officiels'}</span>
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => setSelectedMapHotel(hotel)}
                          className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F5E8C7] font-bold transition-colors cursor-pointer group"
                        >
                          <MapPin className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                          <span className="underline underline-offset-4">Voir sur Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Hotel Name */}
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-heading">
                        {hotel.name}
                      </h3>
                      <p className="text-xs font-bold text-[#D4AF37] mt-1 mb-4 font-mono">
                        {hotel.tagline[lang]}
                      </p>

                      {/* Distance to Radès Competition Venue Banner */}
                      <div className="p-3.5 rounded-xl bg-[#091322] border border-[#D4AF37]/25 mb-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-200">
                          <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>
                            <strong>Salle de Radès :</strong> <span className="font-mono text-[#F5E8C7] font-bold">{hotel.competitionDistance.distanceKm} km</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-200 font-mono">
                          <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <span>~{hotel.competitionDistance.travelTimeMin} min de route directe</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <Bus className="w-4 h-4 shrink-0" />
                          <span>Navette FIE toutes les 20 min</span>
                        </div>
                      </div>

                      {/* Editorial Hotel Description */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                        {hotel.description[lang]}
                      </p>

                      {/* Athletic & Hospitality Amenities */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                        {hotel.amenities.slice(0, 6).map((amenity, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-2 p-2 rounded bg-[#070D18] border border-white/[0.06] text-[11px] text-slate-300 font-medium"
                          >
                            <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            <span className="truncate">{amenity.name[lang]}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Room Types & Official Negotiated Rates Strip */}
                    <div className="border-t border-[#D4AF37]/20 pt-5">
                      <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                        <span>Tarifs Officiels Négociés FIE (TTC &amp; Buffet Inclus)</span>
                        <span className="text-[#D4AF37]">Par nuitée</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        
                        {/* Single Room */}
                        <div className="p-3.5 rounded-xl bg-[#091120] border border-[#D4AF37]/30 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded bg-[#101C32] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                              <Bed className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white uppercase">Chambre Single</div>
                              <div className="text-[10px] text-slate-400">1 Athlète / Officiel</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-black text-[#F5E8C7] font-mono tabular-price">
                              {singlePrice.eur} €
                            </div>
                            <div className="text-[10px] text-[#C59B27] font-mono font-bold">
                              {singlePrice.tnd} TND
                            </div>
                          </div>
                        </div>

                        {/* Double Room */}
                        <div className="p-3.5 rounded-xl bg-[#091120] border border-[#D4AF37]/30 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded bg-[#101C32] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                              <BedDouble className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white uppercase">Chambre Double</div>
                              <div className="text-[10px] text-slate-400">2 Lits séparés Twin</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-black text-[#F5E8C7] font-mono tabular-price">
                              {doublePrice.eur} €
                            </div>
                            <div className="text-[10px] text-[#C59B27] font-mono font-bold">
                              {doublePrice.tnd} TND
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Official Cash upon Check-in Notice */}
                      <div className="p-3 rounded-lg bg-[#0E1B32] border border-[#D4AF37]/40 mb-4 flex items-center gap-3">
                        <Banknote className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span className="text-[11px] text-slate-200">
                          <strong>Paiement Officiel FIE :</strong> 100% en espèces (Euros € ou Dinars TND) lors de votre arrivée / check-in sur place.
                        </span>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => onSelectHotel(hotel.id)}
                        className="w-full py-3.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-black/50 transition-all cursor-pointer"
                      >
                        <span>Réserver à {hotel.name}</span>
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

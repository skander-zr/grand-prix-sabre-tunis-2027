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
  Users,
  Sparkles,
  Shield,
  HeartPulse,
  Coffee,
  UtensilsCrossed,
  Car,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  CalendarCheck,
  Swords,
  BedDouble,
  Bed
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

  const renderAmenityIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Wifi, Dumbbell, Waves, Utensils, Bus, ShieldCheck, Users, Sparkles,
      Shield, HeartPulse, Coffee, UtensilsCrossed, Car
    };
    const IconComponent = icons[iconName] || CheckCircle2;
    return <IconComponent className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  };

  const hotelList = [hotels['el-mouradi-gammarth'], hotels['golden-carthage']];

  return (
    <section id="hotels-section" className="py-14 sm:py-20 bg-[#050912] text-slate-100 piste-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#14233c] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b172a] border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
              <Swords className="w-3 h-3 text-cyan-400" />
              <span>Hébergement Officiel FIE & FTE &bull; Gammarth 2027</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Les 2 Hôtels Officiels de la Compétition
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Deux complexes hôteliers 5 étoiles sélectionnés pour leur proximité avec la piste d'armes, leur centre de balnéothérapie et leurs prestations nutritionnelles adaptées aux athlètes de haut niveau.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 block font-mono">Distance moyenne piste d'armes :</span>
            <span className="text-lg font-black text-amber-400 font-mono">12 - 14 KM &bull; ~16 MIN</span>
            <span className="text-[10px] text-emerald-400 block font-semibold">Navettes FIE directes toutes les 20 min</span>
          </div>
        </div>

        {/* The 2 Hotels Showcase */}
        <div className="space-y-12">
          {hotelList.map((hotel, index) => {
            const currentPhotoIdx = photoIndexes[hotel.id] || 0;
            const singlePrice = hotel.roomTypes.single.pricePerNight;
            const doublePrice = hotel.roomTypes.double.pricePerNight;

            return (
              <div
                key={hotel.id}
                className="tournament-card rounded-3xl overflow-hidden border border-[#1b2b46] shadow-2xl transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Photo Gallery Column (5 cols) */}
                  <div className="lg:col-span-5 relative bg-[#030712] min-h-[340px] sm:min-h-[420px] flex flex-col justify-between">
                    
                    {/* Active Photo Container */}
                    <div className="relative w-full h-full flex-1 overflow-hidden group">
                      <img
                        src={hotel.photos[currentPhotoIdx]?.url}
                        alt={hotel.photos[currentPhotoIdx]?.caption[lang]}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Gradient film */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040813] via-transparent to-black/40 pointer-events-none"></div>

                      {/* Photo Navigation */}
                      <button
                        type="button"
                        onClick={() => prevPhoto(hotel.id, hotel.photos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-sky-600 text-white backdrop-blur border border-white/20 transition-all cursor-pointer"
                        title="Photo précédente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => nextPhoto(hotel.id, hotel.photos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-sky-600 text-white backdrop-blur border border-white/20 transition-all cursor-pointer"
                        title="Photo suivante"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Official Designation Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur border border-amber-400/50 text-amber-300 font-black text-xs">
                          5 ★★★★★ LUXE
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#0062ff]/90 backdrop-blur text-white font-mono text-[10px] font-black uppercase tracking-wider">
                          {hotel.id === 'el-mouradi-gammarth' ? 'HÔTEL 01' : 'HÔTEL 02'}
                        </span>
                      </div>

                      {/* Photo Caption & Counter */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                        <span className="font-semibold truncate pr-2 drop-shadow">
                          {hotel.photos[currentPhotoIdx]?.caption[lang]}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/70 font-mono text-[10px] shrink-0 border border-white/10 font-bold">
                          {currentPhotoIdx + 1} / {hotel.photos.length}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="p-2.5 bg-[#03060c] border-t border-[#122037] flex items-center gap-2 overflow-x-auto">
                      {hotel.photos.map((photo, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setPhotoIndexes(prev => ({ ...prev, [hotel.id]: pIdx }))}
                          className={`relative rounded-lg overflow-hidden w-16 h-11 shrink-0 border-2 transition-all cursor-pointer ${
                            currentPhotoIdx === pIdx ? 'border-cyan-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                  </div>

                  {/* Details Column (7 cols) */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div>
                      
                      {/* Top Tagline & Map Link */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0c1930] border border-sky-400/40 text-cyan-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{hotel.id === 'el-mouradi-gammarth' ? 'Village Officiel Athlètes & Délégations' : 'QG FIE, Arbitres & Directoire'}</span>
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => setSelectedMapHotel(hotel)}
                          className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer group"
                        >
                          <MapPin className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                          <span className="underline underline-offset-4">Voir sur Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Hotel Name */}
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                        {hotel.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-400 mt-1 mb-4">
                        {hotel.tagline[lang]}
                      </p>

                      {/* Distance to Radès Competition Venue Banner */}
                      <div className="p-3.5 rounded-xl bg-[#081224] border border-[#172946] mb-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-200">
                          <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>
                            <strong>{hotel.competitionDistance.venue} :</strong> <span className="font-mono text-cyan-300 font-bold">{hotel.competitionDistance.distanceKm} km</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-200 font-mono">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>~{hotel.competitionDistance.travelTimeMin} min de route directe</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <Bus className="w-4 h-4 shrink-0" />
                          <span>Navette toutes les 20 min</span>
                        </div>
                      </div>

                      {/* Editorial Description */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                        {hotel.description[lang]}
                      </p>

                      {/* Amenities Grid */}
                      <div className="mb-6">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                          Équipements & Services Délégations Escrime
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {hotel.amenities.map((amenity, aIdx) => (
                            <div
                              key={aIdx}
                              className="flex items-center gap-2 p-2 rounded-xl bg-[#081224]/80 border border-[#14233c] text-slate-200"
                            >
                              {renderAmenityIcon(amenity.icon)}
                              <span className="text-[11px] font-semibold truncate leading-tight">
                                {amenity.label[lang]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Room Rates Matrix Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        
                        {/* Single Room Rate */}
                        <div className="p-4 rounded-2xl bg-[#081324] border border-sky-950 relative hover:border-sky-500/50 transition-all">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                              <Bed className="w-4 h-4 text-amber-400" />
                              <span>Chambre Single (1 pers)</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                              DISPONIBLE
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{singlePrice} €</span>
                            <span className="text-xs text-slate-400 font-medium">/ nuit</span>
                            <span className="text-[11px] text-slate-400 font-mono ml-auto">(~{Math.round(singlePrice * 3.35)} TND)</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {hotel.roomTypes.single.description[lang]}
                          </p>
                        </div>

                        {/* Double Room Rate */}
                        <div className="p-4 rounded-2xl bg-[#081324] border border-sky-950 relative hover:border-sky-500/50 transition-all">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                              <BedDouble className="w-4 h-4 text-cyan-400" />
                              <span>Chambre Double / Twin</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                              DISPONIBLE
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">{doublePrice} €</span>
                            <span className="text-xs text-slate-400 font-medium">/ nuit</span>
                            <span className="text-[11px] text-slate-400 font-mono ml-auto">(~{Math.round(doublePrice * 3.35)} TND)</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {hotel.roomTypes.double.description[lang]}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-4 border-t border-[#122037] flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Tarifs négociés officiels FTE / FIE sans intermédiaire &bull; TVA 7% incluse</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectHotel(hotel.id)}
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black text-slate-950 uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>Réserver à {hotel.name}</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Google Maps Modal */}
      <MapModal
        hotel={selectedMapHotel}
        onClose={() => setSelectedMapHotel(null)}
      />
    </section>
  );
};

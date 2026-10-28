import React from 'react';
import { X, MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';
import { Hotel } from '../types/gp';
import { useLanguage } from '../contexts/LanguageContext';

interface MapModalProps {
  hotel: Hotel | null;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ hotel, onClose }) => {
  const { lang, t } = useLanguage();

  if (!hotel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl palace-card border border-[#D4AF37]/45 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/20 bg-[#060B14]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#121E38] text-[#D4AF37] border border-[#D4AF37]/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
                <span>{hotel.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#0A1220] text-[#D4AF37] border border-[#D4AF37]/40 font-mono font-bold">
                  5 ★★★★★
                </span>
              </h3>
              <p className="text-xs text-slate-400">{hotel.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Travel Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#091222] border-b border-[#D4AF37]/20 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Navigation className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <div>
              <div className="font-bold text-white">Destination Compétition</div>
              <div className="text-[11px] text-slate-400">{hotel.competitionDistance.venue}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <div>
              <div className="font-bold text-white">Temps de Trajet Estimé</div>
              <div className="text-[11px] text-slate-400">~{hotel.competitionDistance.travelTimeMin} minutes ({hotel.competitionDistance.distanceKm} km direct)</div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.location)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#C59B27] text-[#060B14] font-bold text-xs transition-colors shadow-md"
            >
              <span>Ouvrir dans Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-900">
          <iframe
            src={hotel.googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Localisation Google Maps de ${hotel.name}`}
            className="w-full h-full filter contrast-[1.05]"
          ></iframe>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#060B14] border-t border-[#D4AF37]/20 text-xs text-slate-400">
          <span className="font-mono">Coordonnées GPS : {hotel.coordinates.lat.toFixed(4)}° N, {hotel.coordinates.lng.toFixed(4)}° E</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

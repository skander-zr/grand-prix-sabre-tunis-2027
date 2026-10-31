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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl inst-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-[#03396C] border border-blue-200">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <span>{hotel.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-blue-50 text-[#03396C] border border-blue-200 font-mono font-bold">
                  5 ★★★★★
                </span>
              </h3>
              <p className="text-xs text-slate-500">{hotel.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Travel Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Navigation className="w-4 h-4 text-[#03396C] shrink-0" />
            <div>
              <div className="font-bold text-[#0F172A]">Destination Compétition</div>
              <div className="text-[11px] text-slate-500">{hotel.competitionDistance.venue}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Clock className="w-4 h-4 text-[#03396C] shrink-0" />
            <div>
              <div className="font-bold text-[#0F172A]">Temps de Trajet Estimé</div>
              <div className="text-[11px] text-slate-500">~{hotel.competitionDistance.travelTimeMin} minutes ({hotel.competitionDistance.distanceKm} km direct)</div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-[#03396C] hover:border-slate-400 font-semibold text-xs shadow-xs"
            >
              <span>Ouvrir dans Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="flex-1 w-full min-h-[380px] bg-slate-100">
          <iframe
            title={hotel.name}
            src={hotel.googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '380px' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
          Liaisons assurées par les navettes officielles FIE toutes les 20 minutes entre {hotel.name} et la Salle Omnisports de Radès.
        </div>

      </div>
    </div>
  );
};

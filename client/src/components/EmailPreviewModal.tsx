import React from 'react';
import { EmailLog } from '../types/gp';
import { X, Mail, CheckCircle2, Calendar, ShieldCheck, Printer } from 'lucide-react';

interface EmailPreviewModalProps {
  emailLog: EmailLog | null;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ emailLog, onClose }) => {
  if (!emailLog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Email Header Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#071329] text-white border-b border-sky-950">
          <div className="flex items-center gap-2 text-xs">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-sky-300">APERÇU EMAIL OFFICIEL EXPÉDIÉ</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 text-xs space-y-1">
          <div><strong className="text-slate-600">De :</strong> notifications@gp-sabre-tunis2027.com &lt;Comité d'Organisation FIE/FTE&gt;</div>
          <div><strong className="text-slate-600">À :</strong> {emailLog.recipientName} &lt;{emailLog.recipientEmail}&gt;</div>
          <div><strong className="text-slate-600">Date :</strong> {new Date(emailLog.sentAt).toLocaleString('fr-FR')}</div>
          <div><strong className="text-slate-600">Objet :</strong> <span className="font-bold text-slate-900">{emailLog.subject}</span></div>
        </div>

        {/* Email Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto font-sans text-xs sm:text-sm text-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#09152b] text-white p-1 text-center font-bold text-[10px] flex flex-col justify-center">
                <span className="text-sky-400">FIE</span>
                <span className="text-rose-400 text-[8px]">TUNIS</span>
              </div>
              <div>
                <div className="font-black text-sm text-slate-900 uppercase">GRAND PRIX SABRE TUNIS 2027</div>
                <div className="text-[11px] text-slate-500">Official Accommodation & Transfer Desk</div>
              </div>
            </div>
            <div className="text-right font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
              {emailLog.bookingCode}
            </div>
          </div>

          <p>Bonjour {emailLog.recipientName},</p>

          <p className="leading-relaxed">
            {emailLog.type === 'booking_confirmation' && (
              <>
                Nous avons le plaisir de vous confirmer l'enregistrement officiel de votre réservation d'hébergement pour le <strong>Grand Prix Sabre Tunis (15 - 17 Janvier 2027)</strong>.
              </>
            )}
            {emailLog.type === 'shuttle_assignment' && (
              <>
                Votre navette aéroport officielle a été configurée et assignée dans le système d'optimisation logistique de la Fédération Tunisienne d'Escrime.
              </>
            )}
            {emailLog.type === 'reminder_48h' && (
              <>
                Rappel officiel : Votre arrivée à Tunis pour le Grand Prix Sabre 2027 est prévue dans 48 heures. Merci de vérifier vos coordonnées de vol et de présenter votre voucher à l'arrivée.
              </>
            )}
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2 text-xs">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Détails Clés de votre Dossier
            </div>
            <div>&bull; <strong>Code de Réservation Unique :</strong> <span className="font-mono font-bold text-sky-800">{emailLog.bookingCode}</span></div>
            <div>&bull; <strong>Message Système :</strong> {emailLog.contentSnippet}</div>
            <div>&bull; <strong>Desk d'Accueil Aéroport :</strong> Terminal 1, Sortie Arrivées, Comptoir Officiel FTE</div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Vous pouvez à tout moment accéder à votre espace en ligne avec votre code pour modifier vos horaires de vol ou télécharger votre voucher officiel avec QR Code.
          </p>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div>Comité d'Organisation du Grand Prix Sabre Tunis 2027</div>
            <div>Fédération Tunisienne d'Escrime (FTE) & Fédération Internationale d'Escrime (FIE)</div>
            <div>Contact Urgences Délégations : +216 71 889 000 &bull; transport@escrime-tunisie.tn</div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
          >
            Fermer l'aperçu
          </button>
        </div>

      </div>
    </div>
  );
};

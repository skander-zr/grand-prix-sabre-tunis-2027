import React, { useState } from 'react';
import { ShieldCheck, Lock, Building, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminAuthGateProps {
  onSuccess: (role: 'el-mouradi-gammarth' | 'golden-carthage' | 'super-admin') => void;
  onCancel: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onSuccess, onCancel }) => {
  const { lang } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<'el-mouradi-gammarth' | 'golden-carthage' | 'super-admin'>('super-admin');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      const validPins = ['2027', 'FIE2027', 'TUNIS2027', 'admin', 'hote'];
      if (validPins.includes(pin.trim())) {
        onSuccess(selectedRole);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">
      <div className="max-w-md w-full inst-card p-6 sm:p-8 shadow-md border border-slate-200">

        {/* Back link */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'fr' ? 'Retourner au site public' : 'Back to public site'}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[#03396C] border border-blue-200 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-1.5">
            {lang === 'fr' ? 'Accès Restreint • Commissaires FIE' : 'Restricted Access • FIE Commissioners'}
          </div>
          <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
            {lang === 'fr' ? 'Espace Hôte & Super Admin' : 'Host & Super Admin Portal'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {lang === 'fr'
              ? 'Portail réservé aux directions des 2 hôtels 5★ officiels et aux commissaires du comité d\'organisation FIE/FTE.'
              : 'Portal reserved for official 5★ hotel management and FIE/FTE organizing committee commissioners.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {lang === 'fr' ? 'Profil d\'Accréditation' : 'Accreditation Profile'}
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'super-admin',
                  title: lang === 'fr' ? 'Comité Exécutif FIE / FTE' : 'FIE / FTE Executive Committee',
                  desc: lang === 'fr' ? 'Super-Admin global (tous les hôtels & navettes)' : 'Global Super-Admin (all hotels & shuttles)'
                },
                {
                  id: 'el-mouradi-gammarth',
                  title: lang === 'fr' ? 'Hôtel El Mouradi Gammarth (5★)' : 'El Mouradi Gammarth Hotel (5★)',
                  desc: lang === 'fr' ? 'Village Athlètes (Gestion chambres & check-in)' : 'Athletes Village (Rooms & check-in)'
                },
                {
                  id: 'golden-carthage',
                  title: lang === 'fr' ? 'Hôtel Golden Carthage (5★)' : 'Golden Carthage Hotel (5★)',
                  desc: lang === 'fr' ? 'Hub VIP Arbitres (Gestion quotas & check-in)' : 'Referees & VIP Hub (Quotas & check-in)'
                }
              ].map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id as any)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${selectedRole === role.id
                    ? 'border-[#03396C] bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                >
                  <div className="text-xs font-bold text-[#0F172A]">{role.title}</div>
                  <div className="text-[11px] text-slate-500">{role.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PIN Input */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'fr' ? 'Code PIN d\'Accréditation' : 'Accreditation PIN Code'}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder={lang === 'fr' ? 'Saisissez votre code PIN sécurisé (ex: FTE2027)' : 'Enter your secure PIN code (e.g. FTE2027)'}
                className="w-full py-2.5 pl-10 pr-4 text-xs font-mono"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-red-700 text-xs bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'fr' ? 'Code PIN erroné. Veuillez contacter le coordinateur officiel.' : 'Invalid PIN code. Please contact the official coordinator.'}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary cursor-pointer text-xs font-semibold py-3 shadow-xs mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Déverrouiller le Tableau de Bord' : 'Unlock Admin Dashboard'}</span>
              </div>
            )}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {lang === 'fr' ? 'Chiffrement TLS 1.3' : 'TLS 1.3 Encryption'}
          </span>
          <span className="font-mono text-[10px]">FIE-GP-TUNIS-2027</span>
        </div>

      </div>
    </div>
  );
};

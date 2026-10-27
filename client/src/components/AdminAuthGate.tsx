import React, { useState } from 'react';
import { ShieldCheck, Lock, Building, Swords, KeyRound, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
      // Valid pins: 2027, FIE2027, TUNIS2027, admin
      const validPins = ['2027', 'FIE2027', 'TUNIS2027', 'admin', 'hote'];
      if (validPins.includes(pin.trim())) {
        onSuccess(selectedRole);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 450);
  };

  const handleQuickDemo = () => {
    setPin('2027');
    setError(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#070e1c] border border-sky-950/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top tournament accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-sky-500"></div>

        {/* Back link */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'fr' ? 'Retourner au site public' : 'Back to public site'}</span>
        </button>

        {/* Header with official credentials */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-sky-600/20 to-transparent border border-amber-500/30 text-amber-400 mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-2">
            Portail Sécurisé FIE • Accès Restreint
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Espace Hôte & Comité FIE
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {lang === 'fr'
              ? 'Accès réservé aux directions des 2 hôtels officiels et aux commissaires du tournoi Grand Prix Sabre Tunis 2027.'
              : 'Authorized access only for official hotels management and FIE tournament commissioners.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              {lang === 'fr' ? 'Profil d\'accréditation' : 'Accreditation Profile'}
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'super-admin',
                  title: 'Comité Exécutif FIE / FTE',
                  desc: 'Super-Admin global (tous les hôtels & navettes)',
                  icon: Swords,
                  color: 'text-amber-400'
                },
                {
                  id: 'el-mouradi-gammarth',
                  title: 'Hôtel El Mouradi Gammarth',
                  desc: 'Village Athlètes (5★ - Gestion chambres)',
                  icon: Building,
                  color: 'text-sky-400'
                },
                {
                  id: 'golden-carthage',
                  title: 'Hôtel Golden Carthage',
                  desc: 'Hub VIP Arbitres (5★ - Gestion quotas)',
                  icon: ShieldCheck,
                  color: 'text-emerald-400'
                }
              ].map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id as any)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0f1d38] border-sky-500 shadow-md shadow-sky-950/50'
                        : 'bg-[#0a1222] border-slate-800/80 hover:border-slate-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-[#070e1a] border border-slate-800 ${role.color} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{role.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{role.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PIN Input */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {lang === 'fr' ? 'Code PIN d\'accréditation' : 'Accreditation PIN'}
              </label>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-[10px] font-bold text-amber-400 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600/40 transition-colors cursor-pointer"
                title="Cliquer pour remplir automatiquement le code démo"
              >
                Code Démo : 2027
              </button>
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Entrez le code PIN (ex: 2027)"
                className={`w-full bg-[#0a1222] border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  error
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-800 focus:border-sky-500'
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-rose-400 text-xs bg-rose-950/40 border border-rose-800/40 px-3 py-1.5 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Code PIN erroné. Veuillez saisir le code officiel (2027).</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:brightness-95 transition-all cursor-pointer mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Déverrouiller le Tableau de Bord' : 'Unlock Dashboard'}</span>
              </>
            )}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Tunnel TLS 1.3 Sécurisé
          </span>
          <span className="font-mono">FIE-GP-TUNIS-SEC-2027</span>
        </div>

      </div>
    </div>
  );
};

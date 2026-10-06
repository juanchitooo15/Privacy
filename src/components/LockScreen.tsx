import React, { useState } from 'react';
import { UserProfile } from '../types/privacy';
import { Lock, Fingerprint, KeyRound, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { BiometricPromptModal } from './BiometricPromptModal';

interface Props {
  user: UserProfile;
  onUnlock: () => void;
  onLogout: () => void;
}

export const LockScreen: React.FC<Props> = ({ user, onUnlock, onLogout }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === user.secretKey) {
      onUnlock();
    } else {
      setError('Clave secreta incorrecta.');
      setPassword('');
    }
  };

  const handleBiometricSuccess = () => {
    setShowBiometricModal(false);
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0c080a]/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 sm:p-10 select-none text-slate-100">
      {/* Top indicator */}
      <div className="flex items-center gap-2 text-xs font-poppins text-red-400/90 pt-4">
        <ShieldAlert className="w-4 h-4 text-red-400" />
        <span className="tracking-wider uppercase font-semibold">Bloqueo Permanente por Privacidad</span>
      </div>

      {/* Center Lock Box */}
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6 my-auto">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#B4E197]/50 shadow-2xl p-1 bg-[#5A1827]">
            <img
              src={user.avatar}
              alt={user.firstName}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#5A1827] border border-[#B4E197] shadow-lg">
            <Lock className="w-4 h-4 text-[#B4E197]" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold font-poppins text-white">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-xs text-slate-400 font-poppins mt-1">
            Se detectó salida de la aplicación o cambio de pestaña.
          </p>
        </div>

        {/* Biometric Quick Unlock if enabled */}
        {user.biometricEnabled ? (
          <div className="w-full space-y-4">
            <button
              type="button"
              onClick={() => setShowBiometricModal(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#5A1827] text-white border border-[#B4E197]/50 hover:border-[#B4E197] hover:bg-[#6c1d2f] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-poppins shadow-xl cursor-pointer"
            >
              <Fingerprint className="w-6 h-6 text-[#B4E197] animate-pulse" />
              <div className="text-left">
                <div className="text-xs font-semibold">
                  Desbloqueo Biométrico
                </div>
                <div className="text-[10px] text-[#B4E197]/90 font-light">
                  Reconocimiento facial / Huella del dispositivo
                </div>
              </div>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink mx-4 text-[11px] text-slate-500 font-poppins">o con clave secreta</span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresar clave secreta"
                  className="w-full pl-4 pr-10 py-2.5 bg-[#160E12] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] text-xs font-poppins"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {error && <p className="text-xs text-red-400 font-poppins">{error}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-poppins transition-colors cursor-pointer"
              >
                Desbloquear con clave
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="w-full space-y-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresar clave secreta"
                className="w-full pl-4 pr-10 py-3 bg-[#160E12] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] text-sm font-poppins"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-xs text-red-400 font-poppins">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#5A1827] text-white border border-[#B4E197]/40 hover:bg-[#6c1d2f] text-xs font-semibold font-poppins transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <KeyRound className="w-4 h-4 text-[#B4E197]" />
              <span>Desbloquear con clave</span>
            </button>
          </form>
        )}
      </div>

      {/* Logout link */}
      <button
        onClick={onLogout}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-poppins pb-2 cursor-pointer"
      >
        Cerrar sesión en este dispositivo
      </button>

      {/* Native Biometric Verification Modal */}
      <BiometricPromptModal
        isOpen={showBiometricModal}
        mode="authenticate"
        userName={user.firstName}
        onSuccess={handleBiometricSuccess}
        onCancel={() => setShowBiometricModal(false)}
      />
    </div>
  );
};

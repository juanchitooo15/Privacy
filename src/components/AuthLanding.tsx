import React, { useState } from 'react';
import { UserProfile } from '../types/privacy';
import { Lock, ShieldCheck, KeyRound, Fingerprint, Eye, EyeOff, UserCheck } from 'lucide-react';
import { BiometricPromptModal } from './BiometricPromptModal';

interface Props {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onCreateSessionClick: () => void;
}

export const AuthLanding: React.FC<Props> = ({
  currentUser,
  onLoginSuccess,
  onCreateSessionClick,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!currentUser) {
      setLoginError('No existe ninguna cuenta registrada en este dispositivo. Por favor selecciona "Crear Sesión".');
      return;
    }

    if (
      loginUsername.trim() === currentUser.username &&
      loginKey.trim() === currentUser.secretKey
    ) {
      onLoginSuccess(currentUser);
    } else {
      setLoginError('Credenciales incorrectas. Verifica tu nombre de usuario y tu clave secreta.');
    }
  };

  const handleBiometricAuth = () => {
    if (!currentUser) {
      setLoginError('No hay ninguna cuenta guardada para desbloquear de forma biométrica.');
      return;
    }
    setShowBiometricModal(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#0f0b0d] text-slate-100 overflow-hidden px-4 py-6 sm:p-10 select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5A1827]/60 via-[#5A1827]/15 to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#B4E197]/5 blur-3xl pointer-events-none" />

      {/* Top Banner: Privacy Environment Indication */}
      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between py-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-poppins text-[#B4E197]">
          <ShieldCheck className="w-4 h-4 text-[#B4E197]" />
          <span className="tracking-wide">Entorno Cifrado & Exclusivo</span>
        </div>
        <div className="text-[11px] text-slate-400 font-poppins hidden sm:block">
          Sin indexación · No rastreable
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto py-12">
        {/* Subtle Brand Insignia */}
        <div className="w-16 h-16 rounded-full bg-[#5A1827] border border-[#B4E197]/40 flex items-center justify-center mb-6 shadow-xl shadow-[#5A1827]/40">
          <Lock className="w-7 h-7 text-[#B4E197]" />
        </div>

        {/* Application Title in Lettering Style */}
        <h1 className="font-lettering text-8xl sm:text-9xl text-[#B4E197] leading-none mb-3 drop-shadow-md">
          Privacy
        </h1>

        <p className="font-poppins text-xs sm:text-sm text-slate-400 font-light tracking-wide max-w-sm mb-10 leading-relaxed">
          Tu red social de carácter estrictamente personal. Ningún perfil es público ni localizable por motores de búsqueda.
        </p>

        {/* Two Main Primary Buttons */}
        <div className="w-full space-y-3.5">
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full py-3.5 px-6 rounded-xl bg-[#5A1827] text-white font-poppins text-sm font-medium border border-[#B4E197]/30 hover:border-[#B4E197] hover:bg-[#6c1d2f] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5A1827]/30"
          >
            <KeyRound className="w-4 h-4 text-[#B4E197]" />
            <span>Iniciar Sesión</span>
          </button>

          <button
            onClick={onCreateSessionClick}
            className="w-full py-3.5 px-6 rounded-xl bg-[#B4E197] text-[#5A1827] font-poppins text-sm font-semibold hover:bg-[#a0d680] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B4E197]/20"
          >
            <UserCheck className="w-4 h-4 text-[#5A1827]" />
            <span>Crear Sesión</span>
          </button>

          {/* Quick Biometric device login option if user already created */}
          {currentUser && currentUser.biometricEnabled && (
            <button
              onClick={handleBiometricAuth}
              className="w-full py-2.5 px-4 text-xs font-poppins text-slate-400 hover:text-[#B4E197] flex items-center justify-center gap-2 transition-colors pt-2 cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-[#B4E197]" />
              <span>
                Desbloquear con Biometría ({currentUser.firstName})
              </span>
            </button>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full max-w-xl mx-auto text-center border-t border-white/5 pt-4">
        <p className="text-[11px] text-slate-500 font-poppins">
          Estética · Minimalista · Lettering · #5A1827 & #B4E197
        </p>
      </footer>

      {/* Iniciar Sesión Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#160E12] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-lettering text-2xl text-[#B4E197]">Privacy</span>
                <h3 className="text-lg font-semibold text-white font-poppins">Iniciar Sesión</h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-poppins">
                  Nombre de perfil (usuario)
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Tu identificador secreto"
                  className="w-full px-4 py-2.5 bg-[#1f1418] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] text-sm font-poppins"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-poppins">
                  Clave secreta
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={loginKey}
                    onChange={(e) => setLoginKey(e.target.value)}
                    placeholder="Contraseña establecida"
                    className="w-full pl-4 pr-10 py-2.5 bg-[#1f1418] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] text-sm font-poppins"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs font-poppins">
                  {loginError}
                </div>
              )}

              {/* Account quick credentials hint if sample user exists */}
              {currentUser && (
                <div className="p-3 bg-[#5A1827]/20 border border-[#5A1827]/60 rounded-xl text-[11px] text-[#B4E197]/90 font-poppins space-y-1">
                  <p className="font-semibold">Perfil activo en dispositivo:</p>
                  <p>Usuario: <span className="font-mono text-white select-all">{currentUser.username}</span></p>
                  <p>Clave: <span className="font-mono text-white select-all">{currentUser.secretKey}</span></p>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#5A1827] text-white hover:bg-[#6e1e30] border border-[#B4E197]/30 text-sm font-medium font-poppins transition-colors"
                >
                  Acceder a mi entorno
                </button>

                {currentUser && currentUser.biometricEnabled && (
                  <button
                    type="button"
                    onClick={handleBiometricAuth}
                    className="w-full py-2.5 rounded-xl bg-transparent border border-white/20 text-slate-300 hover:text-white hover:border-white/40 text-xs font-poppins flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Fingerprint className="w-4 h-4 text-[#B4E197]" />
                    <span>Usar biometría del dispositivo</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Native Biometric Verification Modal */}
      {currentUser && (
        <BiometricPromptModal
          isOpen={showBiometricModal}
          mode="authenticate"
          userName={currentUser.firstName}
          onSuccess={() => {
            setShowBiometricModal(false);
            onLoginSuccess(currentUser);
          }}
          onCancel={() => setShowBiometricModal(false)}
        />
      )}
    </div>
  );
};

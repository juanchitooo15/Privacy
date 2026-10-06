import React, { useState } from 'react';
import { UserProfile, ProrrogaDuration } from '../types/privacy';
import { ShieldAlert, Clock, KeyRound, Check, X, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface Props {
  user: UserProfile;
  visitorName: string;
  isOpen: boolean;
  onReject: () => void;
  onConfirmAccept: (duration: ProrrogaDuration) => void;
}

export const ScanRequestDialog: React.FC<Props> = ({
  user,
  visitorName,
  isOpen,
  onReject,
  onConfirmAccept,
}) => {
  const [step, setStep] = useState<'decision' | 'prorroga_and_password'>('decision');
  const [selectedDuration, setSelectedDuration] = useState<ProrrogaDuration>(10);
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  if (!isOpen) return null;

  const durationOptions: { label: string; value: ProrrogaDuration }[] = [
    { label: '5 minutos', value: 5 },
    { label: '10 minutos', value: 10 },
    { label: '20 minutos', value: 20 },
    { label: '30 minutos', value: 30 },
    { label: '24 horas', value: 1440 },
    { label: 'Sin límites', value: -1 },
  ];

  const handleAcceptClick = () => {
    setStep('prorroga_and_password');
    setPasswordError('');
  };

  const handleFinalConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Mandatory Security Validation: Must enter secret key; cannot be bypassed by biometrics
    if (!inputPassword) {
      setPasswordError('Debes ingresar tu clave secreta para confirmar.');
      return;
    }

    if (inputPassword !== user.secretKey) {
      setPasswordError('Clave secreta incorrecta. La autorización no fue concedida.');
      return;
    }

    onConfirmAccept(selectedDuration);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#160E12] border border-white/20 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 text-slate-100 animate-fade-in font-poppins">
        {step === 'decision' ? (
          <>
            {/* Step 1: Decision Alert */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-3 rounded-full bg-[#5A1827] text-[#B4E197] border border-[#B4E197]/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B4E197] font-medium">
                  Solicitud de Acceso por QR
                </span>
                <h3 className="text-base font-semibold text-white">
                  Alguien desea ingresar a tu perfil
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1F1318] border border-white/10 space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                El dispositivo de <strong className="text-white">"{visitorName}"</strong> ha escaneado tu código QR y está a la espera de tu autorización.
              </p>
              <p className="text-[11px] text-slate-400">
                Tu nombre de usuario de acceso nunca le será revelado. Solo podrá ver tu contenido si apruebas con tu clave secreta.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onReject}
                className="py-3 px-4 rounded-xl border border-red-800/80 bg-red-950/40 hover:bg-red-900/60 text-red-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Rechazar</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptClick}
                className="py-3 px-4 rounded-xl bg-[#B4E197] text-[#5A1827] hover:bg-[#a1d682] text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#B4E197]/15"
              >
                <Check className="w-4 h-4" />
                <span>Aceptar</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleFinalConfirm} className="space-y-5">
            {/* Step 2: Prórroga & Mandatory Password Validation */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B4E197] font-medium">
                  Tiempo de Prórroga
                </span>
                <h3 className="text-base font-semibold text-white">
                  Definir límite de visualización
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('decision')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Atrás
              </button>
            </div>

            {/* Time selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B4E197]" />
                <span>Selecciona el tiempo límite de visualización:</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedDuration(opt.value)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedDuration === opt.value
                        ? 'bg-[#B4E197] text-[#5A1827] border-[#B4E197] font-semibold'
                        : 'bg-[#191014] text-slate-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandatory Security Validation Box */}
            <div className="p-4 rounded-xl bg-[#5A1827]/40 border border-[#5A1827] space-y-3">
              <div className="flex items-start gap-2 text-xs text-[#B4E197]">
                <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Validación de Seguridad Obligatoria</span>
                  <span className="text-[11px] text-slate-300 font-light leading-relaxed">
                    Para confirmar y aplicar este tiempo límite, ingresa obligatoriamente tu clave secreta. Este paso no puede omitirse mediante desbloqueos biométricos.
                  </span>
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={inputPassword}
                    onChange={(e) => {
                      setInputPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Escribe tu clave secreta..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#120B0E] border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={onReject}
                className="py-2.5 px-4 rounded-xl border border-white/15 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                Cancelar y Rechazar
              </button>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-[#B4E197] text-[#5A1827] hover:bg-[#a1d682] text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Autorizar</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

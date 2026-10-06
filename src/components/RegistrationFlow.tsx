import React, { useState } from 'react';
import { UserProfile, COLOR_PALETTE } from '../types/privacy';
import { calculateAge, getZodiacInfo, getElementColor } from '../utils/astrology';
import { AVATAR_PRESETS } from '../utils/storage';
import { Check, X, ArrowLeft, ArrowRight, Upload, Sparkles, Eye, EyeOff } from 'lucide-react';

interface Props {
  onCancel: () => void;
  onFinish: (user: UserProfile) => void;
}

export const RegistrationFlow: React.FC<Props> = ({ onCancel, onFinish }) => {
  const [step, setStep] = useState<number>(1);

  // Form states
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState<string>(AVATAR_PRESETS[0].url);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState(false);
  const [birthDate, setBirthDate] = useState('2000-01-15');
  const [description, setDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#5A1827'); // Default wine red
  const [textColor, setTextColor] = useState('#B4E197'); // Default pastel green
  const [secretKey, setSecretKey] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1 Username validation rules
  const startsWithCapital = /^[A-Z]/.test(username);
  const hasNumber = /\d/.test(username);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(username);
  const validLength = username.length > 0 && username.length <= 20;
  const isUsernameValid = startsWithCapital && hasNumber && hasSpecialChar && validLength;

  // Step 4 Astrology live calculations
  const calculatedAge = calculateAge(birthDate);
  const zodiac = getZodiacInfo(birthDate);

  // Handle avatar upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          setCustomAvatarUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    setErrorMsg('');

    if (step === 1) {
      if (!isUsernameValid) {
        setErrorMsg('El nombre de usuario debe cumplir con todos los requisitos de seguridad.');
        return;
      }
    } else if (step === 2) {
      if (!firstName.trim() || !lastName.trim()) {
        setErrorMsg('Por favor ingresa tu primer nombre y primer apellido.');
        return;
      }
    } else if (step === 3) {
      if (!avatar) {
        setErrorMsg('Selecciona una imagen para tu perfil.');
        return;
      }
    } else if (step === 4) {
      if (!birthDate) {
        setErrorMsg('Por favor ingresa tu fecha de nacimiento.');
        return;
      }
    } else if (step === 5) {
      if (description.length > 500) {
        setErrorMsg('La descripción no puede exceder los 500 caracteres.');
        return;
      }
    } else if (step === 6) {
      if (!backgroundColor || !textColor) {
        setErrorMsg('Selecciona un color de fondo y de texto.');
        return;
      }
    } else if (step === 7) {
      if (!secretKey.trim()) {
        setErrorMsg('Por favor establece tu clave secreta.');
        return;
      }
      if (secretKey.length > 20) {
        setErrorMsg('La clave secreta no debe superar los 20 caracteres.');
        return;
      }

      // Complete profile creation
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar,
        birthDate,
        age: calculatedAge,
        zodiacSign: zodiac.sign,
        zodiacElement: zodiac.element,
        description: description.trim() || 'Sin descripción personal.',
        backgroundColor,
        textColor,
        secretKey: secretKey.trim(),
        biometricEnabled: false,
        autoLockOnBlur: true,
        createdAt: Date.now(),
      };

      onFinish(newUser);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step === 1) {
      onCancel();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0b0d] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#B4E197] transition-colors font-poppins"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? 'Cancelar' : 'Anterior'}</span>
        </button>

        <div className="text-center">
          <span className="font-lettering text-2xl text-[#B4E197]">Privacy</span>
          <div className="text-xs text-slate-500 font-poppins">
            Paso {step} de 7
          </div>
        </div>

        <div className="w-16 flex justify-end">
          <span className="text-xs font-mono text-[#B4E197]/80">
            {Math.round((step / 7) * 100)}%
          </span>
        </div>
      </header>

      {/* Main Form Content Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        {/* Step 1: Nombre de usuario */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono text-[#B4E197] tracking-wider uppercase">Paso 1</span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-semibold text-white">
                Crear nombre de usuario
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Este identificador es exclusivo para tu inicio de sesión y nunca será visible para otros.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 font-poppins">
                  Nombre de usuario de acceso
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. Valeria_7@"
                  className="w-full px-4 py-3 bg-[#1A1215] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] transition-colors font-poppins"
                  autoFocus
                />
              </div>

              {/* Requirement Checklist */}
              <div className="p-4 bg-[#140D10] border border-white/10 rounded-xl space-y-2.5">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-poppins">
                  Reglas obligatorias:
                </p>

                <div className="flex items-center gap-2 text-xs">
                  {startsWithCapital ? (
                    <Check className="w-4 h-4 text-[#B4E197]" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                  <span className={startsWithCapital ? 'text-[#B4E197]' : 'text-slate-400'}>
                    Empezar con letra mayúscula (A-Z)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {hasNumber ? (
                    <Check className="w-4 h-4 text-[#B4E197]" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                  <span className={hasNumber ? 'text-[#B4E197]' : 'text-slate-400'}>
                    Incluir al menos un número (0-9)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {hasSpecialChar ? (
                    <Check className="w-4 h-4 text-[#B4E197]" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                  <span className={hasSpecialChar ? 'text-[#B4E197]' : 'text-slate-400'}>
                    Incluir al menos un carácter especial (!@#$%^&*...)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {validLength ? (
                    <Check className="w-4 h-4 text-[#B4E197]" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                  <span className={validLength ? 'text-[#B4E197]' : 'text-slate-400'}>
                    No superar los 20 caracteres ({username.length}/20)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: ¿Cómo te llamas? */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono text-[#B4E197] tracking-wider uppercase">Paso 2</span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-semibold text-white">
                ¿Cómo te llamas?
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Este nombre será el único visible en tu perfil privado para las personas que tú autorices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 font-poppins">
                  Primer Nombre
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ej. Valeria"
                  className="w-full px-4 py-3 bg-[#1A1215] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] transition-colors font-poppins"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 font-poppins">
                  Primer Apellido
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ej. Montenegro"
                  className="w-full px-4 py-3 bg-[#1A1215] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] transition-colors font-poppins"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#5A1827]/30 border border-[#5A1827] text-xs text-[#B4E197]/90 font-poppins">
              Nota: Tu nombre de usuario creado en el paso anterior permanecerá estrictamente oculto. Solo se expondrá tu primer nombre y primer apellido.
            </div>
          </div>
        )}

        {/* Step 3: Identifícate visualmente */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono text-[#B4E197] tracking-wider uppercase">Paso 3</span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-semibold text-white">
                Identifícate visualmente
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Sube o elige una imagen para tu perfil, la cual se adaptará con un formato circular exclusivo.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              {/* Circular profile preview */}
              <div className="relative group">
                <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-[#B4E197] shadow-xl bg-black/40 flex items-center justify-center">
                  <img
                    src={avatar}
                    alt="Perfil seleccionado"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#5A1827] text-[#B4E197] border border-[#B4E197] shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  title="Subir imagen propia"
                >
                  <Upload className="w-4 h-4" />
                </label>
              </div>

              {/* Native file upload input */}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <label
                htmlFor="avatar-upload"
                className="text-xs text-[#B4E197] hover:underline cursor-pointer flex items-center gap-1.5 font-poppins pt-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{customAvatarUploaded ? 'Cambiar imagen subida' : 'Subir foto desde tu dispositivo'}</span>
              </label>
            </div>

            {/* Presets selection */}
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-poppins text-center">
                O elige una de nuestras siluetas de arte minimalista:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setAvatar(preset.url);
                      setCustomAvatarUploaded(false);
                    }}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                      avatar === preset.url && !customAvatarUploaded
                        ? 'border-[#B4E197] bg-[#B4E197]/10'
                        : 'border-white/10 hover:border-white/30 bg-[#160F12]'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden mb-2 border border-white/20">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[11px] text-slate-300 font-poppins text-center">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: ¿Cuál es tu cumpleaños? */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono text-[#B4E197] tracking-wider uppercase">Paso 4</span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-semibold text-white">
                ¿Cuál es tu cumpleaños?
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Calcularemos automáticamente tu edad exacta, signo zodiacal y su elemento regente.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 font-poppins">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                value={birthDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1215] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#B4E197] transition-colors font-poppins"
              />
            </div>

            {/* Live Astrology / Age Result Card */}
            <div className="p-5 rounded-2xl bg-[#160F13] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs text-slate-400 font-poppins">Edad calculada</span>
                <span className="text-lg font-semibold text-white font-poppins tabular-nums">
                  {calculatedAge} {calculatedAge === 1 ? 'año' : 'años'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs text-slate-400 font-poppins">Signo zodiacal</span>
                <div className="flex items-center gap-2">
                  <span className="text-base text-[#B4E197] font-semibold">{zodiac.symbol}</span>
                  <span className="text-base font-medium text-white font-poppins">{zodiac.sign}</span>
                  <span className="text-xs text-slate-500 font-poppins">({zodiac.period})</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-poppins">Elemento esencial</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getElementColor(zodiac.element) }}
                  />
                  <span
                    className="text-sm font-semibold font-poppins"
                    style={{ color: getElementColor(zodiac.element) }}
                  >
                    {zodiac.element}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Descripción personal */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono text-[#B4E197] tracking-wider uppercase">Paso 5</span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-semibold text-white">
                Descripción personal
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Un espacio libre para escribir un texto breve y sincero sobre ti (máximo 500 caracteres).
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                rows={5}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Escribe lo que desees expresar sobre tu mundo íntimo, pensamientos o intereses..."
                className="w-full px-4 py-3 bg-[#1A1215] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] transition-colors font-poppins resize-none leading-relaxed"
                autoFocus
              />

              <div className="flex items-center justify-between text-xs text-slate-400 font-poppins">
                <span>Estilo reflexivo y libre</span>
                <span className={`tabular-nums font-mono ${description.length >= 480 ? 'text-amber-400' : ''}`}>
                  {description.length} / 500 caracteres
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Paleta de colores */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono text-[#B4E197] tracking-wider uppercase">Paso 6</span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-semibold text-white">
                Paleta de colores
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Selecciona independientemente el color de fondo y el color de texto que regirán toda la interfaz de tu perfil.
              </p>
            </div>

            {/* Live Preview Card */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 font-poppins">
                Vista previa en tiempo real de tu perfil
              </label>
              <div
                className="p-5 rounded-2xl border transition-all duration-300 shadow-xl"
                style={{
                  backgroundColor,
                  color: textColor,
                  borderColor: textColor + '40',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-lettering text-2xl tracking-wide">Privacy</span>
                  <span className="text-xs uppercase tracking-widest opacity-75">Perfil Exclusivo</span>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden border-2"
                    style={{ borderColor: textColor }}
                  >
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-lg leading-tight">
                      {firstName || 'Nombre'} {lastName || 'Apellido'}
                    </h4>
                    <p className="text-xs opacity-80 font-poppins">
                      {zodiac.sign} · Elemento {zodiac.element}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs opacity-90 line-clamp-2 font-poppins italic">
                  "{description || 'Tu descripción personal personalizada se verá con este contraste.'}"
                </p>
              </div>
            </div>

            {/* Color Selectors */}
            <div className="space-y-5">
              {/* Background Color Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-poppins">
                    1. Color de fondo del perfil
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    {COLOR_PALETTE.find((c) => c.hex.toLowerCase() === backgroundColor.toLowerCase())?.name || backgroundColor}
                  </span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                  {COLOR_PALETTE.map((col) => {
                    const isSelected = backgroundColor.toLowerCase() === col.hex.toLowerCase();
                    return (
                      <button
                        key={`bg-${col.id}`}
                        type="button"
                        onClick={() => setBackgroundColor(col.hex)}
                        title={col.name}
                        className={`h-9 rounded-lg transition-transform relative flex items-center justify-center border ${
                          isSelected ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-black z-10' : 'hover:scale-105 border-white/10'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${col.contrastWhite ? 'text-white' : 'text-black'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Color Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-poppins">
                    2. Color del texto del perfil
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    {COLOR_PALETTE.find((c) => c.hex.toLowerCase() === textColor.toLowerCase())?.name || textColor}
                  </span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                  {COLOR_PALETTE.map((col) => {
                    const isSelected = textColor.toLowerCase() === col.hex.toLowerCase();
                    return (
                      <button
                        key={`txt-${col.id}`}
                        type="button"
                        onClick={() => setTextColor(col.hex)}
                        title={col.name}
                        className={`h-9 rounded-lg transition-transform relative flex items-center justify-center border ${
                          isSelected ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-black z-10' : 'hover:scale-105 border-white/10'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${col.contrastWhite ? 'text-white' : 'text-black'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Tu clave secreta */}
        {step === 7 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono text-[#B4E197] tracking-wider uppercase">Paso 7</span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-semibold text-white">
                Tu clave secreta
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Establece la contraseña de seguridad para acceder y confirmar la autorización de visitas por código QR (máximo 20 caracteres).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 font-poppins">
                  Clave secreta maestra
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    maxLength={20}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Escribe tu clave..."
                    className="w-full pl-4 pr-12 py-3 bg-[#1A1215] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] transition-colors font-poppins"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end text-xs text-slate-500 mt-1.5 font-mono">
                  {secretKey.length} / 20 caracteres
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#5A1827]/30 border border-[#5A1827] text-xs text-[#B4E197] space-y-1.5 font-poppins">
                <p className="font-semibold">Importancia de seguridad:</p>
                <p className="opacity-90">
                  Esta clave te será solicitada de manera obligatoria cuando alguien escanee tu QR y desees aprobar su solicitud con un tiempo de prórroga. Este paso no puede saltarse con datos biométricos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message banner */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs font-poppins flex items-center gap-2">
            <X className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
      </main>

      {/* Bottom Action Footer */}
      <footer className="max-w-xl w-full mx-auto pt-6 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-medium text-slate-300 hover:text-white hover:border-white/40 transition-colors font-poppins"
        >
          {step === 1 ? 'Cancelar' : 'Atrás'}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-[#B4E197] text-[#5A1827] font-semibold text-xs hover:bg-[#a0d680] active:scale-[0.98] transition-all flex items-center gap-2 font-poppins shadow-lg shadow-[#B4E197]/15"
        >
          <span>{step === 7 ? 'Completar Registro' : 'Continuar'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </footer>
    </div>
  );
};

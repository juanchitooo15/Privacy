import React, { useState } from 'react';
import { UserProfile, COLOR_PALETTE } from '../types/privacy';
import { calculateAge, getZodiacInfo, getElementColor } from '../utils/astrology';
import { AVATAR_PRESETS } from '../utils/storage';
import { BiometricPromptModal } from './BiometricPromptModal';
import {
  UserPen,
  Shield,
  PhoneCall,
  Mail,
  Trash2,
  X,
  Fingerprint,
  Lock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface Props {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onDeleteAccount: () => void;
  onTriggerManualLock: () => void;
}

type MenuOption = 'opcion_a' | 'opcion_b' | 'opcion_c' | 'opcion_d';

export const OptionsMenuModal: React.FC<Props> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  onDeleteAccount,
  onTriggerManualLock,
}) => {
  const [activeTab, setActiveTab] = useState<MenuOption>('opcion_a');

  // Edit Profile draft states (Opción A)
  const [draftUsername, setDraftUsername] = useState(user.username);
  const [draftFirstName, setDraftFirstName] = useState(user.firstName);
  const [draftLastName, setDraftLastName] = useState(user.lastName);
  const [draftAvatar, setDraftAvatar] = useState(user.avatar);
  const [draftBirthDate, setDraftBirthDate] = useState(user.birthDate);
  const [draftDescription, setDraftDescription] = useState(user.description);
  const [draftBackgroundColor, setDraftBackgroundColor] = useState(user.backgroundColor);
  const [draftTextColor, setDraftTextColor] = useState(user.textColor);
  const [draftNewPassword, setDraftNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Security confirmation required to evolve profile:
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  // Support form state (Opción C - juanandresalmarza.gonzalez@gmail.com)
  const SUPPORT_EMAIL = 'juanandresalmarza.gonzalez@gmail.com';
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Biometric registration modal
  const [showBiometricRegisterModal, setShowBiometricRegisterModal] = useState(false);

  // Delete account confirmation (Opción D)
  const [deleteConfirmationWord, setDeleteConfirmationWord] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Sync draft states when modal opens with fresh user data
  React.useEffect(() => {
    if (isOpen) {
      setDraftUsername(user.username);
      setDraftFirstName(user.firstName);
      setDraftLastName(user.lastName);
      setDraftAvatar(user.avatar);
      setDraftBirthDate(user.birthDate);
      setDraftDescription(user.description);
      setDraftBackgroundColor(user.backgroundColor);
      setDraftTextColor(user.textColor);
      setDraftNewPassword('');
      setOldPasswordInput('');
      setEditError('');
      setEditSuccess(false);
      setDeleteConfirmationWord('');
      setDeleteError('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Real-time calculations for draft astrology
  const draftAge = calculateAge(draftBirthDate);
  const draftZodiac = getZodiacInfo(draftBirthDate);

  // Username validation rules for draft
  const startsWithCapital = /^[A-Z]/.test(draftUsername);
  const hasNumber = /\d/.test(draftUsername);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(draftUsername);
  const validLength = draftUsername.length > 0 && draftUsername.length <= 20;
  const isDraftUsernameValid = startsWithCapital && hasNumber && hasSpecialChar && validLength;

  // Handle avatar upload in edit mode
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDraftAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile evolution: Must confirm with old secret key!
  const handleEvolveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    // 1. Validate fields
    if (!isDraftUsernameValid) {
      setEditError('El nombre de usuario debe cumplir las reglas (Mayúscula inicial, número, símbolo y máx. 20 caracteres).');
      return;
    }

    if (!draftFirstName.trim() || !draftLastName.trim()) {
      setEditError('El primer nombre y primer apellido no pueden quedar vacíos.');
      return;
    }

    if (!draftBirthDate) {
      setEditError('Debes seleccionar una fecha de nacimiento válida.');
      return;
    }

    if (draftDescription.length > 500) {
      setEditError('La descripción no puede superar los 500 caracteres.');
      return;
    }

    if (draftNewPassword && draftNewPassword.length > 20) {
      setEditError('La nueva clave no puede exceder los 20 caracteres.');
      return;
    }

    // 2. Mandatory Security Validation: Must enter OLD secret key
    if (!oldPasswordInput.trim()) {
      setEditError('Debes ingresar tu clave antigua actual para confirmar y evolucionar tu perfil.');
      return;
    }

    if (oldPasswordInput.trim() !== user.secretKey) {
      setEditError('Clave antigua incorrecta. Verificación de seguridad denegada.');
      return;
    }

    // 3. Construct updated profile
    const updated: UserProfile = {
      ...user,
      username: draftUsername.trim(),
      firstName: draftFirstName.trim(),
      lastName: draftLastName.trim(),
      avatar: draftAvatar,
      birthDate: draftBirthDate,
      age: draftAge,
      zodiacSign: draftZodiac.sign,
      zodiacElement: draftZodiac.element,
      description: draftDescription.trim(),
      backgroundColor: draftBackgroundColor,
      textColor: draftTextColor,
      secretKey: draftNewPassword.trim() ? draftNewPassword.trim() : user.secretKey,
    };

    onUpdateUser(updated);
    setEditSuccess(true);
    setOldPasswordInput('');
    setDraftNewPassword('');

    setTimeout(() => {
      setEditSuccess(false);
      onClose();
    }, 1500);
  };

  const handleToggleBiometric = () => {
    if (!user.biometricEnabled) {
      setShowBiometricRegisterModal(true);
    } else {
      onUpdateUser({ ...user, biometricEnabled: false });
    }
  };

  const handleSendSupportEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      supportSubject || 'Soporte y Asistencia - Privacy'
    )}&body=${encodeURIComponent(
      `Usuario: ${user.firstName} ${user.lastName} (${user.username})\n\nMensaje:\n${supportMessage}`
    )}`;

    window.location.href = mailtoLink;
    setSupportSent(true);
    setTimeout(() => {
      setSupportSent(false);
      setSupportMessage('');
      setSupportSubject('');
    }, 4000);
  };

  const handleCopySupportEmail = () => {
    navigator.clipboard?.writeText(SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationWord !== 'ELIMINAR') {
      setDeleteError('Escribe la palabra exacta "ELIMINAR" para proceder.');
      return;
    }
    onDeleteAccount();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-[#140D10] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-fade-in max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#1A1115]">
          <div className="flex items-center gap-2">
            <span className="font-lettering text-2xl sm:text-3xl text-[#B4E197]">Privacy</span>
            <span className="text-xs text-slate-400 font-poppins">· Menú de Opciones</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Las Cuatro Opciones Principales (A, B, C, D) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-white/10 bg-[#170E12] text-xs font-poppins">
          {/* Opción A: Editar tu perfil */}
          <button
            type="button"
            onClick={() => setActiveTab('opcion_a')}
            className={`py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'opcion_a'
                ? 'border-[#B4E197] text-[#B4E197] bg-white/5 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPen className="w-4 h-4 shrink-0" />
            <span className="text-center truncate">Opción A: Editar perfil</span>
          </button>

          {/* Opción B: Seguridad */}
          <button
            type="button"
            onClick={() => setActiveTab('opcion_b')}
            className={`py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'opcion_b'
                ? 'border-[#B4E197] text-[#B4E197] bg-white/5 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span className="text-center truncate">Opción B: Seguridad</span>
          </button>

          {/* Opción C: Llamada al soporte */}
          <button
            type="button"
            onClick={() => setActiveTab('opcion_c')}
            className={`py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'opcion_c'
                ? 'border-[#B4E197] text-[#B4E197] bg-white/5 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span className="text-center truncate">Opción C: Soporte</span>
          </button>

          {/* Opción D: Eliminar perfil */}
          <button
            type="button"
            onClick={() => setActiveTab('opcion_d')}
            className={`py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'opcion_d'
                ? 'border-red-400 text-red-400 bg-white/5 font-semibold'
                : 'border-transparent text-slate-400 hover:text-red-300'
            }`}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span className="text-center truncate">Opción D: Eliminar</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-poppins space-y-6">
          {/* ================================================================ */}
          {/* OPCIÓN A: EDITAR TU PERFIL */}
          {/* ================================================================ */}
          {activeTab === 'opcion_a' && (
            <form onSubmit={handleEvolveProfile} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-[#B4E197] uppercase tracking-wider block">
                    Opción A
                  </span>
                  <h4 className="text-base sm:text-lg font-semibold text-white">
                    Editar tu perfil
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Modifica tu nombre de usuario, nombre y apellido, cumpleaños, foto, colores, descripción y clave.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#5A1827] text-[#B4E197] border border-[#B4E197]/30 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {editSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>¡Perfil evolucionado con éxito! Todos los cambios se han actualizado.</span>
                </div>
              )}

              {/* 1. Fotografía de Perfil (Circular) */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 space-y-4">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  1. Imagen de Perfil (Formato Circular)
                </label>

                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#B4E197] shadow-lg shrink-0 bg-black">
                    <img
                      src={draftAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="edit-avatar-file"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#5A1827] text-[#B4E197] text-xs font-medium cursor-pointer hover:bg-[#6e1e30] transition-colors border border-[#B4E197]/30"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir nueva foto de galería</span>
                    </label>
                    <input
                      id="edit-avatar-file"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <p className="text-[11px] text-slate-400">
                      O selecciona una silueta artística predeterminada abajo:
                    </p>
                  </div>
                </div>

                {/* Avatar presets */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setDraftAvatar(preset.url)}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                        draftAvatar === preset.url
                          ? 'border-[#B4E197] bg-[#B4E197]/10'
                          : 'border-white/10 hover:border-white/20 bg-black/20'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-slate-300 truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Nombre de Usuario (Con Reglas de Seguridad) */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    2. Nombre de Usuario (Acceso Privado)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {draftUsername.length}/20
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={20}
                  value={draftUsername}
                  onChange={(e) => setDraftUsername(e.target.value)}
                  placeholder="Ej. Valeria_7@"
                  className="w-full px-3.5 py-2.5 bg-[#120B0E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197]"
                />

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    {startsWithCapital ? (
                      <Check className="w-3.5 h-3.5 text-[#B4E197]" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span>Mayúscula inicial (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasNumber ? (
                      <Check className="w-3.5 h-3.5 text-[#B4E197]" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span>Al menos un número (0-9)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasSpecialChar ? (
                      <Check className="w-3.5 h-3.5 text-[#B4E197]" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span>Carácter especial (!@#...)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {validLength ? (
                      <Check className="w-3.5 h-3.5 text-[#B4E197]" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span>Máx 20 caracteres</span>
                  </div>
                </div>
              </div>

              {/* 3. Nombre y Apellido */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 space-y-3">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  3. ¿Cómo te llamas? (Visible en Perfil)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Primer Nombre</label>
                    <input
                      type="text"
                      value={draftFirstName}
                      onChange={(e) => setDraftFirstName(e.target.value)}
                      placeholder="Primer nombre"
                      className="w-full px-3.5 py-2.5 bg-[#120B0E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Primer Apellido</label>
                    <input
                      type="text"
                      value={draftLastName}
                      onChange={(e) => setDraftLastName(e.target.value)}
                      placeholder="Primer apellido"
                      className="w-full px-3.5 py-2.5 bg-[#120B0E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Fecha de Cumpleaños & Astrología */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 space-y-3">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  4. Fecha de Cumpleaños (Cálculo Automático)
                </label>
                <input
                  type="date"
                  value={draftBirthDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDraftBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#120B0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#B4E197]"
                />

                <div className="flex items-center justify-between text-xs bg-black/30 p-2.5 rounded-lg text-slate-300">
                  <span>Edad: <strong className="text-white">{draftAge} años</strong></span>
                  <span>Signo: <strong className="text-[#B4E197]">{draftZodiac.sign} ({draftZodiac.symbol})</strong></span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getElementColor(draftZodiac.element) }}
                    />
                    <span style={{ color: getElementColor(draftZodiac.element) }} className="font-semibold">
                      {draftZodiac.element}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Descripción Personal */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    5. Descripción Personal
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {draftDescription.length} / 500
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  placeholder="Tu descripción personal..."
                  className="w-full px-3.5 py-2.5 bg-[#120B0E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] resize-none leading-relaxed"
                />
              </div>

              {/* 6. Paleta de Colores */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 space-y-4">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  6. Paleta de Colores del Perfil
                </label>

                {/* Live mini preview */}
                <div
                  className="p-3.5 rounded-xl border transition-all shadow-md"
                  style={{
                    backgroundColor: draftBackgroundColor,
                    color: draftTextColor,
                    borderColor: draftTextColor + '40',
                  }}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-lettering text-xl">Privacy</span>
                    <span className="text-[10px] uppercase opacity-75">Vista Previa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={draftAvatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border"
                      style={{ borderColor: draftTextColor }}
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-semibold text-xs leading-tight">
                        {draftFirstName || 'Nombre'} {draftLastName || 'Apellido'}
                      </div>
                      <div className="text-[10px] opacity-80">
                        {draftZodiac.sign} · {draftZodiac.element}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color pickers */}
                <div className="space-y-3">
                  <div>
                    <span className="block text-[11px] text-slate-300 mb-1.5 font-medium">
                      Color de Fondo:
                    </span>
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                      {COLOR_PALETTE.map((col) => {
                        const isSelected = draftBackgroundColor.toLowerCase() === col.hex.toLowerCase();
                        return (
                          <button
                            key={`draft-bg-${col.id}`}
                            type="button"
                            onClick={() => setDraftBackgroundColor(col.hex)}
                            title={col.name}
                            className={`h-7 rounded-md transition-transform relative flex items-center justify-center border ${
                              isSelected ? 'scale-110 ring-2 ring-white z-10' : 'hover:scale-105 border-white/10'
                            }`}
                            style={{ backgroundColor: col.hex }}
                          >
                            {isSelected && (
                              <Check className={`w-3 h-3 ${col.contrastWhite ? 'text-white' : 'text-black'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] text-slate-300 mb-1.5 font-medium">
                      Color de Texto:
                    </span>
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                      {COLOR_PALETTE.map((col) => {
                        const isSelected = draftTextColor.toLowerCase() === col.hex.toLowerCase();
                        return (
                          <button
                            key={`draft-txt-${col.id}`}
                            type="button"
                            onClick={() => setDraftTextColor(col.hex)}
                            title={col.name}
                            className={`h-7 rounded-md transition-transform relative flex items-center justify-center border ${
                              isSelected ? 'scale-110 ring-2 ring-white z-10' : 'hover:scale-105 border-white/10'
                            }`}
                            style={{ backgroundColor: col.hex }}
                          >
                            {isSelected && (
                              <Check className={`w-3 h-3 ${col.contrastWhite ? 'text-white' : 'text-black'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Nueva Clave Secreta (Opcional) */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 space-y-2">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  7. Nueva Clave Secreta (Opcional)
                </label>
                <p className="text-[11px] text-slate-400 font-light">
                  Déjalo en blanco si prefieres mantener tu clave actual.
                </p>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    maxLength={20}
                    value={draftNewPassword}
                    onChange={(e) => setDraftNewPassword(e.target.value)}
                    placeholder="Escribe la nueva clave..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#120B0E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* VALIDACIÓN DE SEGURIDAD OBLIGATORIA: ANTIGUA CLAVE SECRETA */}
              <div className="p-4 rounded-xl bg-[#5A1827]/40 border-2 border-[#5A1827] space-y-3">
                <div className="flex items-start gap-2.5">
                  <KeyRound className="w-5 h-5 text-[#B4E197] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Validación de Seguridad Obligatoria para Evolucionar
                    </h5>
                    <p className="text-[11px] text-slate-300 font-light leading-relaxed mt-0.5">
                      Para evolucionar tu perfil y guardar estos cambios, debes colocar tu <strong>antigua clave secreta actual</strong>.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPasswordInput}
                    onChange={(e) => {
                      setOldPasswordInput(e.target.value);
                      setEditError('');
                    }}
                    placeholder="Coloca tu antigua clave para confirmar..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#120B0E] border border-[#B4E197]/40 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {editError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-xs text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B4E197] text-[#5A1827] font-bold text-xs hover:bg-[#a1d682] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-[#B4E197]/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Evolucionar Perfil</span>
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* OPCIÓN B: SEGURIDAD */}
          {/* ================================================================ */}
          {activeTab === 'opcion_b' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3">
                <span className="text-[11px] font-mono text-[#B4E197] uppercase tracking-wider block">
                  Opción B
                </span>
                <h4 className="text-base sm:text-lg font-semibold text-white">
                  Seguridad del Perfil
                </h4>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Activa o desactiva la seguridad para poder desbloquear tu perfil con o sin clave, o mediante la seguridad de tu dispositivo (Face ID, huella o PIN).
                </p>
              </div>

              {/* Toggle 1: Desbloqueo Biométrico / Seguridad del Dispositivo */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-lg bg-[#5A1827] text-[#B4E197] shrink-0 border border-[#B4E197]/30">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">
                      Desbloqueo Biométrico / Seguridad del Dispositivo
                    </h5>
                    <p className="text-[11px] text-slate-300 font-light mt-1 leading-relaxed">
                      {user.biometricEnabled
                        ? 'Activado: Tu perfil se encuentra vinculado a los sensores biométricos de tu dispositivo (Face ID, huella dactilar o PIN del sistema). Al ingresar o desbloquear, se activará la verificación del dispositivo (cámara frontal para reconocimiento facial o sensor) y accederás de forma fluida sin escribir datos manualmente.'
                        : 'Desactivado (Por defecto): Deberás escribir obligatoriamente tu nombre de usuario y tu clave secreta para acceder a tu perfil.'}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-[#B4E197]">
                      Estado: {user.biometricEnabled ? 'Biometría Activa' : 'Desactivado (Solo Clave)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleBiometric}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                    user.biometricEnabled ? 'bg-[#B4E197]' : 'bg-slate-700'
                  }`}
                  title="Activar o desactivar desbloqueo biométrico"
                >
                  <div
                    className={`bg-[#5A1827] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      user.biometricEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Bloqueo por salida: Automático y permanente de por vida (sin opción a desactivar) */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-white/10 flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#5A1827] text-[#B4E197] shrink-0 border border-[#B4E197]/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-semibold text-white">
                      Bloqueo Instantáneo por Salida o Inactividad
                    </h5>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B4E197]/20 text-[#B4E197] border border-[#B4E197]/30">
                      Permanente de por vida
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                    Esta función de seguridad es automática y permanente. Al salir de la aplicación, minimizarla o cambiar entre pestañas o aplicaciones, el dispositivo se bloquea al instante sin posibilidad de desactivación para salvaguardar tu perfil.
                  </p>
                </div>
              </div>

              {/* Botón de Prueba de Bloqueo Inmediato */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerManualLock();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#5A1827] hover:bg-[#6e1e30] border border-[#B4E197]/40 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#B4E197]" />
                  <span>Bloquear Perfil Ahora (Probar pantalla de seguridad)</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* OPCIÓN C: LLAMADA AL SOPORTE */}
          {/* ================================================================ */}
          {activeTab === 'opcion_c' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3">
                <span className="text-[11px] font-mono text-[#B4E197] uppercase tracking-wider block">
                  Opción C
                </span>
                <h4 className="text-base sm:text-lg font-semibold text-white">
                  Llamada al soporte
                </h4>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Canal directo de comunicación para enviar consultas, reportes técnicos o sugerencias a nuestro correo oficial.
                </p>
              </div>

              {/* Recipient Email Callout */}
              <div className="p-4 rounded-xl bg-[#1C1217] border border-[#B4E197]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Destinatario Oficial de Soporte:
                  </span>
                  <div className="font-mono text-xs sm:text-sm text-[#B4E197] font-semibold break-all">
                    {SUPPORT_EMAIL}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySupportEmail}
                    className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#B4E197]" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar correo</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="py-1.5 px-3 rounded-lg bg-[#5A1827] hover:bg-[#6f1e31] border border-[#B4E197]/40 text-[11px] text-white flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#B4E197]" />
                    <span>Abrir en Gmail / Mail</span>
                  </a>
                </div>
              </div>

              {supportSent ? (
                <div className="p-5 rounded-xl bg-[#1B5E20]/40 border border-[#B4E197]/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#B4E197] mx-auto" />
                  <p className="text-xs text-white font-medium">¡Solicitud de soporte preparada!</p>
                  <p className="text-[11px] text-slate-300">
                    Se ha abierto tu aplicación de correo para enviar tu mensaje a <strong>{SUPPORT_EMAIL}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendSupportEmail} className="space-y-4 p-4 rounded-xl bg-[#1C1217] border border-white/10">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Asunto de la solicitud
                    </label>
                    <input
                      type="text"
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="Ej. Consulta sobre mi privacidad o autorización QR"
                      className="w-full px-3.5 py-2.5 bg-[#120B0E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mensaje / Comentario / Detalle técnico
                    </label>
                    <textarea
                      rows={4}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Escribe aquí tu consulta para el soporte técnico..."
                      className="w-full px-3.5 py-2.5 bg-[#120B0E] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#B4E197] text-[#5A1827] font-semibold text-xs hover:bg-[#a0d680] transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Correo a {SUPPORT_EMAIL}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* OPCIÓN D: ELIMINAR PERFIL */}
          {/* ================================================================ */}
          {activeTab === 'opcion_d' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3">
                <span className="text-[11px] font-mono text-red-400 uppercase tracking-wider block">
                  Opción D
                </span>
                <h4 className="text-base sm:text-lg font-semibold text-white">
                  Eliminar perfil
                </h4>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Da de baja tu cuenta y elimina de forma definitiva todos tus datos de este dispositivo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Acción Definitiva e Irreversible</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-300/90">
                  Al eliminar tu perfil, se borrarán de forma inmediata e irrecuperable: tus fotos, videos, reflexiones, configuración de colores y tu clave secreta de este dispositivo.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Escribe la palabra <strong className="text-red-400 font-mono">ELIMINAR</strong> para confirmar:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationWord}
                  onChange={(e) => {
                    setDeleteConfirmationWord(e.target.value);
                    setDeleteError('');
                  }}
                  placeholder="ELIMINAR"
                  className="w-full px-3.5 py-2.5 bg-[#1C1217] border border-red-900/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              {deleteError && (
                <p className="text-xs text-red-400">{deleteError}</p>
              )}

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar mi perfil definitivamente</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Registro y Vinculación Biometría Nativa */}
      <BiometricPromptModal
        isOpen={showBiometricRegisterModal}
        mode="register"
        userName={user.firstName}
        onSuccess={() => {
          setShowBiometricRegisterModal(false);
          onUpdateUser({ ...user, biometricEnabled: true });
        }}
        onCancel={() => setShowBiometricRegisterModal(false)}
      />
    </div>
  );
};

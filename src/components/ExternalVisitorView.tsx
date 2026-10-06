import React, { useEffect, useState } from 'react';
import { UserProfile, MediaPost, ScanSession } from '../types/privacy';
import { Lock, Shield, Clock, AlertTriangle, Eye, ArrowLeft } from 'lucide-react';

interface Props {
  user: UserProfile;
  posts: MediaPost[];
  session: ScanSession | null;
  onExitVisitorMode: () => void;
}

export const ExternalVisitorView: React.FC<Props> = ({
  user,
  posts,
  session,
  onExitVisitorMode,
}) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!session || session.status !== 'accepted' || !session.expiresAt) {
      return;
    }

    const checkTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((session.expiresAt! - now) / 1000));
      setTimeLeftSeconds(remaining);
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const formatCountdown = (totalSeconds: number | null) => {
    if (totalSeconds === null) return 'Sin límite de tiempo';
    if (totalSeconds <= 0) return 'Tiempo agotado';
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const isExpired =
    session?.status === 'accepted' &&
    session.expiresAt !== null &&
    timeLeftSeconds !== null &&
    timeLeftSeconds <= 0;

  // Status: Pending approval
  if (!session || session.status === 'pending') {
    return (
      <div className="min-h-screen bg-[#0f0b0d] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-poppins select-none">
        <div className="w-16 h-16 rounded-full bg-[#5A1827] border border-[#B4E197]/40 flex items-center justify-center mb-6 animate-pulse">
          <Clock className="w-7 h-7 text-[#B4E197]" />
        </div>

        <span className="font-lettering text-5xl text-[#B4E197] mb-2">Privacy</span>
        <h2 className="text-xl font-semibold text-white mb-2">
          Solicitud en trámite
        </h2>

        {/* Warning text requested in specification */}
        <div className="p-4 rounded-xl bg-[#5A1827]/30 border border-[#5A1827] max-w-sm my-4 text-xs text-[#B4E197] leading-relaxed">
          “El usuario está esperando a que aceptes tu solicitud”
        </div>

        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6 font-light">
          El propietario del perfil ha recibido tu aviso en su dispositivo y debe ingresar su clave secreta para autorizar tu prórroga de visualización.
        </p>

        <button
          onClick={onExitVisitorMode}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Cancelar y regresar
        </button>
      </div>
    );
  }

  // Status: Rejected
  if (session.status === 'rejected') {
    return (
      <div className="min-h-screen bg-[#0f0b0d] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-poppins select-none">
        <div className="w-16 h-16 rounded-full bg-red-950 border border-red-800 flex items-center justify-center mb-6">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">Acceso Denegado</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          El propietario del perfil ha rechazado la solicitud de visualización. La identidad y el contenido permanecen privados y protegidos.
        </p>

        <button
          onClick={onExitVisitorMode}
          className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
        >
          Volver a la portada
        </button>
      </div>
    );
  }

  // Status: Revoked or Expired
  if (session.status === 'revoked' || isExpired) {
    return (
      <div className="min-h-screen bg-[#0f0b0d] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-poppins select-none">
        <div className="w-16 h-16 rounded-full bg-[#5A1827] border border-white/20 flex items-center justify-center mb-6">
          <Lock className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          {session.status === 'revoked' ? 'Acceso Revocado' : 'Prórroga Expirada'}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          {session.status === 'revoked'
            ? 'El propietario ha cancelado la sesión de visualización en vivo desde su dispositivo.'
            : 'El tiempo límite de visualización concedido ha finalizado. La sesión se ha cerrado automáticamente.'}
        </p>

        <button
          onClick={onExitVisitorMode}
          className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
        >
          Finalizar visita
        </button>
      </div>
    );
  }

  // Authorized Read-Only Profile View
  return (
    <div
      className="min-h-screen transition-colors duration-500 font-poppins selection:bg-white/20 pb-20"
      style={{
        backgroundColor: user.backgroundColor,
        color: user.textColor,
      }}
    >
      {/* Read-Only Floating Visitor Banner */}
      <div className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-slate-200">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#B4E197]" />
          <span>Modo Visor Exclusivo (Solo Lectura)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#B4E197] bg-white/10 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatCountdown(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={onExitVisitorMode}
            className="text-[11px] hover:underline text-slate-400 hover:text-white"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Main Profile Header */}
      <header className="max-w-4xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-white/10">
        <button
          onClick={onExitVisitorMode}
          className="text-xs opacity-75 hover:opacity-100 flex items-center gap-1.5 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Salir</span>
        </button>

        <h1 className="font-lettering text-5xl sm:text-6xl tracking-wide select-none">
          Privacy
        </h1>

        <div className="w-12 text-right">
          <span className="text-[10px] uppercase tracking-widest opacity-60">Visor</span>
        </div>
      </header>

      {/* Profile Info Section (Left: Data, Right: Circular Image) */}
      <div className="max-w-4xl w-full mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left Panel: Profile Data (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest opacity-70 block mb-1">
                Identidad Privada
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {user.firstName} {user.lastName}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="opacity-60 block text-[10px] uppercase">Cumpleaños / Edad</span>
                <span className="font-medium">{user.birthDate} ({user.age} años)</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="opacity-60 block text-[10px] uppercase">Signo Zodiacal</span>
                <span className="font-medium">{user.zodiacSign}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
                <span className="opacity-60 block text-[10px] uppercase">Elemento</span>
                <span className="font-semibold">{user.zodiacElement}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest opacity-70 block mb-1">
                Descripción personal
              </span>
              <p className="text-sm font-light leading-relaxed opacity-90 whitespace-pre-wrap">
                {user.description}
              </p>
            </div>
          </div>

          {/* Right Panel: Circular Image */}
          <div className="flex justify-center md:justify-end">
            <div
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 shadow-2xl p-1"
              style={{ borderColor: user.textColor }}
            >
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <hr className="border-t border-white/20 w-full" />
      </div>

      {/* Saved Content Space */}
      <div className="max-w-4xl w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs uppercase tracking-widest opacity-75">
            Espacio de Contenido Guardado ({posts.length})
          </span>
          <span className="text-xs opacity-60">Solo Lectura</span>
        </div>

        {posts.length === 0 ? (
          <div className="py-16 text-center opacity-60 text-xs">
            No hay contenido guardado actualmente en este perfil.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-lg"
              >
                {post.files && post.files.length > 0 && (
                  <div className="aspect-[4/3] w-full bg-black/40 overflow-hidden relative">
                    {post.files[0].type === 'video' ? (
                      <video
                        src={post.files[0].url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={post.files[0].url}
                        alt={post.title || 'Foto guardada'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                )}
                <div className="p-4 space-y-2">
                  {post.title && <h4 className="font-semibold text-sm">{post.title}</h4>}
                  {post.caption && <p className="text-xs opacity-85 leading-relaxed">{post.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

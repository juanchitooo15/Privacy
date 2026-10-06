import React, { useState } from 'react';
import { UserProfile, MediaPost, ScanSession } from '../types/privacy';
import {
  Menu,
  Share2,
  Plus,
  Layers,
  Image as ImageIcon,
  Video,
  X,
  Trash2,
  Maximize2,
  Eye,
  Radio,
  Lock,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UploadModal } from './UploadModal';

interface Props {
  user: UserProfile;
  posts: MediaPost[];
  activeVisitorSession: ScanSession | null;
  onOpenQRShare: () => void;
  onOpenOptionsMenu: () => void;
  onRevokeVisitorSession: () => void;
  onSaveNewPost: (post: MediaPost) => void;
  onDeletePost: (postId: string) => void;
}

export const ProfileView: React.FC<Props> = ({
  user,
  posts,
  activeVisitorSession,
  onOpenQRShare,
  onOpenOptionsMenu,
  onRevokeVisitorSession,
  onSaveNewPost,
  onDeletePost,
}) => {
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [uploadMode, setUploadMode] = useState<'variedad' | 'foto' | 'video' | null>(null);
  const [activeMediaItem, setActiveMediaItem] = useState<{ post: MediaPost; fileIndex: number } | null>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  const hasActiveVisitor = activeVisitorSession && activeVisitorSession.status === 'accepted';

  return (
    <div
      className="min-h-screen relative font-poppins transition-colors duration-500 select-none pb-28"
      style={{
        backgroundColor: user.backgroundColor,
        color: user.textColor,
      }}
    >
      {/* Cabecera Superior */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-black/15 border-b border-white/10 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Top Left: Menu (Tres rayitas) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOptionsMenu}
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Menú de opciones (Seguridad, Ayuda, Eliminar cuenta)"
              aria-label="Abrir menú de opciones"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Top Center: Institutional Text "Privacy" OR Live Visitor Indicator */}
          <div className="text-center px-2 flex-1 max-w-lg">
            {hasActiveVisitor ? (
              <button
                type="button"
                onClick={() => setShowRevokeConfirm(true)}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 hover:bg-red-950/80 hover:border-red-500/50 transition-all cursor-pointer shadow-lg animate-pulse"
                title="Haz clic para cancelar el acceso en cualquier momento"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:bg-red-400 group-hover:scale-125 transition-all" />
                <span className="text-xs font-medium text-emerald-200 group-hover:text-red-200 transition-colors truncate max-w-[220px] sm:max-w-md">
                  El perfil <strong className="font-semibold text-white">{activeVisitorSession.visitorName}</strong> está viendo tu perfil (Revocar ✕)
                </span>
              </button>
            ) : (
              <h1 className="font-lettering text-4xl sm:text-5xl md:text-6xl tracking-wide select-none">
                Privacy
              </h1>
            )}
          </div>

          {/* Top Right: Share Symbol */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQRShare}
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Compartir perfil mediante código QR"
              aria-label="Compartir perfil"
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Info Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Panel Izquierdo (Datos del Perfil) - 8 columnas en desktop */}
          <div className="md:col-span-8 space-y-6 order-2 md:order-1">
            {/* Nombre y Apellido (Username strictly hidden) */}
            <div>
              <span className="text-xs uppercase tracking-[0.25em] opacity-60 block mb-1">
                Identidad Personal
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                {user.firstName} {user.lastName}
              </h2>
            </div>

            {/* Datos Registrados: Cumpleaños, Edad, Signo Zodiacal, Elemento */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {/* Cumpleaños y Edad */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
                <span className="text-[10px] uppercase tracking-wider opacity-60 block">
                  Nacimiento · Edad
                </span>
                <span className="text-xs sm:text-sm font-medium block">
                  {user.birthDate}
                </span>
                <span className="text-xs font-bold opacity-90 block">
                  {user.age} {user.age === 1 ? 'año' : 'años'}
                </span>
              </div>

              {/* Signo Zodiacal */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
                <span className="text-[10px] uppercase tracking-wider opacity-60 block">
                  Signo Zodiacal
                </span>
                <span className="text-xs sm:text-sm font-semibold block">
                  {user.zodiacSign}
                </span>
                <span className="text-[10px] opacity-70 block">
                  Astrología Personal
                </span>
              </div>

              {/* Elemento */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase tracking-wider opacity-60 block">
                  Elemento Regente
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-current opacity-90" />
                  <span className="text-xs sm:text-sm font-bold">{user.zodiacElement}</span>
                </div>
                <span className="text-[10px] opacity-70 block">Naturaleza Esencial</span>
              </div>
            </div>

            {/* Descripción Personal (hasta 500 caracteres) */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider opacity-60 block mb-2 font-medium">
                Descripción personal
              </span>
              <p className="text-sm sm:text-base font-light leading-relaxed opacity-90 whitespace-pre-wrap">
                {user.description || 'Sin descripción personal registrada.'}
              </p>
            </div>
          </div>

          {/* Panel Derecho (Imagen Circular) - 4 columnas en desktop */}
          <div className="md:col-span-4 flex justify-center md:justify-end order-1 md:order-2">
            <div
              className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 shadow-2xl p-1 transition-transform hover:scale-105 duration-500"
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
      </section>

      {/* Divisor: Línea horizontal completa debajo de los datos */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <hr className="border-t border-white/20 w-full" />
      </div>

      {/* Espacio de Contenido Guardado */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] opacity-60 block">
              Espacio Privado
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Contenido Guardado ({posts.length})
            </h3>
          </div>
          <div className="text-xs opacity-60 font-mono">
            Solo visible bajo tu autorización
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white/5 border border-white/10 p-8 space-y-3">
            <Sparkles className="w-8 h-8 mx-auto opacity-50" />
            <h4 className="text-base font-medium">Aún no has guardado momentos</h4>
            <p className="text-xs opacity-70 max-w-md mx-auto leading-relaxed">
              Presiona el botón (+) en la esquina inferior para cargar fotos, videos o colecciones completas a tu espacio personal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 transition-all shadow-md flex flex-col justify-between"
              >
                {/* Media representation */}
                {post.files && post.files.length > 0 && (
                  <div
                    className="relative aspect-[4/3] w-full bg-black/40 overflow-hidden cursor-pointer"
                    onClick={() => setActiveMediaItem({ post, fileIndex: 0 })}
                  >
                    {post.files[0].type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={post.files[0].url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="p-3 rounded-full bg-black/60 text-white border border-white/30">
                            <Video className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={post.files[0].url}
                        alt={post.title || 'Foto'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Variety indicator if multi-file */}
                    {post.files.length > 1 && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-white font-mono flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>+{post.files.length - 1}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Content details */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    {post.title && (
                      <h4 className="font-semibold text-sm line-clamp-1">{post.title}</h4>
                    )}
                    {post.caption && (
                      <p className="text-xs opacity-80 line-clamp-2 mt-1 leading-relaxed">
                        {post.caption}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] opacity-60">
                    <span className="font-mono">
                      {new Date(post.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeletePost(post.id)}
                      className="p-1 hover:text-red-400 transition-colors"
                      title="Eliminar este elemento guardado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Botón Flotante de Acciones (+) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
        {/* Floating radial/popover options */}
        {showFabMenu && (
          <div className="flex flex-col items-end space-y-2.5 animate-fade-in font-poppins">
            {/* Opción 1: Variedad */}
            <button
              onClick={() => {
                setShowFabMenu(false);
                setUploadMode('variedad');
              }}
              className="flex items-center gap-3 py-2.5 px-4 rounded-full bg-[#181014] text-slate-100 border border-white/20 shadow-xl hover:border-[#B4E197] hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-xs font-medium">Variedad (Fotos / Videos)</span>
              <div className="p-1.5 rounded-full bg-[#5A1827] text-[#B4E197]">
                <Layers className="w-4 h-4" />
              </div>
            </button>

            {/* Opción 2: Foto */}
            <button
              onClick={() => {
                setShowFabMenu(false);
                setUploadMode('foto');
              }}
              className="flex items-center gap-3 py-2.5 px-4 rounded-full bg-[#181014] text-slate-100 border border-white/20 shadow-xl hover:border-[#B4E197] hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-xs font-medium">Foto única</span>
              <div className="p-1.5 rounded-full bg-[#5A1827] text-[#B4E197]">
                <ImageIcon className="w-4 h-4" />
              </div>
            </button>

            {/* Opción 3: Video */}
            <button
              onClick={() => {
                setShowFabMenu(false);
                setUploadMode('video');
              }}
              className="flex items-center gap-3 py-2.5 px-4 rounded-full bg-[#181014] text-slate-100 border border-white/20 shadow-xl hover:border-[#B4E197] hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-xs font-medium">Video único</span>
              <div className="p-1.5 rounded-full bg-[#5A1827] text-[#B4E197]">
                <Video className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Permanent circular (+) button in bottom corner */}
        <button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform cursor-pointer border-2 ${
            showFabMenu ? 'rotate-45 bg-[#5A1827] text-white border-white/30' : 'bg-[#B4E197] text-[#5A1827] border-[#5A1827] hover:scale-105'
          }`}
          title="Agregar contenido"
          aria-label="Agregar contenido"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Upload modal for Variedad, Foto, Video */}
      <UploadModal
        mode={uploadMode}
        isOpen={uploadMode !== null}
        onClose={() => setUploadMode(null)}
        onSavePost={onSaveNewPost}
      />

      {/* Media Viewer Lightbox */}
      {activeMediaItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="font-semibold text-base">{activeMediaItem.post.title || 'Contenido Guardado'}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {new Date(activeMediaItem.post.createdAt).toLocaleString('es-ES')}
              </p>
            </div>
            <button
              onClick={() => setActiveMediaItem(null)}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Media Player / Image */}
          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
            {activeMediaItem.post.files[activeMediaItem.fileIndex]?.type === 'video' ? (
              <video
                src={activeMediaItem.post.files[activeMediaItem.fileIndex]?.url}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
              />
            ) : (
              <img
                src={activeMediaItem.post.files[activeMediaItem.fileIndex]?.url}
                alt="Vista completa"
                className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Thumbnails if album */}
          {activeMediaItem.post.files.length > 1 && (
            <div className="flex items-center justify-center gap-2 py-2 overflow-x-auto">
              {activeMediaItem.post.files.map((file, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMediaItem({ ...activeMediaItem, fileIndex: i })}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeMediaItem.fileIndex === i ? 'border-[#B4E197] scale-110' : 'border-white/20 opacity-50'
                  }`}
                >
                  <img src={file.url} alt="Miniatura" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {activeMediaItem.post.caption && (
            <p className="text-xs text-slate-300 text-center max-w-xl mx-auto pt-2 leading-relaxed">
              {activeMediaItem.post.caption}
            </p>
          )}
        </div>
      )}

      {/* Revoke Visitor Confirmation Modal */}
      {showRevokeConfirm && hasActiveVisitor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#160E12] border border-white/20 rounded-2xl p-6 shadow-2xl text-slate-100 font-poppins space-y-4 animate-fade-in text-center">
            <h3 className="text-base font-semibold text-white">
              ¿Cancelar acceso a {activeVisitorSession.visitorName}?
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Al confirmar, el visor perderá de inmediato los permisos de lectura y será redirigido fuera de tu perfil.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRevokeConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-white/15 text-xs text-slate-300 hover:text-white"
              >
                Mantener acceso
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRevokeConfirm(false);
                  onRevokeVisitorSession();
                }}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
              >
                Revocar Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

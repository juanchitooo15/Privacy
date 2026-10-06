import React, { useState } from 'react';
import { MediaPost, MediaFile } from '../types/privacy';
import { Layers, Image as ImageIcon, Video, X, UploadCloud, Shield, Check, Plus } from 'lucide-react';

interface Props {
  mode: 'variedad' | 'foto' | 'video' | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (post: MediaPost) => void;
}

export const UploadModal: React.FC<Props> = ({ mode, isOpen, onClose, onSavePost }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(mode === 'video');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !mode) return null;

  // Handle Video Permission Prompt first as required by spec:
  // "(Previamente, el sistema solicitará los permisos correspondientes de acceso a la galería del dispositivo)"
  if (mode === 'video' && !permissionGranted && showPermissionPrompt) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm bg-[#160E12] border border-white/20 rounded-2xl p-6 shadow-2xl text-slate-100 font-poppins space-y-5 animate-fade-in text-center">
          <div className="w-14 h-14 rounded-full bg-[#5A1827] border border-[#B4E197]/40 flex items-center justify-center mx-auto text-[#B4E197]">
            <Shield className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">
              Permiso de Acceso a Galería
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Privacy solicita acceso a tu almacenamiento y galería para cargar y procesar archivos de video privados con cifrado local.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-white/15 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Denegar
            </button>
            <button
              type="button"
              onClick={() => {
                setPermissionGranted(true);
                setShowPermissionPrompt(false);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#B4E197] text-[#5A1827] font-semibold text-xs hover:bg-[#a0d680] transition-colors"
            >
              Permitir Acceso
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError('');
    const newMediaList: MediaFile[] = [];

    Array.from(selectedFiles).forEach((file) => {
      const isVideo = file.type.startsWith('video');
      const isImage = file.type.startsWith('image');

      if (mode === 'foto' && !isImage) {
        setError('Solo puedes seleccionar una imagen en esta opción.');
        return;
      }
      if (mode === 'video' && !isVideo) {
        setError('Solo puedes seleccionar un archivo de video en esta opción.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFiles((prev) => [
            ...prev,
            {
              url: reader.result as string,
              type: isVideo ? 'video' : 'image',
              name: file.name,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Debes cargar al menos un archivo multimedia.');
      return;
    }

    const postType: 'variety' | 'photo' | 'video' =
      mode === 'variedad' ? 'variety' : mode === 'foto' ? 'photo' : 'video';

    const newPost: MediaPost = {
      id: `post_${Date.now()}`,
      type: postType,
      files,
      title: title.trim() || undefined,
      caption: caption.trim() || undefined,
      createdAt: Date.now(),
    };

    onSavePost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#160E12] border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl text-slate-100 font-poppins space-y-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#5A1827] text-[#B4E197]">
              {mode === 'variedad' && <Layers className="w-5 h-5" />}
              {mode === 'foto' && <ImageIcon className="w-5 h-5" />}
              {mode === 'video' && <Video className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white capitalize">
                Carga: {mode === 'variedad' ? 'Variedad de archivos' : mode === 'foto' ? 'Foto única' : 'Video único'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'variedad'
                  ? 'Sube fotos y videos simultáneamente'
                  : mode === 'foto'
                  ? 'Carga una imagen en alta calidad'
                  : 'Carga un clip de video para tu espacio privado'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Picker Box */}
          <div>
            <label
              htmlFor="media-input"
              className="border-2 border-dashed border-white/20 hover:border-[#B4E197] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/5"
            >
              <UploadCloud className="w-8 h-8 text-[#B4E197] mb-2" />
              <span className="text-xs font-medium text-white">
                Haz clic para seleccionar desde tu dispositivo
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                {mode === 'variedad'
                  ? 'Múltiples imágenes o videos (JPG, PNG, MP4, WebM)'
                  : mode === 'foto'
                  ? 'Una imagen (JPG, PNG, WebP)'
                  : 'Un video (MP4, WebM, MOV)'}
              </span>
            </label>
            <input
              id="media-input"
              type="file"
              multiple={mode === 'variedad'}
              accept={mode === 'foto' ? 'image/*' : mode === 'video' ? 'video/*' : 'image/*,video/*'}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Files Preview Grid */}
          {files.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400">Archivos seleccionados ({files.length}):</span>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {files.map((file, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square bg-black">
                    {file.type === 'video' ? (
                      <video src={file.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={file.url} alt="Previa" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Title and Caption */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Título opcional
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Encuentro íntimo en el mirador"
              className="w-full px-3.5 py-2.5 bg-[#1C1217] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Reflexión o descripción
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escribe lo que este recuerdo significa para ti..."
              className="w-full px-3.5 py-2.5 bg-[#1C1217] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B4E197] resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
              {error}
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
              className="px-5 py-2.5 rounded-xl bg-[#B4E197] text-[#5A1827] font-semibold text-xs hover:bg-[#a0d680] transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar en Perfil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

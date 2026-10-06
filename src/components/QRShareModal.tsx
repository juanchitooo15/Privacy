import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { UserProfile } from '../types/privacy';
import { Download, X, QrCode } from 'lucide-react';

interface Props {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestSimulatedScan: () => void;
}

export const QRShareModal: React.FC<Props> = ({
  user,
  isOpen,
  onClose,
  onRequestSimulatedScan,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    // Generate personalized QR code strictly for camera scanning
    const profileSharePayload = JSON.stringify({
      app: 'Privacy',
      profileId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      time: Date.now(),
    });

    // Dark wine / user background color styling
    QRCode.toCanvas(
      canvasRef.current,
      profileSharePayload,
      {
        width: 260,
        margin: 2,
        color: {
          dark: user.backgroundColor || '#5A1827',
          light: '#FFFFFF',
        },
      },
      (error) => {
        if (!error && canvasRef.current) {
          setQrDataUrl(canvasRef.current.toDataURL('image/png'));
        }
      }
    );
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Privacy_QR_${user.firstName}_${user.lastName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-[#160E12] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100 animate-fade-in font-poppins">
        {/* Header with Title "QR" and Download Button on top right */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-lettering text-2xl text-[#B4E197]">Privacy</span>
            <h3 className="text-xl font-bold font-poppins text-white ml-2 tracking-wide">
              QR
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadQR}
              className="p-2 rounded-xl bg-[#5A1827] text-[#B4E197] border border-[#B4E197]/40 hover:bg-[#701e31] hover:border-[#B4E197] transition-all flex items-center gap-1.5 text-xs font-poppins shadow-md cursor-pointer"
              title="Descargar imagen del código QR"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar QR</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QR Code Presentation Area - Strictly QR only, no links */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-[#B4E197]/30">
            <canvas ref={canvasRef} className="rounded-lg max-w-full" />
          </div>
        </div>

        {/* Simular Escaneo: Únicamente para pruebas del desarrollador */}
        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestSimulatedScan();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#5A1827] text-[#B4E197] hover:bg-[#6f1e31] hover:text-white border border-[#B4E197]/40 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#B4E197]" />
            <span>Simular Escaneo (Prueba de Desarrollador)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

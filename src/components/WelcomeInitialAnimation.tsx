import React, { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export const WelcomeInitialAnimation: React.FC<Props> = ({ onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    // 5 seconds total duration
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const phase1 = setTimeout(() => setPhase(1), 1200);
    const phase2 = setTimeout(() => setPhase(2), 2600);
    const phase3 = setTimeout(() => setPhase(3), 3900);

    return () => {
      clearInterval(interval);
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, [onComplete]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#5A1827] text-[#B4E197] select-none px-6">
      {/* Dynamic ambient color gradients */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B4E197]/30 via-transparent to-black" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#B4E197]/15 blur-3xl animate-pulse" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#5A1827] border border-[#B4E197]/20 blur-2xl" />

      {/* Main typographic showcase */}
      <div className="relative z-10 text-center max-w-xl mx-auto flex flex-col items-center space-y-6">
        <span className="text-xs uppercase tracking-[0.35em] text-[#B4E197]/70 font-poppins font-medium animate-fade-in">
          Entorno Cifrado · Estricto & Exclusivo
        </span>

        <h1 className="font-lettering text-7xl sm:text-8xl md:text-9xl text-[#B4E197] tracking-wide transition-all duration-1000 transform hover:scale-105">
          Privacy
        </h1>

        <div className="h-16 flex items-center justify-center">
          {phase === 0 && (
            <p className="font-poppins text-lg sm:text-xl font-light text-[#B4E197]/90 transition-opacity duration-700 animate-fade-in">
              Bienvenido al silencio digital.
            </p>
          )}
          {phase === 1 && (
            <p className="font-lettering text-2xl sm:text-3xl text-white transition-opacity duration-700 animate-fade-in">
              Estética, minimalismo y autenticidad.
            </p>
          )}
          {phase === 2 && (
            <p className="font-poppins text-base sm:text-lg text-[#B4E197] font-normal tracking-wide transition-opacity duration-700 animate-fade-in">
              Ningún perfil es público, rastreable ni indexable.
            </p>
          )}
          {phase === 3 && (
            <p className="font-lettering text-3xl sm:text-4xl text-[#B4E197] font-semibold transition-opacity duration-700 animate-fade-in">
              Comenzando tu registro personal...
            </p>
          )}
        </div>

        {/* 5-second progress indicator */}
        <div className="w-64 sm:w-80 h-1 bg-black/40 rounded-full overflow-hidden mt-6 border border-[#B4E197]/20">
          <div
            className="h-full bg-[#B4E197] transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${((5 - secondsLeft) / 5) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-64 sm:w-80 text-xs text-[#B4E197]/60 font-poppins pt-1">
          <span>Iniciando experiencia</span>
          <span className="tabular-nums font-mono">{secondsLeft}s</span>
        </div>

        {/* Option to skip if user desires */}
        <button
          onClick={onComplete}
          className="mt-6 text-xs text-[#B4E197]/60 hover:text-[#B4E197] underline underline-offset-4 transition-colors font-poppins pt-4"
        >
          Saltar introducción →
        </button>
      </div>
    </div>
  );
};

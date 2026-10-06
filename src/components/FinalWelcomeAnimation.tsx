import React, { useEffect, useState } from 'react';

interface Props {
  firstName: string;
  lastName: string;
  onComplete: () => void;
}

export const FinalWelcomeAnimation: React.FC<Props> = ({ firstName, lastName, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [colorStage, setColorStage] = useState(0);

  // Dynamic transitions of application palette in background:
  // #5A1827 (vino tinto) <-> #B4E197 (verde pastel) <-> deep wine
  const backgrounds = [
    'from-[#5A1827] via-[#370E17] to-[#120306]',
    'from-[#3D101A] via-[#5A1827] to-[#25421C]',
    'from-[#1D3A1B] via-[#5A1827] to-[#3B0F19]',
    'from-[#5A1827] via-[#2F4D25] to-[#B4E197]/30',
    'from-[#5A1827] via-[#43121D] to-[#140407]',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const colorTimer = setInterval(() => {
      setColorStage((prev) => (prev + 1) % backgrounds.length);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(colorTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${backgrounds[colorStage]} text-[#B4E197] select-none px-6 transition-colors duration-1000`}
    >
      {/* Decorative ambient glowing orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#B4E197]/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -top-10 right-10 w-80 h-80 rounded-full bg-[#5A1827]/80 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl mx-auto flex flex-col items-center space-y-6">
        <span className="text-xs tracking-[0.4em] uppercase text-[#B4E197]/75 font-poppins font-medium">
          Privacidad Confirmada
        </span>

        {/* User Full Name */}
        <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
          {firstName} {lastName}
        </h2>

        {/* Lettering Phrase: "Tú eres Tú" */}
        <div className="py-2">
          <p className="font-lettering text-6xl sm:text-7xl md:text-8xl text-[#B4E197] drop-shadow-md">
            “Tú eres Tú”
          </p>
        </div>

        <p className="font-poppins text-sm sm:text-base text-[#B4E197]/90 max-w-md font-light">
          Tu espacio es completamente invisible al mundo exterior. Solo quienes tú decidas podrán acceder.
        </p>

        {/* 5-second progress bar */}
        <div className="w-64 sm:w-80 h-1 bg-black/40 rounded-full overflow-hidden mt-6 border border-[#B4E197]/20">
          <div
            className="h-full bg-[#B4E197] transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${((5 - secondsLeft) / 5) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-64 sm:w-80 text-xs text-[#B4E197]/70 font-poppins pt-1">
          <span>Ingresando a tu perfil</span>
          <span className="tabular-nums font-mono">{secondsLeft}s</span>
        </div>

        <button
          onClick={onComplete}
          className="mt-4 text-xs text-[#B4E197]/70 hover:text-[#B4E197] underline underline-offset-4 transition-colors font-poppins"
        >
          Entrar directamente →
        </button>
      </div>
    </div>
  );
};

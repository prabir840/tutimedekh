import React, { useMemo } from 'react';
import { ThemeMode, AccentColor, BackgroundStyle, AtmosphereIntensity } from '../types';

interface BackgroundSphereAtmosphereProps {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  accent: AccentColor;
  backgroundStyle: BackgroundStyle;
  atmosphereIntensity: AtmosphereIntensity;
}

export const BackgroundSphereAtmosphere: React.FC<BackgroundSphereAtmosphereProps> = ({
  resolvedTheme,
  accent,
  backgroundStyle,
  atmosphereIntensity,
}) => {
  const isDark = resolvedTheme === 'dark';

  // Intensity opacity multiplier
  const intensityOpacity = useMemo(() => {
    switch (atmosphereIntensity) {
      case 'subtle':
        return 0.4;
      case 'balanced':
        return 0.75;
      case 'expressive':
        return 1.0;
      default:
        return 0.75;
    }
  }, [atmosphereIntensity]);

  // Accent color glow styles
  const accentGlow = useMemo(() => {
    if (isDark) {
      switch (accent) {
        case 'blue':
          return 'rgba(59, 130, 246, 0.15)';
        case 'purple':
          return 'rgba(168, 85, 247, 0.15)';
        case 'emerald':
          return 'rgba(16, 185, 129, 0.15)';
        case 'amber':
          return 'rgba(245, 158, 11, 0.15)';
        case 'neutral':
        default:
          return 'rgba(255, 255, 255, 0.08)';
      }
    } else {
      switch (accent) {
        case 'blue':
          return 'rgba(56, 142, 255, 0.35)';
        case 'purple':
          return 'rgba(192, 132, 252, 0.35)';
        case 'emerald':
          return 'rgba(52, 211, 153, 0.35)';
        case 'amber':
          return 'rgba(251, 191, 36, 0.35)';
        case 'neutral':
        default:
          return 'rgba(148, 163, 184, 0.25)';
      }
    }
  }, [isDark, accent]);

  if (backgroundStyle === 'minimal') {
    return (
      <div
        className={`fixed inset-0 pointer-events-none transition-colors duration-700 -z-10 ${
          isDark ? 'bg-[#08090c]' : 'bg-[#f4f7fb]'
        }`}
      />
    );
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-700 -z-10 ${
        isDark ? 'bg-[#060812]' : 'bg-[#eaf1fb]'
      }`}
      style={{ opacity: intensityOpacity }}
    >
      {/* Cinematic Deep Space Gradients */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,45,85,0.4),rgba(6,8,18,0))]'
            : 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(180,215,255,0.6),rgba(234,241,251,0))]'
        }`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_bottom_left,rgba(65,40,95,0.25),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_bottom_left,rgba(195,220,255,0.5),transparent_50%)]'
        }`}
      />

      {/* Dynamic Ambient Accent Light */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[150px] transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        style={{ background: accentGlow }}
      />

      {/* Floating Luminous Glass Spheres & Volumetric Blobs */}
      {backgroundStyle === 'spheres' && (
        <div className="absolute inset-0 w-full h-full">
          {/* Sphere Center-Back (Directly behind the main clock card for visible refraction) */}
          <div
            className={`absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[460px] sm:h-[460px] rounded-full blur-[40px] sm:blur-[55px] ${
              isDark
                ? 'bg-gradient-to-tr from-indigo-600/30 via-blue-500/25 to-cyan-400/20'
                : 'bg-gradient-to-tr from-[#90caff]/70 via-[#60b0ff]/60 to-[#a3e5ff]/50'
            }`}
            style={{
              animation: 'floatOrbCenter 22s ease-in-out infinite alternate',
            }}
          />

          {/* Sphere 1 - Top Left (Large luminous orb) */}
          <div
            className={`absolute top-[-4%] left-[6%] w-60 h-60 sm:w-80 sm:h-80 rounded-full ${
              isDark
                ? 'bg-gradient-to-br from-blue-500/25 via-indigo-600/15 to-transparent blur-[8px] shadow-[inset_-10px_-10px_25px_rgba(0,0,0,0.8),inset_10px_10px_25px_rgba(255,255,255,0.2)] border border-white/10'
                : 'bg-gradient-to-br from-[#a5d5ff] via-[#63a8ff] to-[#2575fc] blur-[3px] shadow-[inset_-12px_-12px_28px_rgba(20,70,180,0.4),inset_10px_10px_22px_rgba(255,255,255,0.95),0_25px_60px_rgba(37,117,252,0.35)]'
            }`}
            style={{
              animation: 'floatOrb1 26s ease-in-out infinite alternate',
            }}
          />

          {/* Sphere 2 - Right Center / Upper Right (Vibrant volumetric orb) */}
          <div
            className={`absolute top-[22%] right-[6%] sm:right-[12%] w-64 h-64 sm:w-96 sm:h-96 rounded-full ${
              isDark
                ? 'bg-gradient-to-br from-cyan-400/20 via-blue-600/15 to-purple-600/10 blur-[6px] shadow-[inset_-14px_-14px_30px_rgba(0,0,0,0.9),inset_12px_12px_28px_rgba(255,255,255,0.25)] border border-white/15'
                : 'bg-gradient-to-br from-[#bfe4ff] via-[#6cb1ff] to-[#1e6be5] blur-[2px] shadow-[inset_-16px_-16px_32px_rgba(10,50,150,0.38),inset_12px_12px_25px_rgba(255,255,255,0.9),0_35px_80px_rgba(30,107,229,0.35)]'
            }`}
            style={{
              animation: 'floatOrb2 30s ease-in-out infinite alternate',
            }}
          />

          {/* Sphere 3 - Bottom Left (Atmosphere bubble) */}
          <div
            className={`absolute bottom-[6%] left-[10%] sm:left-[15%] w-52 h-52 sm:w-72 sm:h-72 rounded-full ${
              isDark
                ? 'bg-gradient-to-br from-purple-500/20 via-indigo-600/15 to-transparent blur-[6px] shadow-[inset_-8px_-8px_20px_rgba(0,0,0,0.85),inset_8px_8px_20px_rgba(255,255,255,0.2)] border border-white/10'
                : 'bg-gradient-to-br from-[#cbe5ff] via-[#8cc2ff] to-[#3a8bff] blur-[2px] shadow-[inset_-10px_-10px_24px_rgba(20,70,180,0.35),inset_8px_8px_20px_rgba(255,255,255,0.9)]'
            }`}
            style={{
              animation: 'floatOrb3 22s ease-in-out infinite alternate',
            }}
          />

          {/* Sphere 4 - Bottom Right 3D glassy orb */}
          <div
            className={`absolute bottom-[12%] right-[15%] w-28 h-28 sm:w-44 sm:h-44 rounded-full ${
              isDark
                ? 'bg-gradient-to-br from-white/25 via-cyan-400/10 to-transparent border border-white/20 shadow-[inset_-6px_-6px_14px_rgba(0,0,0,0.9),inset_8px_8px_16px_rgba(255,255,255,0.35),0_15px_35px_rgba(0,0,0,0.6)]'
                : 'bg-gradient-to-br from-white via-[#9ed2ff] to-[#2575fc] shadow-[inset_-10px_-10px_20px_rgba(10,50,160,0.45),inset_8px_8px_16px_rgba(255,255,255,0.95),0_20px_45px_rgba(37,117,252,0.4)]'
            }`}
            style={{
              animation: 'floatOrb4 18s ease-in-out infinite alternate',
            }}
          />

          {/* Specular Bubble 5 - Floating upper right accent bubble */}
          <div
            className={`absolute top-[16%] right-[26%] w-16 h-16 sm:w-24 sm:h-24 rounded-full ${
              isDark
                ? 'bg-gradient-to-br from-white/35 via-white/5 to-transparent border border-white/30 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.8),inset_5px_5px_12px_rgba(255,255,255,0.45)]'
                : 'bg-gradient-to-br from-white via-[#bce0ff] to-[#4596ff] shadow-[inset_-5px_-5px_12px_rgba(20,70,180,0.4),inset_5px_5px_12px_rgba(255,255,255,0.95)]'
            }`}
            style={{
              animation: 'floatOrb1 20s ease-in-out infinite alternate-reverse',
            }}
          />
        </div>
      )}

      {/* Aurora Ambient Style */}
      {backgroundStyle === 'aurora' && (
        <div className="absolute inset-0 w-full h-full">
          <div
            className={`absolute -top-1/4 -left-1/4 w-[85vw] h-[85vw] rounded-full blur-[130px] ${
              isDark ? 'bg-indigo-900/45' : 'bg-blue-300/55'
            }`}
            style={{ animation: 'floatOrb1 22s ease-in-out infinite alternate' }}
          />
          <div
            className={`absolute -bottom-1/4 -right-1/4 w-[75vw] h-[75vw] rounded-full blur-[150px] ${
              isDark ? 'bg-cyan-950/50' : 'bg-sky-200/70'
            }`}
            style={{ animation: 'floatOrb2 28s ease-in-out infinite alternate' }}
          />
        </div>
      )}

      {/* Soft Gradient Style */}
      {backgroundStyle === 'gradient' && (
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/70 via-[#060812] to-[#030408]'
              : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/80 via-[#edf4fc] to-[#dfeaf7]'
          }`}
        />
      )}

      <style>{`
        @keyframes floatOrbCenter {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          50% { transform: translate(-45%, -46%) scale(1.12) rotate(4deg); }
          100% { transform: translate(-55%, -54%) scale(0.92) rotate(-4deg); }
        }
        @keyframes floatOrb1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, 25px) scale(1.06); }
          100% { transform: translate(-25px, 40px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-35px, -30px) scale(1.08); }
          100% { transform: translate(25px, -20px) scale(0.94); }
        }
        @keyframes floatOrb3 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(25px, -35px) scale(0.96); }
          100% { transform: translate(-20px, 25px) scale(1.05); }
        }
        @keyframes floatOrb4 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-22px, 18px) scale(1.08); }
          100% { transform: translate(20px, -26px) scale(0.92); }
        }
      `}</style>
    </div>
  );
};

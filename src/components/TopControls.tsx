import React from 'react';
import { Sun, Moon, Sparkles, Maximize2, Minimize2, Volume2, VolumeX, Keyboard } from 'lucide-react';
import { TimeFormat, DigitColor } from '../types';
import { playTactileClick } from '../utils/audio';

interface TopControlsProps {
  timeFormat: TimeFormat;
  onToggleTimeFormat: () => void;
  onToggleTheme: () => void;
  onToggleDigitColor: () => void;
  onOpenShortcuts: () => void;
  onIncreaseSize: () => void;
  onDecreaseSize: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDark: boolean;
  digitColor: DigitColor;
  fontSizeScale: number;
}

export const TopControls: React.FC<TopControlsProps> = ({
  timeFormat,
  onToggleTimeFormat,
  onToggleTheme,
  onToggleDigitColor,
  onOpenShortcuts,
  onIncreaseSize,
  onDecreaseSize,
  isFullscreen,
  onToggleFullscreen,
  soundEnabled,
  onToggleSound,
  isDark,
  digitColor,
  fontSizeScale,
}) => {
  return (
    <header
      id="tutimedekh-top-controls"
      aria-label="Application Controls"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div
        className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-full transition-all duration-300 ${
          isDark
            ? 'glass-panel-dark glass-glossy shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
            : 'glass-panel-light glass-glossy glass-glossy-light shadow-[0_15px_35px_rgba(100,150,240,0.18)]'
        }`}
      >
        {/* 1. Time Format Toggle 12/24 */}
        <button
          id="toggle-time-format-btn"
          aria-label={`Current format is ${timeFormat}. Click to toggle format (Press T)`}
          title={`Format: ${timeFormat} (Press T)`}
          onClick={() => {
            playTactileClick(soundEnabled);
            onToggleTimeFormat();
          }}
          className={`relative px-2.5 sm:px-3 h-9 sm:h-10 rounded-full flex items-center justify-center font-mono font-medium text-xs tracking-tight transition-all duration-200 cursor-pointer ${
            isDark ? 'glass-circle-dark text-neutral-200' : 'glass-circle-light text-neutral-800'
          } ${timeFormat === '12h' ? 'ring-1 ' + (isDark ? 'ring-white/40' : 'ring-blue-500/50') : ''}`}
        >
          <span>{timeFormat === '24h' ? '12/24' : '12h'}</span>
        </button>

        {/* 2. Theme Toggle (Click toggles theme between Black / White directly) */}
        <button
          id="appearance-btn"
          aria-label={isDark ? 'Theme: Switch to White/Light Theme' : 'Theme: Switch to Black/Dark Theme'}
          title={isDark ? 'Theme: Switch to Light Theme' : 'Theme: Switch to Dark Theme'}
          onClick={() => {
            playTactileClick(soundEnabled);
            onToggleTheme();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isDark ? 'glass-circle-dark text-neutral-200 hover:text-white' : 'glass-circle-light text-neutral-800 hover:text-black'
          }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" strokeWidth={1.75} />
          )}
        </button>

        {/* 3. Lighting / Digit Color Toggle (Click toggles time digit color to White / Black) */}
        <button
          id="atmosphere-btn"
          aria-label={`Time Color: ${digitColor === 'black' ? 'Black' : 'White'}. Click to toggle white/black text`}
          title={`Lighting: Toggle Time Color (${digitColor === 'black' ? 'Black' : digitColor === 'white' ? 'White' : isDark ? 'White' : 'Black'})`}
          onClick={() => {
            playTactileClick(soundEnabled);
            onToggleDigitColor();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer relative ${
            isDark ? 'glass-circle-dark text-neutral-200' : 'glass-circle-light text-neutral-800'
          }`}
        >
          <Sparkles
            className={`w-4 h-4 transition-transform duration-200 hover:scale-110 ${
              digitColor === 'white'
                ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                : digitColor === 'black'
                ? 'text-neutral-900 drop-shadow-[0_0_4px_rgba(0,0,0,0.4)]'
                : isDark
                ? 'text-amber-200'
                : 'text-blue-500'
            }`}
            strokeWidth={1.75}
          />
        </button>

        {/* 4. A+ (Increase Time Size) */}
        <button
          id="increase-font-btn"
          aria-label="Increase time display size (Press +)"
          title="Increase Size (Press +)"
          disabled={fontSizeScale >= 2.5}
          onClick={() => {
            playTactileClick(soundEnabled);
            onIncreaseSize();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-sans font-medium text-xs transition-all duration-200 cursor-pointer ${
            isDark ? 'glass-circle-dark text-neutral-200' : 'glass-circle-light text-neutral-800'
          } ${fontSizeScale >= 2.5 ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <span className="font-semibold text-xs tracking-tight">A⁺</span>
        </button>

        {/* 5. A- (Decrease Time Size) */}
        <button
          id="decrease-font-btn"
          aria-label="Decrease time display size (Press -)"
          title="Decrease Size (Press -)"
          disabled={fontSizeScale <= 0.65}
          onClick={() => {
            playTactileClick(soundEnabled);
            onDecreaseSize();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-sans font-medium text-xs transition-all duration-200 cursor-pointer ${
            isDark ? 'glass-circle-dark text-neutral-200' : 'glass-circle-light text-neutral-800'
          } ${fontSizeScale <= 0.65 ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <span className="font-semibold text-xs tracking-tight">A⁻</span>
        </button>

        {/* 6. Fullscreen */}
        <button
          id="fullscreen-toggle-btn"
          aria-label={isFullscreen ? 'Exit Fullscreen (Press F)' : 'Enter Fullscreen (Press F)'}
          title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          onClick={() => {
            playTactileClick(soundEnabled);
            onToggleFullscreen();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isDark ? 'glass-circle-dark text-neutral-200' : 'glass-circle-light text-neutral-800'
          }`}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <Maximize2 className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>

        {/* Divider */}
        <div className={`h-5 w-px ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />

        {/* Sound toggle */}
        <button
          id="sound-toggle-btn"
          aria-label={soundEnabled ? 'Mute Sounds (Press M)' : 'Enable Sounds (Press M)'}
          title={soundEnabled ? 'Mute Sounds (M)' : 'Enable Sounds (M)'}
          onClick={() => {
            playTactileClick(!soundEnabled);
            onToggleSound();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isDark ? 'glass-circle-dark text-neutral-200' : 'glass-circle-light text-neutral-800'
          } ${!soundEnabled ? 'opacity-50' : ''}`}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
          )}
        </button>

        {/* Keyboard Shortcuts Help */}
        <button
          id="shortcuts-btn"
          aria-label="Keyboard Shortcuts (Press ?)"
          title="Shortcuts Guide (?)"
          onClick={() => {
            playTactileClick(soundEnabled);
            onOpenShortcuts();
          }}
          className={`hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all duration-200 cursor-pointer ${
            isDark ? 'glass-circle-dark text-neutral-200' : 'glass-circle-light text-neutral-800'
          }`}
        >
          <Keyboard className="w-4 h-4 opacity-70" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
};

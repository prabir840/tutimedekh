import React, { useState, useEffect } from 'react';
import { TimeFormat, DigitColor } from '../types';
import { formatClock } from '../utils/timeFormat';

interface ClockViewProps {
  timeFormat: TimeFormat;
  fontSizeScale: number;
  showSeconds: boolean;
  isDark: boolean;
  digitColor: DigitColor;
}

export const ClockView: React.FC<ClockViewProps> = ({
  timeFormat,
  fontSizeScale,
  showSeconds,
  isDark,
  digitColor,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    // Update every 100ms for smooth immediate precision
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const clockData = formatClock(currentTime, timeFormat === '24h');

  // Dynamic responsive font size based on scale
  // Base scale clamped cleanly
  const scaleMultiplier = Math.max(0.65, Math.min(1.45, fontSizeScale));

  // Determine effective text color for time digits based on digitColor setting
  const effectiveIsWhite = digitColor === 'white' ? true : digitColor === 'black' ? false : isDark;
  const digitColorClass = effectiveIsWhite
    ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]'
    : 'text-neutral-900 drop-shadow-[0_0_15px_rgba(0,0,0,0.08)]';
  const colonColorClass = effectiveIsWhite ? 'text-white/80' : 'text-neutral-900/80';

  return (
    <div
      id="clock-view-container"
      className="relative flex flex-col items-center justify-center w-full h-full min-h-[70vh] p-4 select-none"
    >
      {/* Central Floating Glass Plate */}
      <div
        className={`relative flex flex-col items-center justify-center px-6 py-10 sm:px-14 sm:py-16 md:px-20 md:py-20 rounded-[32px] sm:rounded-[44px] transition-all duration-500 max-w-[96vw] sm:max-w-[92vw] lg:max-w-6xl w-full ${
          isDark
            ? 'glass-panel-dark glass-glossy'
            : 'glass-panel-light glass-glossy glass-glossy-light'
        }`}
      >
        {/* Large Time Display */}
        <div
          id="live-clock-display"
          aria-live="off"
          aria-atomic="true"
          className="time-display-mono flex items-baseline justify-center tracking-tight font-light transition-all duration-200 select-none flex-nowrap whitespace-nowrap"
          style={{
            fontSize: `clamp(3.5rem, ${10 * scaleMultiplier}vw, ${13 * scaleMultiplier}rem)`,
            lineHeight: 1,
          }}
        >
          {/* Hours */}
          <span className={`time-digit-cell ${digitColorClass}`}>
            {clockData.hoursStr}
          </span>

          {/* Colon */}
          <span className={`time-colon-cell ${colonColorClass}`}>
            :
          </span>

          {/* Minutes */}
          <span className={`time-digit-cell ${digitColorClass}`}>
            {clockData.minutesStr}
          </span>

          {/* Optional Seconds */}
          {showSeconds && (
            <>
              <span className={`time-colon-cell ${colonColorClass}`}>
                :
              </span>
              <span className={`time-digit-cell ${digitColorClass}`}>
                {clockData.secondsStr}
              </span>
            </>
          )}

          {/* AM / PM Badge */}
          {clockData.ampm && (
            <span
              className={`ml-3 sm:ml-5 font-sans font-light tracking-wider opacity-80 ${
                effectiveIsWhite ? 'text-neutral-300' : 'text-neutral-700'
              }`}
              style={{
                fontSize: `clamp(1.2rem, ${2.5 * scaleMultiplier}vw, ${3 * scaleMultiplier}rem)`,
              }}
            >
              {clockData.ampm}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

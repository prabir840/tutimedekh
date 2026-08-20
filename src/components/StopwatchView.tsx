import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { LapItem, DigitColor } from '../types';
import { formatStopwatchTime } from '../utils/timeFormat';
import { playActionStart, playActionStop, playTactileClick } from '../utils/audio';

interface StopwatchViewProps {
  fontSizeScale: number;
  isDark: boolean;
  soundEnabled: boolean;
  digitColor: DigitColor;
}

export const StopwatchView: React.FC<StopwatchViewProps> = ({
  fontSizeScale,
  isDark,
  soundEnabled,
  digitColor,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<LapItem[]>([]);

  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const updateTime = useCallback(() => {
    if (startTimeRef.current > 0) {
      setElapsedTime(Date.now() - startTimeRef.current + accumulatedTimeRef.current);
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, []);

  const handleStart = useCallback(() => {
    if (isRunning) return;
    playActionStart(soundEnabled);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = Date.now();
    setIsRunning(true);
    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [soundEnabled, updateTime, isRunning]);

  const handlePause = useCallback(() => {
    playActionStop(soundEnabled);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (startTimeRef.current > 0) {
      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = 0;
    }
    setIsRunning(false);
  }, [soundEnabled]);

  const handleReset = useCallback(() => {
    playTactileClick(soundEnabled);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
    setElapsedTime(0);
    setIsRunning(false);
    setLaps([]);
  }, [soundEnabled]);

  const handleLap = useCallback(() => {
    if (!isRunning && elapsedTime === 0) return;
    playTactileClick(soundEnabled);

    const currentTotal = elapsedTime;
    const previousTotal = laps.length > 0 ? laps[0].overallTime : 0;
    const currentLapTime = currentTotal - previousTotal;

    const newLap: LapItem = {
      id: Date.now(),
      lapNumber: laps.length + 1,
      lapTime: currentLapTime,
      overallTime: currentTotal,
    };

    setLaps((prev) => [newLap, ...prev]);
  }, [isRunning, elapsedTime, laps, soundEnabled]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Expose play/pause and reset for global shortcuts via custom event or props
  useEffect(() => {
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail?.action === 'togglePlay') {
        if (isRunning) handlePause();
        else handleStart();
      } else if (e.detail?.action === 'reset') {
        handleReset();
      }
    };
    window.addEventListener('stopwatch-control' as unknown as string, handleCustomEvent as EventListener);
    return () => {
      window.removeEventListener('stopwatch-control' as unknown as string, handleCustomEvent as EventListener);
    };
  }, [isRunning, handlePause, handleStart, handleReset]);

  const swData = formatStopwatchTime(elapsedTime);
  const scaleMultiplier = Math.max(0.65, Math.min(2.5, typeof fontSizeScale === 'number' && !isNaN(fontSizeScale) ? fontSizeScale : 1.45));

  // Determine effective text color for time digits based on digitColor setting
  const effectiveIsWhite = digitColor === 'white' ? true : digitColor === 'black' ? false : isDark;
  const digitColorClass = effectiveIsWhite
    ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]'
    : 'text-neutral-900 drop-shadow-[0_0_15px_rgba(0,0,0,0.08)]';
  const colonColorClass = effectiveIsWhite ? 'text-white/80' : 'text-neutral-900/80';
  const centiColorClass = effectiveIsWhite ? 'text-neutral-300' : 'text-neutral-700';

  // Find min and max lap times for highlighting
  const lapTimes = laps.map((l) => l.lapTime);
  const minLapTime = lapTimes.length > 1 ? Math.min(...lapTimes) : null;
  const maxLapTime = lapTimes.length > 1 ? Math.max(...lapTimes) : null;

  return (
    <div
      id="stopwatch-view-container"
      className="relative flex flex-col items-center justify-center w-full h-full min-h-[70vh] p-4 select-none"
    >
      {/* Central Floating Glass Card */}
      <div
        className={`relative flex flex-col items-center justify-center px-6 py-10 sm:px-14 sm:py-16 rounded-[32px] sm:rounded-[44px] transition-all duration-500 max-w-[96vw] sm:max-w-[92vw] lg:max-w-5xl w-full ${
          isDark
            ? 'glass-panel-dark glass-glossy'
            : 'glass-panel-light glass-glossy glass-glossy-light'
        }`}
      >
        {/* Large Stopwatch Digits */}
        <div
          id="stopwatch-display"
          aria-live="off"
          className="time-display-mono flex items-baseline justify-center tracking-tight font-light transition-all duration-200 select-none flex-nowrap whitespace-nowrap"
          style={{
            fontSize: `clamp(3rem, ${9 * scaleMultiplier}vw, ${11 * scaleMultiplier}rem)`,
            lineHeight: 1,
          }}
        >
          {swData.hoursStr && (
            <>
              <span className={`time-digit-cell ${digitColorClass}`}>{swData.hoursStr}</span>
              <span className={`time-colon-cell ${colonColorClass}`}>:</span>
            </>
          )}

          <span className={`time-digit-cell ${digitColorClass}`}>
            {swData.minutesStr}
          </span>
          <span className={`time-colon-cell ${colonColorClass}`}>:</span>
          <span className={`time-digit-cell ${digitColorClass}`}>
            {swData.secondsStr}
          </span>
          <span className={`time-colon-cell ${colonColorClass}`}>.</span>
          <span
            className={`time-digit-cell font-light ${centiColorClass}`}
            style={{
              fontSize: `clamp(1.5rem, ${5 * scaleMultiplier}vw, ${5 * scaleMultiplier}rem)`,
            }}
          >
            {swData.centiStr}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-9">
          {/* Reset button */}
          <button
            id="stopwatch-reset-btn"
            aria-label="Reset stopwatch (Press R)"
            title="Reset (R)"
            disabled={elapsedTime === 0 && laps.length === 0}
            onClick={handleReset}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isDark ? 'glass-button-dark' : 'glass-button-light'
            } ${elapsedTime === 0 && laps.length === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
          >
            <RotateCcw className="w-4 h-4 opacity-80" />
          </button>

          {/* Primary Start / Pause Toggle */}
          <button
            id="stopwatch-start-pause-btn"
            aria-label={isRunning ? 'Pause stopwatch (Space)' : 'Start stopwatch (Space)'}
            title={isRunning ? 'Pause (Space)' : 'Start (Space)'}
            onClick={isRunning ? handlePause : handleStart}
            className={`px-6 sm:px-7 h-10 sm:h-11 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition-all duration-300 cursor-pointer shadow-md ${
              isRunning
                ? isDark
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-amber-500/10'
                  : 'bg-amber-500 text-white shadow-amber-500/25 hover:bg-amber-600'
                : isDark
                ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 shadow-white/5'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{elapsedTime > 0 ? 'Resume' : 'Start'}</span>
              </>
            )}
          </button>

          {/* Lap button */}
          <button
            id="stopwatch-lap-btn"
            aria-label="Record lap time"
            title="Record Lap"
            disabled={!isRunning}
            onClick={handleLap}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isDark ? 'glass-button-dark' : 'glass-button-light'
            } ${!isRunning ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
          >
            <Flag className="w-4 h-4 opacity-80" />
          </button>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="w-full mt-8 sm:mt-10 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider opacity-60 px-4 mb-2">
              <span>Lap</span>
              <span>Split</span>
              <span>Total</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 px-2">
              {laps.map((lap) => {
                const isFastest = minLapTime !== null && lap.lapTime === minLapTime;
                const isSlowest = maxLapTime !== null && lap.lapTime === maxLapTime;
                const lapFormatted = formatStopwatchTime(lap.lapTime).formatted;
                const totalFormatted = formatStopwatchTime(lap.overallTime).formatted;

                return (
                  <div
                    key={lap.id}
                    className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm font-mono transition-colors ${
                      isDark ? 'bg-white/5' : 'bg-black/5'
                    } ${
                      isFastest
                        ? 'text-emerald-400 font-medium ring-1 ring-emerald-400/30'
                        : isSlowest
                        ? 'text-rose-400 font-medium ring-1 ring-rose-400/30'
                        : isDark
                        ? 'text-neutral-300'
                        : 'text-neutral-700'
                    }`}
                  >
                    <span className="opacity-80">Lap {lap.lapNumber}</span>
                    <span>+{lapFormatted}</span>
                    <span className="opacity-90">{totalFormatted}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff, ChevronUp, ChevronDown } from 'lucide-react';
import { formatTimerSeconds, padZero } from '../utils/timeFormat';
import { DigitColor } from '../types';
import { playActionStart, playActionStop, playTactileClick, startRepeatingTimerAlarm, stopRepeatingTimerAlarm } from '../utils/audio';

interface TimerViewProps {
  fontSizeScale: number;
  isDark: boolean;
  soundEnabled: boolean;
  lastTimerPreset: number;
  onUpdatePreset: (seconds: number) => void;
  digitColor: DigitColor;
}

export const TimerView: React.FC<TimerViewProps> = ({
  fontSizeScale,
  isDark,
  soundEnabled,
  lastTimerPreset,
  onUpdatePreset,
  digitColor,
}) => {
  // Input settings state (when timer is not running/paused)
  const [inputHours, setInputHours] = useState<number>(() => Math.floor(lastTimerPreset / 3600));
  const [inputMinutes, setInputMinutes] = useState<number>(() => Math.floor((lastTimerPreset % 3600) / 60));
  const [inputSeconds, setInputSeconds] = useState<number>(() => lastTimerPreset % 60);

  // Runtime timer states
  const [totalInitialSeconds, setTotalInitialSeconds] = useState<number>(lastTimerPreset || 300);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(lastTimerPreset || 300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const endTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);

  const presets = [
    { label: '1 min', seconds: 60 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '25 min', seconds: 1500 },
    { label: '30 min', seconds: 1800 },
  ];

  // Stop alarm on unmount
  useEffect(() => {
    return () => {
      stopRepeatingTimerAlarm();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const handleStopAlarm = useCallback(() => {
    stopRepeatingTimerAlarm();
    setIsCompleted(false);
  }, []);

  const handleStart = useCallback(() => {
    handleStopAlarm();
    const duration = remainingSeconds > 0 ? remainingSeconds : inputHours * 3600 + inputMinutes * 60 + inputSeconds;

    if (duration <= 0) return;

    playActionStart(soundEnabled);
    if (remainingSeconds === 0 || remainingSeconds === totalInitialSeconds) {
      setTotalInitialSeconds(duration);
    }
    setRemainingSeconds(duration);
    endTimeRef.current = Date.now() + duration * 1000;
    setIsRunning(true);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const remainingMs = endTimeRef.current - now;
      const remSec = Math.ceil(remainingMs / 1000);

      if (remSec <= 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setRemainingSeconds(0);
        setIsRunning(false);
        setIsCompleted(true);
        startRepeatingTimerAlarm(soundEnabled);
      } else {
        setRemainingSeconds(remSec);
      }
    }, 200);
  }, [remainingSeconds, inputHours, inputMinutes, inputSeconds, soundEnabled, totalInitialSeconds, handleStopAlarm]);

  const handlePause = useCallback(() => {
    playActionStop(soundEnabled);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRunning(false);
  }, [soundEnabled]);

  const handleReset = useCallback(() => {
    playTactileClick(soundEnabled);
    handleStopAlarm();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRunning(false);
    const resetVal = inputHours * 3600 + inputMinutes * 60 + inputSeconds || 300;
    setRemainingSeconds(resetVal);
    setTotalInitialSeconds(resetVal);
  }, [soundEnabled, inputHours, inputMinutes, inputSeconds, handleStopAlarm]);

  const handleSelectPreset = (seconds: number) => {
    playTactileClick(soundEnabled);
    handleStopAlarm();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRunning(false);
    setInputHours(Math.floor(seconds / 3600));
    setInputMinutes(Math.floor((seconds % 3600) / 60));
    setInputSeconds(seconds % 60);
    setTotalInitialSeconds(seconds);
    setRemainingSeconds(seconds);
    onUpdatePreset(seconds);
  };

  const adjustUnit = (unit: 'h' | 'm' | 's', delta: number) => {
    if (isRunning) return;
    playTactileClick(soundEnabled);
    handleStopAlarm();

    let h = inputHours;
    let m = inputMinutes;
    let s = inputSeconds;

    if (unit === 'h') {
      h = Math.max(0, Math.min(23, h + delta));
      setInputHours(h);
    } else if (unit === 'm') {
      m = Math.max(0, Math.min(59, m + delta));
      setInputMinutes(m);
    } else if (unit === 's') {
      s = Math.max(0, Math.min(59, s + delta));
      setInputSeconds(s);
    }

    const total = h * 3600 + m * 60 + s;
    setTotalInitialSeconds(total);
    setRemainingSeconds(total);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail?.action === 'togglePlay') {
        if (isCompleted) {
          handleStopAlarm();
        } else if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.detail?.action === 'reset') {
        handleReset();
      }
    };
    window.addEventListener('timer-control' as unknown as string, handleCustomEvent as EventListener);
    return () => {
      window.removeEventListener('timer-control' as unknown as string, handleCustomEvent as EventListener);
    };
  }, [isRunning, isCompleted, handlePause, handleStart, handleReset, handleStopAlarm]);

  const timerData = formatTimerSeconds(remainingSeconds);
  const scaleMultiplier = Math.max(0.65, Math.min(1.45, fontSizeScale));

  // Determine effective text color for time digits based on digitColor setting
  const effectiveIsWhite = digitColor === 'white' ? true : digitColor === 'black' ? false : isDark;
  const digitColorClass = effectiveIsWhite
    ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]'
    : 'text-neutral-900 drop-shadow-[0_0_15px_rgba(0,0,0,0.08)]';
  const colonColorClass = effectiveIsWhite ? 'text-white/80' : 'text-neutral-900/80';

  // Progress ratio (0 to 1)
  const progressRatio = totalInitialSeconds > 0 ? (totalInitialSeconds - remainingSeconds) / totalInitialSeconds : 0;

  return (
    <div
      id="timer-view-container"
      className="relative flex flex-col items-center justify-center w-full h-full min-h-[70vh] p-4 select-none"
    >
      {/* Central Glass Panel */}
      <div
        className={`relative flex flex-col items-center justify-center px-6 py-10 sm:px-14 sm:py-16 rounded-[32px] sm:rounded-[44px] transition-all duration-500 max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl w-full ${
          isCompleted
            ? isDark
              ? 'bg-rose-950/40 border-2 border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-pulse'
              : 'bg-rose-100/90 border-2 border-rose-400 shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-pulse'
            : isDark
            ? 'glass-panel-dark glass-glossy'
            : 'glass-panel-light glass-glossy glass-glossy-light'
        }`}
      >
        {/* Visual Progress Bar on top edge */}
        {totalInitialSeconds > 0 && !isCompleted && (
          <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden rounded-t-[32px] sm:rounded-t-[44px] bg-black/10 dark:bg-white/5">
            <div
              className={`h-full transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-sky-400 to-indigo-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              }`}
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        )}

        {/* Completion Alert Banner */}
        {isCompleted && (
          <div className="flex items-center gap-3 px-6 py-2.5 rounded-full mb-6 bg-rose-500 text-white font-medium shadow-lg animate-bounce">
            <Bell className="w-5 h-5 animate-spin" />
            <span>Time&apos;s Up!</span>
            <button
              onClick={handleStopAlarm}
              className="ml-2 px-3 py-1 bg-white text-rose-700 rounded-full text-xs font-bold hover:bg-rose-50 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Big Timer Digits or Manual Increment View */}
        {!isRunning && remainingSeconds === totalInitialSeconds && !isCompleted ? (
          /* Interactive manual spinner mode */
          <div className="flex items-center justify-center gap-2 sm:gap-4 my-2 time-display-mono">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => adjustUnit('h', 1)}
                className={`p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                aria-label="Increase hours"
              >
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span
                className={`time-digit-cell font-mono font-light leading-none my-1 tracking-tight ${digitColorClass}`}
                style={{ fontSize: `clamp(2.5rem, ${7 * scaleMultiplier}vw, ${7 * scaleMultiplier}rem)` }}
              >
                {padZero(inputHours)}
              </span>
              <button
                onClick={() => adjustUnit('h', -1)}
                className={`p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                aria-label="Decrease hours"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-[11px] sm:text-xs opacity-50 uppercase tracking-wider mt-1 font-sans">Hours</span>
            </div>

            <span className={`time-colon-cell font-mono font-light text-2xl sm:text-4xl mb-5 ${colonColorClass}`}>:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => adjustUnit('m', 1)}
                className={`p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                aria-label="Increase minutes"
              >
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span
                className={`time-digit-cell font-mono font-light leading-none my-1 tracking-tight ${digitColorClass}`}
                style={{ fontSize: `clamp(2.5rem, ${7 * scaleMultiplier}vw, ${7 * scaleMultiplier}rem)` }}
              >
                {padZero(inputMinutes)}
              </span>
              <button
                onClick={() => adjustUnit('m', -1)}
                className={`p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                aria-label="Decrease minutes"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-[11px] sm:text-xs opacity-50 uppercase tracking-wider mt-1 font-sans">Mins</span>
            </div>

            <span className={`time-colon-cell font-mono font-light text-2xl sm:text-4xl mb-5 ${colonColorClass}`}>:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => adjustUnit('s', 1)}
                className={`p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                aria-label="Increase seconds"
              >
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span
                className={`time-digit-cell font-mono font-light leading-none my-1 tracking-tight ${digitColorClass}`}
                style={{ fontSize: `clamp(2.5rem, ${7 * scaleMultiplier}vw, ${7 * scaleMultiplier}rem)` }}
              >
                {padZero(inputSeconds)}
              </span>
              <button
                onClick={() => adjustUnit('s', -1)}
                className={`p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                aria-label="Decrease seconds"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-[11px] sm:text-xs opacity-50 uppercase tracking-wider mt-1 font-sans">Secs</span>
            </div>
          </div>
        ) : (
          /* Active / Paused clean display mode */
          <div
            id="timer-display"
            aria-live="off"
            className="time-display-mono flex items-baseline justify-center tracking-tight font-light my-4 select-none flex-nowrap whitespace-nowrap"
            style={{
              fontSize: `clamp(3.2rem, ${9.5 * scaleMultiplier}vw, ${11.5 * scaleMultiplier}rem)`,
              lineHeight: 1,
            }}
          >
            {timerData.hours > 0 && (
              <>
                <span className={`time-digit-cell ${digitColorClass}`}>{timerData.hoursStr}</span>
                <span className={`time-colon-cell ${colonColorClass}`}>:</span>
              </>
            )}
            <span className={`time-digit-cell ${digitColorClass}`}>
              {timerData.minutesStr}
            </span>
            <span className={`time-colon-cell ${colonColorClass}`}>:</span>
            <span className={`time-digit-cell ${digitColorClass}`}>
              {timerData.secondsStr}
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-7">
          {/* Reset button */}
          <button
            id="timer-reset-btn"
            aria-label="Reset timer (Press R)"
            title="Reset (R)"
            onClick={handleReset}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isDark ? 'glass-button-dark' : 'glass-button-light'
            } opacity-80 hover:opacity-100`}
          >
            <RotateCcw className="w-4 h-4 opacity-80" />
          </button>

          {/* Primary Start / Pause Toggle */}
          <button
            id="timer-start-pause-btn"
            aria-label={isRunning ? 'Pause timer (Space)' : 'Start timer (Space)'}
            title={isRunning ? 'Pause (Space)' : 'Start (Space)'}
            disabled={remainingSeconds === 0 && !isCompleted}
            onClick={isCompleted ? handleStopAlarm : isRunning ? handlePause : handleStart}
            className={`px-6 sm:px-7 h-10 sm:h-11 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition-all duration-300 cursor-pointer shadow-md ${
              isCompleted
                ? 'bg-rose-600 text-white shadow-rose-600/40 hover:bg-rose-700'
                : isRunning
                ? isDark
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-amber-500/10'
                  : 'bg-amber-500 text-white shadow-amber-500/25 hover:bg-amber-600'
                : isDark
                ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 shadow-white/5'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            {isCompleted ? (
              <>
                <BellOff className="w-4 h-4" />
                <span>Stop Alarm</span>
              </>
            ) : isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{remainingSeconds < totalInitialSeconds ? 'Resume' : 'Start'}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {presets.map((preset) => {
            const isSelected = totalInitialSeconds === preset.seconds && remainingSeconds === preset.seconds;
            return (
              <button
                key={preset.seconds}
                id={`timer-preset-${preset.seconds}`}
                onClick={() => handleSelectPreset(preset.seconds)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-white/20 ring-1 ring-white/40 text-white shadow-sm'
                      : 'bg-blue-600 text-white shadow-md'
                    : isDark
                    ? 'glass-button-dark opacity-75 hover:opacity-100 text-neutral-300'
                    : 'glass-button-light opacity-80 hover:opacity-100 text-neutral-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

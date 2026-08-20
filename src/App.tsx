import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppPage, AppSettings, DEFAULT_SETTINGS, ThemeMode, AccentColor, BackgroundStyle, AtmosphereIntensity, TimeFormat, DigitColor } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { BackgroundSphereAtmosphere } from './components/BackgroundSphereAtmosphere';
import { Sidebar } from './components/Sidebar';
import { MobileNavigation } from './components/MobileNavigation';
import { TopControls } from './components/TopControls';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ClockView } from './components/ClockView';
import { StopwatchView } from './components/StopwatchView';
import { TimerView } from './components/TimerView';
import { playTactileClick } from './utils/audio';

function getInitialPage(): AppPage {
  if (typeof window === 'undefined') return 'time';
  const path = window.location.pathname.toLowerCase();
  if (path.includes('stopwatch')) return 'stopwatch';
  if (path.includes('timer')) return 'timer';
  return 'time';
}

export default function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('tutimedekh_settings', DEFAULT_SETTINGS);
  const [currentPage, setCurrentPage] = useState<AppPage>(getInitialPage);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Ensure default scale is set to highest size on initial load if on old 1.0 default
  useEffect(() => {
    if (settings.fontSizeScale === 1.0) {
      setSettings((prev) => ({ ...prev, fontSizeScale: 1.45 }));
    }
  }, []);

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Listen to system dark/light preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sync browser URL history on navigation
  const navigate = useCallback((page: AppPage) => {
    setCurrentPage(page);
    try {
      const newPath = `/${page}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({ page }, '', newPath);
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Resolved dark or light mode
  const resolvedTheme = useMemo<'dark' | 'light'>(() => {
    if (settings.theme === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return settings.theme;
  }, [settings.theme, systemIsDark]);

  const isDark = resolvedTheme === 'dark';

  // Toggle handlers
  const handleToggleTimeFormat = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      timeFormat: prev.timeFormat === '24h' ? '12h' : '24h',
    }));
  }, [setSettings]);

  // Click on theme toggle directly switches black (dark) and white (light)
  const handleToggleTheme = useCallback(() => {
    setSettings((prev) => {
      const currentIsDark = prev.theme === 'dark' || (prev.theme === 'system' && systemIsDark);
      const nextTheme: ThemeMode = currentIsDark ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
  }, [setSettings, systemIsDark]);

  // Click on lighting toggle directly switches time text color between white and black
  const handleToggleDigitColor = useCallback(() => {
    setSettings((prev) => {
      const currentEffectiveIsWhite = prev.digitColor === 'white' ? true : prev.digitColor === 'black' ? false : (prev.theme === 'dark');
      const nextDigitColor: DigitColor = currentEffectiveIsWhite ? 'black' : 'white';
      return { ...prev, digitColor: nextDigitColor };
    });
  }, [setSettings]);

  const handleIncreaseSize = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      fontSizeScale: Math.min(2.5, +(prev.fontSizeScale + 0.12).toFixed(2)),
    }));
  }, [setSettings]);

  const handleDecreaseSize = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      fontSizeScale: Math.max(0.65, +(prev.fontSizeScale - 0.12).toFixed(2)),
    }));
  }, [setSettings]);

  const handleToggleSound = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, [setSettings]);

  const handleToggleShowSeconds = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      showSeconds: !prev.showSeconds,
    }));
  }, [setSettings]);

  const handleThemeChange = useCallback((theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, [setSettings]);

  const handleAccentChange = useCallback((accent: AccentColor) => {
    setSettings((prev) => ({ ...prev, accent }));
  }, [setSettings]);

  const handleBackgroundStyleChange = useCallback((backgroundStyle: BackgroundStyle) => {
    setSettings((prev) => ({ ...prev, backgroundStyle }));
  }, [setSettings]);

  const handleAtmosphereIntensityChange = useCallback((atmosphereIntensity: AtmosphereIntensity) => {
    setSettings((prev) => ({ ...prev, atmosphereIntensity }));
  }, [setSettings]);

  const handleUpdateTimerPreset = useCallback((seconds: number) => {
    setSettings((prev) => ({ ...prev, lastTimerPreset: seconds }));
  }, [setSettings]);

  // Space & R triggers for stopwatch/timer
  const handleTogglePlayPause = useCallback(() => {
    if (currentPage === 'stopwatch') {
      window.dispatchEvent(new CustomEvent('stopwatch-control', { detail: { action: 'togglePlay' } }));
    } else if (currentPage === 'timer') {
      window.dispatchEvent(new CustomEvent('timer-control', { detail: { action: 'togglePlay' } }));
    }
  }, [currentPage]);

  const handleReset = useCallback(() => {
    if (currentPage === 'stopwatch') {
      window.dispatchEvent(new CustomEvent('stopwatch-control', { detail: { action: 'reset' } }));
    } else if (currentPage === 'timer') {
      window.dispatchEvent(new CustomEvent('timer-control', { detail: { action: 'reset' } }));
    }
  }, [currentPage]);

  const handleCloseModals = useCallback(() => {
    setIsShortcutsOpen(false);
  }, []);

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onNavigate: navigate,
    onTogglePlayPause: handleTogglePlayPause,
    onReset: handleReset,
    onToggleFullscreen: toggleFullscreen,
    onToggleSound: handleToggleSound,
    onToggleShortcutsModal: () => setIsShortcutsOpen((v) => !v),
    onCloseModals: handleCloseModals,
    onToggleFormat: handleToggleTimeFormat,
    onIncreaseSize: handleIncreaseSize,
    onDecreaseSize: handleDecreaseSize,
  });

  return (
    <div
      id="tutimedekh-root"
      className={`relative min-h-screen w-full flex overflow-hidden transition-colors duration-700 ${
        isDark ? 'text-white bg-[#060812]' : 'text-neutral-900 bg-[#eaf1fb]'
      }`}
    >
      {/* Background Sphere Caustics & Atmosphere */}
      <BackgroundSphereAtmosphere
        theme={settings.theme}
        resolvedTheme={resolvedTheme}
        accent={settings.accent}
        backgroundStyle={settings.backgroundStyle}
        atmosphereIntensity={settings.atmosphereIntensity}
      />

      {/* Creator Attribution Link in Bottom Right Corner */}
      <div className="fixed bottom-20 md:bottom-4 right-4 z-40 transition-all">
        <a
          id="prabir-samanta-credit-link"
          href="https://www.linkedin.com/in/prabir-samanta-b692102b4/"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer select-none ${
            isDark
              ? 'glass-button-dark text-neutral-300 hover:text-white'
              : 'glass-button-light text-neutral-700 hover:text-neutral-950'
          }`}
          title="TU TIME DEKH BY PRABIR SAMANTA - Connect on LinkedIn"
        >
          <span>TU TIME DEKH BY PRABIR SAMANTA</span>
          <svg className="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>

      {/* Desktop Fixed Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        isDark={isDark}
        soundEnabled={settings.soundEnabled}
      />

      {/* Mobile Fixed Bottom Navigation */}
      <MobileNavigation
        currentPage={currentPage}
        onNavigate={navigate}
        isDark={isDark}
        soundEnabled={settings.soundEnabled}
      />

      {/* Top Floating Control Bar */}
      <TopControls
        timeFormat={settings.timeFormat}
        onToggleTimeFormat={handleToggleTimeFormat}
        onToggleTheme={handleToggleTheme}
        onToggleDigitColor={handleToggleDigitColor}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onIncreaseSize={handleIncreaseSize}
        onDecreaseSize={handleDecreaseSize}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        isDark={isDark}
        digitColor={settings.digitColor || 'auto'}
        fontSizeScale={settings.fontSizeScale}
      />

      {/* Main Center Stage Area */}
      <main
        id="tutimedekh-main-stage"
        className="flex-1 flex items-center justify-center w-full min-h-screen pt-20 pb-24 md:pb-8 md:pl-20 px-4"
      >
        {currentPage === 'time' && (
          <ClockView
            timeFormat={settings.timeFormat}
            fontSizeScale={settings.fontSizeScale}
            showSeconds={settings.showSeconds}
            isDark={isDark}
            digitColor={settings.digitColor || 'auto'}
          />
        )}

        {currentPage === 'stopwatch' && (
          <StopwatchView
            fontSizeScale={settings.fontSizeScale}
            isDark={isDark}
            soundEnabled={settings.soundEnabled}
            digitColor={settings.digitColor || 'auto'}
          />
        )}

        {currentPage === 'timer' && (
          <TimerView
            fontSizeScale={settings.fontSizeScale}
            isDark={isDark}
            soundEnabled={settings.soundEnabled}
            lastTimerPreset={settings.lastTimerPreset}
            onUpdatePreset={handleUpdateTimerPreset}
            digitColor={settings.digitColor || 'auto'}
          />
        )}
      </main>

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        isDark={isDark}
        soundEnabled={settings.soundEnabled}
      />
    </div>
  );
}

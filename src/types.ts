export type ThemeMode = 'dark' | 'light' | 'system';
export type AccentColor = 'neutral' | 'blue' | 'purple' | 'emerald' | 'amber';
export type BackgroundStyle = 'spheres' | 'aurora' | 'gradient' | 'minimal';
export type AtmosphereIntensity = 'subtle' | 'balanced' | 'expressive';
export type TimeFormat = '24h' | '12h';
export type AppPage = 'time' | 'stopwatch' | 'timer';

export interface LapItem {
  id: number;
  lapNumber: number;
  lapTime: number; // milliseconds
  overallTime: number; // milliseconds
}

export type DigitColor = 'auto' | 'white' | 'black';

export interface AppSettings {
  theme: ThemeMode;
  accent: AccentColor;
  backgroundStyle: BackgroundStyle;
  atmosphereIntensity: AtmosphereIntensity;
  timeFormat: TimeFormat;
  fontSizeScale: number; // default 1.45 (range 0.65 to 2.5)
  soundEnabled: boolean;
  showSeconds: boolean;
  lastTimerPreset: number; // in seconds
  digitColor: DigitColor; // 'auto' | 'white' | 'black'
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accent: 'blue',
  backgroundStyle: 'spheres',
  atmosphereIntensity: 'balanced',
  timeFormat: '24h',
  fontSizeScale: 1.45,
  soundEnabled: true,
  showSeconds: true,
  lastTimerPreset: 300, // 5 min
  digitColor: 'auto',
};

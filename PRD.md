# Product Requirements Document (PRD) — TuTimeDekh

## 1. Executive Summary & Vision
**TuTimeDekh** is a minimalist, futuristic, and aesthetic web utility featuring a **Live Clock**, **Precision Stopwatch**, and **Countdown Timer**. Designed with cinematic glassmorphism, fluid micro-interactions, responsive sizing, and zero external backend/audio dependencies, the application serves as both a daily desktop ambient display and an everyday timekeeper.

---

## 2. Core Architectural Principles
- **Zero Backend / Offline-First**: No database, no user authentication, no external API keys required.
- **Client-Side Persistence**: All UI preferences (theme, format, font scale, accents, sound preferences) persist cleanly in `localStorage` under key `tutimedekh_settings`.
- **Pure Web Audio API**: Tactile click sounds and alarms are generated via Web Audio API oscillators (`src/utils/audio.ts`), requiring no asset downloads or network requests.
- **Drift-Free Precision**: Stopwatch and countdown calculations use delta timestamps (`Date.now()`) with `requestAnimationFrame` and high-frequency checks to eliminate interval drift.

---

## 3. Technology Stack
- **Framework**: React 19 / Vite / TypeScript
- **Styling**: Tailwind CSS (v4) with custom backdrop-filter glass utilities in `src/index.css`
- **Icons**: `lucide-react`
- **Typography**: Google Fonts (`Outfit` for clock numerals, `Plus Jakarta Sans` for body UI, `JetBrains Mono` for monospace timer/laps)
- **Deployment Targets**: Vercel, Netlify, Cloud Run, GitHub Pages

---

## 4. File Structure & Component Map

```text
/
├── index.html                           # App entry point with preconnected Google Fonts & meta tags
├── metadata.json                        # Applet metadata
├── package.json                         # Dependencies & scripts
├── vite.config.ts                       # Vite configuration with Tailwind CSS plugin & path alias
├── PRD.md                               # This Product Requirements Document
├── README.md                            # High-level overview & run instructions
└── src/
    ├── main.tsx                         # React root bootstrap
    ├── App.tsx                          # Core application orchestrator, routing & global state
    ├── index.css                        # Tailwind directives, glassmorphism classes & custom animations
    ├── types.ts                         # Global TypeScript definitions & default configurations
    ├── hooks/
    │   ├── useLocalStorage.ts           # Type-safe generic persistent state hook
    │   ├── useFullscreen.ts             # Cross-browser Fullscreen API hook
    │   └── useKeyboardShortcuts.ts      # Global keyboard shortcut binding & focus filter
    ├── utils/
    │   ├── audio.ts                     # Web Audio API sound generator (clicks, chords, alarm)
    │   └── timeFormat.ts                # Formatting helpers (12h/24h, stopwatch splits, timer parser)
    └── components/
        ├── BackgroundSphereAtmosphere.tsx # Animated floating glass 3D spheres & glowing caustics
        ├── Sidebar.tsx                  # Fixed vertical glass navigation for desktop (left)
        ├── MobileNavigation.tsx         # Floating pill glass navigation for mobile (bottom)
        ├── TopControls.tsx              # Top horizontal glass dock (Format, Palette, A+/A-, Fullscreen, Sound)
        ├── ClockView.tsx                # Large minimalist live clock view
        ├── StopwatchView.tsx            # Stopwatch view with laps, fastest/slowest lap highlighting
        ├── TimerView.tsx                # Countdown timer view with manual controls, presets & audio alarm
        ├── AppearanceModal.tsx          # Modal for Themes (Dark, Light, System), Accents, Background styles
        ├── AtmosphereModal.tsx          # Modal for Atmosphere intensity (Subtle, Balanced, Expressive) & options
        └── ShortcutsModal.tsx           # Modal listing all keyboard shortcuts
```

---

## 5. State Management & Data Schema

### 5.1 `AppSettings` Schema (`src/types.ts`)
```typescript
export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  accent: 'neutral' | 'blue' | 'purple' | 'emerald' | 'amber';
  backgroundStyle: 'spheres' | 'aurora' | 'gradient' | 'minimal';
  atmosphereIntensity: 'subtle' | 'balanced' | 'expressive';
  timeFormat: '24h' | '12h';
  fontSizeScale: number;      // 0.65 to 1.45 (step: 0.08)
  soundEnabled: boolean;
  showSeconds: boolean;
  lastTimerPreset: number;    // seconds (default: 300)
}
```

### 5.2 Navigation Pages
- `time`: Live Clock display (default)
- `stopwatch`: Elapsed time with splits
- `timer`: Countdown timer with alarm

---

## 6. Functional Specifications

### 6.1 Live Clock (`ClockView.tsx`)
- **Display**: Ultra-large thin digits (`clamp` responsive font sizing modulated by `fontSizeScale`).
- **Format Toggle**:
  - `24h`: `HH:MM:SS` (or `HH:MM` if seconds disabled)
  - `12h`: `hh:MM:SS AM/PM`
- **Precision Toggle**: Seconds counter can be toggled on/off in the Atmosphere menu.

### 6.2 Precision Stopwatch (`StopwatchView.tsx`)
- **Accuracy**: Based on `Date.now() - startTime + accumulatedTime` synced with `requestAnimationFrame`.
- **Controls**:
  - **Start / Pause**: Toggles state, plays audio feedback.
  - **Reset**: Resets time and clears recorded laps.
  - **Lap**: Records split time (`lapTime`) and total elapsed time (`overallTime`).
- **Lap Table**: Scrollable list with automatic green highlight for fastest lap and red for slowest lap.

### 6.3 Countdown Timer (`TimerView.tsx`)
- **Dual Input Modes**:
  1. **Quick Presets**: 1 min, 5 min, 10 min, 15 min, 25 min (Pomodoro), 30 min.
  2. **Manual Adjustment**: Increment/decrement buttons for Hours, Minutes, and Seconds when stopped.
- **Visual Progress**: Top glass border progress bar tracking percentage remaining.
- **Alarm System**: On reaching 00:00:00, starts pulsing visual alert and plays repeating sparkling harmonic chime until dismissed or reset.

### 6.4 Atmosphere & Visual Design System
- **Dark Mode**: Deep `#08090c` background, high-contrast white digits, subtle reflections, 3D radial glass bubbles with specular highlights.
- **Light Mode**: Frost `#eef4fc` background, sky-blue/cyan 3D glowing spheres, translucent frosted glass container.
- **Dynamic Accent Glow**: Ambient backdrop blur tinted by selected accent (Blue, Purple, Emerald, Amber, Neutral).
- **Reduced Motion Support**: Fully respects `prefers-reduced-motion` media queries.

---

## 7. Interaction & Keyboard Shortcuts

| Shortcut | Description | Implementation Hook |
| :--- | :--- | :--- |
| `1` | Switch to Live Clock | `useKeyboardShortcuts` -> `navigate('time')` |
| `2` | Switch to Stopwatch | `useKeyboardShortcuts` -> `navigate('stopwatch')` |
| `3` | Switch to Timer | `useKeyboardShortcuts` -> `navigate('timer')` |
| `Space` | Start / Pause active Stopwatch or Timer | Dispatches custom window event `stopwatch-control` / `timer-control` |
| `R` | Reset active Stopwatch or Timer | Dispatches reset event |
| `F` | Toggle Browser Fullscreen | `useFullscreen` |
| `T` | Toggle 12h / 24h Time Format | Updates `timeFormat` state |
| `M` | Toggle Audio Feedback | Updates `soundEnabled` state |
| `+` / `=` | Increase Font Size | Updates `fontSizeScale` (+0.08) |
| `-` / `_` | Decrease Font Size | Updates `fontSizeScale` (-0.08) |
| `?` | Open Keyboard Shortcuts Modal | Toggles `isShortcutsOpen` |
| `Esc` | Close any open modal | Closes active modals |

*Note: All shortcuts automatically ignore key presses when typing inside text/input fields.*

---

## 8. Guidance for AI Agents & Future Contributors
When modifying or extending this codebase, adhere to these rules:
1. **Glassmorphism Consistency**: Always reuse `.glass-panel-dark`, `.glass-panel-light`, `.glass-button-dark`, `.glass-button-light`, and `.glass-circle-*` classes from `src/index.css`.
2. **Audio Feedback**: Wrap interactive button triggers with `playTactileClick(soundEnabled)` from `src/utils/audio.ts`.
3. **No Unnecessary External Dependencies**: Do not import external date libraries (like moment or date-fns) or heavy audio files; continue using native TypeScript `Date` utilities in `src/utils/timeFormat.ts` and the Web Audio API.
4. **Clean State Propagation**: Keep global settings in `AppSettings` managed via `useLocalStorage` in `App.tsx` and pass them down as typed props.
5. **Accessibility**: Maintain accessible `aria-label` tags, semantic `<main>`, `<aside>`, `<nav>`, `<header>` structures, and distinct focus states on all icon buttons.

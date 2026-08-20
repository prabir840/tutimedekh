# TuTimeDekh — Premium Minimalist Time Web Application

**TuTimeDekh** is a futuristic, glassmorphism-inspired minimalist time web utility featuring a Live Clock, Precision Stopwatch, and Countdown Timer.

---

## ✨ Features

- **Live Clock (`/time`)**: Ultra-clean large typography with smooth resizing, 12-hour/24-hour toggle, and optional seconds counter.
- **Precision Stopwatch (`/stopwatch`)**: Drift-free timestamp-based timer with Start, Pause, Resume, Reset, and Lap recording with split calculations and speed highlights.
- **Countdown Timer (`/timer`)**: Quick presets (`1m`, `5m`, `10m`, `15m`, `25m`, `30m`), interactive manual spinner adjustment, visual progress indicator, and crystal bell audio alarm.
- **Atmosphere & Themes**:
  - **Dark Theme (Default)**: Deep cinematic black glass with floating 3D caustics & illuminated glass bubbles.
  - **Light Theme**: Radiant frosted glass plate with cyan/blue floating spheres.
  - **System Theme**: Automatic OS preference sync.
  - **Accent Colors**: Neutral, Blue, Purple, Emerald, and Amber.
  - **Visual Styles**: Floating 3D Spheres, Ambient Aurora, Soft Gradient, Pure Minimal.
  - **Intensity Control**: Subtle, Balanced, Expressive.
- **Controls & Ergonomics**:
  - Circular top glass dock (`12/24`, `Palette`, `Atmosphere`, `A+`, `A-`, `Fullscreen`, `Sound`, `Shortcuts`).
  - Desktop fixed vertical glass sidebar & mobile floating bottom navigation.
  - Fullscreen API support.
  - Pure Web Audio API synthetic feedback & alarm (no external audio file dependencies).
  - Browser `localStorage` persistence for all preferences.
  - Complete keyboard shortcut control.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `1` | Switch to Live Clock |
| `2` | Switch to Stopwatch |
| `3` | Switch to Timer |
| `Space` | Start / Pause active Stopwatch or Timer |
| `R` | Reset active Stopwatch or Timer |
| `F` | Toggle Browser Fullscreen |
| `T` | Toggle 12h / 24h Time Format |
| `M` | Toggle Sound Effects (Mute/Unmute) |
| `+` / `-` | Increase / Decrease Clock Font Size |
| `?` | Open Keyboard Shortcuts Guide |
| `Esc` | Close open popups/modals |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, pnpm, or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/tutimedekh.git

# Navigate to project directory
cd tutimedekh

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` (or `http://localhost:5173`) in your browser.

### Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deployment

### Vercel Deployment

Deploy with 1-click on Vercel:

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Framework Preset: **Vite** (or Next.js if using the Next.js adapter).
4. Click **Deploy**.

---

## 🛠️ Tech Stack

- **Framework**: React 19 / Vite / TypeScript
- **Styling**: Tailwind CSS with custom glass caustics & backdrop filters
- **Icons**: Lucide React
- **Audio**: Web Audio API oscillator synthesis
- **Storage**: Browser LocalStorage API
- **Display**: Browser Fullscreen API

---

## 📄 License

MIT License © 2026 TuTimeDekh

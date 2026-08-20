import React from 'react';
import { Clock, Timer as StopwatchIcon, Hourglass } from 'lucide-react';
import { AppPage } from '../types';
import { playTactileClick } from '../utils/audio';

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isDark: boolean;
  soundEnabled: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isDark,
  soundEnabled,
}) => {
  const navItems = [
    {
      id: 'time' as AppPage,
      icon: Clock,
      label: 'Live Clock',
      ariaLabel: 'Switch to Live Clock (Press 1)',
    },
    {
      id: 'stopwatch' as AppPage,
      icon: StopwatchIcon,
      label: 'Stopwatch',
      ariaLabel: 'Switch to Stopwatch (Press 2)',
    },
    {
      id: 'timer' as AppPage,
      icon: Hourglass,
      label: 'Timer',
      ariaLabel: 'Switch to Timer (Press 3)',
    },
  ];

  return (
    <aside
      id="tutimedekh-sidebar"
      aria-label="Application Navigation"
      className={`hidden md:flex flex-col justify-center items-center fixed left-0 top-0 bottom-0 w-16 sm:w-20 z-30 transition-colors duration-500 border-r ${
        isDark ? 'border-white/5 bg-[#08090c]/20' : 'border-slate-300/40 bg-white/10'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              aria-label={item.ariaLabel}
              title={item.label}
              onClick={() => {
                playTactileClick(soundEnabled);
                onNavigate(item.id);
              }}
              className={`relative group w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
                isDark ? 'glass-button-dark' : 'glass-button-light'
              } ${isActive ? 'active scale-105' : 'opacity-75 hover:opacity-100'}`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <span
                  className={`absolute inset-0 rounded-xl transition-opacity pointer-events-none ${
                    isDark
                      ? 'bg-gradient-to-t from-white/10 to-white/5 ring-1 ring-white/30'
                      : 'bg-gradient-to-t from-blue-400/20 to-blue-200/10 ring-1 ring-blue-400/40'
                  }`}
                />
              )}

              <Icon
                strokeWidth={1.5}
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? 'text-white scale-105 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                      : 'text-blue-600 scale-105 drop-shadow-[0_0_6px_rgba(37,117,252,0.3)]'
                    : isDark
                    ? 'text-neutral-300 group-hover:text-white'
                    : 'text-neutral-600 group-hover:text-neutral-900'
                }`}
              />

              {/* Minimal Hover Tooltip */}
              <span
                className={`absolute left-full ml-4 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-0 ${
                  isDark
                    ? 'bg-neutral-900/90 text-neutral-200 border border-white/10 shadow-lg'
                    : 'bg-white/95 text-neutral-800 border border-slate-200 shadow-md'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

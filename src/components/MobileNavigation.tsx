import React from 'react';
import { Clock, Timer as StopwatchIcon, Hourglass } from 'lucide-react';
import { AppPage } from '../types';
import { playTactileClick } from '../utils/audio';

interface MobileNavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isDark: boolean;
  soundEnabled: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPage,
  onNavigate,
  isDark,
  soundEnabled,
}) => {
  const navItems = [
    {
      id: 'time' as AppPage,
      icon: Clock,
      label: 'Time',
      ariaLabel: 'Switch to Live Clock',
    },
    {
      id: 'stopwatch' as AppPage,
      icon: StopwatchIcon,
      label: 'Stopwatch',
      ariaLabel: 'Switch to Stopwatch',
    },
    {
      id: 'timer' as AppPage,
      icon: Hourglass,
      label: 'Timer',
      ariaLabel: 'Switch to Timer',
    },
  ];

  return (
    <nav
      id="tutimedekh-mobile-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-3xl transition-all duration-300 ${
          isDark
            ? 'glass-panel-dark glass-glossy shadow-[0_15px_35px_rgba(0,0,0,0.8)]'
            : 'glass-panel-light glass-glossy glass-glossy-light shadow-[0_15px_35px_rgba(50,100,200,0.18)]'
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              aria-label={item.ariaLabel}
              onClick={() => {
                playTactileClick(soundEnabled);
                onNavigate(item.id);
              }}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isDark ? 'glass-button-dark' : 'glass-button-light'
              } ${isActive ? 'active scale-105' : 'opacity-70'}`}
            >
              <Icon
                strokeWidth={1.75}
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive
                    ? isDark
                      ? 'text-white'
                      : 'text-blue-600'
                    : isDark
                    ? 'text-neutral-400'
                    : 'text-neutral-600'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

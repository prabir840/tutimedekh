import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  soundEnabled: boolean;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  isDark,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1', description: 'Switch to Live Clock' },
    { key: '2', description: 'Switch to Stopwatch' },
    { key: '3', description: 'Switch to Timer' },
    { key: 'Space', description: 'Start / Pause active Stopwatch or Timer' },
    { key: 'R', description: 'Reset Stopwatch or Timer' },
    { key: 'F', description: 'Toggle Fullscreen mode' },
    { key: 'T', description: 'Toggle 12h / 24h Time Format' },
    { key: 'M', description: 'Toggle Sound Effects' },
    { key: '+ / -', description: 'Increase / Decrease time font size' },
    { key: '?', description: 'Open this Keyboard Shortcuts Guide' },
    { key: 'Esc', description: 'Close any open panel' },
  ];

  return (
    <div
      id="shortcuts-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playTactileClick(soundEnabled);
          onClose();
        }
      }}
    >
      <div
        id="shortcuts-modal-container"
        className={`w-full max-w-md p-6 rounded-3xl transition-all duration-300 transform scale-100 ${
          isDark
            ? 'glass-panel-dark glass-glossy text-white'
            : 'glass-panel-light glass-glossy glass-glossy-light text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Keyboard className={`w-5 h-5 ${isDark ? 'text-sky-300' : 'text-blue-600'}`} />
            <h2 className="text-lg font-medium tracking-tight">Keyboard Shortcuts</h2>
          </div>
          <button
            id="close-shortcuts-btn"
            onClick={() => {
              playTactileClick(soundEnabled);
              onClose();
            }}
            aria-label="Close shortcuts panel"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-black/5 text-neutral-600 hover:text-black'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-2 px-3 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-black/5'
              }`}
            >
              <span className="text-sm opacity-80">{sc.description}</span>
              <kbd
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold tracking-wide ${
                  isDark
                    ? 'bg-neutral-800 text-neutral-200 border border-white/15 shadow-sm'
                    : 'bg-white text-neutral-800 border border-slate-300 shadow-sm'
                }`}
              >
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

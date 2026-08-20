import { useEffect } from 'react';
import { AppPage } from '../types';

interface ShortcutHandlers {
  onNavigate: (page: AppPage) => void;
  onTogglePlayPause?: () => void;
  onReset?: () => void;
  onToggleFullscreen?: () => void;
  onToggleSound?: () => void;
  onToggleShortcutsModal?: () => void;
  onCloseModals?: () => void;
  onToggleFormat?: () => void;
  onIncreaseSize?: () => void;
  onDecreaseSize?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInputActive =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select' ||
        document.activeElement?.hasAttribute('contenteditable');

      if (e.key === 'Escape') {
        handlers.onCloseModals?.();
        return;
      }

      // If user is typing in a field, allow normal typing
      if (isInputActive) {
        return;
      }

      if (e.key === '1') {
        e.preventDefault();
        handlers.onNavigate('time');
      } else if (e.key === '2') {
        e.preventDefault();
        handlers.onNavigate('stopwatch');
      } else if (e.key === '3') {
        e.preventDefault();
        handlers.onNavigate('timer');
      } else if (e.code === 'Space') {
        e.preventDefault();
        handlers.onTogglePlayPause?.();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handlers.onReset?.();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handlers.onToggleFullscreen?.();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handlers.onToggleSound?.();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        handlers.onToggleShortcutsModal?.();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handlers.onIncreaseSize?.();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handlers.onDecreaseSize?.();
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        handlers.onToggleFormat?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}

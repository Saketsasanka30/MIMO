import { useEffect, useRef } from 'react';

/**
 * Triggers `onTimeout` after `timeoutMs` of user inactivity while `enabled` is true.
 * Listens for pointer, touch, and keyboard events across the kiosk window.
 *
 * @param {Object} options
 * @param {boolean} options.enabled - Whether the idle timer is active
 * @param {number} [options.timeoutMs=60000] - Inactivity threshold in milliseconds
 * @param {() => void} options.onTimeout - Callback invoked on timeout
 */
export function useIdleTimeout({ enabled, timeoutMs = 60000, onTimeout }) {
  const callbackRef = useRef(onTimeout);
  callbackRef.current = onTimeout;

  useEffect(() => {
    if (!enabled) return undefined;

    let timerId = null;

    const resetTimer = () => {
      if (timerId !== null) clearTimeout(timerId);
      timerId = setTimeout(() => {
        callbackRef.current?.();
      }, timeoutMs);
    };

    const events = ['pointerdown', 'pointermove', 'keydown', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timerId !== null) clearTimeout(timerId);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [enabled, timeoutMs]);
}

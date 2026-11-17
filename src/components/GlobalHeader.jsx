import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './GlobalHeader.css';

const SPRING_LAYOUT = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 0.9
};

/**
 * Globally fixed Kiosk Header displaying top-left MIMO branding consistently
 * across every screen, plus the extreme top-left Back button on CODE_ENTRY.
 */
export default function GlobalHeader({
  showBack = false,
  onBack,
  backDisabled = false
}) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="global-header" aria-label="MIMO Kiosk Header">
      <div className="global-header__row">
        <AnimatePresence initial={false} mode="popLayout">
          {showBack ? (
            <motion.button
              key="back-btn"
              type="button"
              className="global-back-btn"
              aria-label="Back to welcome screen"
              onClick={onBack}
              disabled={backDisabled}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.72, x: -28 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0, pointerEvents: 'none' }
                  : { opacity: 0, scale: 0.72, x: -24, pointerEvents: 'none' }
              }
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg
                viewBox="0 0 24 24"
                width="50"
                height="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </motion.button>
          ) : null}
        </AnimatePresence>

        {/* Prominent MIMO Top-Left Brand Lockup smoothly gliding with back button */}
        <motion.div
          className="mimo-brand"
          layout={!reduceMotion}
          transition={SPRING_LAYOUT}
        >
          <div className="mimo-brand__emblem" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="84" height="84" fill="none">
              <rect x="12" y="6" width="24" height="10" rx="3" fill="#e2e8f0" />
              <rect x="6" y="14" width="36" height="18" rx="6" fill="#ffffff" />
              <circle cx="14" cy="22" r="2.5" fill="#10b981" />
              <circle cx="21" cy="22" r="2.5" fill="#ffd166" />
              <rect x="13" y="26" width="22" height="15" rx="3" fill="#ffd166" />
              <path d="M17 31h14M17 36h10" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
              <path
                d="M39 7l1.2 3.2L43.5 11l-3.3.8L39 15l-1.2-3.2L34.5 11l3.3-.8z"
                fill="#ffd166"
              />
            </svg>
          </div>

          <div className="mimo-brand__text">
            <span className="mimo-brand__wordmark">MIMO</span>
            <span className="mimo-brand__sub">SELF-SERVICE PRINTING KIOSK</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

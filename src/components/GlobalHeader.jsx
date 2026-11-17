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
          <div className="mimo-brand__text">
            <span className="mimo-brand__wordmark">MIMO</span>
            <span className="mimo-brand__sub">SELF-SERVICE PRINTING KIOSK</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

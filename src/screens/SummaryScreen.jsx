import { useEffect, useState } from 'react';
import { FestiveCelebrationBurst, MimoHeader } from '../components/FestiveDecorations';
import './SummaryScreen.css';

const AUTO_RESET_SECONDS = 10;

export default function SummaryScreen({ userName = 'Demo', onDone }) {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_RESET_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      onDone();
    }
  }, [secondsLeft, onDone]);

  return (
    <section className="kiosk-screen-host summary-screen" aria-label="Documents Ready">
      <FestiveCelebrationBurst />
      <MimoHeader compact />

      <div className="glass-card summary-card">
        <h1 className="kiosk-heading summary-title">
          <span className="summary-user">{String(userName).toUpperCase()}</span>, your documents are ready.
        </h1>

        {/* Document Dispenser Visual matching reference */}
        <div className="summary-dispenser" aria-hidden="true">
          <div className="summary-dispenser__slot">
            <div className="summary-dispenser__mouth" />
          </div>
          <div className="summary-dispenser__sheet">
            <div className="summary-sheet__badge">
              <svg viewBox="0 0 24 24" width="38" height="38" fill="none">
                <path
                  d="M6 12.5l4 4L18 8.5"
                  stroke="#f59e0b"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="summary-sheet__line summary-sheet__line--lg" />
            <span className="summary-sheet__line summary-sheet__line--md" />
            <span className="summary-sheet__line summary-sheet__line--sm" />
            <div className="summary-sheet__footer">
              <span className="summary-sheet__stamp" />
              <span className="summary-sheet__sig" />
            </div>
          </div>
        </div>

        <p className="summary-collect-instruction">
          <span className="summary-arrow" aria-hidden="true">↓</span>
          <span>PLEASE COLLECT YOUR DOCUMENTS FROM BELOW</span>
          <span className="summary-arrow" aria-hidden="true">↓</span>
        </p>

        <button
          type="button"
          className="kiosk-btn kiosk-btn--primary summary-done-btn"
          onClick={onDone}
        >
          <span>DONE</span>
          <svg
            viewBox="0 0 24 24"
            width="42"
            height="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9.5" />
            <path d="M8.5 12.5l2.5 2.5 4.8-5.2" />
          </svg>
        </button>

        <p className="summary-countdown" aria-live="polite">
          Returning to home in {secondsLeft}s…
        </p>
      </div>

      <div className="summary-spacer" aria-hidden="true" />
    </section>
  );
}

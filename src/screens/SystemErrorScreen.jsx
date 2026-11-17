import './SystemErrorScreen.css';

export default function SystemErrorScreen({
  errorInfo,
  onRetry,
  onBackHome
}) {
  const code = errorInfo?.code || '0000';
  const title = errorInfo?.title || 'Printing Failed';
  const message =
    errorInfo?.message ||
    'Unable to complete your print job. A system error prevented the printer from releasing your document.';
  const errorCode = errorInfo?.errorCode || `ERR-${code}`;

  return (
    <section className="kiosk-screen-host system-error-screen" aria-label="System Error">
      <div className="glass-card system-error-card">
        <div className="system-error-emblem" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="84"
            height="84"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="7.5" x2="12" y2="13" />
            <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <div className="system-error-copy">
          <span className="system-error-badge">SYSTEM ERROR · {errorCode}</span>
          <h1 className="kiosk-heading system-error-title">{title}</h1>
          <p className="system-error-message">{message}</p>
        </div>

        <div className="system-error-details" role="status" aria-live="polite">
          <div className="system-error-detail-row">
            <span className="system-error-detail-label">Release Code</span>
            <span className="system-error-detail-value">{code}</span>
          </div>
          <div className="system-error-detail-row">
            <span className="system-error-detail-label">Print Status</span>
            <span className="system-error-detail-value system-error-detail-value--danger">
              Job Aborted — No Pages Printed
            </span>
          </div>
          <div className="system-error-detail-row">
            <span className="system-error-detail-label">Recommended Action</span>
            <span className="system-error-detail-value">
              Verify your Mimo code and retry printing
            </span>
          </div>
        </div>

        <div className="system-error-actions">
          <button
            type="button"
            className="kiosk-btn kiosk-btn--primary system-error-btn"
            onClick={onRetry}
          >
            <svg
              viewBox="0 0 24 24"
              width="36"
              height="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>RETRY</span>
          </button>

          <button
            type="button"
            className="kiosk-btn kiosk-btn--ghost system-error-btn"
            onClick={onBackHome}
          >
            <span>BACK TO HOME</span>
          </button>
        </div>
      </div>

      <footer className="system-error-footer">
        <p className="system-error-footer-note">
          Need help? Contact kiosk support with reference {errorCode}
        </p>
      </footer>
    </section>
  );
}

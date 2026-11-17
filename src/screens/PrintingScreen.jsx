import CometDial from '../components/CometDial';
import './PrintingScreen.css';

/**
 * Printing lifecycle status stages mapped by progress percentage.
 */
export const STATUS_STEPS = [
  { max: 15, label: 'Warming up printer…' },
  { max: 35, label: 'Preparing pages…' },
  { max: 90, label: 'Printing documents…' },
  { max: 100, label: 'Finishing up…' }
];

function getStatusLabel(progress) {
  const step = STATUS_STEPS.find(item => progress <= item.max);
  return step ? step.label : STATUS_STEPS[STATUS_STEPS.length - 1].label;
}

export default function PrintingScreen({
  userName = 'Demo',
  progress,
  pagesPrinted,
  totalPages,
  isLandscape = false
}) {
  const statusLabel = getStatusLabel(progress);
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <section className="kiosk-screen-host printing-screen" aria-label="Printing in Progress">
      <div className="printing-stack">
        {/* Greeting & Live Status Card */}
        <div className="glass-card printing-info-card">
          <h1 className="kiosk-heading printing-greeting">
            Hello <span className="printing-greeting__name">{userName}</span>..!
          </h1>
          <p className="printing-subline">Printing in progress…</p>
          <p className="printing-subline">Please wait.</p>
          <p className="printing-stage-text" role="status" aria-live="polite">
            {statusLabel}
          </p>
        </div>

        {/* Large Read-only CometDial Progress Ring Card */}
        <div className="glass-card printing-dial-card">
          <div
            className="printing-dial-readonly"
            role="progressbar"
            aria-label="Printing progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clampedProgress}
          >
            <CometDial
              value={clampedProgress}
              defaultValue={0}
              min={0}
              max={100}
              step={1}
              unit="%"
              label="Printing"
              accent="#ffd166"
              ink="#f8fafc"
              size={isLandscape ? 420 : 540}
              sweep={320}
              thickness={9}
              speed={25}
              tapBounce={0.2}
              flickBounce={0.1}
              momentum={1}
              cometReach={168}
              cometWidth={20}
            />
            <span className="printing-dial-stage">{statusLabel}</span>
          </div>

          <p className="printing-page-meta">
            Page {pagesPrinted} of {totalPages}
          </p>
        </div>
      </div>

      <footer className="printing-footer">
        <p className="printing-notice">Please do not remove paper while printing</p>
      </footer>
    </section>
  );
}

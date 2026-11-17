import { useState } from 'react';
import './MaintenanceScreen.css';

const MAINTENANCE_STATES = {
  offline: {
    id: 'offline',
    tabLabel: 'Machine Offline',
    badge: 'OFFLINE · LINK DISCONNECTED',
    title: 'Machine Offline',
    tone: 'danger',
    description:
      'This MIMO kiosk cannot reach the print controller right now. New print jobs are temporarily paused while reconnection runs automatically.',
    telemetry: [
      { label: 'Print Server', value: 'Offline', state: 'danger' },
      { label: 'Paper Trays', value: 'Ready (78%)', state: 'ok' },
      { label: 'Toner Levels', value: 'Normal', state: 'ok' },
      { label: 'Service Door', value: 'Locked', state: 'ok' }
    ]
  },
  paper: {
    id: 'paper',
    tabLabel: 'Out of Paper',
    badge: 'SUPPLY ALERT · TRAY EMPTY',
    title: 'Out of Paper',
    tone: 'warning',
    description:
      'Tray 1 and Tray 2 are empty (0 sheets of A4 paper remaining). Please alert an attendant to refill paper trays before starting a print job.',
    telemetry: [
      { label: 'Print Server', value: 'Online', state: 'ok' },
      { label: 'Paper Trays', value: 'Empty (0%)', state: 'danger' },
      { label: 'Toner Levels', value: 'Normal', state: 'ok' },
      { label: 'Service Door', value: 'Locked', state: 'ok' }
    ]
  },
  notices: {
    id: 'notices',
    tabLabel: 'Other Notices',
    badge: 'MAINTENANCE · SERVICE NOTICES',
    title: 'Maintenance Notices',
    tone: 'info',
    description:
      'Routine hardware checks and consumable alerts are active on this MIMO station. Review current kiosk diagnostics below.',
    telemetry: [
      { label: 'Print Server', value: 'Online', state: 'ok' },
      { label: 'Paper Trays', value: 'Low (15%)', state: 'warning' },
      { label: 'Black Toner', value: 'Low (10%)', state: 'warning' },
      { label: 'Thermal Fuser', value: 'Cooling Cycle', state: 'warning' }
    ]
  }
};

const EXTRA_NOTIFICATIONS = [
  {
    id: 'toner',
    level: 'warning',
    title: 'Low Toner Cartridge (10%)',
    detail: 'Black toner module nearing replacement threshold.'
  },
  {
    id: 'fuser',
    level: 'info',
    title: 'Thermal Calibration Active',
    detail: 'Fuser stabilization in progress (~2 mins remaining).'
  },
  {
    id: 'tray',
    level: 'danger',
    title: 'Tray 2 Jam / Cover Sensor',
    detail: 'Attendant inspection advised if feeding stalls.'
  }
];

function StatusIcon({ tone }) {
  if (tone === 'danger') {
    return (
      <svg
        viewBox="0 0 24 24"
        width="76"
        height="76"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 1l22 22" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (tone === 'warning') {
    return (
      <svg
        viewBox="0 0 24 24"
        width="76"
        height="76"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="11" x2="12" y2="15" />
        <circle cx="12" cy="18" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="76"
      height="76"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export default function MaintenanceScreen({
  initialMode = 'offline',
  onBackHome
}) {
  const [mode, setMode] = useState(
    MAINTENANCE_STATES[initialMode] ? initialMode : 'offline'
  );
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const activeState = MAINTENANCE_STATES[mode];

  const handleRecheck = () => {
    setChecking(true);
    setStatusMessage('Running diagnostics check…');
    setTimeout(() => {
      setChecking(false);
      setStatusMessage(
        mode === 'offline'
          ? 'Print server still unreachable. Try again shortly.'
          : mode === 'paper'
            ? 'Paper tray sensors still read 0 sheets.'
            : 'All maintenance notices remain active.'
      );
    }, 700);
  };

  return (
    <section className="kiosk-screen-host maintenance-screen" aria-label="Maintenance Mode">
      <div className="glass-card maintenance-card">
        {/* Selectable Maintenance Mode Tabs (min >= 96px tall) */}
        <div className="maintenance-tabs" role="tablist" aria-label="Maintenance conditions">
          {Object.values(MAINTENANCE_STATES).map(item => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              className={`maintenance-tab${mode === item.id ? ' is-selected' : ''}`}
              onClick={() => {
                setMode(item.id);
                setStatusMessage('');
              }}
            >
              {item.tabLabel}
            </button>
          ))}
        </div>

        <div className="maintenance-body">
          <div className="maintenance-summary">
            <div className={`maintenance-emblem maintenance-emblem--${activeState.tone}`}>
              <StatusIcon tone={activeState.tone} />
            </div>

            <div className="maintenance-copy">
              <span className={`maintenance-badge maintenance-badge--${activeState.tone}`}>
                {activeState.badge}
              </span>
              <h1 className="kiosk-heading maintenance-title">{activeState.title}</h1>
              <p className="maintenance-desc">{activeState.description}</p>
            </div>
          </div>

          <div className="maintenance-panels">
            {/* Live Machine Telemetry Grid */}
            <div className="maintenance-telemetry">
              {activeState.telemetry.map(metric => (
                <div key={metric.label} className="maintenance-metric">
                  <span className="maintenance-metric__label">{metric.label}</span>
                  <span
                    className={`maintenance-metric__value maintenance-metric__value--${metric.state}`}
                  >
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Active Maintenance Notifications List */}
            <div className="maintenance-notices" aria-label="Maintenance notifications">
              {EXTRA_NOTIFICATIONS.map(notice => (
                <div key={notice.id} className="maintenance-notice-item">
                  <span
                    className={`maintenance-notice-dot maintenance-notice-dot--${notice.level}`}
                    aria-hidden="true"
                  />
                  <div className="maintenance-notice-body">
                    <span className="maintenance-notice-title">{notice.title}</span>
                    <span className="maintenance-notice-detail">{notice.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {statusMessage ? (
          <p className="maintenance-recheck-msg" role="status" aria-live="polite">
            {statusMessage}
          </p>
        ) : null}

        <div className="maintenance-actions">
          <button
            type="button"
            className="kiosk-btn kiosk-btn--primary maintenance-btn"
            onClick={handleRecheck}
            disabled={checking}
          >
            <span>{checking ? 'CHECKING…' : 'REFRESH STATUS'}</span>
          </button>

          <button
            type="button"
            className="kiosk-btn kiosk-btn--ghost maintenance-btn"
            onClick={onBackHome}
          >
            <span>BACK TO HOME</span>
          </button>
        </div>
      </div>

      <footer className="maintenance-footer">
        <p className="maintenance-footer-note">
          MIMO Kiosk Diagnostics · Attendant Support Desk
        </p>
      </footer>
    </section>
  );
}

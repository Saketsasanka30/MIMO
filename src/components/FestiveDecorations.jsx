import './FestiveDecorations.css';

const SNOWFLAKES = [
  { left: '4%', size: 12, delay: '0s', dur: '11s', sway: '24px', opacity: 0.72, crystal: false },
  { left: '11%', size: 24, delay: '-3s', dur: '14s', sway: '-28px', opacity: 0.55, crystal: true },
  { left: '19%', size: 9, delay: '-7s', dur: '9.5s', sway: '18px', opacity: 0.6, crystal: false },
  { left: '27%', size: 20, delay: '-1.5s', dur: '13s', sway: '30px', opacity: 0.48, crystal: true },
  { left: '34%', size: 10, delay: '-5s', dur: '10.5s', sway: '-20px', opacity: 0.65, crystal: false },
  { left: '43%', size: 28, delay: '-8.5s', dur: '15.5s', sway: '26px', opacity: 0.44, crystal: true },
  { left: '52%', size: 11, delay: '-2s', dur: '10s', sway: '-22px', opacity: 0.7, crystal: false },
  { left: '61%', size: 22, delay: '-6s', dur: '13.5s', sway: '22px', opacity: 0.52, crystal: true },
  { left: '69%', size: 8, delay: '-4s', dur: '9s', sway: '-16px', opacity: 0.58, crystal: false },
  { left: '77%', size: 26, delay: '-9.5s', dur: '14.5s', sway: '-28px', opacity: 0.46, crystal: true },
  { left: '85%', size: 13, delay: '-0.8s', dur: '11.5s', sway: '20px', opacity: 0.68, crystal: false },
  { left: '93%', size: 20, delay: '-4.8s', dur: '12.8s', sway: '-24px', opacity: 0.54, crystal: true },
  { left: '15%', size: 7, delay: '-11s', dur: '8.8s', sway: '14px', opacity: 0.5, crystal: false },
  { left: '57%', size: 14, delay: '-7.2s', dur: '12s', sway: '26px', opacity: 0.62, crystal: false },
  { left: '89%', size: 9, delay: '-3.6s', dur: '9.8s', sway: '-18px', opacity: 0.6, crystal: false }
];

const TWINKLES = [
  { left: '8%', top: '14%', size: 20, delay: '0.2s', color: 'gold' },
  { left: '91%', top: '12%', size: 22, delay: '1.1s', color: 'gold' },
  { left: '16%', top: '34%', size: 14, delay: '2.0s', color: 'frost' },
  { left: '84%', top: '38%', size: 16, delay: '0.7s', color: 'gold' },
  { left: '7%', top: '68%', size: 18, delay: '1.5s', color: 'frost' },
  { left: '92%', top: '74%', size: 20, delay: '2.6s', color: 'gold' }
];

const SUMMARY_CONFETTI = Array.from({ length: 36 }, (_, i) => {
  const angle = (i / 36) * Math.PI * 2;
  const dist = 220 + (i % 6) * 95;
  const tx = Math.round(Math.cos(angle) * dist);
  const ty = Math.round(Math.sin(angle) * dist - 90);
  const tones = ['gold', 'crimson', 'pine', 'silver', 'frost'];
  return {
    id: i,
    tx: `${tx}px`,
    ty: `${ty}px`,
    rot: `${(i * 42) % 360}deg`,
    delay: `${(i % 7) * 40}ms`,
    tone: tones[i % tones.length],
    isRibbon: i % 2 === 0,
    width: i % 2 === 0 ? 18 : 14,
    height: i % 2 === 0 ? 10 : 14
  };
});

function SnowflakeGlyph({ size }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
      <path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5M4.5 9.5L7 12l-2.5 2.5M19.5 9.5L17 12l2.5 2.5" />
    </svg>
  );
}

/**
 * Pure CSS gentle snowfall & festive starlight layer across the kiosk background.
 */
export function FestiveSnowfall() {
  return (
    <div className="festive-atmosphere" aria-hidden="true">
      {SNOWFLAKES.map((flake, idx) => (
        <span
          key={idx}
          className={`snow-particle${flake.crystal ? ' snow-particle--crystal' : ''}`}
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDelay: flake.delay,
            animationDuration: flake.dur,
            '--sway': flake.sway
          }}
        >
          {flake.crystal ? <SnowflakeGlyph size={flake.size} /> : null}
        </span>
      ))}

      {TWINKLES.map((star, idx) => (
        <span
          key={`star-${idx}`}
          className={`twinkle-star twinkle-star--${star.color}`}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay
          }}
        >
          <svg viewBox="0 0 24 24" width={star.size} height={star.size} fill="currentColor">
            <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/**
 * Smooth celebratory New Year + Winter confetti burst for the Summary screen.
 */
export function FestiveCelebrationBurst() {
  return (
    <div className="festive-burst" aria-hidden="true">
      {SUMMARY_CONFETTI.map(piece => (
        <span
          key={piece.id}
          className={`festive-burst__piece festive-burst__piece--${piece.tone}${piece.isRibbon ? ' is-ribbon' : ''}`}
          style={{
            width: `${piece.width}px`,
            height: `${piece.height}px`,
            '--tx': piece.tx,
            '--ty': piece.ty,
            '--rot': piece.rot,
            animationDelay: piece.delay
          }}
        />
      ))}
    </div>
  );
}

/**
 * Ornate "Happy New Year 2027" sign shared across all 4 kiosk screens
 * so the festive calligraphy, ornament, and firework design stays identical throughout.
 */
export function NewYearBanner({ compact = false, className = '' }) {
  const ornamentSize = compact ? 76 : 104;

  return (
    <div
      className={`ny-banner${compact ? ' ny-banner--compact' : ''}${className ? ` ${className}` : ''}`}
    >
      {/* Left Golden New Year Starburst Filigree */}
      <svg
        className="ny-banner__ornament ny-banner__ornament--left"
        viewBox="0 0 120 120"
        width={ornamentSize}
        height={ornamentSize}
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#ffd166" strokeWidth="2.4" strokeLinecap="round">
          <path d="M52 18v18M52 68v18M18 52h18M68 52h18" />
          <path d="M28 28l12 12M64 64l12 12M76 28L64 40M40 64L28 76" />
        </g>
        <circle cx="52" cy="52" r="8" fill="#ffe49e" />
        <path d="M90 26l3.5 9 9 3.5-9 3.5-3.5 9-3.5-9-9-3.5 9-3.5z" fill="#ffd166" />
        <circle cx="92" cy="86" r="4" fill="#ffe49e" opacity="0.85" />
      </svg>

      {/* Center Fancy Script + Crest + 2027 */}
      <div className="ny-banner__center">
        <div className="ny-banner__crest" aria-hidden="true">
          <span className="ny-banner__line" />
          <svg viewBox="0 0 24 24" width={compact ? 22 : 26} height={compact ? 22 : 26} fill="#ffd166">
            <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" />
          </svg>
          <span className="ny-banner__line" />
        </div>

        <span className="ny-banner__script">Happy New Year</span>

        <div className="ny-banner__year-row">
          <span className="ny-banner__spark" aria-hidden="true">✦</span>
          <span className="ny-banner__year">2027</span>
          <span className="ny-banner__spark" aria-hidden="true">✦</span>
        </div>
      </div>

      {/* Right Golden New Year Starburst Filigree */}
      <svg
        className="ny-banner__ornament ny-banner__ornament--right"
        viewBox="0 0 120 120"
        width={ornamentSize}
        height={ornamentSize}
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#ffd166" strokeWidth="2.4" strokeLinecap="round">
          <path d="M68 18v18M68 68v18M34 52h18M84 52h18" />
          <path d="M44 28l12 12M80 64l12 12M92 28L80 40M56 64L44 76" />
        </g>
        <circle cx="68" cy="52" r="8" fill="#ffe49e" />
        <path d="M28 74l3.5 9 9 3.5-9 3.5-3.5 9-3.5-9-9-3.5 9-3.5z" fill="#ffd166" />
        <circle cx="28" cy="28" r="4" fill="#ffe49e" opacity="0.85" />
      </svg>
    </div>
  );
}

/**
 * Standard high-visibility MIMO header paired with the same ornate New Year 2027 sign.
 */
export function MimoHeader({ compact = false }) {
  return (
    <header className={`mimo-header${compact ? ' mimo-header--compact' : ''}`}>
      <div className="mimo-brand">
        <div className="mimo-brand__emblem" aria-hidden="true">
          <svg
            viewBox="0 0 48 48"
            width={compact ? 74 : 84}
            height={compact ? 74 : 84}
            fill="none"
          >
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
          <span className="mimo-brand__wordmark">
            MIMO<sup className="mimo-brand__ver">2.0</sup>
          </span>
          <span className="mimo-brand__sub">SELF-SERVICE PRINTING KIOSK</span>
        </div>
      </div>

      <NewYearBanner compact />
    </header>
  );
}

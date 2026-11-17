import './FestiveDecorations.css';

const SNOWFLAKES = [
  { left: '7%', size: 10, delay: '0s', dur: '13s', sway: '20px', opacity: 0.42, crystal: false },
  { left: '19%', size: 20, delay: '-4s', dur: '15s', sway: '-22px', opacity: 0.34, crystal: true },
  { left: '37%', size: 9, delay: '-7s', dur: '12s', sway: '16px', opacity: 0.38, crystal: false },
  { left: '64%', size: 22, delay: '-2.5s', dur: '14.5s', sway: '22px', opacity: 0.32, crystal: true },
  { left: '81%', size: 10, delay: '-6s', dur: '12.5s', sway: '-18px', opacity: 0.4, crystal: false },
  { left: '92%', size: 18, delay: '-9s', dur: '15s', sway: '-20px', opacity: 0.32, crystal: true }
];

const TWINKLES = [
  { left: '12%', top: '16%', size: 16, delay: '0.4s', color: 'gold' },
  { left: '88%', top: '18%', size: 18, delay: '1.4s', color: 'gold' },
  { left: '86%', top: '76%', size: 15, delay: '2.4s', color: 'frost' }
];

const SUMMARY_CONFETTI = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 200 + (i % 4) * 85;
  const tx = Math.round(Math.cos(angle) * dist);
  const ty = Math.round(Math.sin(angle) * dist - 80);
  const tones = ['gold', 'crimson', 'pine', 'silver', 'frost'];
  return {
    id: i,
    tx: `${tx}px`,
    ty: `${ty}px`,
    rot: `${(i * 42) % 360}deg`,
    delay: `${(i % 5) * 50}ms`,
    tone: tones[i % tones.length],
    isRibbon: i % 2 === 0,
    width: i % 2 === 0 ? 16 : 12,
    height: i % 2 === 0 ? 9 : 12
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
 * Smooth celebratory New Year confetti burst for the Summary screen.
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

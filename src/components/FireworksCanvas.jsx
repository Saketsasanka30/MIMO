import { useEffect, useRef } from 'react';
import './FireworksCanvas.css';

const PALETTE = [
  '#fff6d6', // champagne white
  '#ffd166', // warm gold
  '#f59e0b', // rich amber
  '#fde68a', // soft gold
  '#fda4af', // rose shimmer
  '#e0f2fe'  // frost silver
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Subtle high-DPI canvas fireworks overlay with CSS fade & blend composition.
 * Triggers immediately on mount (HOME and SUMMARY screens) using destination-out
 * clearing so trails never darken or muddy the background artwork.
 */
export default function FireworksCanvas({ variant = 'ambient' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const rockets = [];
    const particles = [];

    const spawnBurst = (cx, cy, count = 34) => {
      const baseColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const secondaryColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];

      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.08, 0.08);
        const speed = rand(1.4, variant === 'celebrate' ? 5.2 : 4.2);
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: rand(0.75, 1),
          decay: rand(0.011, 0.02),
          radius: rand(1.4, 3.0),
          color: i % 3 === 0 ? secondaryColor : baseColor,
          twinkle: Math.random() > 0.55
        });
      }
    };

    const launchRocket = (targetX, targetY) => {
      const startX = targetX + rand(-40, 40);
      const startY = height + 10;
      const travelFrames = rand(28, 42);
      rockets.push({
        x: startX,
        y: startY,
        vx: (targetX - startX) / travelFrames,
        vy: (targetY - startY) / travelFrames,
        framesLeft: travelFrames,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        burstCount: variant === 'celebrate' ? 42 : 30
      });
    };

    // Keep bursts predominantly in upper and outer sky framing around UI cards
    const pickSkySpot = () => {
      const sideBias = Math.random();
      const x =
        sideBias < 0.35
          ? rand(width * 0.08, width * 0.28)
          : sideBias < 0.7
            ? rand(width * 0.72, width * 0.92)
            : rand(width * 0.28, width * 0.72);
      const y = rand(height * 0.1, height * 0.42);
      return { x, y };
    };

    // Immediate opening bursts on screen entry
    const timers = [];
    const openingCount = variant === 'celebrate' ? 3 : 2;
    for (let i = 0; i < openingCount; i += 1) {
      const t = setTimeout(() => {
        const spot = pickSkySpot();
        spawnBurst(spot.x, spot.y, variant === 'celebrate' ? 42 : 32);
      }, i * 320);
      timers.push(t);
    }

    // Gentle ongoing New Year fireworks cadence
    const intervalMs = variant === 'celebrate' ? 1450 : 2100;
    const launcher = setInterval(() => {
      if (particles.length > 260) return;
      const spot = pickSkySpot();
      launchRocket(spot.x, spot.y);
    }, intervalMs);

    let rafId = 0;
    const frame = () => {
      // Soft transparent trail fade using destination-out
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.framesLeft -= 1;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        if (r.framesLeft <= 0) {
          spawnBurst(r.x, r.y, r.burstCount);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 + 0.045;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0.02) {
          particles.splice(i, 1);
          continue;
        }

        const flicker = p.twinkle ? rand(0.65, 1) : 1;
        ctx.globalAlpha = Math.max(0, p.alpha * flicker);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(frame);
    };

    rafId = window.requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(rafId);
      clearInterval(launcher);
      timers.forEach(clearTimeout);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`fireworks-canvas fireworks-canvas--${variant}`}
      aria-hidden="true"
    />
  );
}

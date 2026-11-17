import { useEffect, useRef } from 'react';
import './HomeScenicBackdrop.css';

function mulberry32(seed) {
  let a = seed;
  return function rand() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Full-viewport cinematic New Year 2027 harbor & cityscape backdrop:
 * - #020B18 -> #061426 -> #0A192C midnight sky with dark clouds
 * - Canvas-animated stars, ambient floating golden dust, corner fireworks,
 *   and hundreds of tiny golden particles forming bottom-corner light waves
 * - City skyline silhouette in lower third + shimmering water reflections
 * - Illuminated golden spiral Christmas tree + 2027 sculpture on right (~85%x, ~67%y)
 */
export default function HomeScenicBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const rand = mulberry32(20270101);

    // Pre-generate deterministic stars
    const stars = Array.from({ length: 110 }, () => ({
      nx: rand(),
      ny: rand() * 0.68,
      r: 0.6 + rand() * 1.4,
      phase: rand() * Math.PI * 2,
      speed: 0.7 + rand() * 1.5
    }));

    // Pre-generate subtle floating golden dust motes
    const motes = Array.from({ length: 42 }, () => ({
      nx: rand(),
      ny: 0.12 + rand() * 0.8,
      r: 1.0 + rand() * 2.1,
      vy: 0.004 + rand() * 0.008,
      vx: (rand() - 0.5) * 0.004,
      phase: rand() * Math.PI * 2,
      color: rand() > 0.25 ? '#FFD36A' : '#FFFFFF'
    }));

    // Pre-generate 240 particles for bottom-left and bottom-right flowing golden ribbons
    const ribbonParticles = [];
    for (let side = 0; side < 2; side += 1) {
      for (let i = 0; i < 150; i += 1) {
        const t = rand();
        const spread = (rand() - 0.5) * 0.055;
        ribbonParticles.push({
          side, // 0 = bottom-left, 1 = bottom-right
          t,
          spread,
          r: 0.9 + rand() * 2.2,
          alpha: 0.28 + rand() * 0.68,
          phase: rand() * Math.PI * 2,
          color: rand() > 0.2 ? '#FFC247' : '#FFE7A0'
        });
      }
    }

    // Firework burst templates placed in upper/mid outer corners away from central text
    const bursts = [
      // Upper-left large golden firework
      {
        nx: 0.11,
        ny: 0.2,
        radius: 0.145,
        rays: 42,
        colorA: '#FFE7A0',
        colorB: '#FFC247',
        phase: 0.2
      },
      // Left-middle smaller golden firework
      {
        nx: 0.18,
        ny: 0.5,
        radius: 0.068,
        rays: 24,
        colorA: '#FFD36A',
        colorB: '#FF9F24',
        phase: 1.9
      },
      // Upper-right large golden firework
      {
        nx: 0.87,
        ny: 0.14,
        radius: 0.135,
        rays: 38,
        colorA: '#FFFFFF',
        colorB: '#FFC247',
        phase: 1.1
      },
      // Upper-right secondary white & icy firework
      {
        nx: 0.77,
        ny: 0.27,
        radius: 0.082,
        rays: 28,
        colorA: '#FFFFFF',
        colorB: '#A5C8FF',
        phase: 2.6
      },
      // Right-middle smaller warm orange firework
      {
        nx: 0.92,
        ny: 0.36,
        radius: 0.09,
        rays: 30,
        colorA: '#FFD36A',
        colorB: '#FF9F24',
        phase: 3.8
      }
    ];

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

    let rafId = 0;
    const render = nowMs => {
      const tSec = prefersReduced ? 0 : nowMs * 0.001;
      ctx.clearRect(0, 0, width, height);

      // 1. Twinkling sky stars
      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(tSec * s.speed + s.phase));
        ctx.fillStyle = `rgba(255, 248, 224, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.nx * width, s.ny * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Subtle outer-corner fireworks with soft shimmer & sparkle tips
      const baseDim = Math.min(width, height * 1.35);
      for (let b = 0; b < bursts.length; b += 1) {
        const fw = bursts[b];
        const cx = fw.nx * width;
        const cy = fw.ny * height;
        const r = fw.radius * baseDim;
        const pulse = 0.84 + 0.16 * Math.sin(tSec * 1.15 + fw.phase);

        // Soft radial bloom
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.15);
        glow.addColorStop(0, 'rgba(255, 231, 160, 0.24)');
        glow.addColorStop(0.5, 'rgba(255, 194, 71, 0.08)');
        glow.addColorStop(1, 'rgba(255, 194, 71, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
        ctx.fill();

        // Crisp slender bursts
        for (let k = 0; k < fw.rays; k += 1) {
          const angle = (k * Math.PI * 2) / fw.rays + (b % 2) * 0.05;
          const lengthScale = k % 2 === 0 ? 1 : 0.68;
          const inner = r * 0.1;
          const outer = r * lengthScale * (0.94 + 0.06 * Math.sin(tSec * 2 + k));
          const x1 = cx + Math.cos(angle) * inner;
          const y1 = cy + Math.sin(angle) * inner;
          const x2 = cx + Math.cos(angle) * outer;
          const y2 = cy + Math.sin(angle) * outer + outer * 0.08;

          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, fw.colorA);
          grad.addColorStop(1, 'rgba(255, 194, 71, 0)');

          ctx.globalAlpha = (k % 2 === 0 ? 0.78 : 0.48) * pulse;
          ctx.strokeStyle = grad;
          ctx.lineWidth = k % 3 === 0 ? 1.9 : 1.1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(
            (x1 + x2) * 0.5,
            (y1 + y2) * 0.5 - r * 0.04,
            x2,
            y2
          );
          ctx.stroke();

          // Tip sparkle
          if (k % 2 === 0) {
            const sparkleAlpha =
              pulse * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(tSec * 3.1 + k * 1.7 + fw.phase)));
            ctx.globalAlpha = sparkleAlpha;
            ctx.fillStyle = k % 4 === 0 ? fw.colorA : fw.colorB;
            ctx.beginPath();
            ctx.arc(x2, y2, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      // 3. Bottom-left & bottom-right flowing golden particle ribbons (clear center-bottom)
      for (let i = 0; i < ribbonParticles.length; i += 1) {
        const p = ribbonParticles[i];
        const u = p.t;
        const px =
          p.side === 0
            ? u * width * 0.34
            : width - u * width * 0.34;
        const curveY =
          height * (0.76 + Math.pow(u, 1.3) * 0.24 - Math.sin(u * Math.PI) * 0.05) +
          p.spread * height +
          Math.sin(tSec * 0.9 + u * 8 + p.phase) * 3;

        const twinkle = 0.55 + 0.45 * Math.sin(tSec * 2.2 + p.phase);
        ctx.globalAlpha = p.alpha * twinkle;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, curveY, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 4. Subtle floating ambient golden particles
      for (let i = 0; i < motes.length; i += 1) {
        const m = motes[i];
        const y = ((m.ny - tSec * m.vy) % 1 + 1) % 1;
        const x = ((m.nx + Math.sin(tSec * 0.6 + m.phase) * 0.012 + tSec * m.vx) % 1 + 1) % 1;
        const alpha = 0.22 + 0.4 * (0.5 + 0.5 * Math.sin(tSec * 1.8 + m.phase));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(x * width, y * height, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!prefersReduced) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    if (prefersReduced) {
      render(0);
    } else {
      rafId = window.requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="home-scenic-bg" aria-hidden="true">
      {/* Deep Midnight Sky Gradient (#020B18 -> #061426 -> #0A192C) */}
      <div className="home-scenic-bg__sky" />

      {/* Animated Canvas: Stars, Corner Fireworks, Flowing Particle Waves, Floating Sparks */}
      <canvas ref={canvasRef} className="home-scenic-bg__canvas" />

      {/* Distant Dark Horizon Clouds */}
      <div className="home-scenic-bg__clouds" />

      {/* Lower Third: City Skyline, Calm Waterfront Reflections & Flowing Gold Mesh Ribbons */}
      <svg
        className="home-scenic-bg__horizon"
        viewBox="0 0 1920 420"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="harbor-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07162B" />
            <stop offset="45%" stopColor="#051022" />
            <stop offset="100%" stopColor="#020B18" />
          </linearGradient>
          <linearGradient id="gold-ribbon-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD36A" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#FF9F24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFC247" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Waterfront Base */}
        <rect x="0" y="210" width="1920" height="210" fill="url(#harbor-water)" />

        {/* City Skyline Silhouette */}
        <path
          d="M0 212 V146 H38 V164 H66 V108 H106 V160 H130 V82 H172 V144 H206 V62 H258 V150 H288 V120 H326 V172 H364 V94 H410 V164 H448 V128 H492 V170 H530 V88 H560 V58 H578 V88 H602 V166 H644 V136 H688 V176 H732 V132 H772 V180 H828 V154 H884 V174 H948 V160 H1016 V178 H1084 V154 H1142 V180 H1190 V134 H1244 V172 H1292 V114 H1348 V166 H1400 V130 H1456 V170 H1512 V96 H1566 V164 H1620 V120 H1672 V164 H1726 V86 H1786 V156 H1840 V108 H1888 V164 H1920 V212 Z"
          fill="#051123"
        />

        {/* Warm Illuminated Tower Windows */}
        <g fill="#FFD36A" opacity="0.62">
          <rect x="78" y="122" width="4" height="5" />
          <rect x="90" y="134" width="4" height="5" />
          <rect x="142" y="102" width="5" height="6" />
          <rect x="154" y="118" width="4" height="5" />
          <rect x="220" y="80" width="5" height="6" />
          <rect x="236" y="96" width="5" height="6" />
          <rect x="222" y="122" width="6" height="6" />
          <rect x="378" y="114" width="5" height="6" />
          <rect x="392" y="132" width="4" height="5" />
          <rect x="542" y="108" width="5" height="6" />
          <rect x="558" y="94" width="4" height="5" />
          <rect x="1308" y="134" width="5" height="6" />
          <rect x="1324" y="146" width="4" height="5" />
          <rect x="1528" y="116" width="5" height="6" />
          <rect x="1742" y="104" width="5" height="6" />
          <rect x="1852" y="124" width="4" height="5" />
        </g>

        {/* Gentle Shimmering Water Reflections */}
        <g className="home-scenic-bg__reflections" fill="#FFC247">
          <rect x="132" y="232" width="26" height="4" rx="2" opacity="0.28" />
          <rect x="218" y="244" width="38" height="4" rx="2" opacity="0.34" />
          <rect x="224" y="268" width="28" height="3" rx="1.5" opacity="0.22" />
          <rect x="372" y="238" width="30" height="4" rx="2" opacity="0.26" />
          <rect x="544" y="236" width="28" height="4" rx="2" opacity="0.28" />
          <rect x="1480" y="252" width="240" height="7" rx="3.5" opacity="0.34" />
          <rect x="1510" y="274" width="195" height="6" rx="3" opacity="0.26" />
          <rect x="1540" y="298" width="160" height="5" rx="2.5" opacity="0.2" />
        </g>

        {/* Bottom-Left & Bottom-Right Sweeping Golden Light Trails */}
        <path d="M-30 220 C165 215, 325 328, 600 426 L-30 426 Z" fill="url(#gold-ribbon-fill)" />
        <path d="M-30 250 C155 250, 305 344, 535 426" fill="none" stroke="#FFD36A" strokeWidth="2.2" opacity="0.62" />
        <path d="M-30 282 C140 284, 285 362, 470 426" fill="none" stroke="#FFE7A0" strokeWidth="1.5" opacity="0.45" />

        <path d="M1950 218 C1755 215, 1595 328, 1320 426 L1950 426 Z" fill="url(#gold-ribbon-fill)" />
        <path d="M1950 248 C1765 250, 1615 344, 1385 426" fill="none" stroke="#FFD36A" strokeWidth="2.2" opacity="0.62" />
        <path d="M1950 280 C1780 284, 1635 362, 1450 426" fill="none" stroke="#FFE7A0" strokeWidth="1.5" opacity="0.45" />
      </svg>

      {/* Right-Side Golden Spiral Christmas Tree + 2027 Sculpture (~85%x, ~67%y) */}
      <div className="home-scenic-bg__tree-anchor">
        <div className="home-scenic-bg__tree-glow" />
        <svg
          className="home-scenic-bg__tree-svg"
          viewBox="0 0 420 440"
          fill="none"
        >
          <defs>
            <linearGradient id="tree-2027-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF7D6" />
              <stop offset="45%" stopColor="#FFD36A" />
              <stop offset="100%" stopColor="#D48414" />
            </linearGradient>
            <radialGradient id="tree-star-bloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor="#FFD36A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFD36A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Conical Golden Glow */}
          <polygon
            points="232,68 134,334 330,334"
            fill="rgba(255, 194, 71, 0.14)"
            stroke="rgba(255, 211, 106, 0.42)"
            strokeWidth="1.5"
          />

          {/* Glowing Golden Spiral Light Ribbons */}
          <path
            d="M232 76 C268 108, 286 132, 194 158 C148 172, 296 196, 296 218 C296 240, 160 264, 160 286 C160 306, 316 318, 330 334"
            stroke="#FFF7D6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M232 82 C198 112, 184 136, 272 164 C306 176, 178 202, 170 226 C162 250, 308 274, 318 298 C326 314, 154 324, 138 334"
            stroke="#FFC247"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Warm Light Particles around Spiral */}
          <g fill="#FFE7A0">
            <circle cx="232" cy="118" r="3" />
            <circle cx="204" cy="156" r="2.6" />
            <circle cx="268" cy="176" r="3.2" />
            <circle cx="182" cy="214" r="2.8" />
            <circle cx="288" cy="236" r="3" />
            <circle cx="166" cy="278" r="3.2" />
            <circle cx="250" cy="264" r="2.4" />
            <circle cx="308" cy="306" r="3.4" />
          </g>

          {/* Radiant Star Topper */}
          <circle cx="232" cy="54" r="38" fill="url(#tree-star-bloom)" />
          <path
            d="M232 24 L238.5 44 L259 47 L244 60 L248 80 L232 69 L216 80 L220 60 L205 47 L225.5 44 Z"
            fill="#FFFFFF"
          />

          {/* Dark Golden Platform Base */}
          <rect x="20" y="380" width="380" height="26" rx="4" fill="#150F08" stroke="#FFC247" strokeOpacity="0.45" />
          <rect x="38" y="362" width="344" height="20" rx="3" fill="#21170B" stroke="#FFD36A" strokeOpacity="0.52" />

          {/* Large Glowing 2027 Sculpture at Tree Base */}
          <text
            x="198"
            y="361"
            textAnchor="middle"
            fontFamily="Montserrat, Outfit, sans-serif"
            fontWeight="900"
            fontSize="112"
            letterSpacing="4"
            fill="url(#tree-2027-gold)"
            stroke="#FFF9E2"
            strokeWidth="2.2"
          >
            2027
          </text>
        </svg>
      </div>
    </div>
  );
}

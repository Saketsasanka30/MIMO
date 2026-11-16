import { useCallback, useEffect, useState } from 'react';
import { getPrintJob } from './api/mock';
import { FestiveSnowfall } from './components/FestiveDecorations';
import FireworksCanvas from './components/FireworksCanvas';
import { useIdleTimeout } from './hooks/useIdleTimeout';
import CodeEntryScreen from './screens/CodeEntryScreen';
import HomeScreen from './screens/HomeScreen';
import PrintingScreen from './screens/PrintingScreen';
import SummaryScreen from './screens/SummaryScreen';

const KIOSK_WIDTH = 1080;
const KIOSK_HEIGHT = 1920;
const PRINT_DURATION_MS = 15000;
const PRINT_DONE_HOLD_MS = 1000;

function computeScale() {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.innerWidth / KIOSK_WIDTH, window.innerHeight / KIOSK_HEIGHT);
}

export default function App() {
  const [screen, setScreen] = useState('HOME');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [userName, setUserName] = useState('Demo');
  const [pagesPrinted, setPagesPrinted] = useState(0);
  const [totalPages, setTotalPages] = useState(12);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(computeScale);

  // Scale the fixed 1080x1920 portrait stage to fit any viewport cleanly
  useEffect(() => {
    const onResize = () => setScale(computeScale());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const resetToHome = useCallback(() => {
    setScreen('HOME');
    setCode('');
    setStatus('idle');
    setUserName('Demo');
    setPagesPrinted(0);
    setTotalPages(12);
    setProgress(0);
  }, []);

  // Return to HOME after 60s of inactivity on CODE_ENTRY
  useIdleTimeout({
    enabled: screen === 'CODE_ENTRY',
    timeoutMs: 60000,
    onTimeout: resetToHome
  });

  const handleStart = useCallback(() => {
    setCode('');
    setStatus('idle');
    setScreen('CODE_ENTRY');
  }, []);

  const handleCodeAccepted = useCallback(verifiedCode => {
    const job = getPrintJob(verifiedCode);
    setUserName(job.userName);
    setTotalPages(job.totalPages);
    setPagesPrinted(0);
    setProgress(0);
    setScreen('PRINTING');
  }, []);

  // Mock print simulator: 0 -> 100% over ~15s, then hold 1s and go to SUMMARY
  useEffect(() => {
    if (screen !== 'PRINTING') return undefined;

    const startTime = performance.now();
    let completeTimer = null;
    let finished = false;

    const tickInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const ratio = Math.min(1, elapsed / PRINT_DURATION_MS);
      const nextProgress = Math.round(ratio * 100);
      const nextPages =
        nextProgress === 0
          ? 0
          : Math.min(totalPages, Math.max(1, Math.ceil(ratio * totalPages)));

      setProgress(nextProgress);
      setPagesPrinted(nextPages);

      if (ratio >= 1 && !finished) {
        finished = true;
        clearInterval(tickInterval);
        setProgress(100);
        setPagesPrinted(totalPages);
        completeTimer = setTimeout(() => {
          setScreen('SUMMARY');
        }, PRINT_DONE_HOLD_MS);
      }
    }, 100);

    return () => {
      clearInterval(tickInterval);
      if (completeTimer !== null) clearTimeout(completeTimer);
    };
  }, [screen, totalPages]);

  return (
    <>
      {/* Full-screen New Year Fireworks background across all screens */}
      <img
        src="/assets/aistudio/image_57854bcc.png"
        alt=""
        aria-hidden="true"
        className="kiosk-bg-image"
      />

      {/* Subtle readability vignette, ambient snowfall & screen-triggered fireworks */}
      <div className="kiosk-bg-overlay" aria-hidden="true" />
      {(screen === 'HOME' || screen === 'SUMMARY') && (
        <FireworksCanvas
          key={screen}
          variant={screen === 'SUMMARY' ? 'celebrate' : 'ambient'}
        />
      )}
      <FestiveSnowfall />

      {/* Centered, uniformly scaled 1080x1920 kiosk stage */}
      <main className="kiosk-viewport">
        <div
          className="kiosk-stage"
          style={{
            transform: `scale(${scale})`,
            '--kiosk-scale': scale
          }}
        >
          {screen === 'HOME' && <HomeScreen onStart={handleStart} />}

          {screen === 'CODE_ENTRY' && (
            <CodeEntryScreen
              code={code}
              setCode={setCode}
              status={status}
              setStatus={setStatus}
              onAccepted={handleCodeAccepted}
              onCancel={resetToHome}
            />
          )}

          {screen === 'PRINTING' && (
            <PrintingScreen
              userName={userName}
              progress={progress}
              pagesPrinted={pagesPrinted}
              totalPages={totalPages}
            />
          )}

          {screen === 'SUMMARY' && (
            <SummaryScreen
              userName={userName}
              totalPages={totalPages}
              onDone={resetToHome}
            />
          )}
        </div>
      </main>
    </>
  );
}

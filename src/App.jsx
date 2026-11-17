import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { getPrintJob } from './api/mock';
import { FestiveSnowfall } from './components/FestiveDecorations';
import FireworksCanvas from './components/FireworksCanvas';
import GlobalHeader from './components/GlobalHeader';
import { useIdleTimeout } from './hooks/useIdleTimeout';
import CodeEntryScreen from './screens/CodeEntryScreen';
import HomeScreen from './screens/HomeScreen';
import MaintenanceScreen from './screens/MaintenanceScreen';
import PrintingScreen from './screens/PrintingScreen';
import SummaryScreen from './screens/SummaryScreen';
import SystemErrorScreen from './screens/SystemErrorScreen';

const PORTRAIT_BASE_WIDTH = 1080;
const LANDSCAPE_BASE_HEIGHT = 1000;
const PRINT_DURATION_MS = 9000;
const PRINT_DONE_HOLD_MS = 1000;

const SCREEN_ORDER = {
  HOME: 0,
  CODE_ENTRY: 1,
  PRINTING: 2,
  SUMMARY: 3,
  ERROR: 2,
  MAINTENANCE: 2
};

const BUTTER_EASE = [0.22, 1, 0.36, 1];

const screenVariants = {
  enter: ({ dir, reduce }) =>
    reduce
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: dir >= 0 ? 72 : -72,
          scale: 0.975,
          filter: 'blur(6px)'
        },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    pointerEvents: 'auto'
  },
  exit: ({ dir, reduce }) =>
    reduce
      ? { opacity: 0, pointerEvents: 'none' }
      : {
          opacity: 0,
          x: dir >= 0 ? -56 : 56,
          scale: 0.975,
          filter: 'blur(6px)',
          pointerEvents: 'none'
        }
};

function computeStageMetrics() {
  if (typeof window === 'undefined') {
    return { width: 1600, height: 1000, scale: 1, isLandscape: true };
  }
  const vw = window.innerWidth || 1280;
  const vh = window.innerHeight || 800;
  const isLandscape = vw > vh;

  if (isLandscape) {
    const height = LANDSCAPE_BASE_HEIGHT;
    const width = Math.min(1820, Math.max(1260, Math.round((vw / vh) * height)));
    const scale = Math.min(vw / width, vh / height);
    return { width, height, scale, isLandscape: true };
  }

  const width = PORTRAIT_BASE_WIDTH;
  const height = Math.min(1920, Math.max(1620, Math.round((vh / vw) * width)));
  const scale = Math.min(vw / width, vh / height);
  return { width, height, scale, isLandscape: false };
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const [route, setRoute] = useState({ screen: 'HOME', dir: 1 });
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [codeBusy, setCodeBusy] = useState(false);
  const [userName, setUserName] = useState('Demo');
  const [errorInfo, setErrorInfo] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState('offline');
  const [pagesPrinted, setPagesPrinted] = useState(0);
  const [totalPages, setTotalPages] = useState(3);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(computeStageMetrics);

  const screen = route.screen;

  const navigateTo = useCallback((nextScreen, explicitDir) => {
    setRoute(prev => {
      if (prev.screen === nextScreen) return prev;
      const autoDir =
        (SCREEN_ORDER[nextScreen] ?? 0) >= (SCREEN_ORDER[prev.screen] ?? 0) ? 1 : -1;
      return {
        screen: nextScreen,
        dir: explicitDir ?? autoDir
      };
    });
  }, []);

  // Dynamically adapt stage aspect ratio to fill 15-inch tablet in both landscape & portrait
  useEffect(() => {
    const onResize = () => setStage(computeStageMetrics());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const resetToHome = useCallback(() => {
    navigateTo('HOME', -1);
    setCode('');
    setStatus('idle');
    setCodeBusy(false);
    setUserName('Demo');
    setErrorInfo(null);
    setPagesPrinted(0);
    setTotalPages(3);
    setProgress(0);
  }, [navigateTo]);

  // Return to HOME after 60s of inactivity on CODE_ENTRY
  useIdleTimeout({
    enabled: screen === 'CODE_ENTRY',
    timeoutMs: 60000,
    onTimeout: resetToHome
  });

  const handleStart = useCallback(() => {
    setCode('');
    setStatus('idle');
    setCodeBusy(false);
    setErrorInfo(null);
    navigateTo('CODE_ENTRY', 1);
  }, [navigateTo]);

  const handleSystemError = useCallback(
    info => {
      setErrorInfo(info);
      navigateTo('ERROR', 1);
    },
    [navigateTo]
  );

  const handleOpenMaintenance = useCallback(
    (initialMode = 'offline') => {
      setMaintenanceMode(initialMode);
      navigateTo('MAINTENANCE', 1);
    },
    [navigateTo]
  );

  const handleCodeAccepted = useCallback(
    verifiedCode => {
      const job = getPrintJob(verifiedCode);
      setUserName(job.userName);
      setTotalPages(job.totalPages);
      setPagesPrinted(0);
      setProgress(0);
      navigateTo('PRINTING', 1);
    },
    [navigateTo]
  );

  // Mock print simulator: 0 -> 100% over ~9s (3 pages), then hold 1s and go to SUMMARY
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
          navigateTo('SUMMARY', 1);
        }, PRINT_DONE_HOLD_MS);
      }
    }, 100);

    return () => {
      clearInterval(tickInterval);
      if (completeTimer !== null) clearTimeout(completeTimer);
    };
  }, [screen, totalPages, navigateTo]);

  const isHome = screen === 'HOME';
  const showFireworks = screen === 'HOME' || screen === 'SUMMARY';

  return (
    <>
      {/* Front page background: bg1 (Happy New Year filigree & bokeh) */}
      <img
        src="/assets/aistudio/bg1_341ba45a.png"
        alt=""
        aria-hidden="true"
        className={`kiosk-bg-base kiosk-bg-base--home${isHome ? ' is-active' : ''}`}
      />

      {/* Rest of pages background: bg2 (Ornamented Christmas trees) */}
      <img
        src="/assets/aistudio/Bg2_d42c6f07.png"
        alt=""
        aria-hidden="true"
        className={`kiosk-bg-base kiosk-bg-base--tree${!isHome ? ' is-active' : ''}`}
      />

      {/* Frosted light wash for darker inner-screen artwork & screen-triggered fireworks */}
      <div className={`kiosk-bg-overlay${!isHome ? ' is-active' : ''}`} aria-hidden="true" />
      <AnimatePresence>
        {showFireworks ? (
          <motion.div
            key={`fw-${screen}`}
            className="kiosk-fw-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: BUTTER_EASE }}
          >
            <FireworksCanvas variant={screen === 'SUMMARY' ? 'celebrate' : 'ambient'} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <FestiveSnowfall />

      {/* Centered, orientation-aware 15-inch tablet & kiosk stage */}
      <main className="kiosk-viewport">
        <div
          className="kiosk-stage"
          data-orientation={stage.isLandscape ? 'landscape' : 'portrait'}
          style={{
            width: `${stage.width}px`,
            height: `${stage.height}px`,
            transform: `scale(${stage.scale})`,
            '--kiosk-scale': stage.scale
          }}
        >
          <GlobalHeader
            showBack={screen === 'CODE_ENTRY'}
            onBack={resetToHome}
            backDisabled={codeBusy}
          />

          <div className="kiosk-screen-viewport">
            <AnimatePresence
              mode="sync"
              initial={false}
              custom={{ dir: route.dir, reduce: !!reduceMotion }}
            >
              <motion.div
                key={screen}
                custom={{ dir: route.dir, reduce: !!reduceMotion }}
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: reduceMotion ? 0.2 : 0.54,
                  ease: BUTTER_EASE
                }}
                className="kiosk-screen-layer"
              >
                {screen === 'HOME' && (
                  <HomeScreen onStart={handleStart} isLandscape={stage.isLandscape} />
                )}

                {screen === 'CODE_ENTRY' && (
                  <CodeEntryScreen
                    code={code}
                    setCode={setCode}
                    status={status}
                    setStatus={setStatus}
                    onAccepted={handleCodeAccepted}
                    onSystemError={handleSystemError}
                    onMaintenance={handleOpenMaintenance}
                    onBusyChange={setCodeBusy}
                    isLandscape={stage.isLandscape}
                  />
                )}

                {screen === 'PRINTING' && (
                  <PrintingScreen
                    userName={userName}
                    progress={progress}
                    pagesPrinted={pagesPrinted}
                    totalPages={totalPages}
                    isLandscape={stage.isLandscape}
                  />
                )}

                {screen === 'SUMMARY' && (
                  <SummaryScreen
                    userName={userName}
                    totalPages={totalPages}
                    onDone={resetToHome}
                  />
                )}

                {screen === 'ERROR' && (
                  <SystemErrorScreen
                    errorInfo={errorInfo}
                    onRetry={handleStart}
                    onBackHome={resetToHome}
                  />
                )}

                {screen === 'MAINTENANCE' && (
                  <MaintenanceScreen
                    initialMode={maintenanceMode}
                    onBackHome={resetToHome}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}

import SlideCommit from '../components/SlideCommit';
import './HomeScreen.css';

export default function HomeScreen({ onStart, isLandscape = false }) {
  return (
    <section className="kiosk-screen-host home-screen" aria-label="MIMO Welcome Screen">
      {/* Centered MIMO Hero Card sized for 15-inch tablet ergonomics */}
      <div className="glass-card home-hero-card">
        <div className="home-hero-flourish" aria-hidden="true">
          <span className="home-hero-flourish__wing" />
          <span className="home-hero-flourish__star">❄</span>
          <span className="home-hero-flourish__wing" />
        </div>

        <p className="home-eyebrow">— WELCOME TO —</p>

        <div className="home-wordmark-wrap">
          <h1 className="home-wordmark">MIMO</h1>
        </div>

        <h2 className="kiosk-heading home-title">Self-Service Printing Kiosk</h2>
        <p className="home-subtitle">Fast, secure document printing via Mimo code.</p>

        <div className="home-slide-wrap">
          <SlideCommit
            label="SWIPE TO START"
            doneLabel="Starting…"
            errorLabel="Try again"
            onConfirm={() => Promise.resolve()}
            onDone={onStart}
            onError={reason => console.log(reason)}
            trackColor="rgba(226, 232, 240, 0.58)"
            handleColor="#f59e0b"
            successColor="#16a34a"
            dangerColor="#dc2626"
            width={isLandscape ? 580 : 720}
            height={isLandscape ? 120 : 156}
            radius={isLandscape ? 60 : 78}
            speed={50}
            returnBounce={0.38}
            landingDip={0.026}
            holdMs={1500}
          />
        </div>
      </div>
    </section>
  );
}

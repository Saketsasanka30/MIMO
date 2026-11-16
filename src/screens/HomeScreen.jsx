import { NewYearBanner } from '../components/FestiveDecorations';
import SlideCommit from '../components/SlideCommit';
import './HomeScreen.css';

export default function HomeScreen({ onStart }) {
  return (
    <section className="kiosk-screen-host home-screen" aria-label="MIMO Welcome Screen">
      {/* Top Festive New Year 2027 Ornament & Fancy Script Banner */}
      <header className="home-top-bar">
        <NewYearBanner />
      </header>

      {/* Center Larger MIMO 2.0 Hero Card */}
      <div className="glass-card home-hero-card">
        <div className="home-hero-flourish" aria-hidden="true">
          <span className="home-hero-flourish__wing" />
          <span className="home-hero-flourish__star">❄</span>
          <span className="home-hero-flourish__wing" />
        </div>

        <p className="home-eyebrow">— WELCOME TO —</p>

        <div className="home-wordmark-wrap">
          <h1 className="home-wordmark">
            MIMO<sup className="home-wordmark-ver">2.0</sup>
          </h1>
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
            trackColor="#141b2d"
            handleColor="#ffd166"
            successColor="#22c55e"
            dangerColor="#e5484d"
            width={880}
            height={164}
            radius={82}
            speed={50}
            returnBounce={0.38}
            landingDip={0.026}
            holdMs={1500}
          />
        </div>
      </div>

      {/* Subtle Bottom Footer */}
      <footer className="home-footer">
        <p className="home-footer-note">
          Happy New Year 2027 · Fast &amp; Secure Document Release
        </p>
      </footer>
    </section>
  );
}

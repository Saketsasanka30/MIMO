import { useCallback, useEffect, useRef, useState } from 'react';
import { verify } from '../api/mock';
import CodeSlots from '../components/CodeSlots';
import { NewYearBanner } from '../components/FestiveDecorations';
import './CodeEntryScreen.css';

const CODE_LENGTH = 4;
const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function CodeEntryScreen({
  code,
  setCode,
  status,
  setStatus,
  onAccepted,
  onCancel
}) {
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const verifyingRef = useRef(false);
  const errorTimerRef = useRef(null);
  const acceptTimerRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const longPressedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(errorTimerRef.current);
      clearTimeout(acceptTimerRef.current);
      clearTimeout(longPressTimerRef.current);
    };
  }, []);

  const clearErrorState = useCallback(() => {
    clearTimeout(errorTimerRef.current);
    setErrorMsg('');
    if (status === 'error') {
      setStatus('idle');
    }
  }, [status, setStatus]);

  const runVerify = useCallback(
    async candidate => {
      if (verifyingRef.current || candidate.length !== CODE_LENGTH) return;
      verifyingRef.current = true;
      setVerifying(true);
      clearTimeout(errorTimerRef.current);
      setErrorMsg('');

      try {
        const ok = await verify(candidate);
        if (!mountedRef.current) return;

        verifyingRef.current = false;
        setVerifying(false);

        if (ok) {
          setStatus('success');
          acceptTimerRef.current = setTimeout(() => {
            if (mountedRef.current) onAccepted(candidate);
          }, 650);
        } else {
          setStatus('error');
          setErrorMsg('Invalid code, please try again');
          errorTimerRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            setStatus('idle');
            setCode('');
            setErrorMsg('');
          }, 1050);
        }
      } catch {
        if (!mountedRef.current) return;
        verifyingRef.current = false;
        setVerifying(false);
        setStatus('error');
        setErrorMsg('Invalid code, please try again');
        errorTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setStatus('idle');
          setCode('');
          setErrorMsg('');
        }, 1050);
      }
    },
    [onAccepted, setCode, setStatus]
  );

  const handleDigitTap = digit => {
    if (verifyingRef.current || status === 'success') return;
    if (status === 'error') {
      clearErrorState();
      setCode(digit);
      return;
    }
    if (code.length >= CODE_LENGTH) return;
    setCode(`${code}${digit}`);
  };

  const handleBackspace = () => {
    if (verifyingRef.current || status === 'success') return;
    if (status === 'error') {
      clearErrorState();
      setCode('');
      return;
    }
    if (!code.length) return;
    setCode(code.slice(0, -1));
  };

  const handleClearAll = () => {
    if (verifyingRef.current || status === 'success') return;
    clearErrorState();
    setCode('');
  };

  const onBackspacePointerDown = () => {
    longPressedRef.current = false;
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      longPressedRef.current = true;
      handleClearAll();
    }, 500);
  };

  const onBackspacePointerUp = () => {
    clearTimeout(longPressTimerRef.current);
    if (!longPressedRef.current) {
      handleBackspace();
    }
  };

  const onBackspacePointerLeave = () => {
    clearTimeout(longPressTimerRef.current);
  };

  const handleSlotsChange = next => {
    if (next !== code) {
      setCode(next);
    }
    if (status !== 'idle' && next.length > 0) {
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const canConfirm = code.length === CODE_LENGTH && !verifying && status !== 'success';

  return (
    <section className="kiosk-screen-host code-entry-screen" aria-label="Enter Mimo Code">
      {/* Top Bar matching reference top-left circular back arrow + New Year badge */}
      <header className="code-top-bar">
        <button
          type="button"
          className="code-back-btn"
          aria-label="Back to welcome screen"
          onClick={onCancel}
          disabled={verifying || status === 'success'}
        >
          <svg
            viewBox="0 0 24 24"
            width="42"
            height="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>

        <NewYearBanner compact className="code-ny-banner" />
      </header>

      <div className="glass-card code-entry-card">
        <div className="code-entry-heading-group">
          <h1 className="kiosk-heading code-entry-title">Enter Your Mimo Code Here</h1>
        </div>

        <div
          className={`code-slots-wrap${status === 'error' ? ' is-error-shake' : ''}`}
          data-status={status}
        >
          <CodeSlots
            length={CODE_LENGTH}
            value={code}
            status={status}
            onChange={handleSlotsChange}
            onComplete={runVerify}
            accentColor="#ffd166"
            inkColor="#fffbeb"
            slotColor="#1a2236"
            digitColor="#141218"
            dangerColor="#ff3b30"
            slotSize={156}
            gap={28}
            radius={28}
            bounce={0.2}
            settle={0.3}
            rise={14}
            cascade={20}
            ariaLabel="4-digit Mimo release code"
          />
        </div>

        <div className="code-entry-feedback" aria-live="polite">
          {verifying ? (
            <span className="code-feedback-verifying">Verifying code…</span>
          ) : errorMsg ? (
            <span className="code-feedback-error" role="alert">
              ⚠ {errorMsg}
            </span>
          ) : (
            <span className="code-feedback-hint">Tap digits below · Hold ⌫ to clear</span>
          )}
        </div>

        {/* Custom 3x4 Touch Keypad matching reference (digits, red backspace, checkmark confirm) */}
        <div className="code-keypad" role="group" aria-label="Numeric keypad">
          {KEYPAD_DIGITS.map(digit => (
            <button
              key={digit}
              type="button"
              className="keypad-key"
              disabled={verifying || status === 'success'}
              onClick={() => handleDigitTap(digit)}
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            className="keypad-key keypad-key--backspace"
            aria-label="Backspace (hold to clear)"
            disabled={verifying || status === 'success'}
            onPointerDown={onBackspacePointerDown}
            onPointerUp={onBackspacePointerUp}
            onPointerLeave={onBackspacePointerLeave}
            onPointerCancel={onBackspacePointerLeave}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBackspace();
              }
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <path d="M18 9l-6 6" />
              <path d="M12 9l6 6" />
            </svg>
          </button>

          <button
            type="button"
            className="keypad-key"
            disabled={verifying || status === 'success'}
            onClick={() => handleDigitTap('0')}
          >
            0
          </button>

          <button
            type="button"
            className={`keypad-key keypad-key--confirm${canConfirm ? ' is-ready' : ''}`}
            aria-label="Confirm code"
            disabled={!canConfirm}
            onClick={() => runVerify(code)}
          >
            <svg
              viewBox="0 0 24 24"
              width="58"
              height="58"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

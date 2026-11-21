import { useEffect, useRef, useState } from "react";
import { Clock3, RefreshCw, ServerCrash, WifiOff } from "lucide-react";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const RETRY_DELAY_MS = 3000;
const REQUEST_TIMEOUT_MS = 8000;
const RETRY_LIMIT_MS = 120000;

export default function BackendStatus({ children }) {
  const [status, setStatus] = useState("checking");
  const [attempts, setAttempts] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [detail, setDetail] = useState("Checking the server...");
  const [retryNonce, setRetryNonce] = useState(0);
  const retryTimerRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;

    const stopTimers = () => {
      clearTimeout(retryTimerRef.current);
      clearInterval(elapsedTimerRef.current);
      clearTimeout(timeoutTimerRef.current);
    };

    const updateElapsedTime = () => {
      if (!cancelled) {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }
    };

    const checkBackend = async () => {
      if (cancelled) return;

      const controller = new AbortController();
      const requestTimeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(`${API_URL}/health`, {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          try {
            const health = await response.json();
            if (health.status === "awake") {
              if (!cancelled) {
                stopTimers();
                setStatus("online");
              }
              return;
            }
          } catch {
            // A 200 HTML response is not a valid backend health response.
          }

          if (!cancelled) {
            setAttempts((current) => current + 1);
            setStatus("configuration-error");
            setDetail("The server URL responded, but it did not return a valid /health response.");
          }
          return;
        }

        if (!cancelled) {
          setAttempts((current) => current + 1);

          if (response.status === 404) {
            setStatus("configuration-error");
            setDetail("The server URL is reachable, but the /health endpoint was not found.");
            return;
          } else if (response.status >= 500) {
            setStatus("server-error");
            setDetail("The backend is reachable but is reporting a server problem.");
          } else if (response.status === 503) {
            setStatus("waking");
            setDetail("The server is starting up. This usually takes less than a minute.");
          } else {
            setStatus("waking");
            setDetail(`The server is temporarily unavailable (HTTP ${response.status}).`);
          }

          retryTimerRef.current = setTimeout(checkBackend, RETRY_DELAY_MS);
        }
      } catch (error) {
        if (!cancelled) {
          setAttempts((current) => current + 1);
          setStatus("waking");

          if (error?.name === "AbortError") {
            setDetail("The server is taking longer than usual to respond.");
          } else {
            setDetail("Connecting to the server and waiting for it to finish starting.");
          }

          retryTimerRef.current = setTimeout(checkBackend, RETRY_DELAY_MS);
        }
      } finally {
        clearTimeout(requestTimeout);
      }
    };

    elapsedTimerRef.current = setInterval(updateElapsedTime, 1000);
    timeoutTimerRef.current = setTimeout(() => {
      if (!cancelled) {
        setStatus((current) => (
          current === "waking" || current === "checking" ? "timeout" : current
        ));
      }
    }, RETRY_LIMIT_MS);

    checkBackend();

    return () => {
      cancelled = true;
      stopTimers();
    };
  }, [retryNonce]);

  const retryNow = () => {
    setStatus("checking");
    setDetail("Checking the server again...");
    startedAtRef.current = Date.now();
    setElapsedSeconds(0);
    setRetryNonce((current) => current + 1);
  };

  if (status === "online") {
    return children;
  }

  const isTimedOut = status === "timeout";
  const isServerError = status === "server-error";
  const isConfigurationError = status === "configuration-error";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10">
          {isServerError || isConfigurationError ? (
            <ServerCrash className="h-9 w-9 text-rose-400" />
          ) : isTimedOut ? (
            <WifiOff className="h-9 w-9 text-amber-400" />
          ) : (
            <Clock3 className="h-9 w-9 text-blue-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {isTimedOut
            ? "The server is still unavailable"
            : isServerError
              ? "We are having a server problem"
              : isConfigurationError
                ? "Connection configuration needs attention"
                : status === "checking"
                  ? "Connecting to the server"
                  : "Waking up the server"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          {isTimedOut
            ? "The backend is taking longer than expected. You can retry now or come back in a moment."
            : detail}
        </p>

        {status !== "server-error" && status !== "configuration-error" && (
          <>
            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-full origin-left animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Waiting {elapsedSeconds}s</span>
              <span>Connection attempt {attempts || 1}</span>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              We retry automatically every few seconds. You can stay here; the application will open as soon as the server is ready.
            </p>
          </>
        )}

        {(isTimedOut || isServerError || isConfigurationError) && (
          <button
            type="button"
            onClick={retryNow}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <RefreshCw className="h-4 w-4" />
            Retry connection
          </button>
        )}
      </div>
    </div>
  );
}

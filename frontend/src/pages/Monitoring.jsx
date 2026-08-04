import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

// BUG FIX (Issue 2 - camera doesn't appear to be active):
// Root cause: there was no webcam code anywhere in the project at all -
// getUserMedia was never called, so the indicator light had nothing to turn
// on and there was no presence/movement logic for a stream to feed into.
// This isn't a regression to "fix" so much as the presence-monitoring piece
// that was missing; it's added here, scoped to this page only, and wired to
// the same `activeSession` state the rest of this page already polls for -
// the camera only runs while a focus session is active, and stops the
// moment it isn't (mirrors the Issue 1 fix on the extension side).
export default function Monitoring() {
  const { token } = useAuth();
  const [data, setData] = useState({ events: [], totalBlocked: 0, activeSession: null });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const prevFrameRef = useRef(null);
  const motionIntervalRef = useRef(null);

  // 'idle' | 'requesting' | 'active' | 'denied' | 'error'
  const [cameraStatus, setCameraStatus] = useState("idle");
  const [cameraErrorMessage, setCameraErrorMessage] = useState("");
  const [presence, setPresence] = useState("unknown"); // 'present' | 'still' | 'unknown'

  const sessionActive = !!data.activeSession;

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const result = await api.getTodayMonitoring(token);
        if (!cancelled) setData(result);
      } catch (err) {
        // ignore transient errors between polls
      }
    }
    poll();
    const interval = setInterval(poll, 4000); // real-time-ish: refresh every 4s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  // Stop the webcam cleanly: stop every track (this is what turns the
  // browser's camera indicator light back off) and clear the motion-check
  // interval so nothing keeps reading from a dead stream.
  function stopCamera() {
    if (motionIntervalRef.current) {
      clearInterval(motionIntervalRef.current);
      motionIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    prevFrameRef.current = null;
    setPresence("unknown");
  }

  // Sample the current video frame onto a small hidden canvas and diff it
  // against the previous sample. This is what actually connects the raw
  // MediaStream to "monitoring" - without it, the camera would just be a
  // silent preview with no presence/movement signal behind it.
  function checkMotion() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const width = 80; // downscaled on purpose - this only needs a coarse signal
    const height = 60;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    const frame = ctx.getImageData(0, 0, width, height).data;

    if (prevFrameRef.current) {
      let diff = 0;
      for (let i = 0; i < frame.length; i += 4) {
        diff += Math.abs(frame[i] - prevFrameRef.current[i]);
      }
      const avgDiff = diff / (width * height);
      setPresence(avgDiff > 8 ? "present" : "still");
    }
    prevFrameRef.current = frame;
  }

  async function startCamera() {
    setCameraStatus("requesting");
    setCameraErrorMessage("");
    try {
      // BUG FIX (Issue 2): this is the actual getUserMedia call that was
      // missing entirely. video-only (no audio) since this is presence
      // monitoring, not a call.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraStatus("active");
      // Sample every 2s - frequent enough to catch presence, cheap enough
      // not to peg the CPU with a full video-processing pipeline.
      motionIntervalRef.current = setInterval(checkMotion, 2000);
    } catch (err) {
      // BUG FIX (Issue 2): handle permission denial / no camera gracefully
      // instead of leaving the page in a silent broken state.
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraStatus("denied");
        setCameraErrorMessage("Camera permission was denied. Allow camera access in your browser settings to enable presence monitoring.");
      } else if (err.name === "NotFoundError") {
        setCameraStatus("error");
        setCameraErrorMessage("No camera was found on this device.");
      } else {
        setCameraStatus("error");
        setCameraErrorMessage("Could not start the camera: " + err.message);
      }
    }
  }

  // Start the camera when a focus session becomes active, stop it the
  // moment the session ends (or the component unmounts) - never leave the
  // webcam running unattended.
  useEffect(() => {
    if (sessionActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionActive]);

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="text-headline-md font-bold text-on-surface">Live Monitoring</h2>
        <p className="text-body-md text-on-surface-variant">
          Updates automatically as the browser extension blocks attempts.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-lg">
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-sm">Blocked Today</p>
          <p className="text-headline-lg font-bold text-primary">{data.totalBlocked}</p>
        </section>
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-sm">Session Status</p>
          <p className="text-title-lg font-bold text-on-surface">
            {data.activeSession ? "Focusing 🔒" : "Idle"}
          </p>
        </section>
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-sm">Sites Attempted</p>
          <p className="text-headline-lg font-bold text-on-surface">{data.events.length}</p>
        </section>
      </div>

      <section className="glass-card rounded-xl p-lg">
        <h3 className="text-title-lg text-on-surface mb-md">Presence Monitoring</h3>
        {!sessionActive ? (
          <p className="text-body-md text-on-surface-variant">
            Camera monitoring runs automatically while a focus session is active. Start a session from Study Hub to enable it.
          </p>
        ) : cameraStatus === "denied" || cameraStatus === "error" ? (
          <p className="text-body-md text-red-500">{cameraErrorMessage}</p>
        ) : (
          <div className="flex items-center gap-lg">
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-40 h-28 rounded-lg bg-black object-cover"
            />
            <div>
              <p className="text-body-md text-on-surface">
                Camera: {cameraStatus === "requesting" ? "Requesting access…" : "Active"}
              </p>
              <p className="text-sm text-on-surface-variant">
                {presence === "present" && "Movement detected"}
                {presence === "still" && "No movement detected"}
                {presence === "unknown" && "Calibrating…"}
              </p>
            </div>
          </div>
        )}
        {/* Hidden canvas used only for frame-diff sampling, never shown to the user */}
        <canvas ref={canvasRef} className="hidden" />
      </section>

      <section className="glass-card rounded-xl p-lg">
        <h3 className="text-title-lg text-on-surface mb-md">Blocked Attempts Today</h3>
        {data.events.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Nothing blocked yet today. Install the extension and try visiting a blocked site to see it appear here live.
          </p>
        ) : (
          <div className="space-y-2">
            {data.events.map((e) => (
              <div key={e.domain} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                <span className="font-semibold text-on-surface">{e.domain}</span>
                <span className="text-sm text-on-surface-variant">
                  {e.count} attempt{e.count > 1 ? "s" : ""} · last at{" "}
                  {new Date(e.last_attempt + "Z").toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { api } from "../api.js";

const CameraContext = createContext(null);

export function CameraProvider({ children }) {
  const { token } = useAuth();
  const [sessionActive, setSessionActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("idle"); // 'idle' | 'requesting' | 'active' | 'denied' | 'error'
  const [cameraErrorMessage, setCameraErrorMessage] = useState("");
  const [presence, setPresence] = useState("unknown"); // 'present' | 'still' | 'unknown'

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const prevFrameRef = useRef(null);
  const motionIntervalRef = useRef(null);

  // Poll for active session state globally across the dashboard
  useEffect(() => {
    if (!token) {
      setSessionActive(false);
      return;
    }
    let cancelled = false;
    async function checkSession() {
      try {
        const { activeSession } = await api.getTodayMonitoring(token);
        if (!cancelled) {
          setSessionActive(!!activeSession);
        }
      } catch (e) {}
    }
    checkSession();
    const interval = setInterval(checkSession, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

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
    setCameraStatus("idle");
  }

  function checkMotion() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const width = 80;
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
    if (streamRef.current && cameraStatus === "active") return;
    setCameraStatus("requesting");
    setCameraErrorMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraStatus("active");
      motionIntervalRef.current = setInterval(checkMotion, 2000);
    } catch (err) {
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

  // Manage camera lifecycle based on global sessionActive state
  useEffect(() => {
    if (sessionActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionActive]);

  // Helper for components (like Monitoring.jsx) to attach the live stream to their video element
  const attachVideoElement = (el) => {
    if (!el) return;
    if (streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  };

  return (
    <CameraContext.Provider
      value={{
        sessionActive,
        cameraStatus,
        cameraErrorMessage,
        presence,
        stream: streamRef.current,
        attachVideoElement,
      }}
    >
      {children}
      {/* Hidden elements keeping camera stream active globally in background during session */}
      <div style={{ display: "none" }}>
        <video ref={videoRef} muted playsInline />
        <canvas ref={canvasRef} />
      </div>
    </CameraContext.Provider>
  );
}

export function useCamera() {
  return useContext(CameraContext);
}

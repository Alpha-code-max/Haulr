import React, { useState, useRef, useEffect } from "react";
import { FiCopy, FiCheck, FiLock } from "react-icons/fi";
import "./OTPDisplay.css";

interface OTPDisplayProps {
  otp?: string;
  status: string;
}

const OTPDisplay: React.FC<OTPDisplayProps> = ({ otp, status }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Only show OTP when delivery is actively being transported
  const showOTP = ["picked_up", "in_transit"].includes(status) && otp;

  if (!showOTP) {
    return (
      <div className="otp-display-hidden glass-panel">
        <FiLock size={20} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
        <p>OTP will appear when your package is picked up by the hauler.</p>
      </div>
    );
  }

  const handleCopy = async () => {
    if (!otp) return;
    await navigator.clipboard.writeText(otp);
    setCopied(true);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="otp-display glass-panel animate-fade-in">
      <div className="otp-display-label">Your Delivery OTP</div>
      <div className="otp-display-code">{otp}</div>
      <div className="otp-display-hint">
        Share this code with the hauler upon delivery to release payment.
      </div>
      {copied ? (
        <span className="otp-copied"><FiCheck size={14} /> Copied!</span>
      ) : (
        <button className="btn btn-outline btn-sm otp-copy-btn" onClick={handleCopy}>
          <FiCopy size={14} /> Copy OTP
        </button>
      )}
    </div>
  );
};

export default OTPDisplay;

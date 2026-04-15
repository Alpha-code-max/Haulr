import React, { useState, useRef } from "react";
import { FiShield } from "react-icons/fi";
import "./OTPModal.css";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, onSubmit, isLoading, error }) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    if (pasted.length >= 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const otp = digits.join("");
  const isComplete = otp.length === 6;

  const handleSubmit = async () => {
    if (!isComplete) return;
    await onSubmit(otp);
  };

  return (
    <div className="otp-modal-overlay" onClick={onClose}>
      <div className="otp-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <FiShield size={32} color="var(--accent-primary)" style={{ marginBottom: "0.75rem" }} />
        <h3>Delivery Verification</h3>
        <p>Enter the 6-digit OTP received from the customer to confirm delivery.</p>

        <div className="otp-input-group" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="otp-digit"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {error && <div className="toast-error" style={{ marginBottom: "1rem" }}>{error}</div>}

        <div className="otp-modal-actions">
          <button className="btn btn-outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={!isComplete || isLoading}
          >
            {isLoading ? "Verifying..." : "Confirm Delivery"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;

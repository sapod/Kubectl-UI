import { useState, useEffect, useRef } from "react";

const AMBER = "#f0995b";
const AMBER_BG = "rgba(240,153,91,0.08)";
const DIVIDER = "#30363d";
const SURFACE = "#1f2937";
const BORDER = "#374151";
const TEXT_MUTED = "#8b949e";
const TEXT_PRIMARY = "#c9d1d9";

interface ClearButtonProps {
  lineCount?: number;
  onClear?: () => void;
}

export default function ClearButton({ lineCount = 0, onClear }: ClearButtonProps) {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const openPopover = () => {
    setOpen(true);
    setCountdown(5);
  };

  const closePopover = () => {
    setOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const confirm = () => {
    onClear?.();
    closePopover();
  };

  useEffect(() => {
    if (!open) return;
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          closePopover();
          return 5;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open]);

  // Support click outside to close he popover
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        closePopover();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 1, height: 20, background: DIVIDER, marginRight: 4 }} />

      <button
        onClick={openPopover}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: open ? AMBER_BG : "transparent",
          border: `0.5px solid ${AMBER}`,
          borderRadius: 4,
          color: AMBER,
          padding: "4px 9px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 12,
          transition: "background 0.15s",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
          <line x1="18" y1="9" x2="12" y2="15"/>
          <line x1="12" y1="9" x2="18" y2="15"/>
        </svg>
        Clear
      </button>

      <div
        ref={popoverRef}
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 220,
          background: SURFACE,
          border: `0.5px solid ${BORDER}`,
          borderRadius: 6,
          padding: "10px 12px",
          zIndex: 100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.15s ease",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <p style={{ margin: "0 0 10px", fontSize: 12, color: TEXT_PRIMARY, lineHeight: 1.5 }}>
          Clear{" "}
          <span style={{ color: AMBER, fontWeight: 500 }}>{lineCount} lines</span>?{" "}
          <span style={{ color: TEXT_MUTED }}>This only affects the view.</span>
        </p>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={confirm}
            style={{
              flex: 1,
              background: AMBER_BG,
              border: `0.5px solid ${AMBER}`,
              borderRadius: 4,
              color: AMBER,
              fontSize: 12,
              padding: "4px 0",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Clear
          </button>
          <button
            onClick={closePopover}
            style={{
              flex: 1,
              background: "transparent",
              border: `0.5px solid ${BORDER}`,
              borderRadius: 4,
              color: TEXT_MUTED,
              fontSize: 12,
              padding: "4px 0",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{ marginTop: 8, height: 2, borderRadius: 2, background: DIVIDER, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(countdown / 5) * 100}%`,
              background: AMBER,
              borderRadius: 2,
              transition: "width 1s linear",
            }}
          />
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 10, color: TEXT_MUTED, textAlign: "right" }}>
          Dismisses in {countdown}s
        </p>
      </div>
    </div>
  );
}

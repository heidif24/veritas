"use client";

import { useEffect, useState } from "react";
import { VeritasLoader } from "./veritas-loader";

/**
 * First-paint splash: centered shield + drawn verification stroke,
 * then fades out so the page is ready.
 */
export function BootSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Let the check finish drawing (~1.3s), then fade out
    const hold = window.setTimeout(() => setLeaving(true), 1400);
    const hide = window.setTimeout(() => setVisible(false), 1800);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-white transition-opacity duration-400 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={leaving}
    >
      <VeritasLoader fullScreen={false} label="Veritas" size="lg" />
    </div>
  );
}

import { useEffect, useSyncExternalStore } from "react";
import { loadingMessage, subscribeLoading } from "./loading-state.js";

export default function LoadingPopup() {
  const label = useSyncExternalStore(subscribeLoading, loadingMessage);
  useEffect(() => {
    if (!label) return;
    const blockKeys = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", blockKeys, true);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", blockKeys, true);
    };
  }, [label]);
  if (!label) return null;
  return <div className="work-loading-backdrop"><div className="work-loading-popup" role="status" aria-live="polite" aria-busy="true"><span className="work-loading-spinner" aria-hidden="true" /><strong>{label}</strong><small>Please wait…</small></div></div>;
}


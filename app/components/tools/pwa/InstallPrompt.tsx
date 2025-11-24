"use client";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    // const isMobile = true;
    if (!isMobile) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-5 right-5 left-5 mx-auto max-w-sm bg-[#0b1d48] text-white rounded-2xl p-4 shadow-lg flex items-center justify-between z-50 animate-fade-in">
      <span>می‌خوای اپ رو نصب کنی؟</span>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg"
        >
          نصب
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-300 text-sm"
        >
          نه
        </button>
      </div>
    </div>
  );
}

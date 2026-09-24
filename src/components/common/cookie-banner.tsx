"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_STORAGE_KEY = "radhe_vastraz_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        timer = setTimeout(() => setVisible(true), 800);
      }
    } catch {
      // localStorage may fail in strict private browsing; do not crash
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleConsent = (choice: "all" | "essential") => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Ignore storage errors
    }
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      role="region"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/95 text-slate-100 p-5 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                <span>Cookie Preferences</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              </h3>
              <button
                type="button"
                onClick={() => handleConsent("essential")}
                className="text-slate-400 hover:text-white p-1 -mr-1 rounded-md transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We use essential cookies to keep you signed in securely and remember your academy dashboard preferences. We do not sell your personal data.
            </p>
            <div className="mt-2 text-xs">
              <Link
                href="/privacy"
                className="text-primary hover:underline underline-offset-4 font-medium"
              >
                Read our Privacy Policy &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleConsent("essential")}
            className="text-xs text-slate-300 hover:text-white hover:bg-slate-800 h-8 px-3"
          >
            Essential Only
          </Button>
          <Button
            size="sm"
            onClick={() => handleConsent("all")}
            className="text-xs h-8 px-4 font-medium shadow-sm"
          >
            Accept All
          </Button>
        </div>
      </div>
    </aside>
  );
}


'use client';

import { useEffect, useCallback, useRef, type ReactNode } from 'react';
import { generateFingerprint, getSessionId, trackRequest } from '@/lib/security/fingerprint';
import { addDOMWatermark, addVisualWatermark } from '@/lib/security/watermark';

// ─── Configuration ───────────────────────────────────────────────────────────
const SHIELD_ID = '__ng_shield';
const OVERLAY_ID = '__ng_clone_overlay';
const SHIELD_ATTR = 'data-ng-protected';

const BLOCKED_KEYS: Array<{ key: string; ctrl?: boolean; shift?: boolean; meta?: boolean }> = [
  { key: 's', ctrl: true },              // Save page
  { key: 'u', ctrl: true },              // View source
  { key: 'i', ctrl: true, shift: true }, // DevTools (Elements)
  { key: 'j', ctrl: true, shift: true }, // DevTools (Console)
  { key: 'c', ctrl: true, shift: true }, // DevTools (Inspect)
  { key: 'F12' },                        // DevTools
  { key: 'p', ctrl: true },              // Print
  { key: 's', meta: true },              // Save (Mac)
  { key: 'u', meta: true },              // View source (Mac)
  { key: 'i', meta: true, shift: true }, // DevTools (Mac)
];

const SCRAPER_AGENTS = [
  'wget', 'curl', 'httrack', 'scrapy', 'puppeteer',
  'phantomjs', 'headlesschrome', 'bot', 'crawl', 'spider',
];

// ─── Toast Notification ──────────────────────────────────────────────────────
function showToast(message: string) {
  if (typeof document === 'undefined') return;

  // Remove existing toast
  const existing = document.getElementById('ng-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'ng-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #a78bfa;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    z-index: 999999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    border: 1px solid rgba(167, 139, 250, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    user-select: none;
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(-8px)';
  });

  // Animate out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ─── Clone Detection Overlay ─────────────────────────────────────────────────
function showCloneOverlay() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(OVERLAY_ID)) return;

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute(SHIELD_ATTR, 'overlay');
  overlay.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      backdrop-filter: blur(20px);
    ">
      <div style="
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 1px solid rgba(167, 139, 250, 0.3);
        border-radius: 20px;
        padding: 48px;
        max-width: 520px;
        text-align: center;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
      ">
        <div style="font-size: 48px; margin-bottom: 16px;">🛡️</div>
        <h2 style="
          color: #a78bfa;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 12px 0;
        ">Licensed Product</h2>
        <p style="
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 24px 0;
        ">
          This is a licensed copy of NicheGenius AI.<br/>
          Unauthorized copying, redistribution, or cloning is strictly prohibited
          and may result in legal action.
        </p>
        <a href="https://nichegenius.ai" style="
          display: inline-block;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: white;
          padding: 12px 32px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        ">Visit Official Site →</a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

// ─── Component ───────────────────────────────────────────────────────────────
export function AntiCloneShield({ children }: { children: ReactNode }) {
  const fingerprintRef = useRef<string>('');
  const shieldActiveRef = useRef(false);

  // ── Right-click protection ───────────────────────────────────────────────
  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Allow right-click on form inputs for paste etc.
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }
    e.preventDefault();
    showToast('🛡️ This content is protected');
  }, []);

  // ── Keyboard shortcut blocking ───────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    for (const combo of BLOCKED_KEYS) {
      const keyMatch = e.key.toLowerCase() === combo.key.toLowerCase() || e.key === combo.key;
      const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : true;
      const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
      const metaMatch = combo.meta ? e.metaKey : true;

      if (keyMatch && ctrlMatch && shiftMatch && metaMatch) {
        // Don't block Ctrl+C for text copying in inputs
        if (e.key.toLowerCase() === 'c' && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
          continue;
        }
        e.preventDefault();
        e.stopPropagation();
        showToast('🛡️ This action is disabled');
        return;
      }
    }
  }, []);

  // ── Drag prevention ──────────────────────────────────────────────────────
  const handleDragStart = useCallback((e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' || target.closest('[data-protected]')) {
      e.preventDefault();
    }
  }, []);

  // ── Focus blur (Print Screen detection) ──────────────────────────────────
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Subtle blur when tab loses focus — catches PrintScreen
      document.body.style.filter = 'blur(8px)';
      document.body.style.transition = 'filter 0.15s ease';
    } else {
      document.body.style.filter = 'none';
    }
  }, []);

  // ── DevTools Detection ───────────────────────────────────────────────────
  const detectDevTools = useCallback(() => {
    // Method 1: Window size discrepancy
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
      showToast('🛡️ Developer tools detected');
    }

    // Method 2: Debugger timing
    const start = performance.now();
    // This line triggers a pause when DevTools is open
    // eslint-disable-next-line no-debugger
    debugger;
    const duration = performance.now() - start;
    if (duration > 100) {
      showToast('🛡️ Debugging detected');
    }
  }, []);

  // ── Local file detection ─────────────────────────────────────────────────
  const detectLocalFile = useCallback(() => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    const isLocal =
      protocol === 'file:' ||
      (protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.endsWith('.local'));

    // Also check if served from a different domain
    const isOffDomain =
      protocol === 'https:' &&
      !hostname.includes('nichegenius') &&
      !hostname.includes('vercel') &&
      !hostname.includes('localhost') &&
      hostname !== '127.0.0.1';

    if (isLocal || isOffDomain) {
      showCloneOverlay();
    }
  }, []);

  // ── User Agent Detection ─────────────────────────────────────────────────
  const detectScraperUA = useCallback(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isScraper = SCRAPER_AGENTS.some((agent) => ua.includes(agent));
    if (isScraper) {
      showCloneOverlay();
    }
  }, []);

  // ── Selection protection on [data-protected] elements ────────────────────
  const applySelectionProtection = useCallback(() => {
    const style = document.createElement('style');
    style.id = 'ng-selection-guard';
    style.textContent = `
      [data-protected] {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      [data-protected]::selection {
        background: transparent;
      }
      /* Allow selection in form elements */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        user-select: text !important;
      }
    `;
    if (!document.getElementById('ng-selection-guard')) {
      document.head.appendChild(style);
    }
  }, []);

  // ── MutationObserver: self-healing shield ─────────────────────────────────
  const setupMutationObserver = useCallback(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Check if shield element was removed
        for (const removed of Array.from(mutation.removedNodes)) {
          if (removed instanceof HTMLElement) {
            if (
              removed.id === SHIELD_ID ||
              removed.id === OVERLAY_ID ||
              removed.getAttribute?.(SHIELD_ATTR) ||
              removed.id === 'ng-selection-guard'
            ) {
              // Re-inject protections
              setTimeout(() => {
                applySelectionProtection();
                detectLocalFile();
              }, 50);
            }
          }
        }

        // Check if shield attributes were tampered
        if (
          mutation.type === 'attributes' &&
          mutation.target instanceof HTMLElement &&
          mutation.target.id === SHIELD_ID
        ) {
          applySelectionProtection();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [SHIELD_ATTR, 'style'],
    });

    return observer;
  }, [applySelectionProtection, detectLocalFile]);

  // ── Inject invisible fingerprint watermark into DOM ──────────────────────
  const injectWatermark = useCallback(async () => {
    const fp = await generateFingerprint();
    fingerprintRef.current = fp.hash;

    // DOM watermark
    addDOMWatermark(document.body, fp.hash);

    // Visual watermark on main content area
    const mainContent = document.querySelector('main') || document.querySelector('[class*="relative z-10"]');
    if (mainContent instanceof HTMLElement) {
      addVisualWatermark(mainContent, fp.hash);
    }

    // Hidden fingerprint div (traceable in saved HTML)
    const fpDiv = document.createElement('div');
    fpDiv.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;';
    fpDiv.setAttribute('aria-hidden', 'true');
    fpDiv.setAttribute(SHIELD_ATTR, 'fingerprint');
    fpDiv.innerHTML = `<!-- NG:${fp.hash}:${fp.sessionId}:${fp.timestamp} -->`;
    document.body.appendChild(fpDiv);
  }, []);

  // ── Track requests for scraping detection ─────────────────────────────────
  const monitorScraping = useCallback(() => {
    const result = trackRequest();
    if (result.isSuspicious) {
      showToast('⚠️ Unusual activity detected');
      // Slow down the page slightly to discourage scraping
      document.body.style.transition = 'opacity 2s ease';
      document.body.style.opacity = '0.3';
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 3000);
    }
  }, []);

  // ── Main Effect: Wire everything up ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || shieldActiveRef.current) return;
    shieldActiveRef.current = true;

    // Event listeners
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Static protections
    applySelectionProtection();
    detectLocalFile();
    detectScraperUA();
    monitorScraping();

    // Async protections
    injectWatermark();

    // MutationObserver for self-healing
    const observer = setupMutationObserver();

    // DevTools detection interval (gentle — every 5s)
    // Using size-based only in production to avoid debugger annoyance in dev
    const devToolsInterval = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        showToast('🛡️ Developer tools detected');
      }
    }, 5000);

    // Disable image dragging globally
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Prevent "Save As" via beforeunload trick for some browsers
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only trigger on suspicious saves, not normal navigation
      if (document.hidden) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(devToolsInterval);
      observer.disconnect();
      shieldActiveRef.current = false;
    };
  }, [
    handleContextMenu,
    handleKeyDown,
    handleDragStart,
    handleVisibilityChange,
    applySelectionProtection,
    detectLocalFile,
    detectScraperUA,
    monitorScraping,
    injectWatermark,
    setupMutationObserver,
    detectDevTools,
  ]);

  return (
    <div id={SHIELD_ID} data-ng-protected="root">
      {children}
    </div>
  );
}

export default AntiCloneShield;

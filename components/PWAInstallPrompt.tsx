import React, { useState, useEffect, useCallback } from 'react';

const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInIframe, setIsInIframe] = useState(false);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('No deferredPrompt available for native install');
      return;
    }
    console.log('Triggering native install prompt');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User choice outcome:', outcome);
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);

    // Define a global function to trigger the prompt manually
    (window as any).showPwaInstallPrompt = () => {
      console.log('Manual PWA prompt trigger called');
      // If we have a deferred prompt, try to use it directly
      if ((window as any).deferredPwaPrompt) {
        setDeferredPrompt((window as any).deferredPwaPrompt);
        setShowPrompt(true);
      } else {
        localStorage.removeItem('pwa_prompt_dismissed_at');
        setShowPrompt(true);
      }
    };

    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    console.log('PWA Prompt: isStandalone =', isStandalone);
    if (isStandalone) return;

    // 2. Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    }

    // 3. Listen for Chrome's install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('PWA Prompt: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPwaPrompt = e;
      
      const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
      const oneDay = 24 * 60 * 60 * 1000;
      if (!dismissedAt || (Date.now() - parseInt(dismissedAt)) > oneDay) {
        setShowPrompt(true);
      }
    };

    // Check if the event already fired (some browsers might fire it very early)
    if ((window as any).deferredPwaPrompt) {
      console.log('PWA Prompt: Using globally captured deferredPwaPrompt');
      setDeferredPrompt((window as any).deferredPwaPrompt);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt after a short delay to allow browser to fire event
    const timer = setTimeout(() => {
      const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
      const oneDay = 24 * 60 * 60 * 1000;
      if (!dismissedAt || (Date.now() - parseInt(dismissedAt)) > oneDay) {
        setShowPrompt(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
      delete (window as any).showPwaInstallPrompt;
    };
  }, [platform]);

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed_at', Date.now().toString());
  };

  if (!showPrompt) return null;

  const appUrl = window.location.origin;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-xl border border-orange-100 shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 20H22V23H2V20Z" fill="#1A1A1A" />
                  <path d="M5 20L10 4.5H14L19 20H5Z" fill="#F27D26" />
                  <path d="M8.2 11.5H15.8L16.8 14.5H7.2L8.2 11.5Z" fill="#FFFFFF" fillOpacity="0.95" />
                  <path d="M10.4 6H13.6L14.2 8.5H9.8L10.4 6Z" fill="#FFFFFF" fillOpacity="0.95" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Install TTM WA Guide</h4>
                <p className="text-[10px] text-gray-500">Quick offline access</p>
              </div>
            </div>
            <button onClick={dismissPrompt} className="text-gray-400 hover:text-gray-600 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
            Install this app on your home screen for quick offline access to TTM data and a full-screen experience.
          </p>

          <div className="space-y-4">
            {isInIframe ? (
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                    <span className="font-bold uppercase block mb-1 text-blue-900">⚠️ Action Required:</span>
                    Browsers block "Install" buttons inside preview windows. You <span className="font-bold underline text-blue-700">must</span> open the app in a full tab to install it.
                  </p>
                </div>
                <a 
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#F27D26] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#d96a1d] transition-all shadow-lg shadow-orange-500/30 active:scale-95"
                >
                  1. Open in New Tab to Install
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 20 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            ) : (
              <>
                {platform === 'ios' ? (
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-[10px] text-orange-800 font-medium leading-relaxed">
                      <span className="font-bold uppercase block mb-2">How to Install on iOS:</span>
                      1. Tap the <span className="font-bold">Share</span> button in Safari.<br/>
                      2. Scroll down and tap <span className="font-bold">"Add to Home Screen"</span>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deferredPrompt ? (
                      <button 
                        onClick={handleInstall}
                        className="w-full bg-[#F27D26] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#d96a1d] transition-all shadow-lg shadow-orange-500/30 active:scale-95"
                      >
                        Install Now
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                          <p className="text-[10px] text-orange-800 font-medium leading-relaxed">
                            <span className="font-bold uppercase block mb-2 text-orange-900">Manual Install:</span>
                            If the button above doesn't appear, tap your browser's menu (three dots) and select <span className="font-bold">"Install App"</span> or <span className="font-bold">"Add to Home Screen"</span>.
                          </p>
                        </div>
                        <button 
                          onClick={() => window.location.reload()}
                          className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                        >
                          Refresh to Try Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            <button 
              onClick={dismissPrompt}
              className="w-full py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

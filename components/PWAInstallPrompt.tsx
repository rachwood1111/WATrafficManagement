import React, { useState, useEffect, useCallback } from 'react';

const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPwaPrompt = e; // Store globally for App.tsx access if needed
      
      const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
      const oneDay = 24 * 60 * 60 * 1000;
      if (!dismissedAt || (Date.now() - parseInt(dismissedAt)) > oneDay) {
        setShowPrompt(true);
      }
    };

    // Check if the event already fired (some browsers might fire it very early)
    if ((window as any).deferredPwaPrompt) {
      console.log('Using globally captured deferredPwaPrompt');
      setDeferredPrompt((window as any).deferredPwaPrompt);
      const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
      const oneDay = 24 * 60 * 60 * 1000;
      if (!dismissedAt || (Date.now() - parseInt(dismissedAt)) > oneDay) {
        setShowPrompt(true);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. For iOS, show prompt after a short delay
    if (platform === 'ios') {
      const timer = setTimeout(() => {
        const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
        const oneDay = 24 * 60 * 60 * 1000;
        if (!dismissedAt || (Date.now() - parseInt(dismissedAt)) > oneDay) {
          setShowPrompt(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      delete (window as any).showPwaInstallPrompt;
    };
  }, [platform]);

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed_at', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 md:left-auto md:right-6 md:w-80 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white text-[#1A1A1A] p-5 rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 20H22V23H2V20Z" fill="#1A1A1A" />
                <path d="M5 20L10 4.5H14L19 20H5Z" fill="#F27D26" />
                <path d="M8.2 11.5H15.8L16.8 14.5H7.2L8.2 11.5Z" fill="#FFFFFF" fillOpacity="0.95" />
                <path d="M10.4 6H13.6L14.2 8.5H9.8L10.4 6Z" fill="#FFFFFF" fillOpacity="0.95" />
              </svg>
            </div>
            <h4 className="font-bold text-sm">Install TTM WA Guide</h4>
          </div>
          <button onClick={dismissPrompt} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          {platform === 'ios' 
            ? 'To install: Tap the "Share" icon below and then select "Add to Home Screen".'
            : 'Install this app on your home screen for quick offline access to TTM data.'}
        </p>

        {platform !== 'ios' && deferredPrompt && (
          <button 
            onClick={handleInstall}
            className="w-full bg-[#F27D26] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#d96a1d] transition-colors shadow-lg shadow-orange-500/20"
          >
            Install Now
          </button>
        )}

        {platform !== 'ios' && !deferredPrompt && (
          <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 mb-2">
             <p className="text-[10px] text-orange-800 font-medium leading-tight">
               <span className="font-bold uppercase block mb-1">Manual Install:</span>
               Tap your browser's menu (three dots or arrow) and select <span className="font-bold">"Install App"</span> or <span className="font-bold">"Add to Home Screen"</span>.
             </p>
          </div>
        )}

        {platform === 'ios' && (
          <div className="flex justify-center pt-1">
             <div className="animate-bounce text-[#F27D26]">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

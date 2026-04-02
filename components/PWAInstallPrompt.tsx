import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

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
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. For iOS, show prompt after a short delay (if not already dismissed)
    const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (platform === 'ios' && !hasDismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [platform]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-4 right-4 z-50 md:left-auto md:right-6 md:w-80"
      >
        <div className="bg-[#1A1A1A] text-white p-5 rounded-2xl shadow-2xl border border-[#F27D26]/30">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#F27D26] p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 20H22V23H2V20Z" fill="#000000" />
                  <path d="M5 20L12 2L19 20H5Z" fill="currentColor" />
                </svg>
              </div>
              <h4 className="font-bold text-sm">Install TTM WA Guide</h4>
            </div>
            <button onClick={dismissPrompt} className="text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
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

          {platform === 'ios' && (
            <div className="flex justify-center pt-1">
               <div className="animate-bounce text-[#F27D26]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;

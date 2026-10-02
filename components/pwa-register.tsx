'use client';

import { useEffect } from 'react';

export function PWARegister() {
  useEffect(() => {
    // Solo registrar en producción: en dev cachea chunks y sirve código viejo
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      return;
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Error registrando service worker:', err);
      });
    }
  }, []);

  return null;
}

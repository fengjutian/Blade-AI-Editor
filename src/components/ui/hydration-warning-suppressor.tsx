'use client';

import { useEffect } from 'react';

/**
 * Component that suppresses hydration warnings caused by browser extensions
 * This is particularly useful for attributes like data-atm-ext-installed that are
 * added by ad blockers and other browser extensions
 */
export default function HydrationWarningSupressor() {
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // List of known browser extension patterns that cause hydration issues
    const extensionPatterns = [
      'data-atm-ext-installed',
      'data-grammarly-shadow-root',
      'data-lastpass-installed',
      'data-1p-extension',
      'data-bitwarden-watching',
      'hydrated but some attributes',
      'browser extension',
    ];
    
    const shouldSuppressWarning = (message: string) => {
      return extensionPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      );
    };
    
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' && 
        shouldSuppressWarning(args[0])
      ) {
        // Suppress known browser extension hydration warnings
        return;
      }
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      if (
        typeof args[0] === 'string' && 
        shouldSuppressWarning(args[0])
      ) {
        // Suppress known browser extension hydration warnings
        return;
      }
      originalWarn.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);
  
  return null; // This component doesn't render anything
}
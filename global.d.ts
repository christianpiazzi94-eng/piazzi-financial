// global.d.ts
// This file declares global functions injected by external scripts (like GA4)
interface Window {
  gtag: (...args: any[]) => void;
  // Add other global functions here if needed later
}
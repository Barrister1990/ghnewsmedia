import { useEffect, useRef } from 'react';

const initializedSlots = new WeakSet<HTMLModElement>();

/**
 * Initialize an AdSense slot exactly once per <ins> element.
 * Prevents "already have ads in them" errors on route transitions/rehydration.
 */
export const useAdSenseSlot = (enabled: boolean) => {
  const slotRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const slot = slotRef.current;
    if (!slot) return;

    // Skip if this exact element has already been initialized.
    if (initializedSlots.has(slot)) return;

    // Skip if AdSense already marked the slot in DOM.
    if (slot.getAttribute('data-adsbygoogle-status')) {
      initializedSlots.add(slot);
      return;
    }

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      initializedSlots.add(slot);
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [enabled]);

  return slotRef;
};

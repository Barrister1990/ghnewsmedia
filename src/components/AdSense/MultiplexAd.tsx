import { useEffect } from 'react';
import { ENABLE_ADSENSE, ADSENSE_CLIENT_ID } from '@/config/adsense';

interface MultiplexAdProps {
  adSlot: string;
  enabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Multiplex Ad Component (Auto/Relaxed Format)
 * 
 * Google's multiplex ads (autorelaxed format) automatically adapt to different placements
 * and screen sizes. These ads can be placed in various locations on your site.
 * 
 * Note: You can also enable Google's automatic ad placement which will place ads
 * automatically across your site without manual placement.
 */
const MultiplexAd: React.FC<MultiplexAdProps> = ({ 
  adSlot, 
  enabled,
  style,
  className = '' 
}) => {
  const isEnabled = enabled !== undefined ? enabled : ENABLE_ADSENSE;

  useEffect(() => {
    if (isEnabled && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [isEnabled]);

  if (!isEnabled) {
    // Return placeholder during development/pre-approval
    return (
      <div
        className={`adsbygoogle-placeholder ${className}`}
        style={{
          minHeight: '100px',
          backgroundColor: '#f3f4f6',
          border: '1px dashed #d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '14px',
          ...style,
        }}
      >
        <span>Multiplex Ad Space (Enable after AdSense approval)</span>
      </div>
    );
  }

  return (
    <div style={{ margin: '24px 0', ...style }} className={className}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-format="autorelaxed"
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
      />
    </div>
  );
};

export default MultiplexAd;

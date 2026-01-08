import { useEffect } from 'react';
import { ENABLE_ADSENSE, ADSENSE_CLIENT_ID } from '@/config/adsense';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
  fullWidthResponsive?: boolean;
  // Override global enable setting (optional)
  enabled?: boolean;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = 'auto',
  style,
  className = '',
  fullWidthResponsive = true,
  enabled, // Optional override, defaults to global ENABLE_ADSENSE setting
}) => {
  // Use local enabled prop if provided, otherwise use global setting
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
        <span>Ad Space (Enable after AdSense approval)</span>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        textAlign: 'center',
        ...style,
      }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
};

export default AdSenseAd;

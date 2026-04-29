import { ENABLE_ADSENSE, ADSENSE_CLIENT_ID, isConfiguredAdSlot } from '@/config/adsense';
import { useAdSenseSlot } from './useAdSenseSlot';

interface InArticleAdProps {
  adSlot: string;
  enabled?: boolean;
}

/**
 * In-Article Ad Component
 * Place this between paragraphs in article content
 * Uses Google's in-article ad format with fluid layout
 */
const InArticleAd: React.FC<InArticleAdProps> = ({ adSlot, enabled }) => {
  const isEnabled = enabled !== undefined ? enabled : ENABLE_ADSENSE;
  const hasValidSlot = isConfiguredAdSlot(adSlot);
  if (!hasValidSlot) return null;

  const adSlotRef = useAdSenseSlot(isEnabled);

  if (!isEnabled) {
    // Return placeholder during development/pre-approval
    return (
      <div
        className="adsbygoogle-placeholder"
        style={{
          margin: '32px 0',
          minHeight: '100px',
          backgroundColor: '#f3f4f6',
          border: '1px dashed #d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        <span>In-Article Ad Space (Enable after AdSense approval)</span>
      </div>
    );
  }

  return (
    <div style={{ margin: '32px 0', textAlign: 'center' }}>
      <ins
        ref={adSlotRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
      />
    </div>
  );
};

export default InArticleAd;

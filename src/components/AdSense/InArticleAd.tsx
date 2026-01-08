import AdSenseAd from './AdSenseAd';
import { ENABLE_ADSENSE } from '@/config/adsense';

interface InArticleAdProps {
  adSlot: string;
  enabled?: boolean;
}

/**
 * In-Article Ad Component
 * Place this between paragraphs in article content
 */
const InArticleAd: React.FC<InArticleAdProps> = ({ adSlot, enabled }) => {
  return (
    <div style={{ margin: '32px 0', textAlign: 'center' }}>
      <AdSenseAd
        adSlot={adSlot}
        adFormat="auto"
        enabled={enabled !== undefined ? enabled : ENABLE_ADSENSE}
        style={{ minHeight: '250px' }}
      />
    </div>
  );
};

export default InArticleAd;

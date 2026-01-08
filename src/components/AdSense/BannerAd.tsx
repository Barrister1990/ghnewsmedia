import AdSenseAd from './AdSenseAd';
import { ENABLE_ADSENSE } from '@/config/adsense';

interface BannerAdProps {
  adSlot: string;
  enabled?: boolean;
}

/**
 * Banner Ad Component
 * Use this for horizontal banner ads (728x90, 970x90, etc.)
 */
const BannerAd: React.FC<BannerAdProps> = ({ adSlot, enabled }) => {
  return (
    <div style={{ margin: '24px 0', textAlign: 'center' }}>
      <AdSenseAd
        adSlot={adSlot}
        adFormat="horizontal"
        enabled={enabled !== undefined ? enabled : ENABLE_ADSENSE}
        style={{ minHeight: '90px' }}
      />
    </div>
  );
};

export default BannerAd;

import AdSenseAd from './AdSenseAd';
import { ENABLE_ADSENSE } from '@/config/adsense';

interface SidebarAdProps {
  adSlot: string;
  enabled?: boolean;
}

/**
 * Sidebar Ad Component
 * Use this for sidebar placements (300x250 or 300x600)
 */
const SidebarAd: React.FC<SidebarAdProps> = ({ adSlot, enabled }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <AdSenseAd
        adSlot={adSlot}
        adFormat="rectangle"
        enabled={enabled !== undefined ? enabled : ENABLE_ADSENSE}
        style={{ minHeight: '250px' }}
      />
    </div>
  );
};

export default SidebarAd;

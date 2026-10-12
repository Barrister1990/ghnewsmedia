import { ADSENSE_CLIENT_ID, ENABLE_ADSENSE, isConfiguredAdSlot } from '@/config/adsense';
import { useAdSenseSlot } from '@/components/AdSense/useAdSenseSlot';

type AdShape = 'leaderboard' | 'rectangle' | 'infeed';

/** Reserved heights stop the page from jumping when an ad fills in. */
const SHAPES: Record<AdShape, { box: string; format: string }> = {
  leaderboard: { box: 'min-h-[100px] md:min-h-[90px]', format: 'horizontal' },
  rectangle: { box: 'min-h-[250px]', format: 'rectangle' },
  infeed: { box: 'min-h-[250px] md:min-h-[120px]', format: 'auto' },
};

interface AdSlotProps {
  slot: string;
  shape: AdShape;
  className?: string;
}

/** Labelled ad container. Renders nothing until the slot is configured, so no empty boxes ship. */
const AdSlotInner = ({ slot, shape, className = '' }: AdSlotProps) => {
  const ref = useAdSenseSlot(true);
  const { box, format } = SHAPES[shape];

  return (
    <aside aria-label="Advertisement" className={`text-center ${className}`}>
      <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-gp-muted">Advertisement</p>
      <div className={`flex items-center justify-center bg-gp-surface ${box}`}>
        <ins
          ref={ref}
          className="adsbygoogle block w-full"
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};

const AdSlot = (props: AdSlotProps) =>
  ENABLE_ADSENSE && isConfiguredAdSlot(props.slot) ? <AdSlotInner {...props} /> : null;

export default AdSlot;

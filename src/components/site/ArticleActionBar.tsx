import { shareOrCopy, shareUrls } from '@/components/ShareButtons';
import { ArrowUp, Check, MessageCircle, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ArticleActionBarProps {
  url: string;
  title: string;
  excerpt?: string;
}

/** Mobile bottom bar: slides in when the reader scrolls up, hides while they read down. */
export default function ArticleActionBar({ url, title, excerpt }: ArticleActionBarProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 400;
      const goingUp = y < lastY.current - 4;
      const goingDown = y > lastY.current + 4;
      if (y < 500 || nearBottom) setVisible(false);
      else if (goingUp) setVisible(true);
      else if (goingDown) setVisible(false);
      lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const share = async () => {
    if (await shareOrCopy(url, title, excerpt)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const item = 'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-bold text-gp-ink active:bg-gp-surface';

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-gp-line bg-white/95 backdrop-blur transition-transform duration-200 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-md">
        <a href={shareUrls(url, title).whatsapp} target="_blank" rel="noopener noreferrer" className={item} tabIndex={visible ? 0 : -1}>
          <MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden />
          WhatsApp
        </a>
        <button type="button" onClick={share} className={item} tabIndex={visible ? 0 : -1}>
          {copied ? <Check className="h-5 w-5" aria-hidden /> : <Share2 className="h-5 w-5" aria-hidden />}
          {copied ? 'Copied' : 'Share'}
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={item}
          tabIndex={visible ? 0 : -1}
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
          Top
        </button>
      </div>
    </div>
  );
}

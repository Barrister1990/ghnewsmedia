import { Headphones, Pause, Play, Square } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ReadAloudProps {
  articleTitle: string;
  articleContent: string;
  readTime?: number;
}

type Status = 'idle' | 'playing' | 'paused';

const htmlToText = (html: string) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('script, style, iframe, figure, .gp-credit').forEach((el) => el.remove());
  return (div.textContent || '').replace(/\s+/g, ' ').trim();
};

/** "Listen" control using the browser's speech synthesis. */
const ReadAloud: React.FC<ReadAloudProps> = ({ articleTitle, articleContent, readTime }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [supported, setSupported] = useState(true);
  // Chrome drops `onend` if the utterance is garbage-collected mid-speech, so keep a reference.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setStatus('idle');
  }, [articleContent]);

  if (!supported) return null;

  const play = () => {
    const synth = window.speechSynthesis;
    if (status === 'paused') {
      synth.resume();
      setStatus('playing');
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(`${articleTitle}. ${htmlToText(articleContent)}`);
    u.lang = 'en-GB';
    u.onend = () => setStatus('idle');
    u.onerror = () => setStatus('idle');
    utteranceRef.current = u;
    synth.speak(u);
    setStatus('playing');
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus('paused');
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setStatus('idle');
  };

  const pill =
    'inline-flex h-10 items-center gap-2 rounded-full border border-gp-ink px-4 text-sm font-bold text-gp-ink transition-colors hover:bg-gp-ink hover:text-white sm:h-9';

  return (
    <div className="flex items-center gap-2">
      {status === 'playing' ? (
        <button type="button" onClick={pause} className={pill} aria-label="Pause listening">
          <Pause className="h-4 w-4" aria-hidden /> Pause
        </button>
      ) : (
        <button type="button" onClick={play} className={pill} aria-label={status === 'paused' ? 'Resume listening' : 'Listen to this article'}>
          {status === 'paused' ? <Play className="h-4 w-4" aria-hidden /> : <Headphones className="h-4 w-4" aria-hidden />}
          {status === 'paused' ? 'Resume' : 'Listen'}
          {status === 'idle' && readTime ? <span className="font-normal opacity-70">· {readTime} min</span> : null}
        </button>
      )}
      {status !== 'idle' && (
        <button
          type="button"
          onClick={stop}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gp-line text-gp-ink hover:border-gp-ink sm:h-9 sm:w-9"
          aria-label="Stop listening"
        >
          <Square className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
};

export default ReadAloud;

import { Pause, Play, Volume2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ReadAloudProps {
  articleTitle: string;
  articleContent: string;
}

const ReadAloud: React.FC<ReadAloudProps> = ({ articleTitle, articleContent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  // Extract text content from HTML
  const extractTextFromHTML = (html: string): string => {
    if (typeof document === 'undefined') return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove script and style elements
    const scripts = tempDiv.querySelectorAll('script, style, iframe');
    scripts.forEach(el => el.remove());
    
    // Get text content
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up text
    text = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace newlines with space
      .trim();
    
    return text;
  };

  const handlePlay = () => {
    if (!isSupported) {
      alert('Your browser does not support text-to-speech. Please use a modern browser like Chrome, Firefox, or Safari.');
      return;
    }

    if (isPaused && utterance) {
      // Resume paused speech
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // Start new speech
      const text = extractTextFromHTML(articleContent);
      const fullText = `${articleTitle}. ${text}`;
      
      const synth = window.speechSynthesis;
      
      // Cancel any ongoing speech
      synth.cancel();
      
      const newUtterance = new SpeechSynthesisUtterance(fullText);
      
      // Configure voice settings
      newUtterance.rate = 1.0; // Normal speed
      newUtterance.pitch = 1.0; // Normal pitch
      newUtterance.volume = 1.0; // Full volume
      
      // Set language (optional, can be adjusted)
      newUtterance.lang = 'en-GB';
      
      // Event handlers
      newUtterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };
      
      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setUtterance(null);
      };
      
      newUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsPaused(false);
        setUtterance(null);
      };
      
      newUtterance.onpause = () => {
        setIsPaused(true);
        setIsPlaying(false);
      };
      
      newUtterance.onresume = () => {
        setIsPaused(false);
        setIsPlaying(true);
      };
      
      setUtterance(newUtterance);
      synth.speak(newUtterance);
    }
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setUtterance(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) {
    return null; // Don't show the component if not supported
  }

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: '#F3F4F6',
        borderRadius: '8px',
        marginBottom: '16px',
        fontFamily: "'Inter', 'Source Sans 3', system-ui, sans-serif"
      }}
    >
      <Volume2 size={18} style={{ color: '#6B7280', flexShrink: 0 }} />
      <span style={{ fontSize: '13px', color: '#111111', fontWeight: '500', flex: 1 }}>
        Listen to article
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        {!isPlaying && !isPaused && (
          <button
            onClick={handlePlay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: '#1A365D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            aria-label="Play article"
          >
            <Play size={14} />
            Play
          </button>
        )}
        
        {isPlaying && (
          <button
            onClick={handlePause}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: '#6B7280',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            aria-label="Pause article"
          >
            <Pause size={14} />
            Pause
          </button>
        )}
        
        {isPaused && (
          <button
            onClick={handlePlay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: '#1A365D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            aria-label="Resume article"
          >
            <Play size={14} />
            Resume
          </button>
        )}
        
        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            style={{
              padding: '6px 12px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            aria-label="Stop article"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default ReadAloud;

import { useEffect, useState, useRef, useCallback } from 'react';

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>;
  newLogCount: number;
  onReset: () => void;
}

const threshold = 10;
export const ScrollToBottomPill: React.FC<Props> = ({ containerRef, newLogCount, onReset }) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const prevShow = useRef(false);

  const checkIsAtBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkIsAtBottom, { passive: true });
    checkIsAtBottom();
    return () => el.removeEventListener('scroll', checkIsAtBottom);
  }, [containerRef, checkIsAtBottom]);

  const show = !isAtBottom && newLogCount > 0;

  useEffect(() => {
    if (show && !prevShow.current) {
      setAnimateIn(true);
    } else if (!show && prevShow.current) {
      const timeout = setTimeout(() => setAnimateIn(false), 300);
      return () => clearTimeout(timeout);
    }
    prevShow.current = show;
  }, [show]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    onReset();
  };

  if (!animateIn && !show) return null;

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 right-4 flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-full pl-3 pr-4 py-1.5 text-xs shadow-lg hover:bg-gray-700 hover:text-white transition-all z-50 cursor-pointer"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(8px)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
      Scroll to bottom
      {newLogCount > 0 && (
        <span className="bg-blue-500 text-white text-[10px] font-medium rounded-full px-1.5 py-0.5 leading-none">
          {newLogCount} new
        </span>
      )}
    </button>
  );
};

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn } from 'lucide-react';

interface SocialMediaLightboxProps {
  source: 'instagram' | 'tiktok';
  embedHtml: string;
  caption?: string;
  onClose: () => void;
}

export default function SocialMediaLightbox({ source, embedHtml, caption, onClose }: SocialMediaLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const cap = captionRef.current;
    if (!overlay || !panel) return;

    overlay.style.opacity = '0';
    overlay.style.backdropFilter = 'blur(0px)';
    panel.style.transform = 'scale(0.92) translateY(12px)';
    panel.style.opacity = '0';
    if (cap) {
      cap.style.transform = 'translateY(10px)';
      cap.style.opacity = '0';
    }

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition = 'opacity 0.25s ease, backdrop-filter 0.3s ease';
        overlay.style.opacity = '1';
        overlay.style.backdropFilter = 'blur(12px)';
        panel.style.transition = 'transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease';
        panel.style.transform = 'scale(1) translateY(0)';
        panel.style.opacity = '1';
        if (cap) {
          cap.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.12s, opacity 0.25s ease 0.12s';
          cap.style.transform = 'translateY(0)';
          cap.style.opacity = '1';
        }
      });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) {
      onClose();
      return;
    }
    overlay.style.transition = 'opacity 0.2s ease, backdrop-filter 0.2s ease';
    overlay.style.opacity = '0';
    overlay.style.backdropFilter = 'blur(0px)';
    panel.style.transition = 'transform 0.2s ease, opacity 0.18s ease';
    panel.style.transform = 'scale(0.95) translateY(8px)';
    panel.style.opacity = '0';
    window.setTimeout(onClose, 210);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const lightbox = (
    <div
      ref={overlayRef}
      onClick={handleClose}
      className="fixed inset-0 z-[9999] flex min-h-screen w-screen items-center justify-center bg-slate-950/80 px-3 py-4 sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-label={caption || 'Social media post'}
      style={{ opacity: 0 }}
    >
      <div
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
        className="relative flex h-full max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col items-center justify-center"
        style={{ opacity: 0, transform: 'scale(0.92) translateY(12px)' }}
      >
        <button
          onClick={handleClose}
          aria-label="Tutup"
          className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex max-h-full w-full flex-1 items-center justify-center overflow-hidden rounded-2xl">
          <div
            className="max-h-[calc(100vh-7rem)] w-full overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        </div>

        {caption && (
          <p
            ref={captionRef}
            className="mt-3 max-w-3xl rounded-full bg-black/35 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur-md"
            style={{ opacity: 0, transform: 'translateY(10px)' }}
          >
            {caption}
          </p>
        )}

        <div className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm sm:flex">
          <ZoomIn className="h-3.5 w-3.5" />
          <span>ESC atau klik luar untuk menutup</span>
        </div>
      </div>
    </div>
  );

  return createPortal(lightbox, document.body);
}

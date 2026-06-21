import React, { useEffect, useRef, useState } from 'react';

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';
  delay?: number; // dalam milidetik
  duration?: number; // dalam milidetik
}

export const ScrollAnimate: React.FC<ScrollAnimateProps> = ({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 700,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Hentikan observasi setelah elemen terlihat agar animasi hanya jalan sekali (performa tinggi)
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1, // Elemen dianggap masuk jika 10% bagiannya terlihat
        rootMargin: '0px 0px -50px 0px', // Animasi dipicu sedikit sebelum elemen benar-benar di tengah layar
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Definisikan kelas style awal berdasarkan varian animasi
  const getVariantStyles = () => {
    switch (variant) {
      case 'fade-in':
        return isIntersecting ? 'opacity-100' : 'opacity-0';
      case 'scale-in':
        return isIntersecting 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-95';
      case 'slide-left':
        return isIntersecting 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-8';
      case 'slide-right':
        return isIntersecting 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-8';
      case 'fade-up':
      default:
        return isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${getVariantStyles()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimate;

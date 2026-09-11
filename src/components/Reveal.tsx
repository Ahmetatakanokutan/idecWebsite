import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Ekrana girdiginde beliren sarmalayici. `from` ile nereden gelecegi secilir:
 * yandan kayarak (left/right), asagidan (up), yakinlasarak (scale) ya da
 * bulaniktan netlesarak (blur). `delay` ile ayni bolumdeki kardesler sirayla girer.
 * prefers-reduced-motion acikken hook zaten aninda gorunur doner, gecikme de uygulanmaz.
 *
 * Yandan gelen ogeler baslangicta viewport disina tasabilir; yatay kaydirma
 * cubugu cikmasin diye Layout'taki <main> overflow-x-clip kullaniyor.
 */
export type RevealFrom = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

const HIDDEN: Record<RevealFrom, string> = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: '-translate-x-16',
  right: 'translate-x-16',
  scale: 'scale-90',
  blur: 'blur-sm scale-[1.03]',
};

type RevealProps = {
  children: React.ReactNode;
  /** ms cinsinden gecikme — sirali (stagger) girisler icin */
  delay?: number;
  className?: string;
  /** Giris yonu — varsayilan asagidan yukari */
  from?: RevealFrom;
  as?: 'div' | 'li' | 'section' | 'article';
};

const Reveal = ({ children, delay = 0, className = '', from = 'up', as = 'div' }: RevealProps) => {
  const { ref, isVisible, reducedMotion } = useScrollReveal<HTMLDivElement>();
  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      style={reducedMotion ? undefined : { transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out-expo ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-0' : `opacity-0 ${HIDDEN[from]}`
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Reveal;

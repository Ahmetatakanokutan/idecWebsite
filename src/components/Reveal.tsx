import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Ekrana girdiginde 20px asagidan yukari kayarak beliren sarmalayici.
 * `delay` ile ayni bolumdeki kardesler sirayla girer (Nasil Calisir adimlari gibi).
 * prefers-reduced-motion acikken hook zaten aninda gorunur doner, gecikme de uygulanmaz.
 */
type RevealProps = {
  children: React.ReactNode;
  /** ms cinsinden gecikme — sirali (stagger) girisler icin */
  delay?: number;
  className?: string;
  /** Varsayilan yukari kayma yerine baska bir baslangic donusumu */
  from?: string;
  as?: 'div' | 'li' | 'section' | 'article';
};

const Reveal = ({ children, delay = 0, className = '', from = 'translate-y-5', as = 'div' }: RevealProps) => {
  const { ref, isVisible, reducedMotion } = useScrollReveal<HTMLDivElement>();
  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      style={reducedMotion ? undefined : { transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : `opacity-0 ${from}`
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Reveal;

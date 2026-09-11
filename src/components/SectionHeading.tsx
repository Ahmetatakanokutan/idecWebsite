import React from 'react';
import SplitReveal from './SplitReveal';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Bolum basligi: ustte vurgu etiketi (eyebrow), altinda kelime kelime acilan
 * baslik ve aciklama. Etiketin yanindaki ince cizgiler bolum gorunur olunca
 * disa dogru buyur — ortali basliklarda iki yanda, sola dayalilarda sadece solda.
 *
 * Etiket bilincli olarak <p>: baslik hiyerarsisi (h2) sadece asil baslikta.
 */
type SectionHeadingProps = {
  eyebrow?: string;
  /** Baslik; ikinci satir vurgu renginde gosterilir */
  title: string;
  titleAccent?: string;
  description?: React.ReactNode;
  tone?: 'light' | 'dark';
  align?: 'center' | 'left';
  className?: string;
};

const SectionHeading = ({
  eyebrow,
  title,
  titleAccent,
  description,
  tone = 'light',
  align = 'center',
  className = '',
}: SectionHeadingProps) => {
  const { ref, isVisible, reducedMotion } = useScrollReveal<HTMLDivElement>();
  const dark = tone === 'dark';
  const center = align === 'center';
  const titleWords = title.split(/\s+/).filter(Boolean).length;

  const line = (
    <span
      className={`h-px transition-all duration-1000 ease-out-expo ${dark ? 'bg-accent/60' : 'bg-accent-deep/50'} ${
        isVisible ? 'w-10' : 'w-0'
      }`}
      aria-hidden="true"
    />
  );

  const fade = (delay: number, extra = '') => ({
    className: `transition-all duration-1000 ease-out-expo ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${extra}`,
    style: reducedMotion ? undefined : { transitionDelay: `${delay}ms` },
  });

  return (
    <div ref={ref} className={`${center ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p
          className={`flex items-center gap-3 mb-4 text-sm font-bold tracking-[0.2em] uppercase ${
            center ? 'justify-center' : ''
          } ${dark ? 'text-accent' : 'text-accent-deep'}`}
        >
          {line}
          <span {...fade(0, 'inline-block')}>{eyebrow}</span>
          {center && line}
        </p>
      )}
      <h2
        className={`font-archivo text-4xl md:text-5xl font-bold leading-[1.1] mb-6 ${dark ? 'text-white' : 'text-ink-deep'}`}
      >
        <SplitReveal text={title} active={isVisible} delay={120} />
        {titleAccent && (
          <>
            <br />
            <SplitReveal
              text={titleAccent}
              active={isVisible}
              delay={120 + titleWords * 70}
              className={dark ? 'text-accent' : 'text-accent-deep'}
            />
          </>
        )}
      </h2>
      {description && (
        <p {...fade(350, `text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${dark ? 'text-white/60' : 'text-gray-500'}`)}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;

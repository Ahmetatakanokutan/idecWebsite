import React from 'react';
import SplitReveal from './SplitReveal';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Ic sayfalarin ustundeki koyu gradyan bant — ana sayfa ve Hakkimizda ile
 * ayni tasarim dili. Ustte kucuk vurgu etiketi, altinda baslik ve aciklama.
 *
 * Giris: etiketin yanindaki cizgi soldan buyur, baslik (duz metinse) kelime
 * kelime acilir, aciklama soldan kayar, ekler (arama kutusu, rozetler) asagidan.
 *
 * `align="center"` icerik sayfalarinda (duyuru detayi gibi) ortalanmis,
 * varsayilan sola dayali kullanilir. `children` ile bandin altina rozet,
 * arama kutusu ya da sekme gibi ekler konabilir.
 */
type PageHeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  align?: 'left' | 'center';
  /** Dar bant: form/auth sayfalari gibi icerigi kisa olan yerlerde */
  compact?: boolean;
};

const PageHero = ({ eyebrow, title, description, children, align = 'left', compact = false }: PageHeroProps) => {
  const { ref, isVisible, reducedMotion } = useScrollReveal<HTMLDivElement>();
  const center = align === 'center';

  const enter = (hidden: string, delay: number, extra = '') => ({
    className: `transition-all duration-1000 ease-out-expo ${
      isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${hidden}`
    } ${extra}`,
    style: reducedMotion ? undefined : { transitionDelay: `${delay}ms` },
  });

  return (
    <section className="relative overflow-hidden bg-ink-drift bg-[length:200%_200%] animate-drift motion-reduce:animate-none">
      <div className="pointer-events-none absolute -top-24 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float-slow motion-reduce:animate-none" />

      <div
        ref={ref}
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          compact ? 'py-14 md:py-16' : 'py-20 md:py-24'
        }`}
      >
        <div className={center ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'}>
          {eyebrow && (
            <p
              className={`flex items-center gap-3 text-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 ${
                center ? 'justify-center' : ''
              }`}
            >
              <span
                className={`h-px bg-accent/60 transition-all duration-1000 ease-out-expo ${isVisible ? 'w-10' : 'w-0'}`}
                aria-hidden="true"
              />
              <span {...enter('-translate-x-6', 80, 'inline-block')}>{eyebrow}</span>
            </p>
          )}
          <h1
            className={`font-archivo font-bold text-white leading-[1.1] ${
              compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl'
            } ${description || children ? 'mb-6' : ''}`}
          >
            {typeof title === 'string' ? (
              <SplitReveal text={title} active={isVisible} delay={150} />
            ) : (
              <span {...enter('translate-y-6', 150, 'inline-block')}>{title}</span>
            )}
          </h1>
          {description && (
            <p {...enter('-translate-x-10', 400, 'text-lg md:text-xl text-white/75 leading-relaxed')}>{description}</p>
          )}
        </div>

        {children && <div {...enter('translate-y-8', 600, 'relative z-10 mt-10')}>{children}</div>}
      </div>
    </section>
  );
};

export default PageHero;

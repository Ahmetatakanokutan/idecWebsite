import React from 'react';
import Reveal from './Reveal';

/**
 * Ic sayfalarin ustundeki koyu gradyan bant — ana sayfa ve Hakkimizda ile
 * ayni tasarim dili. Ustte kucuk vurgu etiketi, altinda baslik ve aciklama.
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

const PageHero = ({ eyebrow, title, description, children, align = 'left', compact = false }: PageHeroProps) => (
  <section className="relative overflow-hidden bg-ink-drift bg-[length:200%_200%] animate-drift motion-reduce:animate-none">
    <div className="pointer-events-none absolute -top-24 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float-slow motion-reduce:animate-none" />

    <div
      className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        compact ? 'py-14 md:py-16' : 'py-20 md:py-24'
      }`}
    >
      <Reveal className={align === 'center' ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'}>
        {eyebrow && (
          <p className="text-accent text-sm font-bold tracking-[0.2em] uppercase mb-4">{eyebrow}</p>
        )}
        <h1
          className={`font-archivo font-bold text-white leading-[1.1] ${
            compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl'
          } ${description || children ? 'mb-6' : ''}`}
        >
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-white/75 leading-relaxed">{description}</p>
        )}
      </Reveal>

      {children && <div className="relative z-10 mt-10">{children}</div>}
    </div>
  </section>
);

export default PageHero;

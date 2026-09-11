import { Fragment } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Basligi kelime kelime, her kelimeyi kendi maskesinin altindan yukari kaydirarak
 * acar. Satir kirilmasi tarayiciya birakilir (kelimeler inline-block), yani uzun
 * Turkce basliklar da dogal sekilde sarilir.
 *
 * `delay` ilk kelimenin gecikmesi, `stagger` kelimeler arasi fark (ms).
 * Ayni baslikta iki renkli parca varsa (hero'daki gibi) ikinci parcaya
 * ilk parcanin kelime sayisi kadar ek gecikme verilir.
 *
 * Ekran okuyucular metni tek parca okusun diye tam metin aria-label'da,
 * bolunmus kelimeler aria-hidden.
 */
type SplitRevealProps = {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  /** Disaridan tetiklemek icin (orn. bolum gorunur oldugunda). Verilmezse kendi gozlemcisini kullanir. */
  active?: boolean;
};

const SplitReveal = ({ text, delay = 0, stagger = 70, className = '', active }: SplitRevealProps) => {
  const { ref, isVisible, reducedMotion } = useScrollReveal<HTMLSpanElement>();
  const shown = active ?? isVisible;
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {/* Dikey padding + ayni miktar negatif margin: maske "İ" noktasini ve
              "ş/ğ/y" kuyruklarini kesmesin ama satir yuksekligi degismesin. */}
          <span aria-hidden="true" className="inline-block overflow-hidden align-bottom py-[0.12em] -my-[0.12em]">
            <span
              className={`inline-block transition-transform duration-1000 ease-out-expo ${
                shown ? 'translate-y-0' : 'translate-y-[115%]'
              }`}
              style={reducedMotion ? undefined : { transitionDelay: `${delay + i * stagger}ms` }}
            >
              {word}
            </span>
          </span>
          {/* Kelimeler arasi normal bosluk maskenin DISINDA: tarayici satiri buradan kirabilsin. */}
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  );
};

export default SplitReveal;

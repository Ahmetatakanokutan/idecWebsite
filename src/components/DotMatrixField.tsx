import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/useScrollReveal';

/**
 * Ana sayfa hero'sunun arka planindaki nokta matrisi.
 *
 * Hazir bir video ya da kutuphane degil: canvas uzerine cizilen bir nokta izgarasi
 * ve uzerinden capraz gecen bir dalga. Dalganin tepesindeki noktalar buyuyup
 * vurgu yesiline donuyor — sanayiden cikan karbonun yakalanmasini animsatan,
 * projeye ozel bir doku.
 *
 * Performans: dakikada bir degil, her karede ~1200 nokta ciziliyor; bolum
 * ekrandan cikinca ya da sekme arka plana alininca dongu tamamen duruyor.
 * prefers-reduced-motion acikken tek bir durgun kare cizilip birakiliyor.
 */

const SPACING = 30; // noktalar arasi mesafe (px)
const BASE_RADIUS = 1.1;

const DotMatrixField = ({ className = '' }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId = 0;
    let onScreen = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (elapsed: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const time = elapsed * 0.0009;

      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          // Capraz ilerleyen dalga: 0 (dip) .. 1 (tepe)
          const wave = Math.sin(x * 0.011 + y * 0.019 - time * 2.1);
          const energy = (wave + 1) / 2;

          const alpha = 0.05 + Math.pow(energy, 3) * 0.5;
          const radius = BASE_RADIUS + Math.pow(energy, 5) * 2.4;

          // Sadece dalganin tepesi yesile donuyor; gerisi soguk beyaz kaliyor.
          ctx.fillStyle =
            energy > 0.88 ? `rgba(74, 222, 128, ${alpha})` : `rgba(186, 222, 255, ${alpha * 0.7})`;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();

    if (reducedMotion) {
      draw(0);
      const observer = new ResizeObserver(() => {
        resize();
        draw(0);
      });
      observer.observe(canvas);
      return () => observer.disconnect();
    }

    const loop = (now: number) => {
      draw(now);
      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    // Ekrandan cikinca ve sekme arka plana alininca bosuna cizme.
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    intersection.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    start();

    return () => {
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default DotMatrixField;

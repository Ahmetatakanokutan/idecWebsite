import { useEffect, useRef, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Lazy initial state: ilk render'dan itibaren dogru degeri verir, boylece
// reduced-motion acikken bir anlik animasyon "flas"i yasanmaz.
export function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(() =>
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
            ? window.matchMedia(REDUCED_MOTION_QUERY).matches
            : false
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
        const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return reduced;
}

// Bir eleman ekrana girdiginde (bir kez) devreye giren, prefers-reduced-motion'a
// saygili basit bir IntersectionObserver kancasi. Kutuphane gerektirmez.
export function useScrollReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
    const reducedMotion = usePrefersReducedMotion();
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(reducedMotion);

    useEffect(() => {
        if (reducedMotion) {
            setIsVisible(true);
            return;
        }

        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(node);
                }
            },
            // Pozitif alt margin: eleman görünüme girmeden ~150px önce tetiklenir,
            // böylece kullanıcı oraya kaydırdığında içerik zaten belirmiş olur —
            // önceki negatif margin gecikmeye ve uzun süre "boş" görünmeye yol açıyordu.
            { threshold: 0.05, rootMargin: '0px 0px 150px 0px', ...options }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [reducedMotion]);

    return { ref, isVisible, reducedMotion };
}

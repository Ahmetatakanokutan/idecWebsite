import { useCallback, useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion(): boolean {
    const [reducedMotion, setReducedMotion] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(REDUCED_MOTION_QUERY).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
        const handleChange = () => setReducedMotion(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return reducedMotion;
}

export function useScrollReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
    const reducedMotion = usePrefersReducedMotion();
    const [node, setNode] = useState<T | null>(null);
    const [isVisible, setIsVisible] = useState(reducedMotion);

    const ref = useCallback((element: T | null) => {
        setNode(element);
    }, []);

    useEffect(() => {
        if (reducedMotion) {
            setIsVisible(true);
            return;
        }

        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px',
                ...options,
            }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [node, reducedMotion]);

    return { ref, isVisible, reducedMotion };
}
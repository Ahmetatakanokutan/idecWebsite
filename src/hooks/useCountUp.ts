import { useEffect, useState } from 'react';

const DEFAULT_DURATION_MS = 1400;

/**
 * `active` true olunca 0'dan `target`e ease-out egrisiyle sayar.
 * requestAnimationFrame ile calisir, kutuphane gerektirmez.
 * Reduced motion acikken dogrudan hedefi dondurur.
 *
 * `decimals` verilirse ara degerler o basamak sayisina yuvarlanir (orn. %71,8
 * gibi resmi istatistikler tam sayiya yuvarlanmadan sayabilsin diye).
 */
export function useCountUp(
    target: number,
    active: boolean,
    reducedMotion: boolean,
    durationMs: number = DEFAULT_DURATION_MS,
    decimals: number = 0
) {
    const [value, setValue] = useState(reducedMotion ? target : 0);

    useEffect(() => {
        if (!active) return;
        if (reducedMotion) {
            setValue(target);
            return;
        }

        const factor = Math.pow(10, decimals);
        let frameId: number;
        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased * factor) / factor);
            if (progress < 1) {
                frameId = requestAnimationFrame(tick);
            }
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [active, target, reducedMotion, durationMs, decimals]);

    return value;
}

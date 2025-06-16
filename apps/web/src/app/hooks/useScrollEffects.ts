import { useEffect, useState, useRef } from 'react';

/**
 * @param func 要被節流的函數
 * @param limit 時間限制 (毫秒)
 */
function throttle<F extends (...args: Parameters<F>) => void>(
    func: F,
    limit: number
): (...args: Parameters<F>) => void {
    let inThrottle: boolean;

    return function (...args: Parameters<F>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

interface ScrollEffects {
    isScrollingUp: boolean;
    isAtTop: boolean;
}

export function useScrollEffects(threshold = 80): ScrollEffects {
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsAtTop(currentScrollY < threshold / 2);

            if (currentScrollY <= threshold) {
                setIsScrollingUp(true);
            } else if (currentScrollY < lastScrollY.current) {
                setIsScrollingUp(true);
            } else {
                setIsScrollingUp(false);
            }
            lastScrollY.current = currentScrollY;
        };

        const throttledHandleScroll = throttle(handleScroll, 100);
        window.addEventListener('scroll', throttledHandleScroll);

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [threshold]);

    return { isScrollingUp, isAtTop };
}
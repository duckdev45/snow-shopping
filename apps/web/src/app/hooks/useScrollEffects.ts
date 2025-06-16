import { useEffect, useState, useRef } from 'react';

function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    let lastFunc: NodeJS.Timeout;
    return function(this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    } as T;
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

            // 判斷是否在頂部
            setIsAtTop(currentScrollY < threshold / 2); // 在 threshold 一半的距離內都算頂部

            // 判斷捲動方向
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
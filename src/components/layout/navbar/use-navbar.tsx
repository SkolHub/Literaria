'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function useNavbar() {
  const pathName = usePathname();
  const [navMode, setNavMode] = useState<boolean>(false);

  const main = useRef<any>(null);

  useEffect(() => {
    main.current = document.getElementById('main');
  }, []);

  useEffect(() => {
    const updateNavMode = () => {
      setNavMode(pathName === '/' && window.innerWidth > 900);
    };

    updateNavMode();
    window.addEventListener('resize', updateNavMode);

    return () => {
      window.removeEventListener('resize', updateNavMode);
    };
  }, [pathName]);

  const { scrollYProgress } = useScroll({
    container: main,
    layoutEffect: false
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (pathName === '/' && window.innerWidth > 900) {
      setNavMode(value === 0);
    }
  });

  return navMode;
}

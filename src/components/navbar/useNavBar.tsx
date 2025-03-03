'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { usePathname } from 'next/navigation';

const useNavBar = () => {
	const pathName = usePathname();

	const [navMode, setNavMode] = useState<boolean>(
		pathName === '/' && window.innerWidth > 900
	);

	const main = useRef<any>(null);

	useEffect(() => {
		main.current = document.getElementById('main');
	}, [navMode]);

	useEffect(() => {
		setNavMode(pathName === '/' && window.innerWidth > 900);
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

	return {
		navMode
	};
};

export default useNavBar;

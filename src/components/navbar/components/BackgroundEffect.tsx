import { motion, TargetAndTransition } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

interface props {
	expanded: boolean;
	setExpanded: Dispatch<SetStateAction<boolean>>;
}

const BackgroundEffect = ({ expanded, setExpanded }: props) => {
	const navbarBackground: TargetAndTransition = {
		backdropFilter: expanded ? 'blur(10px)' : 'blur(0px)',
		backgroundColor: expanded ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0)',
		zIndex: expanded ? 9 : -1
	};

	const transition = {
		zIndex: {
			delay: expanded ? 0 : 0.2
		}
	};

	return (
		<motion.div
			onClick={() => {
				setExpanded(false);
			}}
			animate={navbarBackground}
			transition={transition}
			className='w-screen h-[100svh] fixed left-0 top-0'
		></motion.div>
	);
};

export default BackgroundEffect;

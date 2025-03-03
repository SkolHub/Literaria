import { motion, TargetAndTransition } from 'framer-motion';
import Link from 'next/link';

const initial = {
  height: '3rem'
};

const NavBarLogo = ({
  navMode,
  className = ''
}: {
  navMode: boolean;
  className: string;
}) => {
  const logoVariants: TargetAndTransition = {
    height: navMode ? '6rem' : '3rem'
  };

  return (
    <Link className={className} href={'/'}>
      <motion.img
        initial={initial}
        animate={logoVariants}
        layout='preserve-aspect'
        src={'/logo.svg'}
        alt='Literaria'
      />
    </Link>
  );
};

export default NavBarLogo;

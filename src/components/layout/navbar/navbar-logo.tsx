import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ({
  navMode,
  className = ''
}: {
  navMode: boolean;
  className: string;
}) {
  return (
    <Link className={className} href='/'>
      <motion.img
        className='transition-[filter] duration-200'
        initial={{
          height: '3rem'
        }}
        animate={{
          height: navMode ? '6rem' : '3rem'
        }}
        style={{
          filter: 'var(--literaria-article-nav-logo-filter, none)'
        }}
        layout='preserve-aspect'
        src='/logo.svg'
        alt='Literaria'
      />
    </Link>
  );
}

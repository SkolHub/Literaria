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
        initial={{
          height: '3rem'
        }}
        animate={{
          height: navMode ? '6rem' : '3rem'
        }}
        layout='preserve-aspect'
        src='/logo.svg'
        alt='Literaria'
      />
    </Link>
  );
}

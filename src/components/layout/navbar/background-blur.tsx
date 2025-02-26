import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

export default function ({
  expanded,
  setExpanded
}: {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <motion.div
      onClick={() => {
        setExpanded(false);
      }}
      animate={
        expanded
          ? {
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 9
            }
          : {
              backdropFilter: 'blur(0px)',
              backgroundColor: 'rgba(0,0,0,0)',
              zIndex: -1
            }
      }
      transition={{
        zIndex: {
          delay: expanded ? 0 : 0.2
        }
      }}
      className='fixed left-0 top-0 h-[100svh] w-screen'
    />
  );
}

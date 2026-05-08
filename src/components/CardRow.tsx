import {motion} from "motion/react";
import {type ComponentPropsWithoutRef} from 'react';

export function CardRow({className, children}: ComponentPropsWithoutRef<'div'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 16}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -16}}
      transition={{type: 'spring', stiffness: 260, damping: 20}}
      className={['flex gap-3 overflow-auto justify-between', className].filter(Boolean).join(' ')}
    >
      {children}
    </motion.div>
  );
}


import {type ComponentPropsWithoutRef} from 'react';
import {motion} from 'motion/react';

export function CardInteraction({className, children, ...rest}: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{type: 'spring', stiffness: 260, damping: 20}}
      whileHover={{y: -8, scale: 1.06, boxShadow: '0px 0px 20px rgba(79,70,229,0.3)'}}
      whileTap={{scale: 0.95, transition: {delay: 0}}}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}


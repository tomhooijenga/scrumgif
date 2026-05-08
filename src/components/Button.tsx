import {motion} from "motion/react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  const styles = variant === 'primary'
    ? "px-7 py-2.5 text-white bg-indigo-600 rounded-lg text-base cursor-pointer border-none [box-shadow:0px_4px_12px_rgba(79,70,229,0.4)]"
    : "px-7 py-2.5 text-white bg-gray-500 rounded-lg text-base cursor-pointer border-none [box-shadow:0px_4px_12px_rgba(0,0,0,0.2)]";

  return (
    <motion.button
      onClick={onClick}
      className={styles}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}


import { memo, PropsWithChildren, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TransitionRouteProps extends PropsWithChildren {
  className?: string;
}

const TransitionRoute = memo(({ children, className }: TransitionRouteProps) => {
  const reduceMotion = useReducedMotion();

  const variants = useMemo(
    () => ({
      initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 },
    }),
    [reduceMotion]
  );

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
});

export default TransitionRoute;

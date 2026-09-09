import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-10% 0px -10% 0px', amount: 0.25 });
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Smooth pop variants
  const variants = {
    hiddenDown: {
      opacity: 0,
      y: 60,
      filter: 'blur(6px)',
      scale: 0.96,
    },
    hiddenUp: {
      opacity: 0,
      y: -60,
      filter: 'blur(6px)',
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1] as const, // pop -> settle
      },
    },
  };

  const initialVariant = scrollDirection === 'down' ? 'hiddenDown' : 'hiddenUp';

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial={initialVariant}
      animate={isInView ? 'visible' : initialVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
};

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Standard premium bezier curve used across RouteQ design system
export const smoothEase = [0.22, 1, 0.36, 1] as const;

// ─── 1. ANIMATED HERO HEADING ────────────────────────────────────────────────
// Displays each line of the main hero headline masked by an overflow-hidden container,
// popping upward from below its own bounding box with smooth easing and blur clearing.
interface HeadingLine {
  text: string;
  isGradient?: boolean;
}

const HERO_LINES: HeadingLine[] = [
  { text: 'THE SHORTEST' },
  { text: 'PATH BETWEEN' },
  { text: 'DEMAND AND' },
  { text: 'DELIVERY.', isGradient: true },
];

interface AnimatedHeadingProps {
  className?: string;
  onAnimationComplete?: () => void;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  className = '',
  onAnimationComplete,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is requested, render clean static typography
  if (shouldReduceMotion) {
    return (
      <h1 className={className}>
        {HERO_LINES.map((line, idx) => (
          <React.Fragment key={line.text}>
            {line.isGradient ? (
              <span className="bg-gradient-to-r from-[#FF5B37] via-[#FF7A3D] to-[#FF4D8D] bg-clip-text text-transparent">
                {line.text}
              </span>
            ) : (
              line.text
            )}
            {idx < HERO_LINES.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h1>
    );
  }

  // Line animation variants: popping up from within its own position
  const lineVariants = {
    hidden: {
      opacity: 0,
      y: 48,
      filter: 'blur(6px)',
      scale: 0.98,
    },
    visible: (customIdx: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.75,
        ease: smoothEase,
        delay: 0.18 + customIdx * 0.13, // Sequential stagger 0.13s per line
      },
    }),
  };

  return (
    <h1 className={className} aria-label="THE SHORTEST PATH BETWEEN DEMAND AND DELIVERY.">
      {HERO_LINES.map((line, idx) => (
        <div key={line.text} className="overflow-hidden leading-[1.08] py-0.5">
          <motion.div
            custom={idx}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            onAnimationComplete={idx === HERO_LINES.length - 1 ? onAnimationComplete : undefined}
            className="inline-block"
          >
            {line.isGradient ? (
              <span className="bg-gradient-to-r from-[#FF5B37] via-[#FF7A3D] to-[#FF4D8D] bg-clip-text text-transparent">
                {line.text}
              </span>
            ) : (
              line.text
            )}
          </motion.div>
        </div>
      ))}
    </h1>
  );
};

// ─── 2. FADE / SLIDE ENTRANCE COMPONENT ──────────────────────────────────────
interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  blur?: boolean;
  className?: string;
  viewportOnce?: boolean;
  viewportAmount?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  distance = 30,
  blur = true,
  className = '',
  viewportOnce = false,
  viewportAmount = 0.2,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const yOffset = direction === 'up' ? distance : direction === 'down' ? -distance : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        filter: blur ? 'blur(6px)' : 'none',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: viewportOnce, amount: viewportAmount }}
      transition={{
        duration,
        delay,
        ease: smoothEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── 3. STAGGER CONTAINER & ITEM ─────────────────────────────────────────────
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  viewportOnce?: boolean;
  viewportAmount?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0.05,
  viewportOnce = false,
  viewportAmount = 0.15,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, amount: viewportAmount }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  distance = 24,
  duration = 0.55,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: distance,
      filter: 'blur(4px)',
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration,
        ease: smoothEase,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

// ─── 4. INTERACTIVE MOTION BUTTON ───────────────────────────────────────────
interface MotionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const MotionButton: React.FC<MotionButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{
        scale: 1.025,
        transition: { duration: 0.2, ease: smoothEase },
      }}
      whileTap={{
        scale: 0.97,
        transition: { duration: 0.1 },
      }}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

// ─── 5. INTERACTIVE MOTION CARD ─────────────────────────────────────────────
interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div onClick={onClick} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{
        y: -3,
        transition: { duration: 0.22, ease: smoothEase },
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

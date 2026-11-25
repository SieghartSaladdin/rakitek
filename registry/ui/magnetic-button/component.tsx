"use client";

import {
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import styles from "./styles.module.css";

export type MagneticButtonVariant =
  | "primary"
  | "accent"
  | "surface"
  | "outline"
  | "light";

export interface MagneticButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "style"
  > {
  children: ReactNode;
  /** Optional trailing icon rendered inside a 32px circular badge. */
  icon?: ReactNode;
  /** Fraction of cursor offset from the button center that the button follows. */
  intensity?: number;
  /** Visual treatment bound to --rk-* style tokens. */
  variant?: MagneticButtonVariant;
  /** Optional inline style overrides merged with the spring motion values. */
  style?: CSSProperties;
}

const MAGNET_SPRING = { stiffness: 150, damping: 15 };

const VARIANT_CLASS: Record<MagneticButtonVariant, string> = {
  primary: styles.primary,
  accent: styles.accent,
  surface: styles.surface,
  outline: styles.outline,
  light: styles.light,
};

/** Pill CTA button pulled towards the cursor with a damped motion/react spring while hovered. */
export function MagneticButton({
  children,
  icon,
  intensity = 0.3,
  variant = "primary",
  type = "button",
  className = "",
  style,
  disabled,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, MAGNET_SPRING);
  const y = useSpring(targetY, MAGNET_SPRING);

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(event);
    if (disabled || prefersReducedMotion || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    targetX.set((event.clientX - centerX) * intensity);
    targetY.set((event.clientY - centerY) * intensity);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(event);
    targetX.set(0);
    targetY.set(0);
  };

  const classes = [
    styles.button,
    VARIANT_CLASS[variant],
    icon ? styles.withIcon : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      style={prefersReducedMotion ? style : { ...style, x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={classes}
      {...props}
    >
      {icon ? (
        <>
          <span className={styles.label}>{children}</span>
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

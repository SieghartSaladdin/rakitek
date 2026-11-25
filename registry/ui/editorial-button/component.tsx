"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./styles.module.css";

export type EditorialButtonVariant =
  | "solid"
  | "dark"
  | "ghost"
  | "light"
  | "outline"
  | "accent";

export type EditorialButtonSize = "sm" | "md" | "lg";

interface EditorialButtonBaseProps {
  variant?: EditorialButtonVariant;
  size?: EditorialButtonSize;
  blend?: boolean;
  trailingArrow?: boolean;
  className?: string;
  children: ReactNode;
}

export type EditorialButtonProps =
  | (EditorialButtonBaseProps & {
      as?: "button";
      href?: undefined;
    } & ButtonHTMLAttributes<HTMLButtonElement>)
  | (EditorialButtonBaseProps & {
      as?: "a";
      href: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>);

const VARIANT_CLASS: Record<EditorialButtonVariant, string> = {
  solid: styles.solid,
  dark: styles.dark,
  ghost: styles.ghost,
  outline: styles.ghost,
  light: styles.light,
  accent: styles.accent,
};

const SIZE_CLASS: Record<EditorialButtonSize, string> = {
  sm: styles.sizeSm,
  md: "",
  lg: styles.sizeLg,
};

export function EditorialButton(props: EditorialButtonProps) {
  const {
    variant = "solid",
    size = "md",
    blend = false,
    trailingArrow = false,
    className = "",
    children,
  } = props;

  const classes = [
    styles.btn,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    blend ? styles.blend : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = trailingArrow ? (
    <>
      <span>{children}</span>
      <span aria-hidden="true" className={styles.arrow}>
        →
      </span>
    </>
  ) : (
    children
  );

  if (props.as === "a" || typeof props.href === "string") {
    const {
      as: _as,
      variant: _variant,
      size: _size,
      blend: _blend,
      trailingArrow: _trailingArrow,
      className: _className,
      children: _children,
      ...anchorProps
    } = props as EditorialButtonBaseProps & {
      as?: "a";
      href: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <a className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const {
    as: _as,
    href: _href,
    variant: _variant,
    size: _size,
    blend: _blend,
    trailingArrow: _trailingArrow,
    className: _className,
    children: _children,
    type = "button",
    ...buttonProps
  } = props as EditorialButtonBaseProps & {
    as?: "button";
    href?: undefined;
  } & ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

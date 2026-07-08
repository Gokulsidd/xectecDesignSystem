import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Show a loading spinner and disable interaction */
  isLoading?: boolean;
  /** Icon placed before the button label */
  leftIcon?: ReactNode;
  /** Icon placed after the button label */
  rightIcon?: ReactNode;
  /** Make button fill its container width */
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * Button — primary interactive element.
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Save changes
 * </Button>
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const classNames = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : "",
    isLoading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classNames}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="60"
              strokeDashoffset="20"
            />
          </svg>
        </span>
      )}
      {!isLoading && leftIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children && <span className={styles.label}>{children}</span>}
      {!isLoading && rightIcon && (
        <span className={styles.icon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}

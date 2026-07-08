import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Input.module.css";

export type InputValidationState = "default" | "success" | "error";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input label */
  label?: string;
  /** Helper text shown below the input */
  helperText?: string;
  /** Error message — sets validation state to "error" */
  errorMessage?: string;
  /** Success message — sets validation state to "success" */
  successMessage?: string;
  /** Explicit validation state (auto-detected from errorMessage/successMessage) */
  validationState?: InputValidationState;
  /** Size of the input */
  size?: InputSize;
  /** Icon or element placed at the left inside the input */
  leftElement?: ReactNode;
  /** Icon or element placed at the right inside the input */
  rightElement?: ReactNode;
  /** Marks input as required and shows a required indicator */
  isRequired?: boolean;
  /** Override or append className on the outer wrapper */
  wrapperClassName?: string;
}

/**
 * Input — a text input with label, helper/error/success text and validation states.
 *
 * @example
 * <Input
 *   label="Email address"
 *   type="email"
 *   placeholder="you@example.com"
 *   helperText="We'll never share your email."
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    errorMessage,
    successMessage,
    validationState: validationStateProp,
    size = "md",
    leftElement,
    rightElement,
    isRequired,
    disabled,
    id: idProp,
    wrapperClassName,
    className,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  // Derive validation state automatically
  const validationState: InputValidationState =
    validationStateProp ??
    (errorMessage ? "error" : successMessage ? "success" : "default");

  const feedbackMessage = validationState === "error"
    ? errorMessage
    : validationState === "success"
    ? successMessage
    : helperText;

  const feedbackId = validationState !== "default" ? errorId : helperId;

  const wrapperClasses = [
    styles.wrapper,
    disabled ? styles.disabled : "",
    wrapperClassName ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputWrapperClasses = [
    styles.inputWrapper,
    styles[`size-${size}`],
    styles[`state-${validationState}`],
    leftElement ? styles.hasLeft : "",
    rightElement ? styles.hasRight : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [styles.input, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {isRequired && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className={inputWrapperClasses}>
        {leftElement && (
          <span className={`${styles.element} ${styles.elementLeft}`} aria-hidden="true">
            {leftElement}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          disabled={disabled}
          required={isRequired}
          aria-required={isRequired}
          aria-invalid={validationState === "error" ? "true" : undefined}
          aria-describedby={feedbackMessage ? feedbackId : undefined}
          className={inputClasses}
          {...rest}
        />

        {rightElement && (
          <span className={`${styles.element} ${styles.elementRight}`} aria-hidden="true">
            {rightElement}
          </span>
        )}

        {/* Validation icon */}
        {validationState === "error" && (
          <span className={`${styles.element} ${styles.elementRight} ${styles.validationIcon}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </span>
        )}
        {validationState === "success" && (
          <span className={`${styles.element} ${styles.elementRight} ${styles.validationIcon}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <polyline points="9,12 11,14 15,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {feedbackMessage && (
        <p
          id={feedbackId}
          className={[
            styles.feedback,
            styles[`feedback-${validationState}`],
          ].join(" ")}
          role={validationState === "error" ? "alert" : undefined}
        >
          {feedbackMessage}
        </p>
      )}
    </div>
  );
});

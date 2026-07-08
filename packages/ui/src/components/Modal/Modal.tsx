"use client";

import type { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";
import styles from "./Modal.module.css";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Modal title — required for accessibility */
  title: string;
  /** Visually hide the title (still read by screen readers) */
  hideTitle?: boolean;
  /** Modal description (optional) */
  description?: string | undefined;
  /** Size of the modal dialog */
  size?: ModalSize;
  /** Footer slot — typically contains action buttons */
  footer?: ReactNode;
  /** Prevent closing when clicking the backdrop */
  preventBackdropClose?: boolean;
  /** Prevent closing when pressing Escape key */
  preventEscapeClose?: boolean;
  children?: ReactNode;
  /** Override class on the dialog panel */
  className?: string;
}

export interface ModalTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

/**
 * Modal — a fully accessible dialog built on Radix UI Dialog.
 * Features: focus trap, ARIA, backdrop, keyboard (Esc) dismiss.
 *
 * @example
 * <Modal open={isOpen} onClose={() => setOpen(false)} title="Confirm action">
 *   <p>Are you sure you want to delete this item?</p>
 * </Modal>
 */
export function Modal({
  open,
  onClose,
  title,
  hideTitle = false,
  description,
  size = "md",
  footer,
  preventBackdropClose = false,
  preventEscapeClose = false,
  children,
  className,
}: ModalProps) {
  const panelClasses = [styles.panel, styles[`size-${size}`], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <RadixDialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <RadixDialog.Portal>
        {/* Backdrop */}
        <RadixDialog.Overlay
          className={styles.overlay}
          onClick={preventBackdropClose ? (e) => e.stopPropagation() : undefined}
        />

        {/* Dialog panel */}
        <RadixDialog.Content
          className={panelClasses}
          {...(preventEscapeClose ? { onEscapeKeyDown: (e) => e.preventDefault() } : {})}
          {...(preventBackdropClose ? { onPointerDownOutside: (e) => e.preventDefault() } : {})}
          {...(description ? { "aria-describedby": "modal-description" } : {})}
        >
          {/* Header */}
          <div className={styles.header}>
            {hideTitle ? (
              <VisuallyHiddenPrimitive.Root asChild>
                <RadixDialog.Title>{title}</RadixDialog.Title>
              </VisuallyHiddenPrimitive.Root>
            ) : (
              <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
            )}

            {/* Close button */}
            <RadixDialog.Close className={styles.closeButton} aria-label="Close dialog">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </RadixDialog.Close>
          </div>

          {/* Optional description */}
          {description && (
            <RadixDialog.Description id="modal-description" className={styles.description}>
              {description}
            </RadixDialog.Description>
          )}

          {/* Body */}
          <div className={styles.body}>{children}</div>

          {/* Footer */}
          {footer && <div className={styles.footer}>{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

/** Convenience trigger subcomponent */
function ModalTrigger({ children, asChild }: ModalTriggerProps) {
  return (
    <RadixDialog.Trigger {...(asChild !== undefined ? { asChild } : {})}>
      {children}
    </RadixDialog.Trigger>
  );
}
ModalTrigger.displayName = "Modal.Trigger";

Modal.Trigger = ModalTrigger;

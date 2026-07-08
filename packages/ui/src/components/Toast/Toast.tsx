"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as RadixToast from "@radix-ui/react-toast";
import styles from "./Toast.module.css";

/* =====================================================
   Types
   ===================================================== */

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  /** Auto-dismiss duration in ms. Set to Infinity to persist. */
  duration?: number;
}

export interface ToastContextValue {
  toast: (options: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

/* =====================================================
   Context
   ===================================================== */

const ToastContext = createContext<ToastContextValue | null>(null);

/* =====================================================
   Provider
   ===================================================== */

export interface ToastProviderProps {
  children: ReactNode;
  /** Max number of visible toasts at once */
  maxVisible?: number;
}

/**
 * ToastProvider — wrap your app (or layout) with this to enable toasts.
 *
 * @example
 * // In your root layout:
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // Anywhere in the tree:
 * const { toast } = useToast();
 * toast({ variant: 'success', title: 'Saved!', description: 'Your changes were saved.' });
 */
export function ToastProvider({ children, maxVisible = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const toast = useCallback(
    (options: Omit<ToastItem, "id">) => {
      const id = `toast-${++counterRef.current}`;
      setToasts((prev) => {
        const next = [...prev, { ...options, id }];
        return next.slice(-maxVisible);
      });
    },
    [maxVisible]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      <RadixToast.Provider swipeDirection="right">
        {children}

        {/* Render active toasts */}
        {toasts.map((item) => (
          <ToastItem key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
        ))}

        {/* Viewport — where toasts are mounted in the DOM */}
        <RadixToast.Viewport className={styles.viewport} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

/* =====================================================
   useToast hook
   ===================================================== */

/**
 * useToast — access the toast API from any component inside ToastProvider.
 *
 * @example
 * const { toast } = useToast();
 * toast({ variant: 'error', title: 'Something went wrong' });
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

/* =====================================================
   Individual Toast item
   ===================================================== */

const ICONS: Record<ToastVariant, ReactNode> = {
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <polyline points="8,12 11,15 16,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

interface ToastItemProps {
  item: ToastItem;
  onDismiss: () => void;
}

function ToastItem({ item, onDismiss }: ToastItemProps) {
  const { variant, title, description, duration = 5000 } = item;

  return (
    <RadixToast.Root
      className={`${styles.toast} ${styles[`variant-${variant}`]}`}
      duration={duration}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    >
      <span className={styles.icon}>{ICONS[variant]}</span>

      <div className={styles.content}>
        <RadixToast.Title className={styles.title}>{title}</RadixToast.Title>
        {description && (
          <RadixToast.Description className={styles.description}>
            {description}
          </RadixToast.Description>
        )}
      </div>

      <RadixToast.Close className={styles.close} aria-label="Dismiss notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </RadixToast.Close>
    </RadixToast.Root>
  );
}

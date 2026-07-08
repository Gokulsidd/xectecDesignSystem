/**
 * @xectec/ui — Main package entry point
 *
 * Usage:
 *   import { Button, Input, Modal, Card, ToastProvider, useToast } from '@xectec/ui';
 *   import '@xectec/ui/styles.css';  // Component styles
 *   import '@xectec/tokens/tokens.css';  // Design tokens (required)
 */

// Components
export { Button } from "./components/Button/index.js";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button/index.js";

export { Input } from "./components/Input/index.js";
export type { InputProps, InputValidationState, InputSize } from "./components/Input/index.js";

export { Modal } from "./components/Modal/index.js";
export type { ModalProps, ModalSize } from "./components/Modal/index.js";

export { ToastProvider, useToast } from "./components/Toast/index.js";
export type {
  ToastItem,
  ToastVariant,
  ToastProviderProps,
  ToastContextValue,
} from "./components/Toast/index.js";

export { Card } from "./components/Card/index.js";
export type { CardProps, CardElevation, CardPadding } from "./components/Card/index.js";

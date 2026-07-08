import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export type CardElevation = "flat" | "raised" | "floating";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Shadow elevation level */
  elevation?: CardElevation;
  /** Internal padding */
  padding?: CardPadding;
  /** Adds a visible border */
  bordered?: boolean;
  /** Makes the card interactive (hover/active states) */
  interactive?: boolean;
  children?: ReactNode;
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/* =====================================================
   Sub-components defined first (before Card)
   ===================================================== */

function CardHeader({ className, children, ...rest }: CardSectionProps) {
  return (
    <div className={[styles.header, className ?? ""].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
CardHeader.displayName = "Card.Header";

function CardBody({ className, children, ...rest }: CardSectionProps) {
  return (
    <div className={[styles.body, className ?? ""].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
CardBody.displayName = "Card.Body";

function CardFooter({ className, children, ...rest }: CardSectionProps) {
  return (
    <div className={[styles.footer, className ?? ""].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
CardFooter.displayName = "Card.Footer";

/* =====================================================
   Card component
   ===================================================== */

/**
 * Card — a flexible surface container.
 *
 * @example
 * <Card elevation="raised" bordered>
 *   <Card.Header>
 *     <h3>Card Title</h3>
 *   </Card.Header>
 *   <Card.Body>
 *     <p>Card content goes here.</p>
 *   </Card.Body>
 *   <Card.Footer>
 *     <Button variant="primary">Action</Button>
 *   </Card.Footer>
 * </Card>
 */
export function Card({
  elevation = "raised",
  padding = "md",
  bordered = false,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  const classNames = [
    styles.card,
    styles[`elevation-${elevation}`],
    padding !== "none" ? styles[`padding-${padding}`] : "",
    bordered ? styles.bordered : "",
    interactive ? styles.interactive : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
}

// Attach subcomponents as named properties with correct types
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

/**
 * CSS Module type declarations for TypeScript.
 * Allows: import styles from './Component.module.css'
 */
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.css" {
  const content: string;
  export default content;
}

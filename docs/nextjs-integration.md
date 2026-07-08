# Next.js Integration Guide

Integrating the Xectec Design System into a Next.js (App Router) application.

---

## 💾 Installation

Ensure you install both design token and component library packages:

```bash
# Using npm
npm i @xectec/ui @xectec/tokens

# Using pnpm
pnpm add @xectec/ui @xectec/tokens
```

---

## 🎨 1. Global Styles Integration

Import the design token variables and component layout stylesheets at the top of your **root layout** (e.g., `src/app/layout.tsx` / `src/app/layout.js`).

```typescript
// src/app/layout.tsx
import "@xectec/tokens/tokens.css"; // MUST be imported first
import "@xectec/ui/styles.css";     // Imports component styling
import "./globals.css";             // Your application styling
```

---

## ⚙️ 2. Tailwind CSS v4 Configuration (Optional)

If your Next.js application uses **Tailwind CSS v4**, map the `@theme inline` block inside `src/app/globals.css` to consume Xectec tokens instead of hardcoded tailwind configs.

Add this block inside `globals.css`:
```css
@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --font-sans: var(--font-family-sans);
  
  --color-primary: var(--color-primary);
  --color-primary-hover: var(--color-primary-hover);
  --color-primary-active: var(--color-primary-active);
  --color-primary-foreground: var(--color-primary-foreground);
  
  --color-secondary: var(--color-secondary);
  --color-secondary-hover: var(--color-secondary-hover);
  --color-secondary-active: var(--color-secondary-active);
  --color-secondary-foreground: var(--color-secondary-foreground);

  --color-success: var(--color-success);
  --color-success-hover: var(--color-success-hover);
  --color-success-foreground: var(--color-success-foreground);

  --color-warning: var(--color-warning);
  --color-warning-hover: var(--color-warning-hover);
  --color-warning-foreground: var(--color-warning-foreground);

  --color-error: var(--color-error);
  --color-error-hover: var(--color-error-hover);
  --color-error-foreground: var(--color-error-foreground);
  --color-destructive: var(--color-error);
  --color-destructive-foreground: var(--color-error-foreground);

  --color-border: var(--color-border);
  --color-border-strong: var(--color-border-strong);
  --color-ring: var(--color-focus-ring);
  --color-input: var(--color-border);
  
  --color-muted: var(--color-bg-subtle);
  --color-muted-foreground: var(--color-text-secondary);
  --color-accent: var(--color-bg-subtle);
  --color-accent-foreground: var(--color-text);

  --color-card: var(--color-bg-elevated);
  --color-card-foreground: var(--color-text);
  --color-popover: var(--color-bg-elevated);
  --color-popover-foreground: var(--color-text);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);

  --spacing-xs: var(--spacing-xs);
  --spacing-sm: var(--spacing-sm);
  --spacing-md: var(--spacing-md);
  --spacing-lg: var(--spacing-lg);
  --spacing-xl: var(--spacing-xl);
}
```

Now classes like `bg-primary` and `rounded-lg` in your application will automatically render using the values defined by Xectec.

---

## 🔄 3. Next.js Server Components (RSC) vs Client Components

Next.js App Router uses Server Components by default.
* **Stateless components** (`Button`, `Card`, `Input`) can be rendered in server components directly.
* **Stateful/Interactive components** (`Modal`, `ToastProvider`) utilize React state and portal hooks. They have been pre-compiled with `"use client"` directives internally. 
* To use toast notifications, wrap your layout with `ToastProvider` inside a client environment or directly inside `layout.js` (RSC boundaries will handle it).

### Setup Layout Example with Toast:
```typescript
// src/app/layout.tsx
import { ToastProvider } from "@xectec/ui";
import "@xectec/tokens/tokens.css";
import "@xectec/ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

---

## 🌙 4. Dark Mode Support

To activate dark mode, add the `data-theme="dark"` attribute to the root `<html>` tag:

```typescript
// Add dark mode toggle code
document.documentElement.setAttribute("data-theme", "dark");

// Revert to light mode
document.documentElement.setAttribute("data-theme", "light");
```
All variables under `tokens.css` will switch automatically.

# Vite React Integration Guide

Integrating the Xectec Design System into a standard Vite + React application.

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

Import the design token variables and component layout stylesheets at the top of your Vite **main entrypoint** (e.g., `src/main.tsx` / `src/main.jsx`).

```typescript
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@xectec/tokens/tokens.css"; // MUST be imported first
import "@xectec/ui/styles.css";     // Imports component styling
import "./index.css";               // Your application styling

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## ⚙️ 2. Tailwind CSS v4 Configuration (Optional)

If your Vite application uses **Tailwind CSS v4**, map the `@theme inline` block inside `src/index.css` to consume Xectec tokens instead of hardcoded tailwind configs.

Add this block inside `src/index.css`:
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

## 🔄 3. Basic Setup Layout Example with Toast

Wrap your App tree inside `ToastProvider` to enable popup notices:

```typescript
// src/App.tsx
import { useState } from "react";
import { ToastProvider, useToast, Button, Card } from "@xectec/ui";

function Home() {
  const { toast } = useToast();

  const handleShowToast = () => {
    toast({
      variant: "success",
      title: "Action Complete",
      description: "Successfully loaded inside a Vite React app!"
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Card elevation="raised" bordered>
        <Card.Header>
          <h2>Vite React App</h2>
        </Card.Header>
        <Card.Body>
          <Button onClick={handleShowToast}>Trigger Success Toast</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Home />
    </ToastProvider>
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

# Xectec Design System Monorepo

Welcome to the company-wide centralized design system for **Xectec**. This repository contains reusable design tokens and React component libraries built using modern engineering patterns, Tailwind CSS variables, CSS modules, Vitest, TypeScript, and Storybook.

## Repository Structure

```
xectecDesignSystem/
├── packages/
│   ├── tokens/       # Design tokens package (@xectec/tokens)
│   └── ui/           # React component library (@xectec/ui)
└── apps/
    └── storybook/    # Storybook 8 documentation app
```

---

## Getting Started

### Prerequisites

- **Node.js**: `>=18.0.0`
- **pnpm**: `>=9.0.0` (Workspaces enabled)

### Installation & Builds

Install dependencies across the monorepo:
```bash
pnpm install
```

Build all packages (`@xectec/tokens`, `@xectec/ui`, and `storybook`):
```bash
pnpm build
```

Run Storybook locally to view components:
```bash
pnpm storybook
```
Storybook will be accessible at [http://localhost:6006](http://localhost:6006).

Run the unit test suite:
```bash
pnpm test
```

---

## Local Testing in an Independent Project (Next.js, Vite, etc.)

To test these packages locally in an independent application before publishing them to a registry, you can package them into standalone tarball archives (`.tgz`).

### 1. Build and Pack the Packages

From the root of this design system repository, run:
```bash
# Build the workspace
pnpm build

# Pack tokens package into a tarball
pnpm --filter @xectec/tokens pack

# Pack UI component library package into a tarball
pnpm --filter @xectec/ui pack
```

This will generate two tarball files in their respective package directories:
- `packages/tokens/xectec-tokens-0.1.0.tgz`
- `packages/ui/xectec-ui-0.1.0.tgz`

### 2. Install Tarballs in Your Consuming Application

Navigate to your independent application (e.g. Next.js or Vite React project) and run:

```bash
npm install /path/to/xectecDesignSystem/packages/tokens/xectec-tokens-0.1.0.tgz /path/to/xectecDesignSystem/packages/ui/xectec-ui-0.1.0.tgz
# Or with pnpm:
pnpm add /path/to/xectecDesignSystem/packages/tokens/xectec-tokens-0.1.0.tgz /path/to/xectecDesignSystem/packages/ui/xectec-ui-0.1.0.tgz
```

### 3. Usage inside Next.js (App Router or Pages Router)

Import the styles and components in your root layout/application file:

#### Root Import Setup (`app/layout.tsx` / `pages/_app.tsx`):
```typescript
// Import design tokens first (applies global CSS variables)
import "@xectec/tokens/tokens.css";

// Import UI component styles
import "@xectec/ui/styles.css";

// Import Toast Provider if using notifications
import { ToastProvider } from "@xectec/ui";

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

#### Utilizing Components in a Client Page/Component (`app/page.tsx`):
```typescript
"use client";

import { useState } from "react";
import { Button, Card, Input, Modal, useToast } from "@xectec/ui";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleShowToast = () => {
    toast({
      variant: "success",
      title: "Action Complete",
      description: "You have successfully integrated Xectec Design System!"
    });
  };

  return (
    <div style={{ padding: "2rem", display: "grid", gap: "1.5rem", maxWidth: "600px" }}>
      <Card elevation="raised" bordered>
        <Card.Header>
          <h2>Xectec UI Demo</h2>
        </Card.Header>
        <Card.Body style={{ display: "grid", gap: "1rem" }}>
          <Input label="Username" placeholder="Enter your username" isRequired />
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={handleShowToast}>Trigger Toast</Button>
          </div>
        </Card.Body>
        <Card.Footer>
          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
            Powered by @xectec/ui
          </p>
        </Card.Footer>
      </Card>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sample Dialog">
        <p>This modal is rendered dynamically using Radix UI primitives with focus trapping and aria descriptors.</p>
        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
```

#### Theme Toggle Support (Light & Dark Mode)
To toggle the theme, change the `data-theme` attribute on the `<html>` or `<body>` tag:
```javascript
// Toggle to dark mode
document.documentElement.setAttribute("data-theme", "dark");

// Toggle to light mode
document.documentElement.setAttribute("data-theme", "light");
```
CSS variables will automatically shift values based on the dark mode theme tokens.

# Multi-Client Theming Guide

**Package**: `@xectec/themes`  
**Design System**: Xectec Design System (`@xectec/tokens`, `@xectec/ui`)

---

## Overview

The Xectec Design System supports multiple client brands through a **CSS-only theming layer**. Each client receives a dedicated CSS file that overrides only the primary color palette — all other design tokens (typography, spacing, radii, neutral colors) remain unchanged from the base `@xectec/tokens` system.

```
@xectec/tokens/tokens.css   ← base design system (always required)
@xectec/themes/{client}.css ← client brand override (swap per deployment)
@xectec/ui                  ← components (unchanged — use CSS variables)
```

No code changes are needed in `@xectec/ui` or your application logic when switching clients. A single import swap is all it takes.

---

## Available Client Themes

| Client | File | Primary Color | Identity |
|--------|------|---------------|----------|
| **Xectec / XT** | *(none — default)* | Professional Blue `#2563eb` | Tech-forward, trustworthy |
| **Corient** | `@xectec/themes/corient.css` | Charcoal Black `#27272a` | Corporate, formal, authoritative |
| **Thai** | `@xectec/themes/thai.css` | Deep Violet `#7c3aed` | Vibrant, modern, innovative |

---

## Installation

```bash
# npm
npm install @xectec/tokens @xectec/themes @xectec/ui

# pnpm
pnpm add @xectec/tokens @xectec/themes @xectec/ui

# yarn
yarn add @xectec/tokens @xectec/themes @xectec/ui
```

---

## Usage

### Step 1 — Import base tokens first (always)

```css
/* globals.css or your app root stylesheet */
@import '@xectec/tokens/tokens.css';
```

### Step 2 — Import the client theme (right after tokens)

```css
/* For Corient deployment */
@import '@xectec/themes/corient.css';

/* For Thai deployment */
@import '@xectec/themes/thai.css';

/* For Xectec / XT — no import needed, it's the default */
```

### Step 3 — Import component styles

```css
@import '@xectec/ui/dist/styles.css';
```

---

## Framework-Specific Setup

### Next.js (App Router)

In your root `layout.js` or `layout.tsx`, import in this order:

```js
// app/layout.js
import "@xectec/tokens/tokens.css";
import "@xectec/themes/corient.css"; // ← swap for each client build
import "@xectec/ui/dist/styles.css";
import "./globals.css";
```

> **Important**: CSS import order matters. The client theme must come **after** `tokens.css` and **before** `globals.css` so that component-level CSS picks up the correct overrides.

### Next.js (Pages Router)

```js
// pages/_app.js
import "@xectec/tokens/tokens.css";
import "@xectec/themes/thai.css";    // ← swap for each client
import "@xectec/ui/dist/styles.css";
import "../styles/globals.css";
```

### Vite / React

```js
// main.jsx or main.tsx
import "@xectec/tokens/tokens.css";
import "@xectec/themes/corient.css"; // ← swap for each client
import "@xectec/ui/dist/styles.css";
import "./index.css";
```

### HTML (CDN / Vanilla)

```html
<head>
  <link rel="stylesheet" href="https://unpkg.com/@xectec/tokens/src/tokens.css" />
  <link rel="stylesheet" href="https://unpkg.com/@xectec/themes/src/corient.css" />
  <link rel="stylesheet" href="https://unpkg.com/@xectec/ui/dist/styles.css" />
</head>
```

---

## Managing Client Builds

### Option A — Static import per build (Recommended)

The simplest and most performant approach for multi-client deployments.

Set an environment variable and conditionally import in your entry file:

```js
// app/layout.js (Next.js App Router)
import "@xectec/tokens/tokens.css";

// Conditionally import based on deployment env var
if (process.env.NEXT_PUBLIC_CLIENT === "corient") {
  require("@xectec/themes/corient.css");
} else if (process.env.NEXT_PUBLIC_CLIENT === "thai") {
  require("@xectec/themes/thai.css");
}
// Xectec/XT: no import needed

import "@xectec/ui/dist/styles.css";
```

Set the env variable in your `.env.local`:

```bash
NEXT_PUBLIC_CLIENT=corient
```

Or in your CI/CD pipeline:

```yaml
# GitHub Actions example
env:
  NEXT_PUBLIC_CLIENT: corient
```

### Option B — Runtime dynamic injection

For apps that need to switch themes at runtime (e.g., a client portal that serves multiple brands from one deployment):

```js
const CLIENT_THEMES = {
  corient: "https://cdn.example.com/@xectec/themes/corient.css",
  thai:    "https://cdn.example.com/@xectec/themes/thai.css",
};

function applyClientTheme(clientId) {
  const existing = document.getElementById("client-theme");
  if (existing) existing.remove();

  const href = CLIENT_THEMES[clientId];
  if (!href) return; // default Xectec theme — no override needed

  const link = document.createElement("link");
  link.id = "client-theme";
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// On app init or client switch:
applyClientTheme("corient");
```

### Option C — Build-time Bundler alias (Webpack / Vite)

Create a single theme alias in your bundler config and change only the alias per client:

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      // Change this one path to switch the entire client theme
      "@client-theme": "@xectec/themes/corient.css",
    },
  },
});
```

Then in your entry:

```js
import "@xectec/tokens/tokens.css";
import "@client-theme";              // resolves to whichever client alias is set
import "@xectec/ui/dist/styles.css";
```

---

## Dark Mode

All client themes fully support dark mode. Dark mode is activated by adding `data-theme="dark"` to the `<html>` element:

```js
// Toggle dark mode
document.documentElement.setAttribute("data-theme", "dark");

// Toggle light mode
document.documentElement.setAttribute("data-theme", "light");
```

Each client theme includes both light and dark mode primary color overrides, so `data-theme="dark"` will apply the client's dark-mode palette automatically.

---

## What Each Theme Overrides

Each client CSS file overrides **only these variables**:

| Variable | What it controls |
|----------|-----------------|
| `--color-primary-50` → `--color-primary-950` | Full primary palette scale |
| `--color-primary` | Default primary color (buttons, links, active states) |
| `--color-primary-hover` | Hover state color |
| `--color-primary-active` | Active/pressed state color |
| `--color-primary-subtle` | Light tinted background (chips, badges, highlights) |
| `--color-primary-foreground` | Text on top of primary backgrounds |
| `--color-focus-ring` | Keyboard focus outline color |
| `--color-input-border-focus` | Focused input border color |
| `--color-input-focus-ring` | Input focus ring shadow color |
| `--color-button-primary-bg` | Primary button background |
| `--color-button-primary-bg-hover` | Primary button hover state |
| `--color-button-primary-bg-active` | Primary button active/pressed state |
| `--color-button-primary-text` | Primary button label color |
| `--color-sidebar-text-active` | Active nav item text color |
| `--color-sidebar-item-active` | Active nav item background |

---

## Extending Themes

If a client needs additional custom overrides beyond primary colors (e.g., custom fonts, different border radii), create an extension file and import it after the client theme:

```css
/* client-extensions/corient-extended.css */
:root {
  /* Custom font for Corient */
  --font-family-sans: "GT Walsheim", "Helvetica Neue", sans-serif;

  /* Sharper corners for Corient's corporate identity */
  --radius-full: var(--radius-lg);
}
```

```js
import "@xectec/tokens/tokens.css";
import "@xectec/themes/corient.css";
import "./client-extensions/corient-extended.css"; // ← additional overrides
import "@xectec/ui/dist/styles.css";
```

---

## Adding a New Client Theme

1. Create a new file in `packages/themes/src/{client-id}.css`
2. Copy the structure from an existing theme (e.g., `thai.css`)
3. Update the color palette for both `:root` / `[data-theme="light"]` and `[data-theme="dark"]`
4. Register the export in `packages/themes/package.json`:
   ```json
   "exports": {
     "./{client-id}.css": "./src/{client-id}.css"
   }
   ```
5. Publish a new version: `pnpm --filter=@xectec/themes publish --access public`

---

## Troubleshooting

### Theme not applying
- Ensure `@xectec/tokens/tokens.css` is imported **before** the client theme
- Check that the import path is correct: `@xectec/themes/corient.css` (not `@xectec/themes/src/corient.css`)

### Dark mode not working with client theme
- Ensure you are setting `data-theme="dark"` on the `<html>` element (not `<body>`)
- Both the base tokens and the client theme must be loaded

### Component colors not changing
- Verify the CSS import order in your entry file
- Check browser DevTools → Computed styles → `--color-primary` to see the resolved value

---

## Storybook Preview

The Xectec Storybook includes a **Client** toolbar dropdown alongside the **Mode** (Light/Dark) toggle. Use it to preview components under each client's brand before deploying.

Open Storybook: `pnpm storybook dev`  
Look for the 🎨 **Client** and ☀️ **Mode** dropdowns in the toolbar.

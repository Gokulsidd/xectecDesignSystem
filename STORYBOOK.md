# Xectec Design System — Storybook Documentation

> **Version:** Storybook 8.6.18 · React 19 · Vite 6  
> **Framework:** `@storybook/react-vite`  
> **Location:** `apps/storybook/`

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture & Monorepo Structure](#architecture--monorepo-structure)
3. [Storybook Configuration](#storybook-configuration)
   - [main.ts](#maints--build-configuration)
   - [preview.tsx](#previewtsx--global-preview-configuration)
4. [Design Tokens System](#design-tokens-system)
   - [CSS Variables (`tokens.css`)](#css-variables-tokenscss)
   - [TypeScript Token Object (`tokens.ts`)](#typescript-token-object-tokensts)
   - [Token Architecture Reference](#token-architecture-reference)
5. [Component Documentation](#component-documentation)
   - [Button](#button)
   - [Input](#input)
   - [Card](#card)
   - [Modal](#modal)
   - [Toast](#toast)
6. [Story File Structure (CSF3)](#story-file-structure-csf3)
7. [Theming & Dark Mode](#theming--dark-mode)
8. [Viewport Testing](#viewport-testing)
9. [Accessibility Addon](#accessibility-addon)
10. [Running & Building Storybook](#running--building-storybook)
11. [Adding New Stories](#adding-new-stories)
12. [MDX Documentation Pages](#mdx-documentation-pages)
13. [Token Reference: Complete Table](#token-reference-complete-table)

---

## Overview

The Xectec Design System Storybook is the **living documentation hub** for all UI components and design tokens. It serves as:

- **Interactive Component Explorer** — Each component is rendered with live controls to adjust props in real time.
- **Visual Regression Reference** — A canonical source for the design team to validate visual appearance across variants, sizes, and themes.
- **Token Registry** — The `Design System / Design Tokens` MDX page renders every color, spacing, radius, and shadow value dynamically from the token package.
- **Accessibility Audit Surface** — The `@storybook/addon-a11y` addon runs axe-core WCAG 2.1 checks on every story automatically.

Storybook reads story files directly from `packages/ui/src/**` — there are **no story files copied** into the `apps/storybook/` directory. Vite aliases resolve `@xectec/ui` and `@xectec/tokens` directly to their TypeScript source, so changes in either package are reflected immediately without a build step.

---

## Architecture & Monorepo Structure

```
xectecDesignSystem/           ← Turborepo root
├── apps/
│   └── storybook/            ← Storybook host application
│       ├── .storybook/
│       │   ├── main.ts       ← Build config, addons, story glob
│       │   └── preview.tsx   ← Global decorators, theme toggle, viewports
│       ├── package.json
│       └── vite.config.ts
├── packages/
│   ├── tokens/               ← @xectec/tokens
│   │   └── src/
│   │       ├── tokens.css    ← All CSS custom properties (light + dark)
│   │       ├── tokens.ts     ← Typed JS token object (mirrors CSS)
│   │       └── index.ts      ← Package entry re-exports
│   └── ui/                   ← @xectec/ui
│       └── src/
│           ├── components/
│           │   ├── Button/
│           │   │   ├── Button.tsx
│           │   │   ├── Button.module.css
│           │   │   ├── Button.stories.tsx   ← Picked up by Storybook glob
│           │   │   ├── Button.test.tsx
│           │   │   └── index.ts
│           │   ├── Card/     (same pattern)
│           │   ├── Input/    (same pattern)
│           │   ├── Modal/    (same pattern)
│           │   ├── Toast/    (same pattern)
│           │   └── Tokens.mdx ← Token registry page in Storybook
│           └── index.ts       ← Package public API
```

### Data Flow

```
tokens.css (CSS variables) ──→ injected globally via preview.tsx
                                        │
tokens.ts (typed JS object) ──→ imported in Tokens.mdx for rendering
                                        │
Component.module.css ──────────→ references var(--color-*), var(--spacing-*), etc.
                                        │
Component.stories.tsx ─────────→ Storybook discovers and renders
```

---

## Storybook Configuration

### `main.ts` — Build Configuration

**Location:** `apps/storybook/.storybook/main.ts`

```typescript
const config: StorybookConfig = {
  stories: [
    {
      directory: uiPackageSrc,            // packages/ui/src
      files: "**/*.@(stories.@(ts|tsx)|mdx)",
      titlePrefix: "",
    },
  ],
  addons: [
    "@storybook/addon-essentials",        // Controls, Docs, Viewport, Backgrounds, Actions
    "@storybook/addon-a11y",              // Accessibility checks (axe-core)
    "@storybook/addon-interactions",      // Story interaction testing
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  docs: { autodocs: "tag" },             // Generate docs tab when tagged
  viteFinal: (config) => ({
    ...config,
    resolve: {
      alias: {
        "@xectec/ui": uiPackageSrc,       // Resolves to TS source (no build needed)
        "@xectec/tokens": tokensPackageSrc,
      },
    },
  }),
};
```

**Key design decisions:**
| Decision | Reason |
|---|---|
| `directory` points to `packages/ui/src` | Stories live next to components, not in a separate `stories/` folder |
| Vite aliases to TS source | Hot reload works across packages without running `pnpm build` |
| `autodocs: "tag"` | Only generates auto-docs tab for stories with `tags: ["autodocs"]` |
| No `backgrounds` in preview | Disabled — the theme decorator controls background via CSS variable `--color-bg` |

---

### `preview.tsx` — Global Preview Configuration

**Location:** `apps/storybook/.storybook/preview.tsx`

```tsx
import "@xectec/tokens/tokens.css";  // ← Injects all CSS custom properties globally

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,  // Auto-detects color props → color picker
        date: /Date$/i,                  // Auto-detects Date props → date picker
      },
    },
    backgrounds: { disable: true },     // Use theme toggle instead
    viewport: { viewports: { mobile, tablet, laptop, desktop } },
  },
  globalTypes: {
    theme: { defaultValue: "light", toolbar: { items: ["light", "dark"] } },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals["theme"] ?? "light";
      document.documentElement.setAttribute("data-theme", theme); // ← CSS token switching
      document.body.style.backgroundColor = "var(--color-bg)";
      return (
        <div data-theme={theme} style={{ padding: "2rem", minHeight: "100vh",
          backgroundColor: "var(--color-bg)", fontFamily: "var(--font-family-sans)" }}>
          <Story />
        </div>
      );
    },
  ],
};
```

**Global Decorator behavior:**
1. Reads the `theme` global from the toolbar.
2. Sets `data-theme="light"` or `data-theme="dark"` on the `<html>` element.
3. The `tokens.css` file uses `[data-theme="dark"]` selectors, causing all CSS variables to switch automatically.
4. All components re-render without any code change — theming is purely CSS-driven.

---

## Design Tokens System

The `@xectec/tokens` package is the **single source of truth** for all visual values. It provides two consumption surfaces:

### CSS Variables (`tokens.css`)

**Import path:** `import '@xectec/tokens/tokens.css'`

All tokens are expressed as [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*). The file defines both light and dark theme scopes:

```css
/* Light (default) */
:root,
[data-theme="light"] {
  --color-primary: var(--color-primary-600);
  --color-primary-hover: var(--color-primary-700);
  /* ... */
}

/* Dark */
[data-theme="dark"] {
  --color-primary: var(--color-primary-400);
  --color-primary-hover: var(--color-primary-300);
  /* ... */
}
```

**Usage in CSS Modules:**
```css
.button {
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  transition: background-color var(--transition-base);
}
```

---

### TypeScript Token Object (`tokens.ts`)

**Import path:** `import { tokens } from '@xectec/tokens'`

A fully typed `as const` object mirroring the CSS variables. Use in JS/TS contexts where CSS variables are unavailable (charting libraries, canvas rendering, email templates, testing assertions):

```typescript
import { tokens } from '@xectec/tokens';

// Color access
const primaryColor = tokens.colors.primary[600];        // "#2563eb"
const errorDefault = tokens.colors.error.DEFAULT;       // "#e11d48"

// Typography
const sansFont = tokens.typography.fontFamily.sans;     // "Inter, ..."
const smSize = tokens.typography.fontSize.sm;           // "0.875rem"

// Spacing
const spacing4 = tokens.spacing[4];                     // "1rem"
const spacingMd = tokens.spacing.md;                    // "1rem" (named alias)

// Component tokens (reference CSS variables — use with CSS var())
const btnRadius = tokens.components.button.radius;      // "var(--radius-button)"
```

**Exported types:**
```typescript
export type Tokens = typeof tokens;
export type ColorScale = typeof tokens.colors.primary;
export type SpacingScale = typeof tokens.spacing;
export type ComponentTokens = typeof tokens.components;
```

---

### Token Architecture Reference

The token system follows a **3-tier hierarchy**:

```
Tier 1: Primitive (raw values)
   --color-primary-600: #2563eb
   --spacing-4: 1rem
   --radius-full: 9999px

        ↓ referenced by ↓

Tier 2: Semantic (contextual aliases)
   --color-primary: var(--color-primary-600)
   --color-bg: var(--color-neutral-50)
   --color-text: var(--color-neutral-900)

        ↓ referenced by ↓

Tier 3: Component (scoped to a component)
   --color-button-primary-bg: var(--color-primary-600)
   --spacing-button-padding-x-md: var(--spacing-4)
   --radius-button: var(--radius-md)
```

**Color Scales:**

| Scale | Base Color | Default Value | Usage |
|---|---|---|---|
| `primary` | Xectec Blue | `#2563eb` | CTA buttons, links, focus rings |
| `secondary` | Indigo | `#4f46e5` | Supporting interactive elements |
| `success` | Emerald | `#059669` | Success states, confirmations |
| `warning` | Amber | `#f59e0b` | Caution indicators |
| `error` | Rose | `#e11d48` | Errors, danger actions |
| `neutral` | Slate | — | Text, borders, backgrounds |

**Spacing Scale (numeric):**

| Token | CSS Variable | Value |
|---|---|---|
| `spacing[1]` | `--spacing-1` | `0.25rem` / 4px |
| `spacing[2]` | `--spacing-2` | `0.5rem` / 8px |
| `spacing[3]` | `--spacing-3` | `0.75rem` / 12px |
| `spacing[4]` | `--spacing-4` | `1rem` / 16px |
| `spacing[5]` | `--spacing-5` | `1.25rem` / 20px |
| `spacing[6]` | `--spacing-6` | `1.5rem` / 24px |
| `spacing[8]` | `--spacing-8` | `2rem` / 32px |
| `spacing[10]` | `--spacing-10` | `2.5rem` / 40px |
| `spacing[12]` | `--spacing-12` | `3rem` / 48px |

**Named Spacing Aliases:**

| Token | Resolves to | Value |
|---|---|---|
| `spacing.xs` | `--spacing-2` | `0.5rem` |
| `spacing.sm` | `--spacing-3` | `0.75rem` |
| `spacing.md` | `--spacing-4` | `1rem` |
| `spacing.lg` | `--spacing-6` | `1.5rem` |
| `spacing.xl` | `--spacing-8` | `2rem` |
| `spacing.2xl` | `--spacing-12` | `3rem` |

**Border Radius:**

| Token | CSS Variable | Value | Used By |
|---|---|---|---|
| `radius.sm` | `--radius-sm` | `0.25rem` | Small badges |
| `radius.md` | `--radius-md` | `0.375rem` | Inputs, dropdowns |
| `radius.lg` | `--radius-lg` | `0.5rem` | Cards, toasts |
| `radius.xl` | `--radius-xl` | `0.75rem` | Modals |
| `radius.full` | `--radius-full` | `9999px` | Buttons (pill-shaped) |

**Shadow / Elevation:**

| Token | CSS Variable | Purpose |
|---|---|---|
| `shadows.xs` | `--shadow-xs` | Subtle lift (default buttons) |
| `shadows.sm` | `--shadow-sm` | Raised cards |
| `shadows.md` | `--shadow-md` | Floating cards |
| `shadows.lg` | `--shadow-lg` | Toasts |
| `shadows.xl` | `--shadow-xl` | Modals |

**Z-Index Stack:**

| Token | CSS Variable | Value | Layer |
|---|---|---|---|
| `zIndex.dropdown` | `--z-index-dropdown` | `100` | Dropdowns, selects |
| `zIndex.sticky` | `--z-index-sticky` | `200` | Sticky headers |
| `zIndex.overlay` | `--z-index-overlay` | `300` | Backdrop overlays |
| `zIndex.modal` | `--z-index-modal` | `400` | Modal dialogs |
| `zIndex.popover` | `--z-index-popover` | `500` | Popovers |
| `zIndex.toast` | `--z-index-toast` | `600` | Toast notifications |
| `zIndex.tooltip` | `--z-index-tooltip` | `700` | Tooltips |

**Transitions:**

| Token | CSS Variable | Value | Use Case |
|---|---|---|---|
| `transitions.fast` | `--transition-fast` | `100ms ease` | Checkboxes, toggles |
| `transitions.base` | `--transition-base` | `150ms ease` | Buttons, inputs |
| `transitions.slow` | `--transition-slow` | `300ms ease` | Modals, drawers |
| `transitions.spring` | `--transition-spring` | `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful elements |

---

## Component Documentation

### Button

**Story path in Storybook:** `Components / Button`  
**Source file:** [`packages/ui/src/components/Button/Button.tsx`](packages/ui/src/components/Button/Button.tsx)

A polymorphic, fully accessible interactive button element. Extends native `ButtonHTMLAttributes<HTMLButtonElement>`, so all standard HTML button attributes (`type`, `onClick`, `form`, `value`, etc.) are accepted.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline" \| "danger"` | `"primary"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size — controls height and padding |
| `isLoading` | `boolean` | `false` | Shows spinner, sets `aria-busy="true"`, disables interaction |
| `leftIcon` | `ReactNode` | `undefined` | Icon element rendered before the label. Hidden during loading. |
| `rightIcon` | `ReactNode` | `undefined` | Icon element rendered after the label. Hidden during loading. |
| `fullWidth` | `boolean` | `false` | Makes button `width: 100%` |
| `disabled` | `boolean` | `false` | Disables button, sets `aria-disabled="true"` |
| `children` | `ReactNode` | — | Button label content |

#### Variants

| Variant | Background | Text | Use Case |
|---|---|---|---|
| `primary` | `--color-primary` (blue) | white | Main CTA actions |
| `secondary` | `--color-neutral-100` | dark | Secondary actions |
| `ghost` | transparent | `--color-text` | Subtle tertiary actions |
| `outline` | transparent | `--color-primary` | Bordered alternative to primary |
| `danger` | `--color-error` (rose) | white | Destructive actions (delete, remove) |

#### Sizes

| Size | Height | Padding X | Font Size |
|---|---|---|---|
| `sm` | `1.8rem` | `--spacing-3` (12px) | `--font-size-xs` (12px) |
| `md` | `2rem` | `--spacing-4` (16px) | `--font-size-sm` (14px) |
| `lg` | `2.5rem` | `--spacing-6` (24px) | `--font-size-md` (16px) |

#### Accessibility
- Uses native `<button>` element.
- `disabled` prop sets both `disabled` and `aria-disabled="true"`.
- `isLoading` sets `aria-busy="true"` and `disabled` to prevent interaction.
- Spinner SVG is `aria-hidden="true"` (decorative).
- Icon spans are `aria-hidden="true"`.
- Focus ring via `:focus-visible` with `var(--color-focus-ring)`.

#### Stories Available
| Story Name | Description |
|---|---|
| `Default` | Interactive playground with all controls |
| `All Variants` | Side-by-side view of all 5 variants |
| `All Sizes` | Side-by-side comparison of sm / md / lg |
| `Loading` | Button in loading state |
| `Disabled` | Button in disabled state |
| `With Icons` | Examples with leftIcon and rightIcon |
| `Full Width` | Button stretched to container width |

#### Usage Example
```tsx
import { Button } from '@xectec/ui';

// Basic
<Button variant="primary" onClick={handleSave}>Save Changes</Button>

// With loading state
<Button variant="primary" isLoading={isSaving}>
  {isSaving ? "Saving..." : "Save"}
</Button>

// With icon
<Button
  variant="outline"
  leftIcon={<UploadIcon />}
  onClick={handleUpload}
>
  Upload File
</Button>

// Danger action
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>
```

---

### Input

**Story path in Storybook:** `Components / Input`  
**Source file:** [`packages/ui/src/components/Input/Input.tsx`](packages/ui/src/components/Input/Input.tsx)

A form input with integrated label, helper text, validation states, and left/right element slots. Implemented using `forwardRef` for ref forwarding. Uses `useId()` to generate accessible, collision-free IDs.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Input label rendered above the field |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Controls padding and font size |
| `helperText` | `string` | — | Neutral helper text below the field |
| `errorMessage` | `string` | — | Error text — auto-sets validation state to `"error"` |
| `successMessage` | `string` | — | Success text — auto-sets validation state to `"success"` |
| `validationState` | `"default" \| "success" \| "error"` | auto-derived | Explicit override of validation state |
| `leftElement` | `ReactNode` | — | Element rendered inside the input on the left (icon, prefix) |
| `rightElement` | `ReactNode` | — | Element rendered inside the input on the right (icon, button) |
| `isRequired` | `boolean` | — | Adds `*` indicator, sets `required` and `aria-required` |
| `disabled` | `boolean` | — | Disables the input and dims the wrapper |
| `wrapperClassName` | `string` | — | Additional class on the outer wrapper div |

> **Note:** `size` is omitted from the native `InputHTMLAttributes` to avoid conflict with the HTML `size` attribute. This is handled via `Omit<InputHTMLAttributes<HTMLInputElement>, "size">`.

#### Validation State Logic

Validation state is **auto-derived** in priority order:
1. Explicit `validationState` prop (if provided)
2. `"error"` if `errorMessage` is provided
3. `"success"` if `successMessage` is provided
4. `"default"` otherwise

#### Accessibility Implementation
- `label` is linked to the input via `htmlFor={id}`.
- Auto-generated ID via `useId()` avoids manual ID management.
- `aria-describedby` links the input to helper/error/success message.
- Error state adds `role="alert"` to the feedback paragraph.
- `aria-invalid="true"` is set on error state.
- `aria-required` mirrors the `required` attribute.
- Validation icons are `aria-hidden="true"`.

#### Stories Available
| Story Name | Description |
|---|---|
| `Default` | Email input with helper text — interactive playground |
| `All Sizes` | sm / md / lg inputs stacked vertically |
| `Validation States` | Default, error, and success states side by side |
| `With Left Icon` | Search input with magnifier icon |
| `Required` | Input with required indicator |
| `Disabled` | Disabled input state |

#### Usage Example
```tsx
import { Input } from '@xectec/ui';

// Standard field
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  helperText="We'll never share your email."
/>

// With validation
<Input
  label="Username"
  errorMessage="Username is already taken."
  defaultValue="johndoe"
/>

// With left icon
<Input
  label="Search"
  placeholder="Search anything..."
  leftElement={<SearchIcon size={16} />}
/>

// Required field
<Input
  label="Full Name"
  isRequired
  placeholder="John Doe"
/>
```

---

### Card

**Story path in Storybook:** `Components / Card`  
**Source file:** [`packages/ui/src/components/Card/Card.tsx`](packages/ui/src/components/Card/Card.tsx)

A flexible surface container using a compound component pattern. `Card.Header`, `Card.Body`, and `Card.Footer` are attached as static properties on the `Card` function.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `elevation` | `"flat" \| "raised" \| "floating"` | `"raised"` | Shadow depth |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Internal padding |
| `bordered` | `boolean` | `false` | Adds a `1px` border |
| `interactive` | `boolean` | `false` | Enables hover/active states (lift + cursor pointer) |
| `children` | `ReactNode` | — | Card content |

All standard `HTMLAttributes<HTMLDivElement>` are also supported (`style`, `className`, `onClick`, etc.).

#### Compound Subcomponents

| Subcomponent | Tag | Purpose |
|---|---|---|
| `Card.Header` | `<div>` | Header section — typically contains title, icon, or badge |
| `Card.Body` | `<div>` | Main body content |
| `Card.Footer` | `<div>` | Footer — typically contains action buttons |

Each subcomponent accepts `className` and any `HTMLAttributes<HTMLDivElement>`.

#### Elevation Shadows

| Elevation | CSS Variable | Shadow |
|---|---|---|
| `flat` | `--shadow-card-flat` | `none` |
| `raised` | `--shadow-card-raised` | `--shadow-sm` |
| `floating` | `--shadow-card-floating` | `--shadow-md` |

#### Stories Available
| Story Name | Description |
|---|---|
| `Default` | Simple card with basic content |
| `With Header / Body / Footer` | Full compound layout with action buttons |
| `All Elevations` | Flat / Raised / Floating comparison |
| `Interactive` | Clickable cards with hover lift effect |

#### Usage Example
```tsx
import { Card, Button } from '@xectec/ui';

<Card elevation="raised" bordered style={{ maxWidth: "24rem" }}>
  <Card.Header>
    <h3>Project Alpha</h3>
  </Card.Header>
  <Card.Body>
    A next-generation platform built for scale.
  </Card.Body>
  <Card.Footer>
    <Button variant="ghost" size="sm">Cancel</Button>
    <Button variant="primary" size="sm">View Project</Button>
  </Card.Footer>
</Card>

// Interactive (clickable) card
<Card interactive bordered onClick={handleCardClick}>
  <Card.Body>Click me!</Card.Body>
</Card>
```

---

### Modal

**Story path in Storybook:** `Components / Modal`  
**Source file:** [`packages/ui/src/components/Modal/Modal.tsx`](packages/ui/src/components/Modal/Modal.tsx)

A fully accessible dialog built on **Radix UI Dialog**. Provides focus trapping, keyboard dismiss (Esc), ARIA attributes, and a `Modal.Trigger` convenience subcomponent.

> **Server Components note:** The file has `"use client"` directive for Next.js App Router compatibility.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | **Required.** Controls dialog open state |
| `onClose` | `() => void` | — | **Required.** Called when modal should close |
| `title` | `string` | — | **Required.** Dialog title for accessibility |
| `hideTitle` | `boolean` | `false` | Visually hides title (still read by screen readers) |
| `description` | `string` | — | Optional description rendered below the title |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Dialog panel width |
| `footer` | `ReactNode` | — | Footer slot — typically action buttons |
| `preventBackdropClose` | `boolean` | `false` | Prevents closing when clicking outside the dialog |
| `preventEscapeClose` | `boolean` | `false` | Prevents Escape key from closing |
| `className` | `string` | — | Override class on the dialog panel |
| `children` | `ReactNode` | — | Dialog body content |

#### Size Reference

| Size | Max Width | Use Case |
|---|---|---|
| `sm` | `28rem` | Confirmations, alerts |
| `md` | `36rem` | Default — forms, details |
| `lg` | `56rem` | Wide forms, tables |
| `xl` | `72rem` | Data preview, complex UI |
| `full` | `100vw - 2rem` | Full-screen modals |

#### Accessibility (Radix UI)
- Focus is trapped inside the dialog when open.
- Pressing `Escape` closes the dialog (configurable via `preventEscapeClose`).
- Clicking the backdrop closes the dialog (configurable via `preventBackdropClose`).
- `aria-labelledby` and `aria-describedby` are handled automatically by Radix.
- Close button has `aria-label="Close dialog"`.
- Uses `@radix-ui/react-visually-hidden` for screen-reader-only title when `hideTitle` is true.

#### Subcomponent

```tsx
// Convenience wrapper around Radix Dialog.Trigger
<Modal.Trigger asChild>
  <Button>Open Modal</Button>
</Modal.Trigger>
```

#### Stories Available
| Story Name | Description |
|---|---|
| `Default` | Interactive "Open Modal" → close flow |
| `With Description` | Modal with subtitle description |
| `Small` | `sm` size confirmation dialog |
| `Large` | `lg` size editing dialog |
| `Extra Large` | `xl` size data preview |

> **Storybook note:** Stories use a local `ModalDemo` wrapper with `useState` to manage the open/close state, since Storybook does not manage component state automatically for controlled components.

#### Usage Example
```tsx
import { useState } from 'react';
import { Modal, Button } from '@xectec/ui';

function DeleteConfirmation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete Item
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Item"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to permanently delete this item?</p>
      </Modal>
    </>
  );
}
```

---

### Toast

**Story path in Storybook:** `Components / Toast`  
**Source file:** [`packages/ui/src/components/Toast/Toast.tsx`](packages/ui/src/components/Toast/Toast.tsx)

A notification system built on **Radix UI Toast**. Uses a React Context + Provider pattern. Toasts support auto-dismiss (configurable duration), swipe-to-dismiss gesture, and `Infinity` duration for persistent messages.

> **Server Components note:** The file has `"use client"` directive for Next.js App Router compatibility.

#### Setup — `ToastProvider`

Wrap your application root (or page layout) with `ToastProvider` once:

```tsx
// Next.js: app/layout.tsx
import { ToastProvider } from '@xectec/ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

**`ToastProvider` Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Application subtree |
| `maxVisible` | `number` | `5` | Maximum simultaneous toast notifications |

#### `useToast()` Hook

Access the toast API from any component inside the provider:

```tsx
import { useToast } from '@xectec/ui';

const { toast, dismiss } = useToast();
```

| Method | Signature | Description |
|---|---|---|
| `toast` | `(options: Omit<ToastItem, "id">) => void` | Creates and displays a new toast |
| `dismiss` | `(id: string) => void` | Programmatically dismisses a toast by ID |

#### `ToastItem` Interface

```typescript
interface ToastItem {
  id: string;              // Auto-generated — do not pass
  variant: ToastVariant;  // "info" | "success" | "warning" | "error"
  title: string;          // Required — bold notification title
  description?: string;   // Optional — supporting message
  duration?: number;      // Default: 5000ms. Set Infinity to persist.
}
```

#### Variants

| Variant | Background | Border | Icon Color | Use Case |
|---|---|---|---|---|
| `info` | white | neutral-200 | primary blue | General information |
| `success` | success-50 | success-200 | success-500 | Completed actions |
| `warning` | warning-50 | warning-200 | warning-600 | Caution/warnings |
| `error` | error-50 | error-200 | error-600 | Failures, errors |

#### Stories Available
| Story Name | Description |
|---|---|
| `All Variants` | Trigger buttons for all 4 variants |
| `Persistent` | Toast with `duration: Infinity` |

> **Storybook note:** The Toast story uses a decorator that wraps each story in `<ToastProvider>`. The `useToast()` hook inside the story component can then access the context.

#### Usage Example
```tsx
import { useToast } from '@xectec/ui';

function SaveButton() {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast({
        variant: 'success',
        title: 'Saved!',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Save failed',
        description: 'Please try again or contact support.',
        duration: Infinity, // Persist until user dismisses
      });
    }
  };

  return <Button onClick={handleSave}>Save Changes</Button>;
}
```

---

## Story File Structure (CSF3)

All stories use **Component Story Format 3 (CSF3)**. Below is the canonical template:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "@xectec/ui";

// ─── 1. Meta — story metadata and component controls ──────────────────────────
const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",   // Sidebar path: Components > MyComponent
  component: MyComponent,
  tags: ["autodocs"],                // Enables auto-generated API docs tab
  parameters: {
    docs: {
      description: {
        component: "Brief description of what this component does.",
      },
    },
  },
  argTypes: {
    // Document and configure each prop's control
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Visual style variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// ─── 2. Stories — named exports representing individual states ─────────────────

// Default story: Args-based (drives the controls panel)
export const Default: Story = {
  args: {
    children: "Label",
    variant: "primary",
  },
};

// Render story: Custom render function for complex layouts
export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div style={{ display: "flex", gap: "var(--spacing-3)" }}>
      <MyComponent variant="primary">Primary</MyComponent>
      <MyComponent variant="secondary">Secondary</MyComponent>
    </div>
  ),
};
```

### Story Types

| Type | When to Use |
|---|---|
| **Args story** | Single component instance. The Controls panel works. |
| **Render story** | Multiple instances, complex layouts, stateful demos |
| **MDX page** | Pure documentation (token catalog, overview pages) |

---

## Theming & Dark Mode

The design system's dark mode is **entirely CSS-driven** — no JavaScript logic or React context required in components.

**How it works:**
1. `preview.tsx` toolbar shows a sun/moon toggle.
2. Selecting "Dark" sets `context.globals.theme = "dark"`.
3. The global decorator reads this and sets `data-theme="dark"` on `<html>`.
4. `tokens.css` has a `[data-theme="dark"]` block that overrides all semantic tokens.
5. Every component instantly reflects the new theme via CSS variable inheritance.

**Dark mode token overrides (example):**
```css
[data-theme="dark"] {
  --color-bg: var(--color-neutral-900);
  --color-bg-elevated: var(--color-neutral-800);
  --color-text: var(--color-neutral-50);
  --color-border: var(--color-neutral-700);
  --color-primary: var(--color-primary-400); /* Lighter blue for dark bg */
}
```

**Developers must:**
- Never hardcode hex colors in CSS modules.
- Always reference semantic tokens: `var(--color-text)`, `var(--color-bg)`, `var(--color-border)`.
- Test every new component in both Light and Dark mode before marking it done.

---

## Viewport Testing

Viewports are pre-configured in `preview.tsx`:

| Name | Width | Height | Type |
|---|---|---|---|
| `mobile` | `375px` | `667px` | mobile (iPhone SE) |
| `tablet` | `768px` | `1024px` | tablet (iPad) |
| `laptop` | `1024px` | `768px` | desktop (Small) |
| `desktop` | `1440px` | `900px` | desktop (Large) |

Select a viewport from the Storybook toolbar (the phone icon) to test responsive behavior. All components should render correctly at every breakpoint.

---

## Accessibility Addon

The `@storybook/addon-a11y` addon runs **axe-core** WCAG 2.1 Level AA checks on every story.

**Usage:**
1. Open any story in Storybook.
2. Click the **Accessibility** tab in the addons panel.
3. Violations will be highlighted on the canvas and listed in the panel.

**All existing components pass axe-core checks.** When creating new components:
- Run the a11y tab before submitting a PR.
- Fix any violations — do not suppress rules without documented justification.

---

## Running & Building Storybook

### Development

```bash
# From the repo root (Turborepo handles dependency order)
pnpm --filter=storybook dev

# Or from the storybook directory
cd apps/storybook
pnpm dev
```

Storybook dev server starts at **http://localhost:6006**.

No separate build step needed for `@xectec/ui` or `@xectec/tokens` — Vite aliases resolve directly to TypeScript source.

### Production Build

```bash
pnpm --filter=storybook build
# Output: apps/storybook/storybook-static/
```

### Type Check

```bash
pnpm --filter=storybook typecheck
```

---

## Adding New Stories

When a new component is created in `packages/ui/src/components/MyComponent/`, the corresponding story file `MyComponent.stories.tsx` is automatically discovered by Storybook's glob pattern.

**No changes needed to `main.ts`.**

The glob pattern: `packages/ui/src/**/*.@(stories.@(ts|tsx)|mdx)`

---

## MDX Documentation Pages

MDX files in `packages/ui/src/components/` create documentation-only pages in Storybook (no interactive canvas).

The existing MDX page: `packages/ui/src/components/Tokens.mdx`
- Renders live color swatches by iterating `tokens.colors`.
- Renders spacing scale with visual bars.
- Renders radius previews and shadow previews.
- Renders all from the TypeScript token object (dynamically, not hardcoded).

**Create new MDX pages** for overview documentation, getting started guides, or pattern libraries. Use the `<Meta title="...">` block to position it in the sidebar.

```mdx
import { Meta, Story } from '@storybook/blocks';

<Meta title="Design System/Overview" />

# Getting Started with Xectec UI
...
```

---

## Token Reference: Complete Table

### Semantic Color Tokens (Light Theme)

| CSS Variable | Value (resolves to) | Description |
|---|---|---|
| `--color-bg` | `--color-neutral-50` | Page background |
| `--color-bg-elevated` | `--color-neutral-0` (white) | Elevated surface background |
| `--color-bg-subtle` | `--color-neutral-100` | Subtle tinted background |
| `--color-surface` | `--color-neutral-0` | Card/modal surface |
| `--color-border` | `--color-neutral-200` | Default border |
| `--color-border-strong` | `--color-neutral-300` | Emphasized border |
| `--color-text` | `--color-neutral-900` | Primary body text |
| `--color-text-secondary` | `--color-neutral-600` | Muted/secondary text |
| `--color-text-disabled` | `--color-neutral-400` | Disabled element text |
| `--color-text-inverse` | `--color-neutral-0` | Text on dark backgrounds |
| `--color-focus-ring` | `--color-primary-300` | Focus outline color |
| `--color-primary` | `--color-primary-600` | Primary interactive color |
| `--color-primary-hover` | `--color-primary-700` | Primary hover state |
| `--color-primary-active` | `--color-primary-800` | Primary active/pressed state |
| `--color-primary-subtle` | `--color-primary-50` | Tinted primary background |
| `--color-primary-foreground` | `#ffffff` | Text on primary backgrounds |
| `--color-error` | `--color-error-600` | Error/danger color |
| `--color-success` | `--color-success-600` | Success/confirmed color |
| `--color-warning` | `--color-warning-500` | Warning/caution color |

### Component-Level Tokens

| Component | Token Group | Key Variables |
|---|---|---|
| Button | Colors | `--color-button-primary-bg`, `--color-button-danger-bg` |
| Button | Spacing | `--spacing-button-padding-x-md`, `--spacing-button-gap` |
| Button | Shape | `--radius-button`, `--font-weight-button` |
| Input | Colors | `--color-input-bg`, `--color-input-border-focus`, `--color-input-error-border` |
| Input | Spacing | `--spacing-input-padding-x-md`, `--spacing-input-gap` |
| Input | Shape | `--radius-input` |
| Card | Colors | `--color-card-bg`, `--color-card-border` |
| Card | Shadow | `--shadow-card-flat`, `--shadow-card-raised`, `--shadow-card-floating` |
| Card | Spacing | `--spacing-card-padding-sm/md/lg` |
| Modal | Colors | `--color-modal-bg`, `--color-modal-overlay` |
| Modal | Shadow | `--shadow-modal` |
| Modal | Shape | `--radius-modal` |
| Toast | Colors | `--color-toast-info-bg`, `--color-toast-success-bg`, etc. |
| Toast | Shape | `--radius-toast`, `--shadow-toast` |
| Sidebar | Colors | `--color-sidebar-bg`, `--color-sidebar-text-active` |
| Sidebar | Sizing | `--width-sidebar` (260px), `--width-sidebar-collapsed` (72px) |
| Header | Colors | `--color-header-bg`, `--color-header-border` |
| Header | Sizing | `--height-header` (64px) |
| Badge | Colors | `--color-badge-success-bg`, `--color-badge-error-text`, etc. |
| Badge | Shape | `--radius-badge` |

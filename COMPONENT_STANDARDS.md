# Component Standards & Rules — Xectec Design System

> **Package:** `@xectec/ui`  
> **Source root:** `packages/ui/src/components/`  
> **Version:** 1.0.0  
> **Storybook:** 8.6.18 · React 19 · Vite 6

These are the **non-negotiable standards** every component in `@xectec/ui` must follow from first file creation to publishing. They are ordered as a step-by-step workflow.

---

## Table of Contents

1. [Component Lifecycle Overview](#1-component-lifecycle-overview)
2. [Step 1 — Plan & Scope](#step-1--plan--scope)
3. [Step 2 — Create the Directory Structure](#step-2--create-the-directory-structure)
4. [Step 3 — Write the Component TypeScript File](#step-3--write-the-component-typescript-file)
5. [Step 4 — Write the CSS Module](#step-4--write-the-css-module)
6. [Step 5 — Write the `index.ts` Export File](#step-5--write-the-indexts-export-file)
7. [Step 6 — Write Storybook Stories (CSF3)](#step-6--write-storybook-stories-csf3)
8. [Step 7 — Write Unit Tests](#step-7--write-unit-tests)
9. [Step 8 — Register in Package Index](#step-8--register-in-package-index)
10. [Step 9 — Validate Before Publishing](#step-9--validate-before-publishing)
11. [Step 10 — Publish](#step-10--publish)
12. [Rules Reference](#rules-reference)
    - [Naming Conventions](#naming-conventions)
    - [TypeScript Rules](#typescript-rules)
    - [Styling Rules](#styling-rules)
    - [Accessibility Rules](#accessibility-rules)
    - [Story Rules](#story-rules)
    - [Test Rules](#test-rules)
    - [Banned Patterns](#banned-patterns)

---

## 1. Component Lifecycle Overview

```
Plan ──→ Directory ──→ Component.tsx ──→ CSS Module ──→ index.ts
                                                            │
                                                            ↓
                                                    Stories (CSF3)
                                                            │
                                                            ↓
                                                         Tests
                                                            │
                                                            ↓
                                                    Register in index.ts
                                                            │
                                                            ↓
                                                      Validate & Publish
```

Each step is mandatory. **Do not skip steps** — components that have no stories are undiscoverable; components with no tests are unmaintainable.

---

## Step 1 — Plan & Scope

Before writing any code, answer the following checklist:

### Checklist
- [ ] **Does the component already exist?** Check `packages/ui/src/components/`. Do not duplicate.
- [ ] **Can it be composed from existing components?** Prefer composition over new components.
- [ ] **Does it require a Radix UI primitive?** Use Radix for: dialogs, dropdowns, menus, tooltips, tabs, popovers, toggles, checkboxes, radio groups, sliders.
- [ ] **What are its prop variants?** Define `type` unions for each prop (e.g., `"sm" | "md" | "lg"`).
- [ ] **What accessibility roles/patterns apply?** Consult [WAI-ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/).
- [ ] **Does it need `"use client"`?** Required for components using: `useState`, `useEffect`, `useRef`, event handlers, browser APIs, Radix primitives.

### Naming
- Component names must be **PascalCase** and describe the element, not a page or feature.
- ✅ Good: `Badge`, `Tooltip`, `Dropdown`, `Tabs`, `Switch`
- ❌ Bad: `UserProfileCard`, `DashboardHeader`, `LoginButton`

---

## Step 2 — Create the Directory Structure

Every component lives in its **own isolated directory**:

```
packages/ui/src/components/<ComponentName>/
├── <ComponentName>.tsx          # Component implementation
├── <ComponentName>.module.css   # Component styles (CSS Module)
├── <ComponentName>.stories.tsx  # Storybook CSF3 stories
├── <ComponentName>.test.tsx     # Vitest + RTL unit tests
└── index.ts                     # Public exports from this component
```

**Rules:**
- The directory name and all filenames must be **exactly the component name in PascalCase**.
- No exceptions — do not use kebab-case, camelCase, or abbreviations in directory/file names.
- Do not place any component files outside this directory.

---

## Step 3 — Write the Component TypeScript File

**File:** `<ComponentName>.tsx`

### 3.1 — Type Definitions Come First

Always define exported type unions before the props interface:

```typescript
// ✅ Correct order
export type BadgeVariant = "default" | "success" | "warning" | "error";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: ReactNode;
}
```

### 3.2 — Props Interface Rules

- **Extend native HTML attributes** of the root element:
  - Root element `<button>` → extend `ButtonHTMLAttributes<HTMLButtonElement>`
  - Root element `<div>` → extend `HTMLAttributes<HTMLDivElement>`
  - Root element `<input>` → extend `InputHTMLAttributes<HTMLInputElement>`
- Always use `Omit<>` when a native attribute conflicts with a custom prop name. (Example: `Input` omits the native `size` attribute to use its own `size` prop.)
- **Every prop must have a JSDoc comment** — single line is enough. This populates the Storybook autodocs table.

```typescript
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant controlling color scheme */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
}
```

### 3.3 — Component Function Rules

- **Named function exports only** — never `export default`.

```typescript
// ✅ Correct
export function Badge({ ... }: BadgeProps) { ... }

// ❌ Never use default export for components
export default function Badge() { ... }
```

- **Use `forwardRef`** when the component wraps a native input, button, anchor, or textarea, or when consumers may need to imperatively control the element.

```typescript
// For components that need ref forwarding
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ ... }, ref) {
    return <input ref={ref} ... />;
  }
);
```

### 3.4 — Class Name Assembly Pattern

Build class strings using the **array filter join pattern**. Never use template literal chains or fragile ternary nesting:

```typescript
// ✅ Correct — array filter join
const classNames = [
  styles.badge,
  styles[`variant-${variant}`],
  styles[`size-${size}`],
  className ?? "",
]
  .filter(Boolean)
  .join(" ");

// ❌ Avoid — fragile template literals
const classNames = `${styles.badge} ${styles[`variant-${variant}`]} ${className || ""}`;
```

### 3.5 — Compound Components Pattern

For components with sub-sections (Header, Body, Footer), use the **namespace attachment pattern**:

```typescript
// Define sub-components first
function BadgeIcon({ children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest}>{children}</span>;
}
BadgeIcon.displayName = "Badge.Icon";

// Attach to main component after definition
export function Badge(...) { ... }
Badge.Icon = BadgeIcon;
```

**Rules for compound subcomponents:**
- Define sub-components **before** the main component function.
- Set `displayName` to `"ParentName.SubName"` — this ensures correct display in React DevTools and Storybook.
- Attach sub-components as properties **after** the main component definition.

### 3.6 — JSDoc Example Comment

Always include a usage example in JSDoc:

```typescript
/**
 * Badge — a compact status indicator.
 *
 * @example
 * <Badge variant="success" size="sm">Active</Badge>
 */
export function Badge({ ... }: BadgeProps) { ... }
```

### 3.7 — `"use client"` Directive

Add `"use client"` at the very top of any component that:
- Uses React hooks (`useState`, `useEffect`, `useRef`, `useContext`, etc.)
- Registers event handlers in JSX
- Uses browser APIs (`document`, `window`, `navigator`)
- Uses Radix UI primitives (they use hooks internally)

```typescript
"use client";  // First line of file, before all imports

import { useState } from "react";
```

---

## Step 4 — Write the CSS Module

**File:** `<ComponentName>.module.css`

### 4.1 — Structure Template

Organize every CSS module in this exact order with comment dividers:

```css
/* =====================================================
   <ComponentName> — CSS Module
   All values reference design tokens via CSS variables.
   ===================================================== */

/* Base styles */
.componentName { }

/* =====================================================
   SIZES
   ===================================================== */

.size-sm { }
.size-md { }
.size-lg { }

/* =====================================================
   VARIANTS
   ===================================================== */

.variant-primary { }
.variant-secondary { }

/* =====================================================
   MODIFIERS
   ===================================================== */

.fullWidth { }
.loading { }

/* =====================================================
   INTERNAL ELEMENTS
   ===================================================== */

.icon { }
.label { }

/* =====================================================
   ANIMATIONS
   ===================================================== */

@keyframes spin { }
```

### 4.2 — Token Usage Rules

**ALL values must reference CSS variables.** No raw hex colors, px values, or hardcoded strings.

```css
/* ✅ Correct */
.badge {
  background-color: var(--color-primary-subtle);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-3);
  transition: background-color var(--transition-base);
}

/* ❌ Wrong — raw values */
.badge {
  background-color: #eff6ff;
  color: #2563eb;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 12px;
  padding: 4px 12px;
}
```

### 4.3 — Border Rules

- All borders must be exactly `1px solid`.
- Always use `var(--color-border)` or a semantic border token.

```css
border: 1px solid var(--color-border);
```

### 4.4 — Focus Ring Rules

Every interactive element must have a visible focus style:

```css
&:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-focus-ring);
}
```

Never use `outline: none` without providing an alternative visual focus indicator.

### 4.5 — Border Radius Reference

| Element Type | Required Token | Value |
|---|---|---|
| Buttons | `var(--radius-full)` | Pill-shaped (9999px) |
| Input wrappers | `var(--radius-md)` | Rounded (6px) |
| Cards | `var(--radius-lg)` | (8px) |
| Modals | `var(--radius-xl)` | (12px) |
| Toasts | `var(--radius-lg)` | (8px) |
| Badges | `var(--radius-full)` or `var(--radius-sm)` | — |

### 4.6 — CSS Nesting

Use CSS nesting (`&`) for state modifiers — supported in all modern browsers and Vite's CSS pipeline:

```css
.button {
  background-color: var(--color-primary);

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  &:active:not(:disabled) {
    background-color: var(--color-primary-active);
  }

  &:disabled,
  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-focus-ring);
  }
}
```

### 4.7 — Prohibited CSS Practices

| ❌ Prohibited | ✅ Correct Alternative |
|---|---|
| `!important` | Increase specificity or restructure |
| Hardcoded hex colors | `var(--color-*)` tokens |
| Raw `px` sizes (except borders: `1px`) | `rem` values via tokens |
| Global class selectors | CSS Module local classes only |
| `@import` inside module | Add dependency in component file |
| Inline styles in JSX | CSS Module classes |

---

## Step 5 — Write the `index.ts` Export File

**File:** `index.ts`

Use a single wildcard re-export:

```typescript
export * from "./ComponentName";
```

This exports:
- The component function.
- All exported type unions and interfaces from the component file.

**Do not add any logic, imports, or documentation to `index.ts`.**

---

## Step 6 — Write Storybook Stories (CSF3)

**File:** `<ComponentName>.stories.tsx`

### 6.1 — Story File Template

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "@xectec/ui";        // Always import from package alias

const meta: Meta<typeof ComponentName> = {
  title: "Components/ComponentName",               // Title hierarchy in sidebar
  component: ComponentName,
  tags: ["autodocs"],                              // REQUIRED — generates docs tab
  parameters: {
    docs: {
      description: {
        component: "One paragraph description of what this component does.",
      },
    },
  },
  argTypes: {
    // Document every meaningful prop
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Visual style variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    disabled: {
      control: "boolean",
      description: "Disables the component",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: "Label",
    variant: "primary",
  },
};
```

### 6.2 — Mandatory Stories Checklist

Every component must have at minimum:

- [ ] **`Default`** — `args`-based story that populates the Controls panel.
- [ ] **`AllVariants`** — Shows all `variant` values side-by-side in a flex row.
- [ ] **`AllSizes`** — Shows all `size` values side-by-side.
- [ ] **Disabled state** — Shows the component in disabled state.
- [ ] **Any special states** — Loading, error, success, empty, etc. as relevant.

### 6.3 — Import Convention

Always import components from the package alias:

```typescript
// ✅ Correct — uses workspace package alias
import { ComponentName } from "@xectec/ui";

// ❌ Wrong — relative import bypasses the package export
import { ComponentName } from "./ComponentName";
```

### 6.4 — Stateful Stories (for controlled components)

For components that require controlled state (Modal, Tooltip, Popover), create a local wrapper function inside the story file:

```typescript
function ComponentDemo({ prop = "default" }: { prop?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <ComponentName open={open} onClose={() => setOpen(false)} {...} />
    </>
  );
}

export const Default: Story = {
  render: () => <ComponentDemo />,
};
```

### 6.5 — Provider Decorator for Context Components

Components that depend on React context (e.g., Toast `useToast` requires `ToastProvider`) must provide the context via a story decorator:

```typescript
const meta: Meta = {
  title: "Components/Toast",
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};
```

### 6.6 — Inline Styles in Stories

Use design token CSS variables for all inline styles in stories. Never hardcode visual values:

```typescript
// ✅ Correct
<div style={{ display: "flex", gap: "var(--spacing-3)", flexWrap: "wrap" }}>

// ❌ Wrong
<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
```

---

## Step 7 — Write Unit Tests

**File:** `<ComponentName>.test.tsx`

### 7.1 — Test File Template

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ComponentName } from "./ComponentName";  // Import directly (not via package)

describe("ComponentName", () => {
  it("renders with default props", () => {
    render(<ComponentName>Label</ComponentName>);
    expect(screen.getByRole("...")).toBeInTheDocument();
  });
});
```

> **Note:** Tests import directly from the component file, not via `@xectec/ui`. This avoids circular dependency issues.

### 7.2 — Mandatory Test Cases

| Category | Test |
|---|---|
| **Rendering** | Renders with default props without crashing |
| **Default classes** | Default variant/size class is applied |
| **Variant classes** | Each variant applies the correct CSS module class |
| **Size classes** | Each size applies the correct CSS module class |
| **Event handlers** | `onClick` / `onChange` fires on user interaction |
| **Disabled state** | Does not fire events when disabled; `disabled` attribute present |
| **ARIA attributes** | Correct `aria-*` attributes are present |
| **Accessibility** | `role`, `aria-label`, `aria-describedby` as applicable |
| **Ref forwarding** | If `forwardRef` is used, verify the ref attaches to the correct element |
| **Children** | Component renders children correctly |

### 7.3 — Testing Rules

- Use `userEvent` (from `@testing-library/user-event`) for simulating real user interactions — never `fireEvent` for click/type.
- Use `screen.getByRole()` as the primary query — it enforces semantic HTML.
- Use `screen.getByTestId()` only when role-based queries are impossible.
- Use `vi.fn()` for mock functions and `expect(...).toHaveBeenCalledOnce()` for assertions.
- Do not test CSS class names as the primary assertion for visual states — this is brittle. Prefer asserting ARIA attributes and DOM structure.

**Exception:** Class name assertions are acceptable when verifying that CSS module classes are applied correctly (since the system is class-based).

### 7.4 — Run Tests

```bash
# From repo root
pnpm --filter=@xectec/ui test

# Watch mode
pnpm --filter=@xectec/ui test:watch
```

---

## Step 8 — Register in Package Index

**File:** `packages/ui/src/index.ts`

Add exports for the component and all its types:

```typescript
// Add at the bottom of the existing exports

export { ComponentName } from "./components/ComponentName/index.js";
export type {
  ComponentNameProps,
  ComponentNameVariant,
  ComponentNameSize,
} from "./components/ComponentName/index.js";
```

**Rules:**
- Use the `.js` extension in the import path (required for ESM output compatibility).
- Export types with `export type` — not `export` — to keep the runtime bundle clean.
- Maintain alphabetical order within the exports file.

---

## Step 9 — Validate Before Publishing

Run all validation commands and fix every error before creating a PR or publishing:

### 9.1 — Type Check

```bash
# Check @xectec/ui package
pnpm --filter=@xectec/ui typecheck

# Check storybook (catches import errors in stories)
pnpm --filter=storybook typecheck
```

### 9.2 — Lint

```bash
pnpm --filter=@xectec/ui lint
```

### 9.3 — Unit Tests

```bash
pnpm --filter=@xectec/ui test
```

### 9.4 — Build

```bash
pnpm --filter=@xectec/ui build
```

### 9.5 — Storybook Smoke Test

```bash
pnpm --filter=storybook dev
# Open http://localhost:6006
# Verify:
# - Component appears in sidebar under Components/
# - Autodocs tab renders correctly
# - All stories render without JS errors
# - All stories pass the Accessibility tab checks
# - Light and Dark themes both render correctly
```

### 9.6 — Build Storybook (Optional Pre-publish)

```bash
pnpm --filter=storybook build
```

---

## Step 10 — Publish

The packages are published as npm packages from a pnpm workspace.

### Version Bump

Follow **Semantic Versioning (SemVer)**:

| Change Type | Version Bump | Example |
|---|---|---|
| New component, no breaking changes | **Minor**: `0.1.x → 0.2.0` | Added `Badge` component |
| Bug fix, style tweak | **Patch**: `0.1.0 → 0.1.1` | Fixed focus ring |
| Breaking prop rename / removal | **Major**: `0.1.x → 1.0.0` | Renamed `isLoading` to `loading` |

Bump version in `packages/ui/package.json`:

```json
{
  "version": "0.2.0"
}
```

### Build & Publish

```bash
# Build the distributable
pnpm --filter=@xectec/ui build

# Publish to npm (or private registry)
pnpm --filter=@xectec/ui publish --no-git-checks
```

### Update Consumers

After publishing, update the version in any consuming application:

```bash
pnpm add @xectec/ui@0.2.0
```

---

## Rules Reference

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Directory | PascalCase | `Button/`, `DatePicker/` |
| Component file | `ComponentName.tsx` | `Button.tsx` |
| CSS module | `ComponentName.module.css` | `Button.module.css` |
| Stories | `ComponentName.stories.tsx` | `Button.stories.tsx` |
| Tests | `ComponentName.test.tsx` | `Button.test.tsx` |
| Index | `index.ts` | `index.ts` |
| Exported component | PascalCase function | `export function Button` |
| Exported types | PascalCase | `ButtonVariant`, `ButtonProps` |
| CSS module classes | camelCase for elements, kebab-case for modifiers | `.inputWrapper`, `.variant-primary`, `.size-md` |
| Story exports | PascalCase | `export const AllVariants` |
| Story names | Title Case | `name: "All Variants"` |

### TypeScript Rules

| Rule | Reason |
|---|---|
| All props must be explicitly typed | Enables autodocs and catch bugs at compile time |
| All type unions must be exported | Consumers need them for TypeScript integration |
| All props must have JSDoc comments | Populates Storybook autodocs description column |
| No `any` types | Use `unknown` or proper generic types |
| `forwardRef` for input/button/anchor wrappers | Required for form libraries and ref-based access |
| Default props via destructuring defaults | Avoid `defaultProps` (deprecated in React 19) |

### Styling Rules

| Rule | Rationale |
|---|---|
| All styles in `.module.css` file | Scoped, avoids class collisions |
| All values via CSS variables | Theme-aware, dark mode compatible |
| No hardcoded hex colors | Tokens handle theme switching |
| No `!important` | Indicates specificity problem; fix the root cause |
| Border: always `1px solid var(--color-border)` | Consistent, design-specified |
| Focus visible: `box-shadow` ring pattern | WCAG 2.1 AA compliant |
| No `@import` inside modules | Use component-level imports |
| Transitions via token variables | Consistent animation feel across components |

### Accessibility Rules

| Rule | WCAG Criteria |
|---|---|
| Interactive elements must be keyboard focusable | 2.1.1 — Keyboard |
| Focus must be visible | 2.4.7 — Focus Visible |
| Labels must be programmatically associated | 1.3.1 — Info and Relationships |
| Color is not the only differentiator | 1.4.1 — Use of Color |
| Error messages must be identified in text | 3.3.1 — Error Identification |
| Controls must have accessible names | 4.1.2 — Name, Role, Value |
| Modals must trap focus | 2.1.1 — Keyboard, WAI-ARIA Dialog |
| Dynamic content must use `aria-live` | 4.1.3 — Status Messages |

### Story Rules

| Rule | Reason |
|---|---|
| `tags: ["autodocs"]` is mandatory | Generates API documentation automatically |
| Import components from `@xectec/ui` | Tests the public package API, not internals |
| Every meaningful prop documented in `argTypes` | Storybook controls and docs |
| `Default` story must be args-based | Drives the interactive Controls panel |
| Inline styles in stories use CSS variable values | Consistent with design system |
| Theme must work in both Light and Dark | Dark mode is a first-class requirement |

### Test Rules

| Rule | Reason |
|---|---|
| `screen.getByRole()` as primary query | Enforces semantic HTML |
| `userEvent` for interactions | Simulates real browser behavior |
| Import from `"./ComponentName"` not `@xectec/ui` | Avoids circular resolution in test runner |
| Test ARIA attributes for accessibility | Validates accessibility requirements |
| No assertions on computed styles | Not supported in jsdom |
| No snapshot tests | Fragile, maintenance-heavy |

### Banned Patterns

```typescript
// ❌ Default export for components
export default function Button() {}

// ❌ Hardcoded colors in CSS
.button { background-color: #2563eb; }

// ❌ Import from relative path in stories
import { Button } from "./Button";

// ❌ fireEvent for user simulation in tests
fireEvent.click(element);

// ❌ any type
function Component(props: any) {}

// ❌ !important in CSS
.button { color: red !important; }

// ❌ Inline JSX styles with raw values in stories
<div style={{ gap: "12px" }}>

// ❌ defaultProps (deprecated in React 19)
Button.defaultProps = { variant: "primary" };

// ❌ CSS module class from another component
import otherStyles from "../Button/Button.module.css";

// ❌ Global class names in CSS module
// (using :global is prohibited)
:global(.btn-primary) { }
```

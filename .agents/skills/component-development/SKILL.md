---
name: xectec-component-development
description: >
  Guides developers and AI agents through the complete lifecycle of creating,
  documenting, testing, and publishing a new UI component in the Xectec Design
  System monorepo (@xectec/ui). Covers file structure, TypeScript standards,
  CSS Module conventions, Storybook CSF3 stories, Vitest unit tests, package
  registration, and publish workflow.
---

# Skill: Xectec Component Development

This skill provides all context needed to build a production-quality component
in the `@xectec/ui` package, from an empty folder to a published npm release.

---

## Workspace Context

| Item | Value |
|---|---|
| Monorepo tool | Turborepo + pnpm workspaces |
| Component package | `packages/ui/` → npm name `@xectec/ui` |
| Token package | `packages/tokens/` → npm name `@xectec/tokens` |
| Storybook app | `apps/storybook/` (Storybook 8.6.18) |
| Framework | React 19, TypeScript, Vite 6 |
| Testing | Vitest 3 + React Testing Library 16 |
| CSS approach | CSS Modules — all values via CSS custom properties |
| Storybook format | CSF3 (`@storybook/react-vite`) |

### Monorepo Commands

```bash
# Start Storybook dev server (http://localhost:6006)
pnpm --filter=storybook dev

# Run all UI tests
pnpm --filter=@xectec/ui test

# Type-check UI package
pnpm --filter=@xectec/ui typecheck

# Type-check Storybook
pnpm --filter=storybook typecheck

# Lint UI package
pnpm --filter=@xectec/ui lint

# Build UI package
pnpm --filter=@xectec/ui build

# Build all packages in dependency order
pnpm turbo build
```

---

## Required File Structure

Every new component must produce **exactly five files**:

```
packages/ui/src/components/<ComponentName>/
├── <ComponentName>.tsx          ← Component logic + TypeScript interfaces
├── <ComponentName>.module.css   ← CSS Module (tokens only, no hardcoded values)
├── <ComponentName>.stories.tsx  ← Storybook CSF3 stories (autodocs required)
├── <ComponentName>.test.tsx     ← Vitest + RTL unit tests
└── index.ts                     ← Re-export barrel file
```

No additional files. No subdirectories inside the component folder.

---

## Step-by-Step Instructions

### STEP 1: Create Directory

```
packages/ui/src/components/<ComponentName>/
```

All filenames use the exact PascalCase component name.

---

### STEP 2: Write `<ComponentName>.tsx`

Follow this exact structure:

```tsx
// "use client";  ← Add only if using hooks, events, or Radix primitives

import type { HTMLAttributes, ReactNode } from "react";
import styles from "./<ComponentName>.module.css";

// ─── Types (exported) ──────────────────────────────────────────────────────────
export type ComponentNameVariant = "primary" | "secondary";
export type ComponentNameSize = "sm" | "md" | "lg";

// ─── Props interface (exported) ───────────────────────────────────────────────
export interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the component */
  variant?: ComponentNameVariant;
  /** Size of the component */
  size?: ComponentNameSize;
  children?: ReactNode;
}

// ─── Sub-components (if compound pattern) ─────────────────────────────────────
function ComponentNameHeader({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.header, className ?? ""].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
ComponentNameHeader.displayName = "ComponentName.Header";

// ─── Main component ────────────────────────────────────────────────────────────
/**
 * ComponentName — brief one-line description.
 *
 * @example
 * <ComponentName variant="primary" size="md">Content</ComponentName>
 */
export function ComponentName({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ComponentNameProps) {
  const classNames = [
    styles.componentName,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
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

// Attach sub-components (compound pattern only)
ComponentName.Header = ComponentNameHeader;
```

**Critical rules for this file:**
- `export type` for all TypeScript unions and interfaces.
- Named export function — **never** `export default`.
- JSDoc comment with `@example` block on the main function.
- Class name assembly: array → filter(Boolean) → join(" ").
- `forwardRef` required for `<input>`, `<button>`, `<textarea>`, `<a>` wrappers.
- Sub-components defined **before** the main function.
- `displayName` set on every sub-component.

---

### STEP 3: Write `<ComponentName>.module.css`

```css
/* =====================================================
   ComponentName — CSS Module
   All values reference design tokens via CSS variables.
   ===================================================== */

.componentName {
  /* Layout */
  display: inline-flex;
  align-items: center;

  /* Typography */
  font-family: var(--font-family-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);

  /* Shape */
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);

  /* Transitions */
  transition: background-color var(--transition-base), border-color var(--transition-base);

  /* Focus ring (mandatory for all interactive elements) */
  &:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-focus-ring);
  }
}

/* =====================================================
   SIZES
   ===================================================== */

.size-sm { padding: var(--spacing-1) var(--spacing-3); font-size: var(--font-size-xs); }
.size-md { padding: var(--spacing-2) var(--spacing-4); font-size: var(--font-size-sm); }
.size-lg { padding: var(--spacing-3) var(--spacing-6); font-size: var(--font-size-md); }

/* =====================================================
   VARIANTS
   ===================================================== */

.variant-primary {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);

  &:hover:not(:disabled) { background-color: var(--color-primary-hover); }
  &:active:not(:disabled) { background-color: var(--color-primary-active); }
}

.variant-secondary {
  background-color: var(--color-bg-subtle);
  color: var(--color-text);

  &:hover:not(:disabled) { background-color: var(--color-border); }
}
```

**Critical rules for this file:**
- Zero hardcoded hex colors, raw pixel values, or magic numbers.
- Border is always `1px solid var(--color-border)` (or semantic variant).
- Focus ring is `box-shadow: 0 0 0 2px var(--color-focus-ring)`.
- Use CSS nesting (`&`) for state variants.
- No `!important` anywhere.
- No `:global(...)` selectors.
- Use section comment blocks for organization.

**Required border radius by element type:**

| Element | Token |
|---|---|
| Button | `var(--radius-full)` |
| Input | `var(--radius-md)` |
| Card | `var(--radius-lg)` |
| Modal | `var(--radius-xl)` |
| Toast | `var(--radius-lg)` |
| Badge | `var(--radius-full)` or `var(--radius-sm)` |

---

### STEP 4: Write `index.ts`

```typescript
export * from "./ComponentName";
```

That is the entire file. No other content.

---

### STEP 5: Write `<ComponentName>.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "@xectec/ui";  // ← Package alias, NOT relative

const meta: Meta<typeof ComponentName> = {
  title: "Components/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],                          // ← REQUIRED
  parameters: {
    docs: {
      description: {
        component: "One paragraph description of what ComponentName does and when to use it.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// ─── Default story (drives Controls panel) ────────────────────────────────────
export const Default: Story = {
  args: {
    children: "Label",
    variant: "primary",
    size: "md",
  },
};

// ─── All Variants ─────────────────────────────────────────────────────────────
export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)", alignItems: "center" }}>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
    </div>
  ),
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)", alignItems: "center" }}>
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};
```

**Mandatory stories for every component:**
1. `Default` — args-based (Controls panel must work).
2. `AllVariants` — All variant values side-by-side.
3. `AllSizes` — All size values side-by-side (if sizes exist).
4. `Disabled` — Disabled state (if applicable).
5. Any special states: `Loading`, `Error`, `Success`, etc.

**Controlled components** (Modal, Dropdown, etc.) need a local wrapper with `useState`:
```tsx
function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <ComponentName open={open} onClose={() => setOpen(false)} />
    </>
  );
}
export const Default: Story = { render: () => <Demo /> };
```

**Context-dependent components** (useToast, etc.) need a decorator:
```tsx
const meta: Meta = {
  decorators: [(Story) => <ProviderComponent><Story /></ProviderComponent>],
};
```

---

### STEP 6: Write `<ComponentName>.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ComponentName } from "./ComponentName";  // ← Direct import (not package)

describe("ComponentName", () => {
  // ─── Rendering ────────────────────────────────────────────────────────────
  it("renders with default props", () => {
    render(<ComponentName>Label</ComponentName>);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  // ─── CSS Class Application ────────────────────────────────────────────────
  it("applies default variant class", () => {
    render(<ComponentName>x</ComponentName>);
    expect(screen.getByText("x").closest("[class]")?.className).toContain("variant-primary");
  });

  it("applies correct variant class when set", () => {
    render(<ComponentName variant="secondary">x</ComponentName>);
    expect(screen.getByText("x").closest("[class]")?.className).toContain("variant-secondary");
  });

  it("applies correct size class", () => {
    render(<ComponentName size="lg">x</ComponentName>);
    expect(screen.getByText("x").closest("[class]")?.className).toContain("size-lg");
  });

  // ─── Events ───────────────────────────────────────────────────────────────
  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ComponentName onClick={onClick}>Click me</ComponentName>);
    await user.click(screen.getByText("Click me"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  // ─── Disabled State ───────────────────────────────────────────────────────
  it("is disabled when disabled prop is set", () => {
    render(<ComponentName disabled>Disabled</ComponentName>);
    // Assert based on the actual disabled implementation
    expect(screen.getByText("Disabled").closest("[class]")).toBeTruthy();
  });

  // ─── Accessibility ────────────────────────────────────────────────────────
  it("has correct aria attributes", () => {
    render(<ComponentName aria-label="Custom label">x</ComponentName>);
    expect(screen.getByLabelText("Custom label")).toBeInTheDocument();
  });
});
```

**Required test categories:**
1. Renders without crashing with default props.
2. Default variant/size CSS class is applied.
3. Each variant applies its CSS class correctly.
4. Each size applies its CSS class correctly.
5. Event handlers fire correctly.
6. Disabled state: events do NOT fire, correct attributes set.
7. ARIA attributes are present and correct.
8. Children render correctly.
9. Ref forwarding (if `forwardRef` used).

---

### STEP 7: Register in Package Index

**File to edit:** `packages/ui/src/index.ts`

Add these lines (maintain alphabetical order):

```typescript
export { ComponentName } from "./components/ComponentName/index.js";
export type {
  ComponentNameProps,
  ComponentNameVariant,
  ComponentNameSize,
} from "./components/ComponentName/index.js";
```

Note the `.js` extension on the import path — this is required for ESM output.

---

### STEP 8: Validate

Run these commands in order. Fix all errors before proceeding.

```bash
# 1. Type check
pnpm --filter=@xectec/ui typecheck
pnpm --filter=storybook typecheck

# 2. Lint
pnpm --filter=@xectec/ui lint

# 3. Tests
pnpm --filter=@xectec/ui test

# 4. Build
pnpm --filter=@xectec/ui build

# 5. Storybook smoke test (manual)
pnpm --filter=storybook dev
# → Open http://localhost:6006
# → Verify: sidebar shows Components/ComponentName
# → Verify: Docs tab renders correctly
# → Verify: Controls panel works on Default story
# → Verify: Accessibility tab shows no violations
# → Verify: Light and Dark themes both render correctly
```

---

### STEP 9: Publish

```bash
# Bump version in packages/ui/package.json (SemVer)
# Minor bump for new components: 0.1.x → 0.2.0

pnpm --filter=@xectec/ui build
pnpm --filter=@xectec/ui publish --no-git-checks
```

---

## Token Quick Reference

Use these CSS variables in `.module.css` files. Never hardcode values.

### Colors — Semantic

| Variable | Use |
|---|---|
| `var(--color-primary)` | Primary blue (#2563eb) |
| `var(--color-primary-hover)` | Primary hover state |
| `var(--color-primary-active)` | Primary active/pressed |
| `var(--color-primary-subtle)` | Light tinted background |
| `var(--color-primary-foreground)` | White text on primary bg |
| `var(--color-error)` | Error/danger (rose) |
| `var(--color-success)` | Success (emerald) |
| `var(--color-warning)` | Warning (amber) |
| `var(--color-bg)` | Page background |
| `var(--color-bg-elevated)` | Surface background (white) |
| `var(--color-bg-subtle)` | Tinted surface |
| `var(--color-border)` | Default border |
| `var(--color-border-strong)` | Emphasized border |
| `var(--color-text)` | Primary body text |
| `var(--color-text-secondary)` | Muted/secondary text |
| `var(--color-text-disabled)` | Disabled text |
| `var(--color-focus-ring)` | Focus ring color |

### Spacing

| Variable | Value |
|---|---|
| `var(--spacing-1)` | `0.25rem` / 4px |
| `var(--spacing-2)` | `0.5rem` / 8px |
| `var(--spacing-3)` | `0.75rem` / 12px |
| `var(--spacing-4)` | `1rem` / 16px |
| `var(--spacing-5)` | `1.25rem` / 20px |
| `var(--spacing-6)` | `1.5rem` / 24px |
| `var(--spacing-8)` | `2rem` / 32px |

### Border Radius

| Variable | Value |
|---|---|
| `var(--radius-sm)` | `0.25rem` / 4px |
| `var(--radius-md)` | `0.375rem` / 6px |
| `var(--radius-lg)` | `0.5rem` / 8px |
| `var(--radius-xl)` | `0.75rem` / 12px |
| `var(--radius-full)` | `9999px` |

### Typography

| Variable | Value |
|---|---|
| `var(--font-family-sans)` | Inter, system fonts |
| `var(--font-size-xs)` | `0.75rem` / 12px |
| `var(--font-size-sm)` | `0.875rem` / 14px |
| `var(--font-size-md)` | `1rem` / 16px |
| `var(--font-weight-medium)` | `500` |
| `var(--font-weight-semibold)` | `600` |
| `var(--font-weight-bold)` | `700` |
| `var(--line-height-normal)` | `1.5` |

### Shadows

| Variable | Use |
|---|---|
| `var(--shadow-xs)` | Subtle (default buttons) |
| `var(--shadow-sm)` | Raised cards |
| `var(--shadow-md)` | Floating cards |
| `var(--shadow-lg)` | Toasts |
| `var(--shadow-xl)` | Modals |

### Transitions

| Variable | Value |
|---|---|
| `var(--transition-fast)` | `100ms ease` |
| `var(--transition-base)` | `150ms ease` |
| `var(--transition-slow)` | `300ms ease` |
| `var(--transition-spring)` | `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` |

---

## Common Patterns

### Using Radix UI Primitives

Use Radix when the component needs: focus trapping, ARIA management, keyboard navigation, portal rendering.

```bash
# Install from repo root
pnpm --filter=@xectec/ui add @radix-ui/react-<primitive>
```

Common Radix packages in use:
- `@radix-ui/react-dialog` — Modal
- `@radix-ui/react-toast` — Toast
- `@radix-ui/react-visually-hidden` — Screen reader only content
- Next: `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`, `@radix-ui/react-tabs`

### Class Name Pattern

Always use this exact array-filter-join pattern:
```typescript
const classNames = [
  styles.root,
  styles[`variant-${variant}`],
  styles[`size-${size}`],
  isActive ? styles.active : "",
  className ?? "",
].filter(Boolean).join(" ");
```

### `useId()` for Accessible IDs

For components with labels and associated elements:
```typescript
import { useId } from "react";

const generatedId = useId();
const id = idProp ?? generatedId;
const helperId = `${id}-helper`;
const errorId = `${id}-error`;
```

### Sub-component Display Names

```typescript
ComponentName.Header.displayName = "ComponentName.Header";
ComponentName.Body.displayName = "ComponentName.Body";
ComponentName.Footer.displayName = "ComponentName.Footer";
```

---

## Anti-Patterns to Reject

If you see any of these in a component, flag them as violations:

```typescript
// ❌ Default export
export default function Badge() {}

// ❌ Relative import in stories  
import { Badge } from "./Badge";     // should be "@xectec/ui"

// ❌ Hardcoded color in CSS
.badge { background-color: #2563eb; }

// ❌ Raw px values (except 1px borders)
.badge { padding: 4px 12px; }

// ❌ !important
.badge { color: white !important; }

// ❌ fireEvent for interactions in tests
fireEvent.click(element);   // use userEvent instead

// ❌ any type
function Badge(props: any) {}

// ❌ Missing tags: ["autodocs"] in stories meta
const meta: Meta = { title: "Components/Badge", component: Badge };

// ❌ Missing JSDoc on props
export interface BadgeProps { variant: BadgeVariant; }  // no JSDoc comment

// ❌ Global selector in CSS module
:global(.badge-active) { }
```

---

## Reference Files

| Purpose | File |
|---|---|
| Standards and rules | [`COMPONENT_STANDARDS.md`](../../COMPONENT_STANDARDS.md) |
| Storybook documentation | [`STORYBOOK.md`](../../STORYBOOK.md) |
| Token CSS variables | [`packages/tokens/src/tokens.css`](../../packages/tokens/src/tokens.css) |
| Token JS object | [`packages/tokens/src/tokens.ts`](../../packages/tokens/src/tokens.ts) |
| Package public API | [`packages/ui/src/index.ts`](../../packages/ui/src/index.ts) |
| Storybook main config | [`apps/storybook/.storybook/main.ts`](../../apps/storybook/.storybook/main.ts) |
| Storybook preview | [`apps/storybook/.storybook/preview.tsx`](../../apps/storybook/.storybook/preview.tsx) |
| Button (reference impl) | [`packages/ui/src/components/Button/`](../../packages/ui/src/components/Button/) |
| Modal (Radix impl) | [`packages/ui/src/components/Modal/`](../../packages/ui/src/components/Modal/) |
| Toast (Context impl) | [`packages/ui/src/components/Toast/`](../../packages/ui/src/components/Toast/) |

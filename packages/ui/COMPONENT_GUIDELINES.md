# Component Development Standards & Guidelines

This document outlines the rules and conventions for creating new React components inside the `@xectec/ui` library. Adherence to these guidelines ensures clean, type-safe, accessible, and visual-design-consistent components that match enterprise production quality.

---

## 1. Directory Structure

Every component must live in its own directory under `packages/ui/src/components/<ComponentName>/` with the following files:

```
ComponentName/
├── ComponentName.tsx        # React Component Implementation
├── ComponentName.module.css # Component-specific styles (CSS Module)
├── ComponentName.stories.tsx# Storybook CSF3 stories
├── ComponentName.test.tsx   # Vitest + React Testing Library tests
└── index.ts                 # Direct entry export file
```

### index.ts Convention
Each index file should only contain clean exports:
```typescript
export * from "./ComponentName";
```

---

## 2. Visual Style & Styling Rules (Shadcn UI Style)

To match modern, minimalist aesthetics (Shadcn UI style) while respecting our core branding design tokens, follow these guidelines:

1. **CSS Modules**: All styling must be written in a local `ComponentName.module.css` file. Global styling declarations or inline styles are prohibited unless mapping dynamic overrides.
2. **Design Tokens**: All colors, spaces, shadows, transitions, and radii must reference the global CSS variable tokens from `@xectec/tokens/tokens.css` (e.g., `var(--color-primary)`, `var(--spacing-4)`).
3. **Borders**: All borders must be a crisp `1px` width:
   ```css
   border: 1px solid var(--color-border);
   ```
4. **Border Radii**: Prefer smoother, less boxy shapes for a modern UI/UX:
   - **Buttons**: Should be fully rounded/pill-shaped using `var(--radius-full)` (9999px) for a modern, sleek appearance.
   - **Input Wrappers**: Use `var(--radius-lg)` (8px) for distinct, slightly rounded borders.
   - **Structural Blocks (Cards, Modals, Toasts)**: Use `var(--radius-xl)` (12px) to give containers a friendly, professional, non-boxy presence.
   - Avoid generic, sharp profiles except for full structural circles.
5. **No Decorative Boundaries**: Do not divide subcomponents (like Headers or Footers in Cards/Dialogs) with top/bottom border lines unless explicitly requested. Let content breathe naturally.
6. **Focus Ring Styles**: Always configure visible focus states:
   ```css
   &:focus-visible {
     outline: none;
     border-color: var(--color-primary);
     box-shadow: 0 0 0 2px var(--color-focus-ring);
   }
   ```

---

## 3. Accessibility (a11y) Requirements

All components must build with accessibility as a core feature:

1. **Radix Primitives**: Use Radix UI primitives for compound or complex interactive widgets (such as Dropdowns, Modals, Tabs, Tooltips, Toasts) to provide keyboard focus-trapping, ARIA management, and keyboard navigation.
2. **Keyboard Focusable**: All interactive elements must be focusable via `Tab` key navigation and support standard activation triggers (`Enter` or `Space` key).
3. **Semantic HTML**: Use semantic HTML elements (e.g., `<button>` for buttons, `<dialog>` or proper ARIA containers for modals, `aria-live` regions for status updates).
4. **WAI-ARIA Compliance**: Ensure all controls have explicit descriptive labels (like `aria-label` or `htmlFor` mappings for input elements).

---

## 4. Storybook Guidelines (CSF3)

Every component must have visual documentation in Storybook using the **Component Story Format 3 (CSF3)**:

1. **Autodocs**: Add `tags: ["autodocs"]` to the meta configuration to generate the autodocs tab.
2. **Control Types**: Document and structure `argTypes` so developers can play with options in the controls grid.
3. **Responsive Testing**: Viewports are configured globally. Test your components across the mobile, tablet, and desktop breakpoints.
4. **Theme Testing**: Verify your component styling remains legible in both **Light** and **Dark** modes using the toolbar theme toggle.

Example CSF3 Structure:
```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    children: "Label Text",
    variant: "primary",
  },
};
```

---

## 5. Testing Requirements

Write robust unit tests in `ComponentName.test.tsx` using **Vitest** and **React Testing Library**:

1. **Verify Default Rendering**: Test that the component mounts with default props correctly.
2. **Behavioral States**: Test user actions (clicks, changes, keyboard submissions) using `@testing-library/user-event`.
3. **Focus Verification**: Verify the element behaves correctly when receiving focus and tab key navigation sequences.
4. **Redeclarations Avoidance**: Do not name private helper components using the same identifier as exported interfaces to prevent ESLint name collision warnings.

---

## 6. Monorepo Export Guidelines

Once your component is ready:
1. Export it from the main UI index: `packages/ui/src/index.ts`.
2. Verify all files pass linting and typechecking before committing:
   ```bash
   pnpm lint
   pnpm --filter=storybook typecheck
   ```

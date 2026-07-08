# About Xectec Design System Packages

The Xectec Design System is built as a **monorepo** consisting of two main core packages under `packages/` and a documentation playground under `apps/`.

---

## 🎨 1. `@xectec/tokens` (Design Tokens)

The tokens package serves as the **single source of truth** for all visual styles across Xectec products. It holds variables for colors, typography, margins/spacing, corner rounding, and elevations.

### Key Contents
* **`src/tokens.css`**: Holds all CSS Custom Properties (CSS variables) for light and dark modes. Dark mode is mapped dynamically under the `[data-theme="dark"]` attribute selector.
* **`src/tokens.ts`**: Holds a type-safe TypeScript object containing the same design values, allowing autocomplete and validation in JavaScript code (such as charting configurations or canvas painting).

### Build Outputs (`dist/`)
* **`dist/index.js`**: ESM bundle of the token JavaScript objects.
* **`dist/index.cjs`**: CommonJS bundle of the token JavaScript objects.
* **`dist/index.d.ts`**: TypeScript declaration entrypoint.

---

## 🧩 2. `@xectec/ui` (React Component Library)

The component library provides highly polished, accessible, and responsive interface components built on top of **Radix UI Primitives** and styled via **CSS Modules**.

### Available Components
1. **`Button`**: Highly responsive interactive trigger supporting variants (`primary`, `secondary`, `danger`, `ghost`, `outline`), sizes (`sm`, `md`, `lg`), disabled state, custom left/right icons, full-width support, and a busy/loading spinner.
2. **`Input`**: A text field wrapping supporting labels, optional requirement indicators (`*`), validation states (`success`, `error`), warning icons, helper texts, and custom left/right slots.
3. **`Modal`**: Fully accessible dialog panel utilizing **Radix UI Dialog** (focus trapping, backdrop overlays, and Esc-key closes out of the box).
4. **`Toast`**: A notification toast manager utilizing **Radix UI Toast** (info, success, warning, and error toast levels built via dynamic hook context).
5. **`Card`**: Surface panels supporting shadow elevation presets (`flat`, `raised`, `floating`), border variations, and layout structure (`Card.Header`, `Card.Body`, `Card.Footer`).

### Build Outputs (`dist/`)
* **`dist/index.js`**: ESM distribution for modern bundlers supporting tree-shaking.
* **`dist/index.cjs`**: CommonJS distribution for node environments.
* **`dist/index.d.ts`**: Fully compiled declaration types.
* **`dist/styles.css`**: Compiled CSS modules bundle.

---

## 🛠️ Monorepo Tooling

* **pnpm Workspaces**: Manages local dependency mapping efficiently without duplicate files.
* **Turborepo**: Caches compile times, tests, and builds pipelines to accelerate developer workflows.
* **Vitest**: Runs fast Jest-compatible unit tests natively in Vite.
* **Storybook 8**: Serves as the interactive documentation playground and visual testing tool.

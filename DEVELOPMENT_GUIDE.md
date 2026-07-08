# Developer Guide: From Component Development to Publishing

This guide provides a step-by-step walkthrough for setting up your local environment, developing a new UI component, documenting it, and publishing it to a package registry in the Xectec Design System.

---

## Part 1: Setting Up the Development Workspace

Before starting, ensure you have **Node.js** (>= 18.0.0) and **pnpm** (>= 9.0.0) installed.

### Step 1.1: Clone and Install Dependencies
1. Clone the repository to your local machine.
2. Open a terminal at the project root and run:
   ```bash
   pnpm install
   ```
   This will bootstrap the workspace and link packages (`@xectec/tokens` and `@xectec/ui`) inside `node_modules`.

### Step 1.2: Launch the Development Servers
Run the turbo dev runner to watch for TS/CSS changes and launch Storybook:
```bash
pnpm dev
```
Storybook will open automatically at [http://localhost:6006](http://localhost:6006).

---

## Part 2: Developing a New Component

Let's walk through creating a new component (e.g., `Badge`).

### Step 2.1: Create the Component Directory
Under `packages/ui/src/components/`, create a new folder named `Badge/` containing 5 files:

```bash
cd packages/ui/src/components
mkdir Badge
cd Badge
touch Badge.tsx Badge.module.css Badge.stories.tsx Badge.test.tsx index.ts
```

### Step 2.2: Implement Component Logic (`Badge.tsx`)
Create a semantic, accessible component:
```typescript
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

export type BadgeVariant = "default" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant = "default", className, children, ...rest }: BadgeProps) {
  const classNames = [
    styles.badge,
    styles[`variant-${variant}`],
    className ?? ""
  ].filter(Boolean).join(" ");

  return (
    <span className={classNames} {...rest}>
      {children}
    </span>
  );
}
```

### Step 2.3: Write Component Styling (`Badge.module.css`)
Style the component using CSS variables from `@xectec/tokens`, utilizing 1px borders and smooth corner radius tags (consistent with Shadcn UI aesthetics):
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-0-5) var(--spacing-2-5);
  font-family: var(--font-family-sans);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  border-radius: var(--radius-full); /* pill style */
  border: 1px solid transparent;
  white-space: nowrap;
}

.variant-default {
  background-color: var(--color-bg-subtle);
  border-color: var(--color-border);
  color: var(--color-text);
}

.variant-success {
  background-color: var(--color-success-subtle);
  border-color: rgba(16, 185, 129, 0.2);
  color: var(--color-success);
}

.variant-warning {
  background-color: var(--color-warning-subtle);
  border-color: rgba(245, 158, 11, 0.2);
  color: var(--color-warning);
}

.variant-danger {
  background-color: var(--color-error-subtle);
  border-color: rgba(244, 63, 94, 0.2);
  color: var(--color-error);
}
```

### Step 2.4: Export Component (`index.ts`)
1. In `packages/ui/src/components/Badge/index.ts`, add:
   ```typescript
   export * from "./Badge";
   ```
2. Export it from the package entry point `packages/ui/src/index.ts`:
   ```typescript
   export * from "./components/Badge";
   ```

---

## Part 3: Creating Stories & Testing

### Step 3.1: Document in Storybook (`Badge.stories.tsx`)
Create interactive CSF3 story definitions for documentation:
```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@xectec/ui";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
};
```

### Step 3.2: Write Unit Tests (`Badge.test.tsx`)
Create a Vitest test suite to cover rendering and class assignment:
```typescript
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge component", () => {
  it("renders correctly with children", () => {
    render(<Badge>Beta</Badge>);
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    expect(container.firstChild).toHaveClass(/variant-success/);
  });
});
```

---

## Part 4: Code Quality & Verification

Before publishing, ensure all tests, lint configurations, and compiler typechecks pass.

### Step 4.1: Run Unit Tests
Run Vitest to verify all components compile and pass criteria:
```bash
pnpm test
```

### Step 4.2: Lint Files
Verify ESLint contains zero formatting or code errors:
```bash
pnpm lint
```

### Step 4.3: Typecheck Storybook
Compile type definitions to verify story code is type-safe:
```bash
pnpm --filter=storybook typecheck
```

---

## Part 5: Bumping Version and Compiling

To distribute your changes, you must bump the package version and compile package assets.

### Step 5.1: Bump Package Version
Open `packages/ui/package.json` (and `packages/tokens/package.json` if design tokens changed) and update the version field:
```json
{
  "name": "@xectec/ui",
  "version": "0.1.4" // Bump appropriately (SemVer: major.minor.patch)
}
```
*Note: If `@xectec/ui` relies on a newly updated `@xectec/tokens`, make sure to update tokens version reference in ui package dependencies as well.*

### Step 5.2: Compile the Production Bundles
Build all design system packages into production-ready ES Modules/CommonJS output:
```bash
pnpm build
```
This updates output code files in `packages/ui/dist` and `packages/tokens/dist`.

---

## Part 6: Publishing to registry

Publishing pushes compiled packages (`dist` folders) to your NPM registry.

### Step 6.1: Login to the NPM Registry (First time only)
In your terminal, authenticate with the registry:
```bash
npm login
```
*(If using private registries like AWS CodeArtifact or GitHub Packages, follow your organization's specific authentication token configuration).*

### Step 6.2: Publish the Packages
Navigate to the directory of the package you want to publish and execute:
```bash
# To publish tokens package:
cd packages/tokens
pnpm publish --access public

# To publish components package:
cd ../ui
pnpm publish --access public
```
*Tip: `--access public` is required if your scope is public. If scopes are private, you can configure `.npmrc` registry publishing limits.*

### Step 6.3: Clean Git Working Directory
Verify all changes are checked into control management:
```bash
git add .
git commit -m "feat(ui): add badge component, standard configurations and guidelines"
git push origin main
```

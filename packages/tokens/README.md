# @xectec/tokens

Centralized design token variables for the Xectec Design System. Contains styling configuration for colors, typography, spacing, elevations, and transition timing.

Available as:
- CSS Custom Properties (CSS variables) for stylesheet styling.
- Type-safe JavaScript variables for canvas rendering, charting libraries, or custom JS/TS usage.

## Installation

```bash
npm install @xectec/tokens
# Or:
pnpm add @xectec/tokens
```

## Usage

### 1. CSS Custom Properties

Import the styling file in your application's root entrypoint:
```javascript
import '@xectec/tokens/tokens.css';
```

Now you can use these custom properties in any stylesheet:
```css
.custom-panel {
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
}
```

### 2. JavaScript / TypeScript

Import type-safe JSON-like objects containing token values:
```typescript
import { tokens } from '@xectec/tokens';

const chartPrimaryColor = tokens.colors.primary[500];
const bodyFontSize = tokens.typography.fontSize.md;
```

---

## Available Token Groups

### Colors
- `primary`: Core theme colors
- `secondary`: Secondary theme actions
- `success`: Success alerts and indicators
- `warning`: Warning states
- `error`: Destructive actions and alerts
- `neutral`: Grays, background panels, borders, text colors

### Typography
- Font Families: `sans`, `mono`
- Font Sizes: `2xs` through `5xl`
- Font Weights: `light`, `regular`, `semibold`, `bold`, etc.
- Line Heights

### Spacing & Layout
- Spacing: Core spacer values (`0` to `24`, and responsive aliases `xs`, `sm`, `md`, `lg`, `xl`)
- Corner Radius: `none`, `xs` to `3xl`, and `full`
- Elevation Shadows: `xs` to `2xl`, and `inner`
- Z-Index layers: `modal`, `overlay`, `toast`, etc.
- Transitions: speed and spring easing presets

### Component-Level Semantic Tokens & Layout Spacing
- `components.button`: Sized paddings (`sm`/`md`/`lg`), colors, gaps, margins, and borders.
- `components.input`: Padding sizing, colors, state indicators, and focus rings.
- `components.card`: Dynamic padding levels, background surface, and elevation overlays.
- `components.modal`: Overlay background, padding options, and shadow elevations.
- `components.toast`: Variant configurations, icon spacing, border colors.
- `components.sidebar` & `components.header`: Layout width, height, backgrounds.
- `components.element`: General responsive padding, margin, and gap utility scales.

---

## 📖 Discovery & Documentation
Run `pnpm storybook` inside this repository to launch the interactive documentation page. Under **Design System/Design Tokens**, you will find visual swatches, sizes, layout spacing tables, and interactive variables listings.


# @xectec/ui

Xectec company-wide reusable React component library built on top of Radix UI and Tailwind design tokens.

## Installation

```bash
npm install @xectec/ui @xectec/tokens
# Or:
pnpm add @xectec/ui @xectec/tokens
```

## Styling Setup

Make sure to import the CSS variables and component CSS files at the root entry point of your project:

```javascript
// Import design tokens first (sets up all design token CSS variables)
import '@xectec/tokens/tokens.css';

// Import component styling
import '@xectec/ui/styles.css';
```

---

## Component Usage

### Button
Interactive button supporting variants, sizes, loading indicators, and icons.

```typescript
import { Button } from '@xectec/ui';

function Example() {
  return (
    <Button variant="primary" size="md" onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  );
}
```

### Input
Form input with built-in validation states, helper text, and icons.

```typescript
import { Input } from '@xectec/ui';

function Example() {
  return (
    <Input
      label="Username"
      placeholder="Enter username"
      errorMessage="Username is already taken"
      isRequired
    />
  );
}
```

### Modal
Fully accessible overlay dialog based on Radix UI Dialog.

```typescript
import { useState } from 'react';
import { Modal, Button } from '@xectec/ui';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm action"
        footer={<Button onClick={() => setIsOpen(false)}>Close</Button>}
      >
        Are you sure you want to proceed with this task?
      </Modal>
    </>
  );
}
```

### Card
Flexible surface container with shadow elevation levels, padding options, and structured layouts.

```typescript
import { Card } from '@xectec/ui';

function Example() {
  return (
    <Card elevation="raised" bordered>
      <Card.Header>
        <h3>Card Title</h3>
      </Card.Header>
      <Card.Body>
        <p>Main content inside body...</p>
      </Card.Body>
      <Card.Footer>
        <span>Footer details</span>
      </Card.Footer>
    </Card>
  );
}
```

### Toast (Notifications)
Rich toast alerts powered by Radix UI Toast. Wrap your root tree with `ToastProvider` and trigger notifications via `useToast` hook.

```typescript
import { ToastProvider, useToast, Button } from '@xectec/ui';

function InnerApp() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({ variant: 'success', title: 'Successfully saved!' })}>
      Show Notification
    </Button>
  );
}

function App() {
  return (
    <ToastProvider>
      <InnerApp />
    </ToastProvider>
  );
}
```

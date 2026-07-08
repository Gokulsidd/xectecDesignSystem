import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@xectec/ui";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The primary interactive element. Supports 5 variants, 3 sizes, loading state, disabled state, and left/right icons.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "outline", "danger"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Button size",
    },
    isLoading: {
      control: "boolean",
      description: "Shows a spinner and disables interaction",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    fullWidth: {
      control: "boolean",
      description: "Makes the button fill container width",
    },
    children: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* =====================================================
   Stories
   ===================================================== */

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)", alignItems: "center" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: "Saving...",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const WithIcons: Story = {
  name: "With Icons",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)", alignItems: "center" }}>
      <Button
        leftIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        Upload
      </Button>
      <Button
        variant="outline"
        rightIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        Next
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  name: "Full Width",
  render: () => (
    <div style={{ maxWidth: "24rem" }}>
      <Button fullWidth>Full Width Button</Button>
    </div>
  ),
};

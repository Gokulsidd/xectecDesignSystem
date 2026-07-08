import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast, Button } from "@xectec/ui";

const meta: Meta = {
  title: "Components/Toast",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Toast notifications built on Radix UI Toast. Supports info, success, warning, and error variants with auto-dismiss and swipe-to-dismiss.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ToastDemo() {
  const { toast } = useToast();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)" }}>
      <Button
        variant="primary"
        onClick={() =>
          toast({
            variant: "info",
            title: "Information",
            description: "Here's some useful information for you.",
          })
        }
      >
        Info Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "success",
            title: "Success!",
            description: "Your changes have been saved successfully.",
          })
        }
      >
        Success Toast
      </Button>
      <Button
        onClick={() =>
          toast({
            variant: "warning",
            title: "Warning",
            description: "Please review your input before continuing.",
          })
        }
        style={{ backgroundColor: "var(--color-warning)", color: "var(--color-warning-foreground)", border: "none", borderRadius: "var(--radius-md)", padding: "0 var(--spacing-4)", height: "2.5rem", cursor: "pointer", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-sm)" }}
      >
        Warning Toast
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            variant: "error",
            title: "Error",
            description: "Something went wrong. Please try again.",
          })
        }
      >
        Error Toast
      </Button>
    </div>
  );
}

export const AllVariants: Story = {
  name: "All Variants",
  render: () => <ToastDemo />,
};

function PersistentToastDemo() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          variant: "info",
          title: "Persistent toast",
          description: "This toast won't auto-dismiss.",
          duration: Infinity,
        })
      }
    >
      Show Persistent Toast
    </Button>
  );
}

export const Persistent: Story = {
  render: () => (
    <ToastProvider>
      <PersistentToastDemo />
    </ToastProvider>
  ),
};

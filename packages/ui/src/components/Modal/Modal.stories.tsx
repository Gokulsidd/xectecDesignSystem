import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal, Button } from "@xectec/ui";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A fully accessible dialog built on Radix UI. Features focus trapping, keyboard navigation (Esc to close), backdrop dismiss, and multiple size options.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

/* Interactive story with open/close */
function ModalDemo({
  size = "md",
  title = "Confirm Action",
  description,
}: {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        size={size}
        {...(description ? { description } : {})}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
          This is the modal body content. You can put any content here — forms, tables, media, or
          other components.
        </p>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const WithDescription: Story = {
  name: "With Description",
  render: () => (
    <ModalDemo
      title="Delete Item"
      description="This action cannot be undone. The item will be permanently removed."
    />
  ),
};

export const SmallSize: Story = {
  name: "Small",
  render: () => <ModalDemo size="sm" title="Confirm" />,
};

export const LargeSize: Story = {
  name: "Large",
  render: () => <ModalDemo size="lg" title="Edit Details" />,
};

export const ExtraLarge: Story = {
  name: "Extra Large",
  render: () => <ModalDemo size="xl" title="Data Preview" />,
};

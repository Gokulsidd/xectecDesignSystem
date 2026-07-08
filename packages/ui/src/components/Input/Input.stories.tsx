import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@xectec/ui";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A text input with label, helper text, validation states (default, success, error), left/right element slots, and full accessibility.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    validationState: {
      control: "select",
      options: ["default", "success", "error"],
    },
    disabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    label: { control: "text" },
    helperText: { control: "text" },
    errorMessage: { control: "text" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email address",
    placeholder: "you@example.com",
    type: "email",
    helperText: "We'll never share your email.",
  },
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", maxWidth: "24rem" }}>
      <Input label="Small" size="sm" placeholder="Small input" />
      <Input label="Medium" size="md" placeholder="Medium input" />
      <Input label="Large" size="lg" placeholder="Large input" />
    </div>
  ),
};

export const ValidationStates: Story = {
  name: "Validation States",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", maxWidth: "24rem" }}>
      <Input label="Default" placeholder="Default state" helperText="Some helpful text here" />
      <Input
        label="Error"
        placeholder="Invalid value"
        errorMessage="This field is required."
        defaultValue="bad@"
      />
      <Input
        label="Success"
        placeholder="Valid value"
        successMessage="Looks good!"
        defaultValue="hello@example.com"
      />
    </div>
  ),
};

export const WithLeftElement: Story = {
  name: "With Left Icon",
  args: {
    label: "Search",
    placeholder: "Search anything...",
    leftElement: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>
    ),
  },
};

export const Required: Story = {
  args: {
    label: "Full name",
    placeholder: "John Doe",
    isRequired: true,
    helperText: "Required for account creation.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    defaultValue: "gokul_user",
    disabled: true,
    helperText: "Username cannot be changed.",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Card, Button } from "@xectec/ui";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A flexible surface container with elevation variants, optional border, interactive hover states, and Header/Body/Footer subcomponents.",
      },
    },
  },
  argTypes: {
    elevation: {
      control: "select",
      options: ["flat", "raised", "floating"],
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
    bordered: { control: "boolean" },
    interactive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    elevation: "raised",
    bordered: true,
    children: "Card content goes here.",
  },
};

export const WithSubcomponents: Story = {
  name: "With Header / Body / Footer",
  render: () => (
    <Card bordered style={{ maxWidth: "24rem" }}>
      <Card.Header>
        <h3>Project Alpha</h3>
      </Card.Header>
      <Card.Body>
        A next-generation platform built for scale. This card demonstrates the Header, Body, and
        Footer subcomponent layout.
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          View Project
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const AllElevations: Story = {
  name: "All Elevations",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-6)" }}>
      <Card elevation="flat" bordered style={{ width: "12rem", padding: "var(--spacing-5)" }}>
        <strong>Flat</strong>
        <p style={{ margin: "var(--spacing-2) 0 0", color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>No shadow</p>
      </Card>
      <Card elevation="raised" bordered style={{ width: "12rem", padding: "var(--spacing-5)" }}>
        <strong>Raised</strong>
        <p style={{ margin: "var(--spacing-2) 0 0", color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>Default shadow</p>
      </Card>
      <Card elevation="floating" bordered style={{ width: "12rem", padding: "var(--spacing-5)" }}>
        <strong>Floating</strong>
        <p style={{ margin: "var(--spacing-2) 0 0", color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>Strong shadow</p>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-4)" }}>
      {["Design System", "Component Library", "Token Architecture"].map((name) => (
        <Card
          key={name}
          interactive
          bordered
          style={{ width: "14rem", cursor: "pointer" }}
        >
          <Card.Header>
            <h3>{name}</h3>
          </Card.Header>
          <Card.Body>Click me — I&apos;m interactive with hover effects.</Card.Body>
        </Card>
      ))}
    </div>
  ),
};

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("variant-primary");
  });

  it("applies correct variant class", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button").className).toContain("variant-danger");
  });

  it("applies size class", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("size-lg");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  it("shows loading state and disables the button", () => {
    render(<Button isLoading>Loading</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders fullWidth class when fullWidth is true", () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByRole("button").className).toContain("fullWidth");
  });

  it("renders left and right icons", () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        With Icons
      </Button>
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("hides icons when loading", () => {
    render(
      <Button
        isLoading
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Loading
      </Button>
    );
    expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
  });
});

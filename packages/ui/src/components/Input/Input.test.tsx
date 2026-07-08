import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders helper text", () => {
    render(<Input label="Email" helperText="We won't share your email" />);
    expect(screen.getByText("We won't share your email")).toBeInTheDocument();
  });

  it("renders error message and sets aria-invalid", () => {
    render(<Input label="Email" errorMessage="Email is required" />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders success message", () => {
    render(<Input label="Email" successMessage="Valid email!" />);
    expect(screen.getByText("Valid email!")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows required indicator when isRequired", () => {
    render(<Input label="Name" isRequired />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("can type into the input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Enter text" />);
    const input = screen.getByRole("textbox");
    await user.type(input, "Hello world");
    expect(input).toHaveValue("Hello world");
  });

  it("forwards ref to the input element", () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

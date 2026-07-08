import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("does not render content when closed", () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("renders content when open", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="My Dialog">
        Content
      </Modal>
    );
    expect(screen.getByText("My Dialog")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Dialog" description="This is a description">
        Content
      </Modal>
    );
    expect(screen.getByText("This is a description")).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Dialog" footer={<button>Confirm</button>}>
        Content
      </Modal>
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Dialog">
        Content
      </Modal>
    );
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });
});

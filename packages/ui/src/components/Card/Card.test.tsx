import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies elevation class", () => {
    const { container } = render(<Card elevation="floating">Content</Card>);
    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain("elevation-floating");
  });

  it("applies bordered class", () => {
    const { container } = render(<Card bordered>Content</Card>);
    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain("bordered");
  });

  it("applies interactive class", () => {
    const { container } = render(<Card interactive>Content</Card>);
    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain("interactive");
  });

  it("renders Card.Header", () => {
    render(
      <Card>
        <Card.Header>
          <h3>Title</h3>
        </Card.Header>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("renders Card.Body", () => {
    render(
      <Card>
        <Card.Body>Body text</Card.Body>
      </Card>
    );
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });

  it("renders Card.Footer", () => {
    render(
      <Card>
        <Card.Footer>
          <button>Action</button>
        </Card.Footer>
      </Card>
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});

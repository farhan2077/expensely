import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrettyJSONFormatter } from "../../libs/formatters";

describe("PrettyJSONFormatter", () => {
  it("renders formatted JSON with correct colors", () => {
    const testData = {
      string: "Hello, world!",
      number: 42,
      boolean: true,
      null: null,
      object: { key: "value" },
      array: [1, 2, 3],
    };

    render(<PrettyJSONFormatter data={testData} />);

    const preElement = screen.getByText((content, element) => {
      return (
        element instanceof HTMLElement &&
        element.tagName.toLowerCase() === "pre" &&
        element.innerHTML.includes("Hello, world!")
      );
    });

    expect(preElement).toBeDefined();

    // Check for correct CSS classes
    expect(preElement.innerHTML).toContain('class="text-red-600">"string"');
    expect(preElement.innerHTML).toContain(
      'class="text-green-600">"Hello, world!"'
    );
    expect(preElement.innerHTML).toContain('class="text-blue-600">42');
    expect(preElement.innerHTML).toContain('class="text-yellow-600">true');
    expect(preElement.innerHTML).toContain('class="text-gray-600">null');
  });

  it("handles empty object", () => {
    render(<PrettyJSONFormatter data={{}} />);
    const preElement = screen.getByText("{}");
    expect(preElement).toBeDefined();
  });

  it("handles empty array", () => {
    render(<PrettyJSONFormatter data={[]} />);
    const preElement = screen.getByText("[]");
    expect(preElement).toBeDefined();
  });
});

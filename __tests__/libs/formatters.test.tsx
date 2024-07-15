import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrettyJSONFormatter, getFormattedDate } from "../../libs/formatters";

describe("-------------------- PrettyJSONFormatter --------------------", () => {
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

describe("-------------------- getFormattedDate --------------------", () => {
  // TODO: test different timezone
  it("should format the date correctly", () => {
    expect(getFormattedDate("2024-07-03 11:43:04")).toBe("3 July 2024");
    expect(getFormattedDate("2023-01-15 09:30:00")).toBe("15 January 2023");
    expect(getFormattedDate("2025-12-31 23:59:59")).toBe("31 December 2025");
  });
});

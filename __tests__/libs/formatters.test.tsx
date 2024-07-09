import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  PrettyJSONFormatter,
  getFormattedDate,
  getRelativeTime,
} from "../../libs/formatters";

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
  describe("getFormattedDate", () => {
    it("should format the date correctly", () => {
      expect(getFormattedDate("2024-07-03 11:43:04")).toBe("3 July 2024");
      expect(getFormattedDate("2023-01-15 09:30:00")).toBe("15 January 2023");
      expect(getFormattedDate("2025-12-31 23:59:59")).toBe("31 December 2025");
    });
  });
});

describe("-------------------- getRelativeTime --------------------", () => {
  const currentDate = new Date();

  it("should return correct relative time", () => {
    let result = getRelativeTime(currentDate.toString());
    expect(result).toBe("a few seconds ago");

    const oneMinBefore = new Date(currentDate.getTime() - 1 * 60 * 1000);
    let result2 = getRelativeTime(oneMinBefore.toString());
    expect(result2).toBe("a minute ago");

    const twoMinBefore = new Date(currentDate.getTime() - 2 * 60 * 1000);
    let result3 = getRelativeTime(twoMinBefore.toString());
    expect(result3).toBe("2 minutes ago");

    const oneHourBefore = new Date(currentDate.getTime() - 1 * 60 * 60 * 1000);
    let resul4 = getRelativeTime(oneHourBefore.toString());
    expect(resul4).toBe("an hour ago");

    const oneDayBefore = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    let result4 = getRelativeTime(oneDayBefore.toString());
    expect(result4).toBe("a day ago");
  });
});

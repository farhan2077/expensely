/* eslint-disable no-console */

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import {
  cn,
  getFirstName,
  isEmpty,
  isEqual,
  logRuntimeType,
  maskEmail,
} from "../../libs/utils";

describe("-------------------- cn --------------------", () => {
  test("combines class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  test("handles conditional classes", () => {
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
    expect(cn("foo", { bar: false, baz: true })).toBe("foo baz");
  });

  test("merges Tailwind classes", () => {
    expect(cn("px-2 py-1", "px-3")).toBe("py-1 px-3");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  test("handles array input", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
    expect(cn("foo", ["bar", "baz"])).toBe("foo bar baz");
  });

  test("removes falsy values", () => {
    expect(cn("foo", null, undefined, false, "bar")).toBe("foo bar");
  });

  test("handles empty input", () => {
    expect(cn()).toBe("");
  });

  test("handles complex Tailwind class merging", () => {
    expect(cn("p-4 m-2", "p-5 px-6")).toBe("m-2 p-5 px-6");
    expect(cn("text-sm font-bold", "text-lg font-normal")).toBe(
      "text-lg font-normal"
    );
  });

  test("handles multiple conditional classes", () => {
    expect(
      cn("base", {
        conditional1: true,
        conditional2: false,
        conditional3: true,
      })
    ).toBe("base conditional1 conditional3");
  });

  test("handles nested arrays", () => {
    expect(cn("foo", ["bar", ["baz", "qux"]])).toBe("foo bar baz qux");
  });

  test("handles mixed input types", () => {
    expect(cn("foo", ["bar", { baz: true, qux: false }], "quux")).toBe(
      "foo bar baz quux"
    );
  });
  test("handles numeric class names", () => {
    expect(cn("p-2", "mt-3", "mb-4")).toBe("p-2 mt-3 mb-4");
  });

  test("handles complex conditional expressions", () => {
    const condition = true;
    expect(cn("base", condition && "active", !condition && "inactive")).toBe(
      "base active"
    );
  });

  test("include repeated class names", () => {
    expect(cn("p-2", "m-4", "p-2")).toBe("m-4 p-2");
    expect(cn("foo", "bar", "foo")).toBe("foo bar foo");
  });

  test("handles whitespace in class names", () => {
    expect(cn("  p-2  ", "  m-4  ")).toBe("p-2 m-4");
  });

  test("handles Tailwind hover and focus classes", () => {
    expect(cn("hover:bg-blue-500", "focus:outline-none")).toBe(
      "hover:bg-blue-500 focus:outline-none"
    );
    expect(cn("hover:bg-blue-500", "hover:bg-red-500")).toBe(
      "hover:bg-red-500"
    );
  });
});

describe("-------------------- isEmpty --------------------", () => {
  test("should return true for empty values", () => {
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty("")).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty([])).toBe(true);
  });

  test("should return false for non-empty values", () => {
    expect(isEmpty("Hello")).toBe(false);
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty({ key: "value" })).toBe(false);
    expect(isEmpty(42)).toBe(false);
    expect(isEmpty(true)).toBe(false);
  });
});

describe("-------------------- logRuntimeType --------------------", () => {
  let originalConsoleLog: typeof console.log;

  beforeAll(() => {
    // Save the original console.log
    originalConsoleLog = console.log;
  });

  beforeEach(() => {
    // Mock console.log before each test
    console.log = vi.fn();
  });

  afterEach(() => {
    // Restore the original console.log after each test
    (console.log as ReturnType<typeof vi.fn>).mockRestore();
  });

  afterAll(() => {
    // Restore the original console.log
    console.log = originalConsoleLog;
  });

  test("should log client message with green color", () => {
    logRuntimeType("client");
    expect(console.log).toHaveBeenCalledWith(
      "%c----- CLIENT -----",
      "color: lightgreen;"
    );
  });

  test("should log server message with blue color", () => {
    logRuntimeType("server");
    expect(console.log).toHaveBeenCalledWith(
      "\x1b[34m%s\x1b[0m",
      "----- SERVER -----"
    );
  });
});

describe("-------------------- isEqual --------------------", () => {
  test("return true both types and values are same", () => {
    expect(isEqual("abcd", "abcd")).toBe(true);
    expect(isEqual("5", "5")).toBe(true);
    expect(isEqual(5, 5)).toBe(true);
  });

  test("return false when types or values are not same", () => {
    expect(isEqual("abcd", "abcde")).toBe(false);
    expect(isEqual("5", "6")).toBe(false);
    // @ts-expect-error
    expect(isEqual("5", 5)).toBe(false);
    // @ts-expect-error
    expect(isEqual("abcd", 5)).toBe(false);
    expect(isEqual(5, 6)).toBe(false);
  });
});

describe("-------------------- getFirstName --------------------", () => {
  test("return first name", () => {
    expect(getFirstName("Farhan Bin Amin")).toBe("Farhan");
  });
});

describe("-------------------- maskEmail --------------------", () => {
  test("should return empty string for empty input", () => {
    const result = maskEmail("");
    expect(result).toBe("");
  });

  test("should return the correct number of asterisks for emails with different lengths", () => {
    expect(maskEmail("John")).toBe("∗∗∗∗");
    expect(maskEmail("ABC")).toBe("∗∗∗");
  });
});

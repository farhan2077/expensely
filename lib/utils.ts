import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmpty(input: any): boolean {
  if (input === undefined || input === null) {
    return true;
  }

  if (typeof input === "object" && Object.keys(input).length === 0) {
    return true;
  }

  if (typeof input === "string" && input.trim().length === 0) {
    return true;
  }

  return false;
}

export function logRuntimeType(type: "client" | "server") {
  if (type === "client") {
    // eslint-disable-next-line no-console
    console.log("%c----- CLIENT -----", "color: lightgreen;");
  }

  if (type === "server") {
    // eslint-disable-next-line no-console
    console.log("\x1b[34m%s\x1b[0m", "----- SERVER -----");
  }
}

import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number into a currency string using Intl.NumberFormat.
 *
 * @param amount - The amount to be formatted.
 * @returns A string representing the formatted currency.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export const typeNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !(
      (e.key >= "0" && e.key <= "9") ||
      e.key === "Backspace" ||
      e.key === "(" ||
      e.key === ")" ||
      e.key === "+" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Tab" ||
      e.key === "Delete" ||
      e.key === "."
    )
  ) {
    e.preventDefault();
  }
};

export function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const randomNum = Math.floor(Math.random() * 1000); // Random number between 0 and 999

  return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${randomNum}`;
}

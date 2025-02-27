import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { isImageKeyExpired, ImageKey } from "../src";

describe("isImageKeyExpired", () => {
  // Store the original Date implementation
  const originalDate = global.Date;

  // Mock date for consistent testing
  beforeEach(() => {
    // Mock current date to 2023-06-15
    const mockDate = new Date(2023, 5, 15);
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  // Restore original Date after tests
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return true for an expired image key", () => {
    // Key with expiration date of 2023-06-14 (yesterday)
    const expiredKey: ImageKey = "abc123_expires_20230614";
    expect(isImageKeyExpired(expiredKey)).toBe(true);
  });

  it("should return false for a non-expired image key", () => {
    // Key with expiration date of 2023-06-16 (tomorrow)
    const validKey: ImageKey = "abc123_expires_20230616";
    expect(isImageKeyExpired(validKey)).toBe(false);
  });

  it("should return false for a key expiring today", () => {
    // Key with expiration date of 2023-06-15 (today)
    const todayKey: ImageKey = "abc123_expires_20230615";
    expect(isImageKeyExpired(todayKey)).toBe(false);
  });

  it("should throw an error for an invalid key format", () => {
    const invalidKey: ImageKey = "abc123";
    expect(() => isImageKeyExpired(invalidKey)).toThrow(
      "Invalid image key format"
    );
  });

  it("should throw an error for an invalid date format", () => {
    const invalidDateKey: ImageKey = "abc123_expires_202306";
    expect(() => isImageKeyExpired(invalidDateKey)).toThrow(
      "Invalid expiration date format"
    );
  });
});

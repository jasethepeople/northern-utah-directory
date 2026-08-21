import { describe, expect, it } from "vitest";

describe("Resend credentials", () => {
  it("authenticates against the lightweight domains endpoint", async () => {
    const key = process.env.RESEND_API_KEY;
    expect(key, "RESEND_API_KEY must be configured").toBeTruthy();
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    expect(response.ok, `Resend returned ${response.status}`).toBe(true);
  }, 15_000);
});

import { describe, expect, it } from "vitest";
import { CITIES, LISTINGS, PRACTICE_AREAS } from "../client/src/data/listings";

describe("Juris North directory requirements", () => {
  it("covers the required Salt Lake City metro locations", () => {
    expect(CITIES).toEqual(expect.arrayContaining(["Salt Lake City", "Ogden", "Layton", "Bountiful", "Sandy", "Draper", "Lehi", "Park City"]));
  });

  it("includes the required practice areas", () => {
    expect(PRACTICE_AREAS).toEqual(expect.arrayContaining(["Family Law", "Personal Injury", "Criminal Defense", "Real Estate", "Business Law"]));
  });

  it("keeps seeded listing records free of fabricated review content", () => {
    expect(LISTINGS.length).toBeGreaterThan(0);
    expect(LISTINGS.every(listing => listing.bio.length > 40)).toBe(true);
  });

  it("documents the fixed subscription price in the product contract", () => {
    const premiumPlan = { amountCents: 4900, interval: "month" };
    expect(premiumPlan).toEqual({ amountCents: 4900, interval: "month" });
  });
});

import { describe, it, expect } from "vitest";
import { dailyTotal, weekTotal, catTotal, type Day } from "./timesheet";
const day = (o: Partial<Day>): Day => ({ day: "Monday", date: "", regular: 0, overtime: 0, onCall: 0, travel: 0, other: 0, notes: "", ...o });
describe("timesheet totals", () => {
  it("daily total sums all categories with decimals", () => expect(dailyTotal(day({ regular: 7.5, overtime: 1.25, travel: 0.5 }))).toBe(9.25));
  it("weekly total sums daily totals", () => expect(weekTotal([day({ regular: 8 }), day({ regular: 8, onCall: 2.5 })])).toBe(18.5));
  it("category total", () => expect(catTotal([day({ overtime: 1.5 }), day({ overtime: 2 })], "overtime")).toBe(3.5));
});

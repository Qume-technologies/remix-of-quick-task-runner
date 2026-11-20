export const CATS = ["regular", "overtime", "onCall", "travel", "other"] as const;
export const CAT_LABELS: Record<(typeof CATS)[number], string> = { regular: "Regular", overtime: "Overtime", onCall: "On-Call", travel: "Travel", other: "Other" };
export type Day = { day: string; date: string; regular: number; overtime: number; onCall: number; travel: number; other: number; notes: string };
export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const dailyTotal = (d: Day) => Math.round(CATS.reduce((s, c) => s + (Number(d[c]) || 0), 0) * 100) / 100;
export const catTotal = (days: Day[], c: (typeof CATS)[number]) => Math.round(days.reduce((s, d) => s + (Number(d[c]) || 0), 0) * 100) / 100;
export const weekTotal = (days: Day[]) => Math.round(days.reduce((s, d) => s + dailyTotal(d), 0) * 100) / 100;
export function weekStart(offset: number, base = new Date("2026-11-15T00:00:00")) { const d = new Date(base); d.setDate(d.getDate() + offset * 7); return d; }
export function makeWeek(start: Date, seed = 0): Day[] {
  return DAYS.map((day, i) => { const d = new Date(start); d.setDate(d.getDate() + i); const work = i > 0 && i < 6;
    return { day, date: d.toISOString().slice(0, 10), regular: work ? 8 : 0, overtime: work && (i + seed) % 3 === 0 ? 1.5 : 0, onCall: i === 6 && seed % 2 ? 4 : 0, travel: work && i % 2 ? 0.5 : 0, other: 0, notes: "" }; });
}
export const fmtRange = (start: Date) => { const e = new Date(start); e.setDate(e.getDate() + 6); const o: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }; return `${start.toLocaleDateString("en-US", o)} – ${e.toLocaleDateString("en-US", o)}`; };

import { NAMES, FACILITIES } from "./modules";
import { makeWeek, weekStart, fmtRange, weekTotal, type Day } from "./timesheet";
export type Sheet = { id: number; employee: string; empId: string; client: string; period: string; status: string; days: Day[]; total: number; comments: string; submitted: string };
const ST = ["Pending", "Approved", "Rejected", "Changes Requested", "Pending", "Approved"];
export const SHEETS: Sheet[] = Array.from({ length: 14 }, (_, i) => { const s = weekStart(-(i % 4) - 1); const days = makeWeek(s, i);
  return { id: i + 1, employee: NAMES[i % NAMES.length], empId: `SMH-${1040 + i}`, client: FACILITIES[i % FACILITIES.length], period: fmtRange(s), status: ST[i % ST.length], days, total: weekTotal(days), comments: "", submitted: s.toISOString().slice(0, 10) }; });

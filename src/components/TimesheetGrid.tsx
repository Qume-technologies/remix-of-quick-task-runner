import { CATS, CAT_LABELS, dailyTotal, catTotal, weekTotal, weekMiles, MILE_RATE, type Day } from "@/lib/timesheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function TimesheetGrid({ days, onChange, readOnly, header }: { days: Day[]; onChange?: (d: Day[]) => void; readOnly?: boolean; header: { employee: string; id: string; client: string; location: string; period: string } }) {
  const set = (i: number, k: keyof Day, v: string) => onChange?.(days.map((d, j) => (j === i ? { ...d, [k]: k === "notes" ? v : v === "" ? 0 : Math.max(0, Math.min(24, parseFloat(v) || 0)) } : d)));
  const num = (i: number, c: (typeof CATS)[number]) => readOnly ? <span>{days[i][c] ? days[i][c].toFixed(2) : "–"}</span> :
    <Input type="number" step="0.25" min={0} max={24} value={days[i][c] || ""} placeholder="0" onChange={(e) => set(i, c, e.target.value)} className="h-8 w-full min-w-16 border-transparent bg-transparent text-center shadow-none focus-visible:bg-card" />;
  return (
    <div className="overflow-hidden rounded border bg-card">
      <div className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground"><div className="min-w-0"><div className="text-[10px] uppercase tracking-[0.2em] opacity-70">SriMatrix Health</div><div className="truncate text-sm font-semibold sm:text-base">Weekly Timesheet</div></div><div className="shrink-0 text-right"><div className="text-[10px] uppercase opacity-70">Week total</div><div className="text-lg font-semibold tabular-nums">{weekTotal(days).toFixed(2)}</div></div></div>
      <div className="grid grid-cols-2 gap-px border-b bg-border text-sm lg:grid-cols-4">
        {[["Employee", header.employee], ["Employee ID", header.id], ["Client / Facility", header.client], ["Week Period", header.period]].map(([k, v]) => (
          <div key={k} className="min-w-0 bg-card px-3 py-2 sm:px-4"><div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</div><div className="truncate text-[13px] font-medium sm:text-sm">{v}</div></div>
        ))}
      </div>
      {/* desktop spreadsheet */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-primary/90 text-primary-foreground text-xs uppercase">
            {["Day", "Date", ...CATS.map((c) => CAT_LABELS[c]), "Daily Total", "Notes"].map((h) => <th key={h} className="border border-primary px-2 py-2 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {days.map((d, i) => (
              <tr key={d.day} className={i % 2 === 0 ? "bg-sheet-row" : "bg-card"}>
                <td className="border px-3 py-1 font-medium">{d.day}</td>
                <td className="border px-3 py-1 text-muted-foreground whitespace-nowrap">{d.date}</td>
                {CATS.map((c) => <td key={c} className="border px-1 py-0.5 text-center">{num(i, c)}</td>)}
                <td className="border px-3 py-1 text-center font-semibold">{dailyTotal(d).toFixed(2)}</td>
                <td className="border px-1 py-0.5">{readOnly ? <span className="px-2 text-muted-foreground">{d.notes}</span> : <Input value={d.notes} onChange={(e) => set(i, "notes", e.target.value)} className="h-8 min-w-40 border-transparent bg-transparent shadow-none focus-visible:bg-card" placeholder="Add note" />}</td>
              </tr>
            ))}
            <tr className="bg-primary text-primary-foreground font-semibold">
              <td className="border border-primary px-3 py-2" colSpan={2}>WEEKLY TOTAL</td>
              {CATS.map((c) => <td key={c} className="border border-primary px-3 py-2 text-center">{catTotal(days, c).toFixed(2)}</td>)}
              <td className="border border-primary px-3 py-2 text-center">{weekTotal(days).toFixed(2)}</td><td className="border border-primary" />
            </tr>
          </tbody>
        </table>
      </div>
      <MobileDays days={days} set={set} readOnly={readOnly} />
    </div>
  );
}

export function CategorySummary({ days }: { days: Day[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {CATS.map((c) => <div key={c} className="rounded border bg-card p-3"><div className="text-xs text-muted-foreground">{CAT_LABELS[c]}</div><div className="text-lg font-semibold">{catTotal(days, c).toFixed(2)}</div></div>)}
      <div className="rounded border border-primary bg-primary p-3 text-primary-foreground"><div className="text-xs opacity-80">Total Hours</div><div className="text-lg font-semibold">{weekTotal(days).toFixed(2)}</div></div>
    </div>
  );
}

export function MileageGrid({ days, onChange, readOnly }: { days: Day[]; onChange?: (d: Day[]) => void; readOnly?: boolean }) {
  const set = (i: number, k: "miles" | "trip", v: string) => onChange?.(days.map((d, j) => (j === i ? { ...d, [k]: k === "trip" ? v : Math.max(0, Math.min(1000, parseFloat(v) || 0)) } : d)));
  const total = weekMiles(days);
  return (
    <div className="overflow-hidden rounded border bg-card">
      <div className="flex items-center justify-between bg-primary px-4 py-2.5 text-primary-foreground"><span className="text-sm font-semibold tracking-wide">WEEKLY MILEAGE</span><span className="text-xs opacity-80">Rate ${MILE_RATE.toFixed(2)}/mi</span></div>
      <div className="divide-y">
        {days.map((d, i) => (
          <div key={d.day} className={`grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 px-3 py-2 sm:grid-cols-[8rem_7rem_minmax(0,1fr)] ${i % 2 === 0 ? "bg-sheet-row" : ""}`}>
            <div className="min-w-0"><div className="text-sm font-medium">{d.day.slice(0, 3)}<span className="hidden sm:inline">{d.day.slice(3)}</span></div><div className="text-[11px] text-muted-foreground">{d.date.slice(5)}</div></div>
            {readOnly ? <div className="text-sm font-semibold sm:text-center">{d.miles ? `${d.miles} mi` : "–"}</div> :
              <div className="relative"><Input type="number" inputMode="decimal" step="0.1" min={0} value={d.miles || ""} placeholder="0" onChange={(e) => set(i, "miles", e.target.value)} className="h-9 bg-card pr-8 text-right" /><span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground">mi</span></div>}
            {readOnly ? <div className="col-span-2 truncate text-xs text-muted-foreground sm:col-span-1">{d.trip}</div> :
              <Input value={d.trip} onChange={(e) => set(i, "trip", e.target.value)} placeholder="From → To / purpose" className="col-span-2 h-9 bg-card sm:col-span-1" />}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><span>Total {total} mi</span><span>Reimbursement ${(total * MILE_RATE).toFixed(2)}</span></div>
    </div>
  );
}

function MobileDays({ days, set, readOnly }: { days: Day[]; set: (i: number, k: keyof Day, v: string) => void; readOnly?: boolean | undefined }) {
  const [sel, setSel] = useState(1);
  const d = days[sel];
  const bump = (c: (typeof CATS)[number], delta: number) => set(sel, c, String(Math.max(0, d[c] + delta)));
  return (
    <div className="md:hidden">
      <div className="grid grid-cols-7 gap-1 border-b bg-muted/40 p-2">
        {days.map((x, i) => (
          <button key={x.day} onClick={() => setSel(i)} className={`flex flex-col items-center rounded-md py-1.5 transition-colors ${sel === i ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
            <span className="text-[10px] font-medium uppercase opacity-70">{x.day.slice(0, 3)}</span>
            <span className="text-sm font-semibold">{x.date.slice(8)}</span>
            <span className={`mt-0.5 h-1 w-1 rounded-full ${dailyTotal(x) > 0 ? (sel === i ? "bg-primary-foreground" : "bg-primary") : "bg-transparent"}`} />
          </button>
        ))}
      </div>
      <div className="p-3">
        <div className="mb-3 flex items-end justify-between"><div><div className="font-semibold">{d.day}</div><div className="text-xs text-muted-foreground">{new Date(d.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}</div></div><div className="text-right"><div className="text-[10px] uppercase text-muted-foreground">Day total</div><div className="text-xl font-semibold tabular-nums">{dailyTotal(d).toFixed(2)}<span className="ml-0.5 text-xs font-normal text-muted-foreground">h</span></div></div></div>
        <div className="divide-y rounded-lg border">
          {CATS.map((c) => (
            <div key={c} className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="text-sm">{CAT_LABELS[c]}</span>
              {readOnly ? <span className="text-sm font-semibold tabular-nums">{d[c].toFixed(2)}</span> :
                <div className="flex items-center gap-1">
                  <button aria-label={`Less ${c}`} onClick={() => bump(c, -0.5)} className="grid h-9 w-9 place-items-center rounded-md border text-muted-foreground active:bg-muted"><Minus className="h-4 w-4" /></button>
                  <Input type="number" inputMode="decimal" step="0.25" value={d[c] || ""} placeholder="0" onChange={(e) => set(sel, c, e.target.value)} className="h-9 w-16 text-center tabular-nums" />
                  <button aria-label={`More ${c}`} onClick={() => bump(c, 0.5)} className="grid h-9 w-9 place-items-center rounded-md border text-muted-foreground active:bg-muted"><Plus className="h-4 w-4" /></button>
                </div>}
            </div>
          ))}
        </div>
        {readOnly ? d.notes && <p className="mt-3 text-xs text-muted-foreground">{d.notes}</p> : <Input value={d.notes} onChange={(e) => set(sel, "notes", e.target.value)} className="mt-3 h-10" placeholder={`Note for ${d.day} (optional)`} />}
        <div className="mt-3 flex gap-2">
          <button disabled={sel === 0} onClick={() => setSel(sel - 1)} className="h-10 flex-1 rounded-md border text-sm font-medium disabled:opacity-40">← {sel > 0 ? days[sel - 1].day.slice(0, 3) : ""}</button>
          <button disabled={sel === 6} onClick={() => setSel(sel + 1)} className="h-10 flex-1 rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-40">{sel < 6 ? days[sel + 1].day.slice(0, 3) : ""} →</button>
        </div>
      </div>
    </div>
  );
}

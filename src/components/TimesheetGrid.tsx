import { CATS, CAT_LABELS, dailyTotal, catTotal, weekTotal, type Day } from "@/lib/timesheet";
import { Input } from "@/components/ui/input";

export function TimesheetGrid({ days, onChange, readOnly, header }: { days: Day[]; onChange?: (d: Day[]) => void; readOnly?: boolean; header: { employee: string; id: string; client: string; location: string; period: string } }) {
  const set = (i: number, k: keyof Day, v: string) => onChange?.(days.map((d, j) => (j === i ? { ...d, [k]: k === "notes" ? v : v === "" ? 0 : Math.max(0, Math.min(24, parseFloat(v) || 0)) } : d)));
  const num = (i: number, c: (typeof CATS)[number]) => readOnly ? <span>{days[i][c] ? days[i][c].toFixed(2) : "–"}</span> :
    <Input type="number" step="0.25" min={0} max={24} value={days[i][c] || ""} placeholder="0" onChange={(e) => set(i, c, e.target.value)} className="h-8 w-full min-w-16 border-transparent bg-transparent text-center shadow-none focus-visible:bg-card" />;
  return (
    <div className="overflow-hidden rounded border bg-card">
      <div className="bg-primary px-4 py-3 text-center text-primary-foreground"><div className="text-base font-semibold tracking-wide">SRIMATRIX HEALTH — WEEKLY TIMESHEET</div></div>
      <div className="grid grid-cols-1 gap-px border-b bg-border text-sm sm:grid-cols-2 lg:grid-cols-4">
        {[["Employee", header.employee], ["Employee ID", header.id], ["Client / Facility", header.client], ["Week Period", header.period]].map(([k, v]) => (
          <div key={k} className="bg-card px-4 py-2"><div className="text-[11px] uppercase text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>
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
      {/* mobile cards */}
      <div className="md:hidden divide-y">
        {days.map((d, i) => (
          <div key={d.day} className={`p-3 ${i % 2 === 0 ? "bg-sheet-row" : ""}`}>
            <div className="mb-2 flex justify-between"><div><div className="font-medium">{d.day}</div><div className="text-xs text-muted-foreground">{d.date}</div></div><div className="text-right"><div className="text-[11px] text-muted-foreground">Daily total</div><div className="font-semibold">{dailyTotal(d).toFixed(2)}</div></div></div>
            <div className="grid grid-cols-3 gap-2">{CATS.map((c) => <label key={c} className="text-[11px] text-muted-foreground">{CAT_LABELS[c]}<div className="rounded border bg-card text-center text-sm text-foreground">{num(i, c)}</div></label>)}</div>
            {readOnly ? d.notes && <p className="mt-2 text-xs">{d.notes}</p> : <Input value={d.notes} onChange={(e) => set(i, "notes", e.target.value)} className="mt-2 h-9 bg-card" placeholder="Daily note" />}
          </div>
        ))}
        <div className="bg-primary p-3 text-primary-foreground"><div className="flex justify-between font-semibold"><span>Weekly Total</span><span>{weekTotal(days).toFixed(2)} hrs</span></div></div>
      </div>
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

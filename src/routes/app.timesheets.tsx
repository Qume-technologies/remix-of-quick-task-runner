import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, FileDown, FileSpreadsheet, Save, Send, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatusBadge } from "@/components/StatusBadge";
import { TimesheetGrid, CategorySummary } from "@/components/TimesheetGrid";
import { CATS, CAT_LABELS, dailyTotal, fmtRange, makeWeek, weekStart, weekTotal, type Day } from "@/lib/timesheet";

export const Route = createFileRoute("/app/timesheets")({
  head: () => ({ meta: [{ title: "My Timesheets – SriMatrix Health" }, { name: "description", content: "Enter and submit weekly timesheets." }, { property: "og:title", content: "My Timesheets – SriMatrix Health" }, { property: "og:description", content: "Weekly timesheet entry." }] }),
  component: Page,
});

type Hist = { period: string; total: number; status: string; submitted: string };
const HISTORY: Hist[] = Array.from({ length: 8 }, (_, i) => { const s = weekStart(-i - 1); return { period: fmtRange(s), total: weekTotal(makeWeek(s, i)), status: ["Approved", "Approved", "Pending", "Changes Requested", "Approved", "Rejected", "Approved", "Approved"][i], submitted: s.toISOString().slice(0, 10) }; });

function Page() {
  const [offset, setOffset] = useState(0);
  const [weeks, setWeeks] = useState<Record<number, { days: Day[]; comments: string; status: string }>>({});
  const start = weekStart(offset);
  const w = weeks[offset] ?? { days: makeWeek(start, 0), comments: "", status: "Draft" };
  const update = (p: Partial<typeof w>) => setWeeks({ ...weeks, [offset]: { ...w, ...p } });
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState(HISTORY);
  const [q, setQ] = useState(""); const [st, setSt] = useState("all");
  const filtered = useMemo(() => history.filter((h) => h.period.toLowerCase().includes(q.toLowerCase()) && (st === "all" || h.status === st)), [history, q, st]);
  const header = { employee: "Priya Raman", id: "SMH-1040", client: "St. Mary's Medical Center", location: "Dallas, TX", period: fmtRange(start) };
  const locked = w.status === "Submitted";

  const exportCsv = () => {
    const rows = [["Day", "Date", ...CATS.map((c) => CAT_LABELS[c]), "Daily Total", "Notes"], ...w.days.map((d) => [d.day, d.date, ...CATS.map((c) => d[c]), dailyTotal(d), d.notes]), ["Weekly Total", "", ...CATS.map((c) => w.days.reduce((s, d) => s + d[c], 0)), weekTotal(w.days), ""]];
    const blob = new Blob([rows.map((r) => r.map((x) => `"${x}"`).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `timesheet-${w.days[0].date}.csv`; a.click(); toast.success("Excel (CSV) exported");
  };
  const submit = () => { update({ status: "Submitted" }); setHistory([{ period: header.period, total: weekTotal(w.days), status: "Pending", submitted: new Date().toISOString().slice(0, 10) }, ...history]); toast.success("Submitted for approval"); };

  return (
    <div className="space-y-5">
      <PageHeader title="My Timesheets" description="Weekly time entry for all hour categories">
        <Button variant="outline" size="sm" onClick={() => setPreview(true)}><Eye className="mr-1 h-4 w-4" />Preview</Button>
        <Button variant="outline" size="sm" onClick={() => { setPreview(true); setTimeout(() => window.print(), 300); }}><FileDown className="mr-1 h-4 w-4" />PDF</Button>
        <Button variant="outline" size="sm" onClick={exportCsv}><FileSpreadsheet className="mr-1 h-4 w-4" />Excel</Button>
      </PageHeader>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border bg-card p-3">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setOffset(offset - 1)} aria-label="Previous week"><ChevronLeft className="h-4 w-4" /></Button>
          <div className="text-sm font-medium">{header.period}</div>
          <Button size="icon" variant="outline" onClick={() => setOffset(offset + 1)} aria-label="Next week"><ChevronRight className="h-4 w-4" /></Button>
          <StatusBadge value={w.status} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={locked} onClick={() => { update({ status: "Draft" }); toast.success("Draft saved"); }}><Save className="mr-1 h-4 w-4" />Save Draft</Button>
          <Button disabled={locked} onClick={submit}><Send className="mr-1 h-4 w-4" />Submit for Approval</Button>
        </div>
      </div>
      <TimesheetGrid days={w.days} onChange={(days) => update({ days })} readOnly={locked} header={header} />
      <CategorySummary days={w.days} />
      <div className="rounded border bg-card p-4"><div className="mb-2 text-sm font-medium">Weekly Comments</div><Textarea disabled={locked} value={w.comments} onChange={(e) => update({ comments: e.target.value })} placeholder="Add comments for your approver..." /></div>

      <div className="rounded border bg-card">
        <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-medium">Timesheet History</div>
          <div className="flex gap-2"><div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-8 sm:w-56" placeholder="Search period" value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <Select value={st} onValueChange={setSt}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{["all", "Pending", "Approved", "Rejected", "Changes Requested"].map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All statuses" : s}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="divide-y text-sm">
          {filtered.map((h, i) => <div key={i} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"><div><div className="font-medium">{h.period}</div><div className="text-xs text-muted-foreground">Submitted {h.submitted}</div></div><div className="flex items-center gap-4"><span className="font-semibold">{h.total.toFixed(2)} hrs</span><StatusBadge value={h.status} /></div></div>)}
          {filtered.length === 0 && <div className="p-6 text-center text-muted-foreground">No timesheets match.</div>}
        </div>
      </div>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl"><DialogHeader><DialogTitle>Timesheet Preview</DialogTitle></DialogHeader>
          <TimesheetGrid days={w.days} readOnly header={header} />{w.comments && <p className="text-sm"><b>Comments:</b> {w.comments}</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

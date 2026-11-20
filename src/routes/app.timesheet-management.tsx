import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, StatusBadge } from "@/components/StatusBadge";
import { TimesheetGrid, CategorySummary } from "@/components/TimesheetGrid";
import { SHEETS, type Sheet } from "@/lib/timesheetData";

export const Route = createFileRoute("/app/timesheet-management")({
  head: () => ({ meta: [{ title: "Timesheet Management – SriMatrix Health" }, { name: "description", content: "Review and approve employee timesheets." }, { property: "og:title", content: "Timesheet Management – SriMatrix Health" }, { property: "og:description", content: "Approve, reject or request changes." }] }),
  component: Page,
});
const TABS = ["Pending", "Approved", "Rejected", "Changes Requested"];
function Page() {
  const [sheets, setSheets] = useState(SHEETS);
  const [tab, setTab] = useState("Pending");
  const [open, setOpen] = useState<Sheet | null>(null);
  const [note, setNote] = useState("");
  const act = (status: string) => { if (!open) return; setSheets(sheets.map((s) => (s.id === open.id ? { ...s, status, comments: note } : s))); toast.success(`Timesheet ${status.toLowerCase()}`); setOpen(null); setNote(""); };
  const list = sheets.filter((s) => s.status === tab);
  return (
    <div className="space-y-4">
      <PageHeader title="Timesheet Management" description="Review submitted weekly timesheets" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded border bg-card p-3 text-left ${tab === t ? "border-info" : ""}`}><div className="text-xs text-muted-foreground">{t}</div><div className="text-xl font-semibold">{sheets.filter((s) => s.status === t).length}</div></button>)}</div>
      <Tabs value={tab} onValueChange={setTab}><TabsList className="flex h-auto flex-wrap">{TABS.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList></Tabs>
      <div className="rounded border bg-card divide-y">
        {list.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">{s.employee.split(" ").map((x) => x[0]).join("")}</div>
              <div><div className="font-medium">{s.employee} <span className="text-xs text-muted-foreground">· {s.empId}</span></div><div className="text-xs text-muted-foreground">{s.client} · {s.period}</div></div></div>
            <div className="flex items-center gap-3"><span className="text-sm font-semibold">{s.total.toFixed(2)} hrs</span><StatusBadge value={s.status} /><Button size="sm" variant="outline" onClick={() => setOpen(s)}>Review</Button></div>
          </div>
        ))}
        {list.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No {tab.toLowerCase()} timesheets.</div>}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader><DialogTitle>Review – {open?.employee}</DialogTitle></DialogHeader>
          {open && <><TimesheetGrid days={open.days} readOnly header={{ employee: open.employee, id: open.empId, client: open.client, location: "", period: open.period }} /><CategorySummary days={open.days} />
            <Textarea placeholder="Reviewer comments (required for reject / changes)" value={note} onChange={(e) => setNote(e.target.value)} /></>}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => note ? act("Changes Requested") : toast.error("Add a comment first")}><MessageSquare className="mr-1 h-4 w-4" />Request Changes</Button>
            <Button variant="destructive" onClick={() => note ? act("Rejected") : toast.error("Add a comment first")}><X className="mr-1 h-4 w-4" />Reject</Button>
            <Button onClick={() => act("Approved")}><Check className="mr-1 h-4 w-4" />Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

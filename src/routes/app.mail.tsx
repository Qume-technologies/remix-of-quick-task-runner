import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/StatusBadge";
export const Route = createFileRoute("/app/mail")({
  head: () => ({ meta: [{ title: "Mail – SriMatrix Health" }, { name: "description", content: "Team mail." }, { property: "og:title", content: "Mail – SriMatrix Health" }, { property: "og:description", content: "Inbox, sent and drafts." }] }),
  component: Page,
});
type M = { id: number; box: string; who: string; subject: string; body: string };
const INIT: M[] = [
  { id: 1, box: "Inbox", who: "hr@mercygeneral.org", subject: "Staffing request – ICU nurses", body: "We need 4 ICU RNs starting December." },
  { id: 2, box: "Inbox", who: "priya.raman@srimatrix.com", subject: "Timesheet question", body: "Should on-call hours include travel?" },
  { id: 3, box: "Sent", who: "james@riverside.org", subject: "Contract renewal", body: "Attached is the renewal proposal." },
  { id: 4, box: "Drafts", who: "", subject: "Holiday schedule", body: "Draft of holiday coverage..." },
];
function Page() {
  const [mails, setMails] = useState(INIT); const [box, setBox] = useState("Inbox"); const [sel, setSel] = useState<M | null>(null);
  const [c, setC] = useState<M | null>(null);
  const list = mails.filter((m) => m.box === box);
  return (
    <div>
      <PageHeader title="Mail"><Button onClick={() => setC({ id: 0, box: "Sent", who: "", subject: "", body: "" })}>Compose</Button></PageHeader>
      <div className="grid gap-4 md:grid-cols-[160px_1fr_1.4fr]">
        <div className="flex gap-1 md:flex-col">{["Inbox", "Sent", "Drafts"].map((b) => <Button key={b} variant={box === b ? "default" : "ghost"} className="justify-start" onClick={() => { setBox(b); setSel(null); }}>{b} ({mails.filter((m) => m.box === b).length})</Button>)}</div>
        <div className="rounded border bg-card divide-y">{list.map((m) => <button key={m.id} onClick={() => setSel(m)} className={`block w-full p-3 text-left text-sm hover:bg-muted ${sel?.id === m.id ? "bg-accent" : ""}`}><div className="font-medium">{m.subject}</div><div className="text-xs text-muted-foreground">{m.who || "(no recipient)"}</div></button>)}</div>
        <div className="rounded border bg-card p-4 text-sm">{sel ? <><div className="text-lg font-semibold">{sel.subject}</div><div className="mb-3 text-xs text-muted-foreground">{sel.who}</div><p>{sel.body}</p></> : <span className="text-muted-foreground">Select a message</span>}</div>
      </div>
      <Dialog open={!!c} onOpenChange={(o) => !o && setC(null)}><DialogContent><DialogHeader><DialogTitle>New message</DialogTitle></DialogHeader>
        {c && <div className="space-y-2"><Input placeholder="To" value={c.who} onChange={(e) => setC({ ...c, who: e.target.value })} /><Input placeholder="Subject" value={c.subject} onChange={(e) => setC({ ...c, subject: e.target.value })} /><Textarea rows={6} value={c.body} onChange={(e) => setC({ ...c, body: e.target.value })} /></div>}
        <DialogFooter><Button variant="outline" onClick={() => { setMails([{ ...c!, id: Date.now(), box: "Drafts" }, ...mails]); setC(null); toast.success("Saved to drafts"); }}>Save draft</Button><Button onClick={() => { setMails([{ ...c!, id: Date.now() }, ...mails]); setC(null); toast.success("Email sent"); }}>Send</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}

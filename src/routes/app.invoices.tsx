import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatusBadge } from "@/components/StatusBadge";
import { FACILITIES } from "@/lib/modules";

export const Route = createFileRoute("/app/invoices")({
  head: () => ({ meta: [{ title: "Invoices – SriMatrix Health" }, { name: "description", content: "Create and manage client invoices." }, { property: "og:title", content: "Invoices – SriMatrix Health" }, { property: "og:description", content: "Client invoicing." }] }),
  component: Page,
});
type Item = { desc: string; qty: number; rate: number };
type Inv = { id: number; number: string; client: string; address: string; date: string; due: string; status: string; tax: number; items: Item[] };
export const subtotal = (i: Inv) => i.items.reduce((s, x) => s + x.qty * x.rate, 0);
export const total = (i: Inv) => subtotal(i) * (1 + i.tax / 100);
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const INIT: Inv[] = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, number: `INV-2026-${String(101 + i)}`, client: FACILITIES[i], address: "100 Medical Pkwy, Dallas, TX", date: `2026-${String((i % 10) + 1).padStart(2, "0")}-05`, due: `2026-${String((i % 10) + 1).padStart(2, "0")}-30`, status: ["Paid", "Sent", "Draft", "Overdue"][i % 4], tax: 8.25, items: [{ desc: "RN staffing – regular hours", qty: 120 + i * 8, rate: 68 }, { desc: "Overtime hours", qty: 12, rate: 98 }] }));

function Page() {
  const [list, setList] = useState(INIT);
  const [edit, setEdit] = useState<Inv | null>(null);
  const [view, setView] = useState<Inv | null>(null);
  const setItem = (k: number, p: Partial<Item>) => edit && setEdit({ ...edit, items: edit.items.map((x, j) => (j === k ? { ...x, ...p } : x)) });
  const save = () => { if (!edit) return; setList(edit.id ? list.map((x) => (x.id === edit.id ? edit : x)) : [{ ...edit, id: Date.now() }, ...list]); toast.success("Invoice saved"); setEdit(null); };
  return (
    <div>
      <PageHeader title="Invoices" description="Client billing and invoice records"><Button onClick={() => setEdit({ id: 0, number: `INV-2026-${101 + list.length}`, client: FACILITIES[0], address: "", date: "2026-11-20", due: "2026-12-20", status: "Draft", tax: 8.25, items: [{ desc: "", qty: 1, rate: 0 }] })}><Plus className="mr-1 h-4 w-4" />New Invoice</Button></PageHeader>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">{["Paid", "Sent", "Draft", "Overdue"].map((s) => <div key={s} className="rounded border bg-card p-3"><div className="text-xs text-muted-foreground">{s}</div><div className="text-lg font-semibold">{money(list.filter((x) => x.status === s).reduce((a, x) => a + total(x), 0))}</div></div>)}</div>
      <div className="rounded border bg-card divide-y">
        {list.map((x) => <div key={x.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"><div><div className="font-medium">{x.number}</div><div className="text-xs text-muted-foreground">{x.client} · Due {x.due}</div></div>
          <div className="flex items-center gap-3"><span className="font-semibold">{money(total(x))}</span><StatusBadge value={x.status} /><Button size="icon" variant="ghost" onClick={() => setView(x)}><Eye className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => setEdit(x)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="text-destructive" onClick={() => { setList(list.filter((y) => y.id !== x.id)); toast.success("Invoice deleted"); }}><Trash2 className="h-4 w-4" /></Button></div></div>)}
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{edit?.id ? "Edit" : "New"} Invoice</DialogTitle></DialogHeader>
          {edit && <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div><Label className="text-xs">Invoice #</Label><Input value={edit.number} onChange={(e) => setEdit({ ...edit, number: e.target.value })} /></div>
              <div><Label className="text-xs">Date</Label><Input type="date" value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value })} /></div>
              <div><Label className="text-xs">Due</Label><Input type="date" value={edit.due} onChange={(e) => setEdit({ ...edit, due: e.target.value })} /></div>
              <div><Label className="text-xs">Client</Label><Input value={edit.client} onChange={(e) => setEdit({ ...edit, client: e.target.value })} /></div>
              <div><Label className="text-xs">Client Address</Label><Input value={edit.address} onChange={(e) => setEdit({ ...edit, address: e.target.value })} /></div>
              <div><Label className="text-xs">Status</Label><Select value={edit.status} onValueChange={(v) => setEdit({ ...edit, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Draft", "Sent", "Paid", "Overdue"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-2"><div className="text-sm font-medium">Line items</div>
              {edit.items.map((it, k) => <div key={k} className="grid grid-cols-12 gap-2"><Input className="col-span-12 sm:col-span-6" placeholder="Description" value={it.desc} onChange={(e) => setItem(k, { desc: e.target.value })} /><Input className="col-span-3 sm:col-span-2" type="number" value={it.qty} onChange={(e) => setItem(k, { qty: +e.target.value })} /><Input className="col-span-4 sm:col-span-2" type="number" step="0.01" value={it.rate} onChange={(e) => setItem(k, { rate: +e.target.value })} /><div className="col-span-3 sm:col-span-1 self-center text-right text-sm">{money(it.qty * it.rate)}</div><Button size="icon" variant="ghost" className="col-span-2 sm:col-span-1" onClick={() => setEdit({ ...edit, items: edit.items.filter((_, j) => j !== k) })}><Trash2 className="h-4 w-4" /></Button></div>)}
              <Button size="sm" variant="outline" onClick={() => setEdit({ ...edit, items: [...edit.items, { desc: "", qty: 1, rate: 0 }] })}><Plus className="mr-1 h-4 w-4" />Add line</Button></div>
            <div className="ml-auto w-full max-w-xs space-y-1 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal(edit))}</span></div><div className="flex items-center justify-between gap-2"><span>Tax %</span><Input className="h-8 w-20" type="number" step="0.01" value={edit.tax} onChange={(e) => setEdit({ ...edit, tax: +e.target.value })} /></div><div className="flex justify-between border-t pt-1 font-semibold"><span>Total</span><span>{money(total(edit))}</span></div></div>
          </div>}
          <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save}>Save Invoice</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>Invoice Preview</DialogTitle></DialogHeader>
          {view && <div className="rounded border p-6 text-sm"><div className="mb-6 flex justify-between"><div><div className="text-lg font-semibold text-primary">SriMatrix Health</div><div className="text-xs text-muted-foreground">Dallas, TX</div></div><div className="text-right"><div className="font-semibold">{view.number}</div><div className="text-xs text-muted-foreground">Issued {view.date} · Due {view.due}</div></div></div>
            <div className="mb-4"><div className="text-xs text-muted-foreground">Bill to</div><div className="font-medium">{view.client}</div><div>{view.address}</div></div>
            <table className="w-full"><thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="py-1">Description</th><th>Qty</th><th>Rate</th><th className="text-right">Amount</th></tr></thead><tbody>{view.items.map((it, k) => <tr key={k} className="border-b"><td className="py-1.5">{it.desc}</td><td>{it.qty}</td><td>{money(it.rate)}</td><td className="text-right">{money(it.qty * it.rate)}</td></tr>)}</tbody></table>
            <div className="ml-auto mt-3 w-56 space-y-1"><div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal(view))}</span></div><div className="flex justify-between"><span>Tax ({view.tax}%)</span><span>{money(subtotal(view) * view.tax / 100)}</span></div><div className="flex justify-between font-semibold"><span>Total</span><span>{money(total(view))}</span></div></div></div>}
          <DialogFooter><Button onClick={() => window.print()}>Print / PDF</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

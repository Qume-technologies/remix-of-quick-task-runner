import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye, ArrowUpDown, LayoutGrid, List, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatusBadge } from "@/components/StatusBadge";
import type { ModuleConfig } from "@/lib/modules";

const PAGE = 8;
export function CrudPage({ config }: { config: ModuleConfig }) {
  const [rows, setRows] = useState(config.rows);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<{ k: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [viewing, setViewing] = useState<Record<string, any> | null>(null);
  const [view, setView] = useState<"table" | "kanban">(config.kanban ? "kanban" : "table");
  const label = (k: string) => config.fields.find((f) => f.name === k)?.label ?? k;
  const statusOpts = config.fields.find((f) => f.name === config.statusField)?.options ?? [];

  const filtered = useMemo(() => {
    let r = rows.filter((x) => Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase()));
    if (status !== "all" && config.statusField) r = r.filter((x) => x[config.statusField!] === status);
    if (sort) r = [...r].sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : -1) * sort.dir);
    return r;
  }, [rows, q, status, sort, config.statusField]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const shown = filtered.slice(page * PAGE, page * PAGE + PAGE);

  const save = () => {
    if (!editing) return;
    if (editing.id) setRows(rows.map((r) => (r.id === editing.id ? editing : r)));
    else setRows([{ ...editing, id: Date.now() }, ...rows]);
    toast.success(editing.id ? "Record updated" : "Record created");
    setEditing(null);
  };
  const remove = (id: number) => { setRows(rows.filter((r) => r.id !== id)); toast.success("Record deleted"); };
  const blank = () => Object.fromEntries(config.fields.map((f) => [f.name, f.options?.[0] ?? ""]));
  const fmt = (k: string, v: any) => (k === config.statusField || k === "status" || k === "priority" ? <StatusBadge value={v} /> : typeof v === "number" && /salary/i.test(k) ? `$${v.toLocaleString()}` : String(v ?? ""));

  return (
    <div>
      <PageHeader title={config.title} description={config.description}>
        {config.kanban && (
          <div className="flex rounded border bg-card">
            <button onClick={() => setView("kanban")} className={`px-3 py-1.5 text-sm ${view === "kanban" ? "bg-accent" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("table")} className={`px-3 py-1.5 text-sm ${view === "table" ? "bg-accent" : ""}`}><List className="h-4 w-4" /></button>
          </div>
        )}
        {config.key === "hr-documents" && <Button variant="outline" onClick={() => setEditing({ ...blank(), uploaded: new Date().toISOString().slice(0, 10), size: "0.4 MB" })}><Upload className="mr-1 h-4 w-4" />Upload</Button>}
        {!config.readOnly && <Button onClick={() => setEditing(blank())}><Plus className="mr-1 h-4 w-4" />Add {config.key === "pipeline" ? "Follow-up" : "New"}</Button>}
      </PageHeader>

      {config.statusField && statusOpts.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statusOpts.slice(0, 6).map((s) => (
            <button key={s} onClick={() => { setStatus(status === s ? "all" : s); setPage(0); }} className={`rounded border bg-card p-3 text-left transition-colors hover:border-info ${status === s ? "border-info" : ""}`}>
              <div className="text-xs text-muted-foreground">{s}</div><div className="text-lg font-semibold">{rows.filter((r) => r[config.statusField!] === s).length}</div>
            </button>
          ))}
        </div>
      )}

      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9 bg-card" placeholder={`Search ${config.title.toLowerCase()}...`} value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} /></div>
        {config.statusField && (
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
            <SelectTrigger className="sm:w-48 bg-card"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All {label(config.statusField)}</SelectItem>{statusOpts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        )}
      </div>

      {view === "kanban" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statusOpts.map((s) => (
            <div key={s} className="rounded border bg-muted/60 p-2">
              <div className="mb-2 flex justify-between px-1 text-xs font-semibold uppercase text-muted-foreground">{s}<span>{filtered.filter((r) => r[config.statusField!] === s).length}</span></div>
              <div className="space-y-2">
                {filtered.filter((r) => r[config.statusField!] === s).map((r) => (
                  <div key={r.id} className="rounded border bg-card p-2.5 text-sm">
                    <button className="font-medium text-left hover:text-info" onClick={() => setViewing(r)}>{r.facility}</button>
                    <div className="text-xs text-muted-foreground">{r.contact} · {r.followUp}</div>
                    <div className="mt-2 flex items-center justify-between"><StatusBadge value={r.priority} />
                      <Select value={r[config.statusField!]} onValueChange={(v) => { setRows(rows.map((x) => (x.id === r.id ? { ...x, [config.statusField!]: v } : x))); toast.success(`Moved to ${v}`); }}>
                        <SelectTrigger className="h-7 w-auto text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{statusOpts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded border bg-card">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                <tr>{config.columns.map((c) => <th key={c} className="px-4 py-2.5 font-medium"><button className="inline-flex items-center gap-1" onClick={() => setSort({ k: c, dir: sort?.k === c && sort.dir === 1 ? -1 : 1 })}>{label(c)}<ArrowUpDown className="h-3 w-3" /></button></th>)}<th className="px-4 py-2.5 text-right font-medium">Actions</th></tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/40">
                    {config.columns.map((c, i) => <td key={c} className={`px-4 py-2.5 ${i === 0 ? "font-medium" : "text-muted-foreground"} max-w-56 truncate`}>{fmt(c, r[c])}</td>)}
                    <td className="px-4 py-2 text-right whitespace-nowrap"><RowActions r={r} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y">
            {shown.map((r) => (
              <div key={r.id} className="p-3">
                <div className="flex items-start justify-between gap-2"><div className="font-medium">{r[config.columns[0]]}</div>{config.statusField && <StatusBadge value={r[config.statusField]} />}</div>
                <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">{config.columns.slice(1, 5).filter((c) => c !== config.statusField).map((c) => <div key={c} className="truncate"><span className="text-foreground/70">{label(c)}:</span> {String(r[c])}</div>)}</div>
                <div className="mt-2 flex justify-end"><RowActions r={r} /></div>
              </div>
            ))}
          </div>
          {shown.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No records found.</div>}
          <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
            <span>{filtered.length} records</span>
            <div className="flex items-center gap-2"><Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button><span>{page + 1} / {pages}</span><Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</Button></div>
          </div>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} {config.title.replace(/s$/, "")}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3 sm:grid-cols-2">
              {config.fields.map((f) => (
                <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Label className="mb-1 block text-xs">{f.label}</Label>
                  {f.type === "select" ? (
                    <Select value={editing[f.name]} onValueChange={(v) => setEditing({ ...editing, [f.name]: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  ) : f.type === "textarea" ? (
                    <Textarea rows={f.name === "content" ? 8 : 3} value={editing[f.name]} onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })} />
                  ) : (
                    <Input type={f.type ?? "text"} value={editing[f.name]} onChange={(e) => setEditing({ ...editing, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value })} />
                  )}
                </div>
              ))}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{viewing && viewing[config.columns[0]]}</DialogTitle></DialogHeader>
          {viewing && (config.preview && (viewing.content || viewing.fileName) ? (
            <div className="rounded border bg-background p-6">
              <div className="mb-4 border-b pb-3"><div className="text-lg font-semibold text-primary">SriMatrix Health</div><div className="text-xs text-muted-foreground">{viewing.fileName ?? "Offer Letter"}</div></div>
              {viewing.content ? <pre className="whitespace-pre-wrap font-sans text-sm">{viewing.content}</pre> : <div className="space-y-1 text-sm">{config.fields.map((f) => <div key={f.name}><span className="text-muted-foreground">{f.label}:</span> {String(viewing[f.name])}</div>)}</div>}
            </div>
          ) : (
            <dl className="grid gap-3 sm:grid-cols-2">{config.fields.map((f) => <div key={f.name}><dt className="text-xs text-muted-foreground">{f.label}</dt><dd className="text-sm">{fmt(f.name, viewing[f.name]) || "—"}</dd></div>)}</dl>
          ))}
          <DialogFooter>{config.preview && <Button variant="outline" onClick={() => window.print()}>Print</Button>}{!config.readOnly && viewing && <Button onClick={() => { setEditing(viewing); setViewing(null); }}>Edit</Button>}</DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  function RowActions({ r }: { r: Record<string, any> }) {
    return (
      <div className="inline-flex gap-1">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewing(r)} aria-label="View"><Eye className="h-4 w-4" /></Button>
        {!config.readOnly && <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(r)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>}
        {config.key === "sessions" ? <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => remove(r.id)}>Revoke</Button>
          : !config.readOnly && <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(r.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>}
      </div>
    );
  }
}

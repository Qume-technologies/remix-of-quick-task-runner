import { cn } from "@/lib/utils";
const good = ["approved", "active", "won", "hired", "accepted", "completed", "success", "paid"];
const warn = ["pending", "draft", "in review", "expiring", "submitted", "negotiation", "offer", "interview", "proposal", "changes requested", "rfe received", "sent", "screening"];
const bad = ["rejected", "declined", "denied", "failed", "overdue", "inactive", "high"];
export function StatusBadge({ value }: { value: string }) {
  const v = String(value ?? "").toLowerCase();
  const cls = good.includes(v) ? "bg-success-soft text-success" : bad.includes(v) ? "bg-destructive/10 text-destructive" : warn.includes(v) ? "bg-warning-soft text-warning" : "bg-accent text-accent-foreground";
  return <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap", cls)}>{value}</span>;
}
export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-xl font-semibold text-foreground">{title}</h1>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

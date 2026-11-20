import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Users, UserPlus, Building2, KanbanSquare, BellRing, Clock, CheckCircle2, Timer } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/StatusBadge";
import { MODULES } from "@/lib/modules";
import { SHEETS } from "@/lib/timesheetData";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Overview – SriMatrix Health" }, { name: "description", content: "Workforce dashboard overview." }, { property: "og:title", content: "Overview – SriMatrix Health" }, { property: "og:description", content: "Recruitment and timesheet KPIs." }] }),
  component: Dashboard,
});
const recruit = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m, i) => ({ m, sourced: 30 + i * 6 + (i % 2) * 5, hired: 6 + i * 2 }));
const hours = ["Wk 42", "Wk 43", "Wk 44", "Wk 45", "Wk 46", "Wk 47"].map((w, i) => ({ w, hours: 1480 + i * 45 - (i % 3) * 30 }));

function Dashboard() {
  const fu = MODULES.pipeline.rows.filter((r) => r.status !== "Completed");
  const kpis = [
    ["Total Employees", 248, Users], ["Total Candidates", MODULES.candidates.rows.length * 9, UserPlus], ["Healthcare Facilities", 86, Building2], ["Active Pipeline", 42, KanbanSquare],
    ["Pending Follow-ups", fu.length, BellRing], ["Pending Timesheets", SHEETS.filter((s) => s.status === "Pending").length, Clock], ["Approved Timesheets", SHEETS.filter((s) => s.status === "Approved").length, CheckCircle2], ["Total Working Hours", "1,712", Timer],
  ] as const;
  return (
    <div className="space-y-5">
      <PageHeader title="Overview" description="Friday, November 20, 2026" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(([l, v, I]) => <div key={l} className="flex items-center gap-3 rounded border bg-card p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent text-accent-foreground"><I className="h-5 w-5" /></div><div className="min-w-0"><div className="truncate text-xs text-muted-foreground">{l}</div><div className="text-xl font-semibold">{v}</div></div></div>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border bg-card p-4"><div className="mb-3 text-sm font-medium">Recruitment – Sourced vs Hired</div>
          <div className="h-60"><ResponsiveContainer><BarChart data={recruit}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="sourced" fill="var(--chart-5)" radius={[3, 3, 0, 0]} /><Bar dataKey="hired" fill="var(--chart-1)" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        <div className="rounded border bg-card p-4"><div className="mb-3 text-sm font-medium">Weekly Hours Logged</div>
          <div className="h-60"><ResponsiveContainer><LineChart data={hours}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="w" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Line dataKey="hours" stroke="var(--chart-2)" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Timesheet Summary" link="/app/timesheet-management">{SHEETS.slice(0, 5).map((s) => <Row key={s.id} a={s.employee} b={`${s.total.toFixed(1)} hrs`} s={s.status} />)}</Panel>
        <Panel title="Upcoming Follow-ups" link="/app/pipeline">{fu.slice(0, 5).map((r) => <Row key={r.id} a={r.facility} b={r.followUp} s={r.priority} />)}</Panel>
        <Panel title="Recent Activity" link="/app/activity-logs">{MODULES["activity-logs"].rows.slice(0, 5).map((r) => <Row key={r.id} a={r.account} b={r.action.replace(/_/g, " ").toLowerCase()} s={r.status} />)}</Panel>
      </div>
      <Panel title="Recent Candidates" link="/app/candidates">{MODULES.candidates.rows.slice(0, 5).map((r) => <Row key={r.id} a={`${r.name} — ${r.role}`} b={`${r.experience} yrs`} s={r.stage} />)}</Panel>
    </div>
  );
}
function Panel({ title, link, children }: { title: string; link: string; children: React.ReactNode }) {
  return <div className="rounded border bg-card"><div className="flex justify-between border-b px-4 py-2.5 text-sm font-medium">{title}<Link to={link} className="text-xs text-info hover:underline">View all</Link></div><div className="divide-y">{children}</div></div>;
}
function Row({ a, b, s }: { a: string; b: string; s: string }) {
  return <div className="flex items-center justify-between gap-2 px-4 py-2 text-sm"><div className="min-w-0"><div className="truncate">{a}</div><div className="text-xs text-muted-foreground">{b}</div></div><StatusBadge value={s} /></div>;
}

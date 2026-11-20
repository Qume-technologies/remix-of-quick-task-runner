import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/StatusBadge";
import { MODULES } from "@/lib/modules";
export const Route = createFileRoute("/app/permissions")({
  head: () => ({ meta: [{ title: "Permissions – SriMatrix Health" }, { name: "description", content: "Manage access permissions." }, { property: "og:title", content: "Permissions – SriMatrix Health" }, { property: "og:description", content: "Role permissions." }] }),
  component: Page,
});
const FLAGS = ["is_super_admin", "can_manage_permissions", "can_view_candidates", "can_view_directory", "can_view_pipeline", "can_view_timesheets", "can_approve_timesheets", "can_view_invoices", "can_view_immigration", "can_view_hr_documents", "can_view_mail", "widget_recruitment_chart", "widget_timesheet_summary", "widget_activity"];
function Page() {
  const accounts = MODULES["accounts"]!.rows.slice(0, 6);
  const [p, setP] = useState<Record<string, boolean>>({});
  return (
    <div>
      <PageHeader title="Permissions" description="Module, widget and admin flags per account"><Button onClick={() => toast.success("Permissions saved")}>Save</Button></PageHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((a) => (
          <div key={a["id"]} className="rounded border bg-card p-4">
            <div className="mb-3 font-medium">{a["name"]} <span className="text-xs text-muted-foreground">· {a["role"]}</span></div>
            {FLAGS.map((f) => { const k = `${a["id"]}-${f}`; const v = p[k] ?? (a["role"] === "Super Admin" || f.startsWith("can_view"));
              return <label key={f} className="flex items-center justify-between py-1 text-sm"><span className="text-muted-foreground">{f}</span><Switch checked={v} onCheckedChange={(c) => setP({ ...p, [k]: c })} /></label>; })}
          </div>
        ))}
      </div>
    </div>
  );
}

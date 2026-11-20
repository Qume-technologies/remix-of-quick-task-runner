import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Building2, Users, KanbanSquare, FileSignature, Car, Clock, ClipboardCheck, FolderOpen, Plane, Receipt, Mail, KeyRound, UserCog, ShieldCheck, MonitorSmartphone, History, Menu, Bell, ChevronsLeft, ChevronsRight, LogOut, User, HeartPulse } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const NAV: { title: string; to: string; icon: typeof Mail }[] = [
  { title: "Overview", to: "/app", icon: LayoutDashboard },
  { title: "SriMatrix Directory", to: "/app/directory", icon: Building2 },
  { title: "Candidates", to: "/app/candidates", icon: Users },
  { title: "Pipeline", to: "/app/pipeline", icon: KanbanSquare },
  { title: "Job Offers", to: "/app/job-offers", icon: FileSignature },
  { title: "Mileage", to: "/app/mileage", icon: Car },
  { title: "My Timesheets", to: "/app/timesheets", icon: Clock },
  { title: "Timesheet Management", to: "/app/timesheet-management", icon: ClipboardCheck },
  { title: "HR Documents", to: "/app/hr-documents", icon: FolderOpen },
  { title: "Immigration Cases", to: "/app/immigration", icon: Plane },
  { title: "Invoices", to: "/app/invoices", icon: Receipt },
  { title: "Mail", to: "/app/mail", icon: Mail },
  { title: "Email Credentials", to: "/app/email-credentials", icon: KeyRound },
  { title: "Accounts", to: "/app/accounts", icon: UserCog },
  { title: "Permissions", to: "/app/permissions", icon: ShieldCheck },
  { title: "Sessions", to: "/app/sessions", icon: MonitorSmartphone },
  { title: "Activity Logs", to: "/app/activity-logs", icon: History },
];

function NavList({ collapsed, onNav }: { collapsed?: boolean; onNav?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") });
  return (
    <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
      {NAV.map((n) => {
        const active = path === n.to;
        return (
          <Link key={n.to} to={n.to} onClick={() => onNav?.()} title={n.title}
            className={cn("flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/60", collapsed && "justify-center px-2")}>
            <n.icon className="h-4 w-4 shrink-0" />{!collapsed && <span className="truncate">{n.title}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground"><HeartPulse className="h-4 w-4" /></div>
      {!collapsed && <div className="leading-tight"><div className="text-sm font-semibold text-sidebar-primary">SriMatrix</div><div className="text-[11px] text-sidebar-foreground">Health</div></div>}
    </div>
  );
}

const NOTES = [
  { t: "Timesheet submitted by Priya Raman", s: "5 min ago" },
  { t: "Follow-up overdue: Mercy General", s: "1 hr ago" },
  { t: "H-1B case RFE received", s: "Yesterday" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [notes, setNotes] = useState(NOTES);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") });
  const current = NAV.find((n) => n.to === path);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className={cn("hidden md:flex sticky top-0 h-screen flex-col bg-sidebar transition-[width] duration-200", collapsed ? "w-16" : "w-60")}>
        <Brand collapsed={collapsed} />
        <NavList collapsed={collapsed} />
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center justify-center gap-2 border-t border-sidebar-border py-3 text-xs text-sidebar-foreground hover:bg-sidebar-accent">
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" />Collapse</>}
        </button>
      </aside>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border flex flex-col">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Brand /><NavList onNav={() => setMobile(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card px-3 sm:px-5">
          <button className="md:hidden rounded p-2 hover:bg-muted" onClick={() => setMobile(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div className="min-w-0 flex-1 text-sm">
            <span className="hidden sm:inline text-muted-foreground">SriMatrix Health / </span>
            <span className="font-medium text-foreground truncate">{current?.title ?? "Overview"}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="relative rounded p-2 hover:bg-muted" aria-label="Notifications">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {notes.length > 0 && <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-destructive px-1 text-[10px] leading-4 text-destructive-foreground">{notes.length}</span>}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="flex justify-between">Notifications {notes.length > 0 && <button className="text-xs text-info" onClick={() => setNotes([])}>Mark all read</button>}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notes.length === 0 ? <div className="p-3 text-sm text-muted-foreground">You're all caught up.</div> : notes.map((n, i) => (
                <DropdownMenuItem key={i} onClick={() => setNotes(notes.filter((_, j) => j !== i))} className="flex-col items-start"><span className="text-sm">{n.t}</span><span className="text-xs text-muted-foreground">{n.s}</span></DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded p-1 hover:bg-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">AD</div>
              <span className="hidden lg:block text-sm font-medium">Admin User</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel><div>Admin User</div><div className="text-xs font-normal text-muted-foreground">admin@srimatrix.com</div></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/app/$module", params: { module: "accounts" } })}><User className="mr-2 h-4 w-4" />My Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { toast.success("Signed out"); navigate({ to: "/" }); }}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}


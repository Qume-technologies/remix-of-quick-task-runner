import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, HeartPulse, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sign in – SriMatrix Health" },
    { name: "description", content: "Sign in to SriMatrix Health workforce management." },
    { property: "og:title", content: "Sign in – SriMatrix Health" },
    { property: "og:description", content: "Workforce management for healthcare staffing." },
  ] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@srimatrix.com");
  const [pw, setPw] = useState("password");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return toast.error("Enter your work email and password");
    setLoading(true);
    setTimeout(() => { toast.success("Welcome back"); nav({ to: "/app" }); }, 600);
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-sidebar p-12 text-sidebar-foreground">
        <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground"><HeartPulse className="h-5 w-5" /></div><span className="text-lg font-semibold text-sidebar-primary">SriMatrix Health</span></div>
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight text-sidebar-primary">Workforce management built for healthcare staffing.</h2>
          <p className="mt-4 text-sm">Recruitment, timesheets, immigration, invoicing and HR — one secure workspace for your team.</p>
        </div>
        <div className="flex items-center gap-2 text-xs"><ShieldCheck className="h-4 w-4" />HIPAA-conscious · Role-based access</div>
      </div>
      <div className="flex items-center justify-center bg-background p-6">
        <form onSubmit={submit} className="w-full max-w-sm rounded-lg border bg-card p-7 shadow-sm">
          <div className="mb-6 lg:hidden flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground"><HeartPulse className="h-4 w-4" /></div><span className="font-semibold text-primary">SriMatrix Health</span></div>
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="mb-6 text-sm text-muted-foreground">Use your SriMatrix work account.</p>
          <Label className="mb-1 block text-xs">Work Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
          <Label className="mb-1 block text-xs">Password</Label>
          <div className="relative mb-4">
            <Input type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} className="pr-10" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-2 text-muted-foreground" aria-label="Toggle password">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2"><Checkbox defaultChecked />Remember me</label>
            <button type="button" className="text-info hover:underline" onClick={() => toast.info(`Reset link sent to ${email}`)}>Forgot password?</button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
        </form>
      </div>
    </div>
  );
}

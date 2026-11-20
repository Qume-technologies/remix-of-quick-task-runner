import { createFileRoute, notFound } from "@tanstack/react-router";
import { CrudPage } from "@/components/CrudPage";
import { MODULES } from "@/lib/modules";
export const Route = createFileRoute("/app/$module")({
  loader: ({ params }) => { if (!MODULES[params.module]) throw notFound(); return { title: MODULES[params.module].title }; },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? "Module"} – SriMatrix Health` }, { name: "description", content: `${loaderData?.title ?? ""} in SriMatrix Health` }, { property: "og:title", content: `${loaderData?.title ?? ""} – SriMatrix Health` }, { property: "og:description", content: "SriMatrix Health workforce management" }] }),
  component: Page,
});
function Page() { const { module } = Route.useParams(); return <CrudPage key={module} config={MODULES[module]} />; }

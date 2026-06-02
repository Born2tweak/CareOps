import Link from "next/link";

type PlaceholderPageProps = {
  title: string;
  description: string;
  milestone: string;
  backHref?: string;
};

export function PlaceholderPage({
  title,
  description,
  milestone,
  backHref = "/admin",
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {milestone} — not built yet
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <p className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        This route is reserved in the admin shell so navigation and layout stay
        stable while features ship milestone by milestone.
      </p>
      <Link
        href={backHref}
        className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

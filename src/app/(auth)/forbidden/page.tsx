import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authSignOut } from "@/app/(auth)/actions";

export default function ForbiddenPage() {
  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
        <p className="text-sm text-muted-foreground">
          This account does not have administrator access to CareOps.
        </p>
      </div>
      <form action={authSignOut}>
        <Button type="submit" variant="outline" className="w-full">
          Sign out
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        Need access? Contact your CareOps administrator.
      </p>
      <Link
        href="/login"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}

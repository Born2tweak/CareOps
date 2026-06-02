"use client";

import { useActionState } from "react";

import { markAllReadAction } from "@/app/(admin)/admin/notifications/actions";
import { Button } from "@/components/ui/button";

export function MarkAllReadButton() {
  const [, formAction, pending] = useActionState(
    async () => {
      await markAllReadAction();
    },
    undefined,
  );

  return (
    <form action={formAction}>
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "Marking…" : "Mark All Read"}
      </Button>
    </form>
  );
}

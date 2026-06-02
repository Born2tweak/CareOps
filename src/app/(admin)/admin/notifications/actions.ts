"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { markAllNotificationsRead } from "@/lib/notifications/queries";

export async function markAllReadAction() {
  await requireAdmin();
  await markAllNotificationsRead();
  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
}

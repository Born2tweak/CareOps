"use server";

import { signOut } from "@/lib/auth";

export async function authSignOut() {
  await signOut();
}

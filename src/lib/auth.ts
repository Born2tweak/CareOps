import { UserRole } from "@prisma/client";
import type { User as AuthUser } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getAppUser() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return null;
  }

  return prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });
}

export async function requireAdmin() {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/login");
  }

  const appUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  if (!appUser || appUser.role !== UserRole.ADMIN) {
    redirect("/forbidden");
  }

  return { authUser, appUser };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

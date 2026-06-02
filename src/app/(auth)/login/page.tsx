import { LoginForm } from "@/app/(auth)/login/login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath =
    params.next?.startsWith("/admin") ? params.next : undefined;

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">CareOps Admin</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with your administrator account.
        </p>
      </div>
      <LoginForm nextPath={nextPath} />
      <p className="text-center text-xs text-muted-foreground">
        No public signup. First admin: create a user in Supabase Auth, then run{" "}
        <code className="text-[0.7rem]">npm run db:seed-admin</code> (see README).
      </p>
    </div>
  );
}

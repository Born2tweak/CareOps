import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
};

export function SurfaceCard({
  children,
  className,
  as: Component = "div",
}: SurfaceCardProps) {
  return (
    <Component
      className={cn(
        "rounded-lg border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </Component>
  );
}

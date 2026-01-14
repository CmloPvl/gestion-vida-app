// components/ui/skeleton.tsx
import { cn } from "@/lib/utils" // Asegúrate de que tienes un archivo cn para tus utilidades de Tailwind

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  )
}

export { Skeleton }
import { Skeleton } from "../ui/skeleton"

export function PageFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-[60vh] w-full rounded-xl" />
    </div>
  )
}

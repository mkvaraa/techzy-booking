import { Link } from "react-router"
import { CompassIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/EmptyState"

export function NotFound() {
  return (
    <div className="py-10">
      <EmptyState
        icon={CompassIcon}
        title="Page not found"
        description="The page you are looking for doesn't exist or may have been moved."
        action={
          <Button asChild>
            <Link to="/">Back to dashboard</Link>
          </Button>
        }
      />
    </div>
  )
}

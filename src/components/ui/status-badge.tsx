import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "clean" | "needs-attention" | "overdue" | "critical";
  children: React.ReactNode;
  className?: string;
}

const statusVariants = {
  clean: "bg-success text-success-foreground hover:bg-success/80",
  "needs-attention": "bg-warning text-warning-foreground hover:bg-warning/80",
  overdue: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  critical: "bg-destructive text-destructive-foreground hover:bg-destructive/80 animate-pulse"
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(statusVariants[status], className)}
    >
      {children}
    </Badge>
  );
}
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn(
      "p-6 bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-200",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        
        {change && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}>
            {change}
          </div>
        )}
      </div>
    </Card>
  );
}
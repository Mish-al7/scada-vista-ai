import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  variant?: "success" | "warning" | "danger" | "default";
  trend?: "up" | "down" | "stable";
  className?: string;
}

export function StatusCard({ 
  title, 
  value, 
  description, 
  icon, 
  variant = "default",
  trend,
  className 
}: StatusCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-gradient-status-success";
      case "warning":
        return "border-warning/20 bg-gradient-status-warning";
      case "danger":
        return "border-destructive/20 bg-gradient-status-danger";
      default:
        return "border-border bg-gradient-card";
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "danger":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card className={cn(
      "shadow-card hover:shadow-card-hover transition-all duration-300",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            variant === "success" && "bg-success/20 text-success",
            variant === "warning" && "bg-warning/20 text-warning", 
            variant === "danger" && "bg-destructive/20 text-destructive",
            variant === "default" && "bg-primary/20 text-primary"
          )}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", getValueColor())}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <span className={cn(
              "flex items-center",
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              trend === "stable" && "text-muted-foreground"
            )}>
              {trend === "up" && "↗"} 
              {trend === "down" && "↘"}
              {trend === "stable" && "→"}
              <span className="ml-1 capitalize">{trend}</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
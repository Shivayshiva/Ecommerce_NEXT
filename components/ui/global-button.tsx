import { ReactNode } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GlobalButtonProps extends Omit<ButtonProps, "children"> {
  title: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function GlobalButton({
  title,
  icon,
  iconPosition = "left",
  className,
  size = "default",
  variant = "default",
  ...props
}: GlobalButtonProps) {
  return (
    <Button
      size={size}
      variant={variant}
      className={cn(
        // Default styles
        "inline-flex items-center gap-2 font-medium transition-all duration-200",
        // Custom className override
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      <span>{title}</span>
      {icon && iconPosition === "right" && icon}
    </Button>
  );
}
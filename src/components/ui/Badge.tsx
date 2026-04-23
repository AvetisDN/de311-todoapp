import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex justify-center items-center rounded-full border border-border px-3.5 py-1 text-sm font-semibold transition ",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground border-transparent",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        outline: "text-foreground",
        success: "bg-green-300 text-green-950 border-transparent",
        warning: "bg-yellow-300 text-yellow-950 border-transparent",
        info: "bg-sky-300 text-sky-950 border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props}></div>
  );
};

export default Badge;

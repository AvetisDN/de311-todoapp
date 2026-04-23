import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex gap-2 justify-center items-center whitespace-nowrap rounded-md font-medium ring-offset-background transition duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none hover:opacity-80 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input text-foreground hover:bg-border",
        destructive: "bg-destructive text-destructive-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-destructive hover:text-destructive-foreground",
        link: "text-primary hover:underline underline-offset-4",
      },
      size: {
        default: "px-5 py-3",
        sm: "rounded-sm text-sm px-4 py-2",
        lg: "rounded-lg text-lg px-7 py-4",
        icon: "p-0 w-10 h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      size,
      variant,
      asChild = false,
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

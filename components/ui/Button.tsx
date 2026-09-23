import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.99]";

    const variantStyles = {
      primary:
        "bg-brand-700 text-paper-50 hover:bg-brand-500 shadow-sm dark:bg-brand-500 dark:hover:bg-brand-300",
      secondary:
        "bg-transparent border border-line text-ink-900 hover:bg-paper-200/60 dark:text-paper-50 dark:border-ink-line dark:hover:bg-ink-surface-2",
      tertiary:
        "bg-transparent text-brand-700 hover:text-brand-500 hover:bg-paper-200/40 dark:text-brand-300 dark:hover:bg-ink-surface-2",
      ghost:
        "bg-transparent text-ink-700 hover:text-ink-900 hover:bg-paper-200/40 dark:text-paper-200 dark:hover:text-paper-50 dark:hover:bg-ink-surface-2",
      destructive:
        "bg-semantic-error/15 text-semantic-error border border-semantic-error/30 hover:bg-semantic-error/25 dark:bg-semantic-error/20",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-10 px-4 py-2 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

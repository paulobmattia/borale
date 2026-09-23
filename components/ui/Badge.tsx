import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "brand"
    | "outline"
    | "success"
    | "warning"
    | "error"
    | "info";
  pill?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", pill = true, ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-paper-200 text-ink-700 border-line dark:bg-ink-surface dark:text-paper-200 dark:border-ink-line",
      brand:
        "bg-brand-700/15 text-brand-700 border-brand-700/30 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/40",
      outline:
        "bg-transparent text-ink-700 border-line dark:text-paper-200 dark:border-ink-line",
      success:
        "bg-[#B8D86A]/25 text-[#425916] border-[#B8D86A]/50 dark:bg-[#B8D86A]/20 dark:text-[#B8D86A]",
      warning:
        "bg-[#F4D35E]/25 text-[#735900] border-[#F4D35E]/50 dark:bg-[#F4D35E]/20 dark:text-[#F4D35E]",
      error:
        "bg-[#E9827D]/25 text-[#7F241F] border-[#E9827D]/50 dark:bg-[#E9827D]/20 dark:text-[#E9827D]",
      info:
        "bg-[#7DBBDA]/25 text-[#18536F] border-[#7DBBDA]/50 dark:bg-[#7DBBDA]/20 dark:text-[#7DBBDA]",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2 py-0.5 text-xs font-sans font-medium border select-none transition-colors whitespace-nowrap flex-shrink-0",
          pill ? "rounded-full" : "rounded-sm",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

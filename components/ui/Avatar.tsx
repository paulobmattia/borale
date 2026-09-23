import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallbackText, size = "md", ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const sizeStyles = {
      sm: "w-7 h-7 text-xs",
      md: "w-9 h-9 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    const getInitials = (text?: string) => {
      if (!text) return "•";
      const parts = text.trim().split(" ");
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden border border-line bg-paper-200 text-ink-900 font-sans font-semibold flex-shrink-0 select-none",
          "dark:border-ink-line dark:bg-ink-surface dark:text-paper-50",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="leading-none">{getInitials(fallbackText || alt)}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

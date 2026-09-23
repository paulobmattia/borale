import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "w-full h-11 px-3.5 py-2 text-sm font-sans rounded-md border border-line bg-paper-100 text-ink-900 placeholder:text-ink-500 transition duration-150",
            "dark:bg-ink-surface dark:border-ink-line dark:text-paper-50 dark:placeholder:text-ink-500",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-semantic-error focus-visible:ring-semantic-error text-semantic-error",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-ink-500 dark:text-paper-200/70">{hint}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-semantic-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "w-full min-h-[90px] p-3 text-sm font-sans rounded-md border border-line bg-paper-100 text-ink-900 placeholder:text-ink-500 transition duration-150",
            "dark:bg-ink-surface dark:border-ink-line dark:text-paper-50 dark:placeholder:text-ink-500",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-semantic-error focus-visible:ring-semantic-error text-semantic-error",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-ink-500 dark:text-paper-200/70">{hint}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-semantic-error">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

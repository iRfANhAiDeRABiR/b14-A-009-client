import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Input({
  id,
  name,
  type = "text",
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  leftIcon,
  rightElement,
  className,
  wrapperClassName,
  ref,
  ...props
}) {
  const generatedId = React.useId();
  const inputId = id || name || generatedId;
  const messageId = `${inputId}-description`;
  const hasMessage = Boolean(error || helperText);

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="flex items-center gap-1 text-sm font-medium text-foreground"
        >
          <span>{label}</span>
          {required ? (
            <span aria-hidden="true" className="text-danger">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative flex items-center">
        {leftIcon ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 flex items-center text-muted"
          >
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cn(
            "min-h-11 w-full rounded-lg border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors duration-150 placeholder:text-muted focus:outline-none focus:ring-2 sm:text-sm",
            error
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border focus:border-primary focus:ring-primary/20",
            disabled && "cursor-not-allowed bg-surface-subtle text-muted opacity-70",
            leftIcon && "pl-10",
            rightElement && "pr-11",
            className
          )}
          {...props}
        />

        {rightElement ? (
          <div className="absolute right-2.5 flex items-center">{rightElement}</div>
        ) : null}
      </div>

      {error ? (
        <p
          id={messageId}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-danger"
        >
          <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={messageId} className="text-xs text-text-secondary">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

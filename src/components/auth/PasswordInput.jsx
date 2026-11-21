"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function PasswordInput({
  id,
  name = "password",
  label = "Password",
  placeholder = "Enter your password",
  autoComplete = "current-password",
  value,
  onChange,
  error,
  helperText,
  required = true,
  disabled = false,
  ...props
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      label={label}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      leftIcon={<Lock className="size-4" />}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      }
      {...props}
    />
  );
}

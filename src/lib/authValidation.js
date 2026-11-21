export const PASSWORD_RULES = {
  minLength: 6,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function evaluatePasswordRules(password = "") {
  const value = typeof password === "string" ? password : "";
  const hasMinLength = value.length >= PASSWORD_RULES.minLength;
  const hasUppercase = PASSWORD_RULES.hasUppercase.test(value);
  const hasLowercase = PASSWORD_RULES.hasLowercase.test(value);

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    isValid: hasMinLength && hasUppercase && hasLowercase,
  };
}

export function validateEmail(email) {
  const trimmed = String(email || "").trim();
  if (!trimmed) {
    return "Email address is required.";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address (e.g., name@company.com).";
  }
  return "";
}

export function validatePassword(
  password,
  { requireComplexity = true } = {}
) {
  const value = typeof password === "string" ? password : "";
  if (!value) {
    return "Password is required.";
  }
  if (!requireComplexity) {
    return "";
  }

  const rules = evaluatePasswordRules(value);
  if (!rules.hasUppercase) {
    return "Password must include at least 1 uppercase letter.";
  }
  if (!rules.hasLowercase) {
    return "Password must include at least 1 lowercase letter.";
  }
  if (!rules.hasMinLength) {
    return `Password must be at least ${PASSWORD_RULES.minLength} characters long.`;
  }

  return "";
}

export function validateImageUrl(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "Profile photo URL must start with http:// or https://.";
    }
    return "";
  } catch {
    return "Enter a valid image URL (e.g., https://example.com/photo.jpg).";
  }
}

export function isSafeRedirectPath(target) {
  if (typeof target !== "string") return false;
  const trimmed = target.trim();
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return false;
  return true;
}

export function sanitizeRedirectPath(target, fallback = "/") {
  const safeFallback = isSafeRedirectPath(fallback) ? fallback : "/";
  if (!isSafeRedirectPath(target)) {
    return safeFallback;
  }

  const trimmed = target.trim();
  if (
    trimmed === "/login" ||
    trimmed.startsWith("/login?") ||
    trimmed.startsWith("/login/") ||
    trimmed === "/register" ||
    trimmed.startsWith("/register?") ||
    trimmed.startsWith("/register/")
  ) {
    return safeFallback;
  }

  return trimmed;
}

export function buildLoginRedirectUrl(destinationPath = "/") {
  const safePath = sanitizeRedirectPath(destinationPath, "/");
  if (safePath === "/") {
    return "/login";
  }
  return `/login?redirectTo=${encodeURIComponent(safePath)}`;
}

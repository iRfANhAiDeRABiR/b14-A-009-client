import { authClient, isAuthBackendConfigured } from "@/lib/auth-client";
import { sanitizeRedirectPath } from "@/lib/authValidation";
import {
  clearAccessTokenCache,
  getAccessToken,
} from "@/lib/token-provider";

const IMGBB_API_KEY = (process.env.NEXT_PUBLIC_IMGBB_API_KEY || "").trim();
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function hasImgBBConfigured() {
  return Boolean(
    IMGBB_API_KEY && !IMGBB_API_KEY.toLowerCase().includes("your-")
  );
}

export function extractAuthErrorMessage(
  error,
  fallback = "Authentication request could not be completed."
) {
  if (!error) return fallback;

  const rawMessage =
    typeof error === "string"
      ? error
      : error?.message || error?.statusText || "";

  const normalized = String(rawMessage).trim();
  if (!normalized) return fallback;

  const lower = normalized.toLowerCase();
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("econnrefused") ||
    lower.includes("load failed")
  ) {
    return "Unable to reach the GearNest authentication server. Confirm the Express backend is running and CORS allows this origin.";
  }

  if (lower.includes("invalid email or password")) {
    return "Invalid email or password. Please verify your credentials and try again.";
  }

  if (lower.includes("already exists") || lower.includes("already registered")) {
    return "An account with this email address already exists. Please sign in instead.";
  }

  return normalized;
}

function assertBackendReady() {
  if (!isAuthBackendConfigured) {
    throw new Error(
      "Authentication backend URL (NEXT_PUBLIC_API_BASE_URL) is not configured yet. Configure the Express server URL in .env.local before signing in."
    );
  }
}

export async function uploadProfilePhotoToImgBB(file) {
  if (!file) {
    throw new Error("Please select an image file to upload.");
  }

  if (!hasImgBBConfigured()) {
    throw new Error(
      "Image upload key is not configured. Paste a direct HTTPS photo URL instead."
    );
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported image format. Please choose a JPG, PNG, or WebP file.");
  }

  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("Profile photo must be 5 MB or smaller.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(IMGBB_API_KEY)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.success) {
    throw new Error(
      payload?.error?.message || "Failed to upload profile photo. Please try again or use a direct URL."
    );
  }

  const uploadedUrl = payload?.data?.display_url || payload?.data?.url;
  if (!uploadedUrl) {
    throw new Error("Upload completed without a valid image URL.");
  }

  return uploadedUrl;
}

/**
 * Register a new customer account via Better Auth.
 * Public registration strictly relies on server-enforced `customer` default role
 * and never transmits privileged role overrides.
 */
export async function registerWithEmail({ name, email, password, image = "" }) {
  assertBackendReady();
  clearAccessTokenCache();

  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanImage = String(image || "").trim();

  const result = await authClient.signUp.email({
    name: cleanName,
    email: cleanEmail,
    password,
    ...(cleanImage ? { image: cleanImage } : {}),
  });

  if (result?.error) {
    throw new Error(
      extractAuthErrorMessage(result.error, "Unable to create your account.")
    );
  }

  const sessionResult = await authClient.getSession().catch(() => null);
  const user = sessionResult?.data?.user || result?.data?.user || null;
  const session = sessionResult?.data?.session || null;

  if (!user) {
    throw new Error("Account creation response was incomplete. Please sign in to continue.");
  }

  await getAccessToken({ forceRefresh: true }).catch(() => null);

  return {
    user,
    session,
  };
}

export async function loginWithEmail({ email, password }) {
  assertBackendReady();
  clearAccessTokenCache();

  const cleanEmail = String(email || "").trim().toLowerCase();

  const result = await authClient.signIn.email({
    email: cleanEmail,
    password,
    rememberMe: true,
  });

  if (result?.error) {
    throw new Error(
      extractAuthErrorMessage(
        result.error,
        "Invalid email or password. Please try again."
      )
    );
  }

  const sessionResult = await authClient.getSession().catch(() => null);
  const user = sessionResult?.data?.user || result?.data?.user || null;
  const session = sessionResult?.data?.session || null;

  if (!user) {
    throw new Error(
      "Sign-in succeeded, but no active session could be established. Confirm backend cookies/CORS settings."
    );
  }

  await getAccessToken({ forceRefresh: true }).catch(() => null);

  return {
    user,
    session,
  };
}

export async function loginWithGoogle({ redirectTo = "/" } = {}) {
  assertBackendReady();
  clearAccessTokenCache();

  const safePath = sanitizeRedirectPath(redirectTo, "/dashboard");
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const callbackURL = origin ? `${origin}${safePath}` : safePath;
  const errorParams = new URLSearchParams({
    authError: "google_oauth_failed",
    ...(safePath !== "/dashboard" ? { callbackURL: safePath } : {}),
  });
  const errorCallbackURL = origin
    ? `${origin}/login?${errorParams.toString()}`
    : `/login?${errorParams.toString()}`;

  const result = await authClient.signIn.social({
    provider: "google",
    callbackURL,
    errorCallbackURL,
  });

  if (result?.error) {
    throw new Error(
      extractAuthErrorMessage(
        result.error,
        "Google sign-in could not be started. Verify Google OAuth settings on the backend."
      )
    );
  }

  return result;
}

export async function logoutUser() {
  clearAccessTokenCache();

  if (!isAuthBackendConfigured) {
    return;
  }

  try {
    const result = await authClient.signOut();
    if (result?.error) {
      throw new Error(
        extractAuthErrorMessage(result.error, "Unable to sign out cleanly.")
      );
    }
  } finally {
    clearAccessTokenCache();
  }
}

export async function refreshSession() {
  if (!isAuthBackendConfigured) {
    clearAccessTokenCache();
    return { user: null, session: null };
  }

  const result = await authClient.getSession();
  const user = result?.data?.user ?? null;
  const session = result?.data?.session ?? null;

  if (!user || !session) {
    clearAccessTokenCache();
    return { user: null, session: null };
  }

  await getAccessToken({ forceRefresh: true }).catch(() => null);
  return { user, session };
}

import { ApiError, apiRequest } from "@/lib/apiClient";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

/**
 * Submit a customer/owner/general contact inquiry to Express backend:
 * POST {NEXT_PUBLIC_API_BASE_URL}/api/contact
 * Never simulates a successful submission if backend URL is unset or unreachable.
 */
export async function submitContactMessage({
  name,
  email,
  inquiryType,
  subject,
  message,
}) {
  if (!API_BASE_URL) {
    throw new ApiError(
      "Contact submission endpoint (POST /api/contact) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured yet.",
      { status: 503, code: "SERVICE_UNAVAILABLE" }
    );
  }

  return apiRequest("/api/contact", {
    method: "POST",
    body: {
      name: String(name || "").trim(),
      email: String(email || "").trim(),
      inquiryType: String(inquiryType || "").trim(),
      subject: String(subject || "").trim(),
      message: String(message || "").trim(),
    },
    authRequired: false,
  });
}

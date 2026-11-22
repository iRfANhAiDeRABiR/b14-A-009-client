import { ApiError, buildApiErrorFromResponse, notifySessionExpired } from "@/lib/apiClient";
import { validateEquipmentImageFile } from "@/lib/ownerUtils";
import { clearAccessTokenCache, getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

/**
 * Upload an equipment image securely through the Express backend upload endpoint:
 * POST {NEXT_PUBLIC_API_BASE_URL}/api/uploads/equipment-image (multipart/form-data)
 *
 * ImgBB API credentials stay strictly server-side; the frontend never reads or sends
 * a private ImgBB key.
 */
export async function uploadEquipmentImage(
  file,
  { onProgress = null, token = null } = {}
) {
  const fileError = validateEquipmentImageFile(file);
  if (fileError) {
    throw new Error(fileError);
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError("Authentication required to upload equipment images.", {
      status: 401,
      code: "UNAUTHORIZED",
      requiresAuth: true,
    });
  }

  if (!API_BASE_URL) {
    throw new ApiError(
      "Image upload endpoint (POST /api/uploads/equipment-image) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured.",
      {
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      }
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/api/uploads/equipment-image`, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${activeToken}`);

    if (xhr.upload && typeof onProgress === "function") {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const percent = Math.min(
            99,
            Math.max(1, Math.round((event.loaded / event.total) * 100))
          );
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      let payload = {};
      try {
        payload = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        payload = {};
      }

      if (xhr.status === 401) {
        clearAccessTokenCache();
        notifySessionExpired({ path: "/api/uploads/equipment-image", status: 401 });
        reject(buildApiErrorFromResponse(401, payload));
        return;
      }

      if (xhr.status === 403) {
        reject(buildApiErrorFromResponse(403, payload));
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        const message =
          payload?.message ||
          payload?.error?.message ||
          `Image upload endpoint responded with status ${xhr.status}.`;
        reject(
          new ApiError(message, {
            status: xhr.status,
            code: payload?.code || "UPLOAD_FAILED",
          })
        );
        return;
      }

      const hostedUrl =
        payload?.data?.url ||
        payload?.data?.display_url ||
        payload?.imageUrl ||
        payload?.url ||
        "";

      if (
        typeof hostedUrl !== "string" ||
        !/^https?:\/\//i.test(hostedUrl.trim())
      ) {
        reject(
          new Error(
            "Image upload succeeded without a valid hosted image URL from the server."
          )
        );
        return;
      }

      if (typeof onProgress === "function") {
        onProgress(100);
      }

      resolve({
        url: hostedUrl.trim(),
        deleteUrl: String(payload?.data?.deleteUrl || payload?.deleteUrl || ""),
      });
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network error while reaching POST /api/uploads/equipment-image. Verify the Express upload endpoint is running."
        )
      );
    };

    xhr.onabort = () => {
      reject(new Error("Image upload was cancelled."));
    };

    xhr.send(formData);
  });
}

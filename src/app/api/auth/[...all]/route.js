const RAW_BACKEND_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ""
)
  .trim()
  .replace(/\/+$/, "");

const IS_BACKEND_CONFIGURED = Boolean(
  RAW_BACKEND_URL && !RAW_BACKEND_URL.toLowerCase().includes("your-")
);

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "authorization",
  "content-type",
  "cookie",
  "origin",
  "referer",
  "user-agent",
  "x-requested-with",
];

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "set-cookie",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function adaptSetCookieForSameOrigin(rawCookie, { isHttps }) {
  // Make proxied session cookies strictly first-party host-only (`SameSite=Lax`)
  // so privacy modes like Chrome Incognito accept and retain HTTP-only auth sessions.
  let adapted = rawCookie
    .replace(/;\s*Domain=[^;]*/gi, "")
    .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");

  if (!isHttps) {
    adapted = adapted.replace(/;\s*Secure\b/gi, "");
  }

  return adapted;
}

async function handleAuthProxy(request, context) {
  const params = await context.params;
  const segments = Array.isArray(params?.all) ? params.all : [];
  const subPath = segments.join("/");

  if (!IS_BACKEND_CONFIGURED) {
    if (subPath === "get-session") {
      return Response.json(null, {
        status: 200,
        headers: { "cache-control": "no-store" },
      });
    }

    return Response.json(
      {
        code: "BACKEND_NOT_CONFIGURED",
        message:
          "Authentication backend URL (NEXT_PUBLIC_API_BASE_URL) is not configured.",
      },
      { status: 503, headers: { "cache-control": "no-store" } }
    );
  }

  const incomingUrl = new URL(request.url);
  const targetUrl = `${RAW_BACKEND_URL}/api/auth/${subPath}${incomingUrl.search}`;
  const forwardedProto = (request.headers.get("x-forwarded-proto") || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const forwardedHost = (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    incomingUrl.host
  )
    .split(",")[0]
    .trim();
  const isHttps = forwardedProto
    ? forwardedProto === "https"
    : incomingUrl.protocol === "https:";

  const upstreamHeaders = new Headers();
  for (const headerName of FORWARDED_REQUEST_HEADERS) {
    const val = request.headers.get(headerName);
    if (val) {
      upstreamHeaders.set(headerName, val);
    }
  }

  upstreamHeaders.set("x-forwarded-host", forwardedHost);
  upstreamHeaders.set("x-forwarded-proto", isHttps ? "https" : "http");

  const hasBody = !["GET", "HEAD"].includes(request.method.toUpperCase());
  const requestBody = hasBody ? await request.arrayBuffer() : undefined;

  let upstreamResponse;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers: upstreamHeaders,
      body: requestBody && requestBody.byteLength > 0 ? requestBody : undefined,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    return Response.json(
      {
        code: "AUTH_PROXY_UNREACHABLE",
        message: "Unable to reach the authentication server right now.",
      },
      { status: 502, headers: { "cache-control": "no-store" } }
    );
  }

  const responseHeaders = new Headers();
  upstreamResponse.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });
  responseHeaders.set("cache-control", "no-store");

  const setCookies =
    typeof upstreamResponse.headers.getSetCookie === "function"
      ? upstreamResponse.headers.getSetCookie()
      : [];
  for (const rawCookie of setCookies) {
    responseHeaders.append(
      "set-cookie",
      adaptSetCookieForSameOrigin(rawCookie, { isHttps })
    );
  }

  if ([204, 205, 304].includes(upstreamResponse.status)) {
    return new Response(null, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  }

  const bodyBuffer = await upstreamResponse.arrayBuffer();
  return new Response(bodyBuffer.byteLength > 0 ? bodyBuffer : null, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(request, context) {
  return handleAuthProxy(request, context);
}

export async function POST(request, context) {
  return handleAuthProxy(request, context);
}

export async function PUT(request, context) {
  return handleAuthProxy(request, context);
}

export async function PATCH(request, context) {
  return handleAuthProxy(request, context);
}

export async function DELETE(request, context) {
  return handleAuthProxy(request, context);
}

export async function OPTIONS(request, context) {
  return handleAuthProxy(request, context);
}

export async function HEAD(request, context) {
  return handleAuthProxy(request, context);
}

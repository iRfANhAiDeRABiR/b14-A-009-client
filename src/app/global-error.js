"use client";

export default function GlobalErrorPage({ reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: "#F7F8F4",
          color: "#202923",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "460px",
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E9E3",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#B42318",
            }}
          >
            GearNest Recovery
          </p>
          <h1
            style={{
              margin: "12px 0 8px",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#4E5B52",
            }}
          >
            A critical application error occurred. Reload the workspace cleanly to recover your session.
          </p>
          <button
            type="button"
            onClick={() => reset?.()}
            style={{
              cursor: "pointer",
              backgroundColor: "#193D34",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}

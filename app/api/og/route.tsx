import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #0f172a 100%)",
          color: "#e2e8f0",
          padding: "72px",
          gap: "18px",
          fontFamily: "Inter, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "10px 16px",
            borderRadius: "999px",
            letterSpacing: "0.06em",
            fontSize: 22,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background:
                "conic-gradient(from 45deg, #c084fc, #38bdf8, #22c55e, #fbbf24, #c084fc)",
              boxShadow: "0 0 16px rgba(88, 28, 135, 0.4)",
            }}
          />
          Elevate Your Shopping
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#f8fafc",
            textShadow: "0 12px 40px rgba(0,0,0,0.28)",
          }}
        >
          Discover premium products with a seamless experience.
        </div>

        <div
          style={{
            fontSize: 28,
            maxWidth: "72%",
            color: "#cbd5e1",
            lineHeight: 1.4,
          }}
        >
          Handpicked collections, swift checkout, and trusted delivery—designed for shoppers who expect more.
        </div>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              padding: "14px 24px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #22d3ee, #a855f7)",
              color: "#0f172a",
              fontSize: 24,
              fontWeight: 700,
              boxShadow: "0 12px 30px rgba(34, 211, 238, 0.35)",
            }}
          >
            Shop Now →
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 12px rgba(34, 197, 94, 0.7)",
              }}
            />
            Trusted by thousands of happy customers
          </div>
        </div>
      </div>
    ),
    size
  );
}
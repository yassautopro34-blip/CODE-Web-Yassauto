import { ImageResponse } from "next/og";

export const alt = "YASSAUTO, garage automobile à Gigean près de Montpellier";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#09090b",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ color: "#dc2626", fontSize: 34, fontWeight: 700 }}>YASSAUTO MKLF</div>
      <div style={{ fontSize: 72, fontWeight: 900, marginTop: 24 }}>Garage automobile</div>
      <div style={{ color: "#d4d4d8", fontSize: 38, marginTop: 20 }}>Gigean · Montpellier</div>
      <div style={{ color: "#a1a1aa", fontSize: 26, marginTop: 48 }}>
        Mécanique · Diagnostic · Pièces · Accompagnement
      </div>
    </div>,
    { ...size },
  );
}
"use client";

import React from "react";

export default function BackgroundScene() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Main Gold Radial Glow from Center - Stadium Floodlight Effect */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          background: "radial-gradient(circle, rgba(245, 166, 35, 0.08) 0%, rgba(245, 166, 35, 0.03) 30%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Secondary Warm Amber Glow from Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "40%",
          background: "radial-gradient(circle, rgba(212, 137, 26, 0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Subtle Grid Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

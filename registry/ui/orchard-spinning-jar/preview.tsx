"use client";

import { useEffect, useRef, useState } from "react";
import { OrchardSpinningJar, type OrchardSpinningJarHandle } from "./component";
import { jarArt, labelArt } from "./jar-art";

export default function OrchardSpinningJarPreview() {
  const handle = useRef<OrchardSpinningJarHandle | null>(null);
  const [progress, setProgress] = useState(0);
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const sync = () => setWide(window.innerWidth > 1024);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  useEffect(() => {
    handle.current?.setSpin(progress);
  }, [progress]);
  return (
    <div style={{ background: "var(--rk-bg)", height: "100dvh", overflow: "hidden", position: "relative" }}>
      <OrchardSpinningJar
        jarImage={jarArt("goldenrod")}
        labelImage={labelArt("PISTACHIO", "Velvet Cream", "darkseagreen", "darkolivegreen")}
        alt="Pistachio cream jar"
        spin={0}
        handleRef={handle}
        pending={false}
        style={{
          bottom: wide ? "calc(0.7 * clamp(380px, 24vw, 99999px) * 1013 / 630 * -1)" : "-30vh",
          left: "50%",
          position: "absolute",
          transform: "translate(-50%) scale(1.25)",
        }}
      />
      <label style={{ color: "var(--rk-fg)", fontFamily: "var(--rk-font-body)", fontSize: 14, left: 16, position: "absolute", top: 16 }}>
        Label spin{" "}
        <input type="range" min={0} max={1} step={0.01} value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
      </label>
    </div>
  );
}

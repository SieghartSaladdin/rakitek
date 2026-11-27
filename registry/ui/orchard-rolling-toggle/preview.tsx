"use client";

import { useState } from "react";
import { OrchardRollingToggle } from "./component";

export default function OrchardRollingTogglePreview() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", padding: "32px" }}>
      <OrchardRollingToggle
        open={open}
        onToggle={() => setOpen((v) => !v)}
        menuLabel="menu"
        closeLabel="close"
        theme="dark"
        controlsId="demo-nav-drawer"
      />
    </div>
  );
}

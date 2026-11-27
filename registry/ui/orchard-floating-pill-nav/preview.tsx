"use client";

import { useState } from "react";
import { OrchardFloatingPillNav } from "./component";

export default function OrchardFloatingPillNavPreview() {
  const [activeId, setActiveId] = useState("jams");

  return (
    <div style={{ minHeight: "140px", padding: "32px" }}>
      <OrchardFloatingPillNav
        items={[
          { id: "jams", label: "Jams" },
          { id: "creams", label: "Creams" },
          { id: "savoury", label: "Savoury" },
          { id: "monopack", label: "Mono Pack" },
        ]}
        ariaLabel="Product lines"
        activeId={activeId}
        forceVisible={true}
        hideAtSelector=""
        onSelect={setActiveId}
      />
    </div>
  );
}

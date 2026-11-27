"use client";

import { OrchardFruitPauseStage } from "./component";

export default function OrchardFruitPauseStagePreview() {
  return (
    <OrchardFruitPauseStage
      id="pause"
      title={"It’s not just a label,\nbut a promise that has been kept\nover time."}
      showFruits={true}
      ariaLabel="Orchard pause"
    />
  );
}

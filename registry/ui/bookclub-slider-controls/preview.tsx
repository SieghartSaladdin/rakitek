"use client";

import { useState } from "react";
import { BookclubSliderControls } from "./component";
import styles from "./styles.module.css";

export default function BookclubSliderControlsPreview() {
  const [index, setIndex] = useState(0);
  const max = 3;

  return (
    <div className={styles.previewStage}>
      <BookclubSliderControls
        variant="choice"
        alwaysVisible
        canPrev={index > 0}
        canNext={index < max}
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(max, i + 1))}
      />
    </div>
  );
}

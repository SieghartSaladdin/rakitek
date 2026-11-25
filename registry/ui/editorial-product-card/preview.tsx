"use client";

import { EditorialProductCard, type ProductSpecItem } from "./component";
import styles from "./styles.module.css";

interface PreviewProduct {
  id: string;
  title: string;
  price: string;
  specs: ProductSpecItem[];
}

const PREVIEW_PRODUCTS: PreviewProduct[] = [
  {
    id: "cantaloupe",
    title: "Cantaloupe",
    price: "$28.00",
    specs: [
      { label: "Type", value: "Single Origin" },
      { label: "Origin", value: "Nicaragua" },
      { label: "Process", value: "Washed" },
    ],
  },
  {
    id: "ca-buche",
    title: "Ça Bûche",
    price: "$26.00",
    specs: [
      { label: "Type", value: "Blend" },
      { label: "Origin", value: "Mexico, Ethiopia" },
      { label: "Process", value: "Natural & Washed" },
    ],
  },
  {
    id: "gold",
    title: "Gold",
    price: "$40.00",
    specs: [
      { label: "Type", value: "Single origin" },
      { label: "Origin", value: "Colombia" },
      { label: "Process", value: "Washed with thermal shock" },
    ],
  },
];

export default function EditorialProductCardPreview() {
  return (
    <div className={styles.previewStage}>
      <div className={styles.previewList}>
        {PREVIEW_PRODUCTS.map((product) => (
          <EditorialProductCard
            key={product.id}
            title={product.title}
            price={product.price}
            specs={product.specs}
            onAction={(event) => event.preventDefault()}
          />
        ))}
      </div>
    </div>
  );
}

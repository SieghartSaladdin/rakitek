"use client";

import { useState } from "react";
import { SlideOverDrawer, type DrawerLineItem } from "./component";

const BAG_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 68'><path d='M8 6h40l4 58H4L8 6Z' fill='white' stroke='silver' stroke-width='1.5'/><rect x='14' y='26' width='28' height='18' fill='gainsboro'/></svg>",
  );

const INITIAL_ITEMS: DrawerLineItem[] = [
  { id: "pacamara", name: "Pacamara Jaune", price: 36, quantity: 1, image: BAG_IMAGE },
];

export default function SlideOverDrawerPreview() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<DrawerLineItem[]>(INITIAL_ITEMS);

  const handleQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer px-6 py-3 text-sm font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          backgroundColor: "var(--rk-fg)",
          color: "var(--rk-bg)",
          fontFamily: "var(--rk-font-display)",
          borderRadius: "3px",
        }}
      >
        Open bag ({items.reduce((s, i) => s + i.quantity, 0)})
      </button>
      <SlideOverDrawer
        open={open}
        items={items}
        onClose={() => setOpen(false)}
        onUpdateQty={handleQty}
        currencyCode="CAD"
        shippingLabel="FREE Canada shipping"
      />
    </div>
  );
}

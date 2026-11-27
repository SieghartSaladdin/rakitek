"use client";

import { OrchardFruitNotFound } from "./component";

export default function OrchardFruitNotFoundPreview() {
  return (
    <OrchardFruitNotFound
      id="not-found"
      status={404}
      headline="This page bore no fruit"
      lead="Even among the groves you can take a wrong turn. Come back to our land and rediscover the authentic flavours."
      links={[
        { label: "Home", href: "#home" },
        { label: "Pantry", href: "#pantry" },
        { label: "Contacts", href: "#contacts" },
      ]}
      linksLabel="Page not found"
      showFruit={true}
    />
  );
}

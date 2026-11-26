"use client";

import { EditorialMissionSplit } from "./component";

export default function EditorialMissionSplitPreview() {
  return (
    <EditorialMissionSplit
      tagline={"Our\nMission"}
      statement="People say we have a one-track mind. And to that we always reply - thank you. Because we believe that by focusing on one thing, many good things happen. And for our whole team, that one thing was always coffee. We have gone deeper into coffee than anyone, with busy hands and grinder dust on our sleeves at every step."
      ctaLabel="Learn More"
      ctaHref="#mission"
      topCaption={"craft\nis always possible."}
      bottomCaption={"Just grab a bag\nand jump right in."}
      coordinates="45.5236° N - 73.5955° W"
      backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=75&auto=format&fit=crop&bri=-35&sat=-45"
      backgroundAlt="Glass architectural facade under an overcast sky"
      insetImage="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&q=80&auto=format&fit=crop"
      insetAlt="Specialty coffee cup viewed from above on a minimalist table"
      onCtaClick={(event) => event.preventDefault()}
    />
  );
}

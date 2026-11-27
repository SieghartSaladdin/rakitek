"use client";

import { CinematicMediaBanner } from "./component";

export default function CinematicMediaBannerPreview() {
  return (
    <CinematicMediaBanner
      id="banner"
      imageSrc="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=75&auto=format&fit=crop"
      imageAlt="Wide view of a lit exhibition hall"
      imageOpacity={1}
      aspectRatio="21 / 9"
      cropScale={1.32}
      videoSrc=""
      videoTitle="Background video"
      eager
    />
  );
}

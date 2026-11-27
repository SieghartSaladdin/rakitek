"use client";

import { FestivalCard } from "./component";

const PREVIEW_CSS = `
  .rk-festival-card-preview { box-sizing: border-box; width: 100%; margin-inline: auto; padding: 16px; }
  .rk-festival-card-preview > div { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  @media (min-width: 1536px) { .rk-festival-card-preview { max-width: 1400px; } }
  @media (max-width: 767px) { .rk-festival-card-preview > div { grid-template-columns: minmax(0, 1fr); } }
`;

export default function FestivalCardPreview() {
  return (
    <div className="rk-festival-card-preview">
      <style>{PREVIEW_CSS}</style>
      <div>
        <FestivalCard
          id="card-talk"
          title="Maren Lindqvist"
          imageSrc="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=75&auto=format&fit=crop"
          imageAlt="Speaker on a lit stage in front of a crowd"
          subtitle="Beyond the new frame"
          location="Denmark"
          href="#talk"
          variant="visual"
          eager
          onClick={(event) => event.preventDefault()}
        />
        <FestivalCard
          id="card-trail"
          title="Light garden"
          imageSrc="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=75&auto=format&fit=crop"
          imageAlt="Glowing installation in a dark courtyard"
          companyStudio="Studio North"
          subtitle="Interactive installation"
          badge="New"
          href="#trail"
          variant="visual"
          eager
          onClick={(event) => event.preventDefault()}
        />
        <FestivalCard
          id="card-night"
          title="Night session"
          imageSrc="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=75&auto=format&fit=crop"
          imageAlt="DJ booth under colored lights"
          subtitle="Live set"
          location="Harbour hall"
          href="#night"
          variant="wide"
          onClick={(event) => event.preventDefault()}
        />
      </div>
    </div>
  );
}

"use client";

import { FestivalLineupSection } from "./component";

export default function FestivalLineupSectionPreview() {
  return (
    <FestivalLineupSection
      id="talks"
      label="Get inspired"
      title="Talks"
      ghostNumber="40+"
      description={"Speakers from art, science and industry share what they are building and why it matters.\nThree days of short talks and open conversations."}
      stats={[]}
      cards={[
        {
          title: "Signals from the studio",
          companyStudio: "Studio North",
          subtitle: "Keynote",
          location: "Main hall",
          imageSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=75&auto=format&fit=crop",
          imageAlt: "Speaker on a lit stage in front of a crowd",
          badge: "New",
          href: "#signals",
        },
        {
          title: "Machines that listen",
          companyStudio: "Atelier Delta",
          subtitle: "Talk",
          location: "Hall B",
          imageSrc: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=75&auto=format&fit=crop",
          imageAlt: "Presenter gesturing beside a projection",
          href: "#machines",
        },
        {
          title: "Cities as instruments",
          companyStudio: "Open Lab",
          subtitle: "Panel",
          location: "Hall C",
          imageSrc: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&q=75&auto=format&fit=crop",
          imageAlt: "Audience seated in a conference room",
          href: "#cities",
        },
        {
          title: "Seeing like a sensor",
          companyStudio: "North Studio",
          subtitle: "Talk",
          location: "Main hall",
          imageSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=75&auto=format&fit=crop",
          imageAlt: "Illuminated stage screen in a dark hall",
          href: "#sensor",
        },
        {
          title: "Living systems",
          companyStudio: "Field Collective",
          subtitle: "Workshop",
          location: "Hall B",
          imageSrc: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=900&q=75&auto=format&fit=crop",
          imageAlt: "Workshop group collaborating around a table",
          href: "#systems",
        },
        {
          title: "New work, old craft",
          companyStudio: "Atelier West",
          subtitle: "Talk",
          location: "Hall C",
          imageSrc: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=900&q=75&auto=format&fit=crop",
          imageAlt: "Designers discussing prototypes in a studio",
          href: "#craft",
        },
      ]}
      actions={[
        { label: "View all talks", href: "#all-talks", variant: "outline", arrow: true },
        { label: "Tickets", href: "#tickets", variant: "filled", arrow: true },
      ]}
      eagerCards={3}
      titleLetterSpacing="-0.06em"
      titleLineHeight={0.8}
    />
  );
}

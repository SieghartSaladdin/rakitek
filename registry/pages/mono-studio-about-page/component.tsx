"use client";

import { SwissGridShell } from "@registry/templates/swiss-grid-shell/component";
import { MonoClockHeader } from "@registry/sections/mono-clock-header/component";
import { MonoStudioNote } from "@registry/ui/mono-studio-note/component";
import { FounderHoverManifesto } from "@registry/sections/founder-hover-manifesto/component";
import { StudioHoverReel } from "@registry/sections/studio-hover-reel/component";
import { CreditsIndexColumns } from "@registry/sections/credits-index-columns/component";
import { GiantWordmarkFooter } from "@registry/sections/giant-wordmark-footer/component";
import { MONO_STUDIO_ABOUT_DATA, type MonoStudioAboutData } from "./demo-data";

export interface MonoStudioAboutPageProps {
  data?: MonoStudioAboutData;
}

export function MonoStudioAboutPage({
  data = MONO_STUDIO_ABOUT_DATA,
}: MonoStudioAboutPageProps) {
  return (
    <SwissGridShell
      header={
        <MonoClockHeader
          id="site-header"
          links={data.header.links}
          wordmarkPaths={data.header.wordmarkPaths}
          wordmarkViewBox={data.header.wordmarkViewBox}
          homeLabel={data.header.homeLabel}
          email={data.header.email}
          compact
        />
      }
      note={
        <MonoStudioNote
          id="studio-note"
          lines={data.note.lines}
          contactLabel={data.note.contactLabel}
          linkLabel={data.note.linkLabel}
          linkHref={data.note.linkHref}
          fixed
        />
      }
      footer={<GiantWordmarkFooter id="signature" glyphs={data.footer.glyphs} />}
    >
      <FounderHoverManifesto
        id="manifesto"
        paragraphs={data.manifesto.paragraphs}
        people={data.manifesto.people}
      />
      <StudioHoverReel
        id="reel"
        items={data.reel.items}
        overview={data.reel.overview}
        markPaths={data.reel.markPaths}
        markViewBox={data.reel.markViewBox}
      />
      <CreditsIndexColumns
        id="credits"
        primary={data.credits.primary}
        secondary={data.credits.secondary}
        colophon={data.credits.colophon}
        legal={data.credits.legal}
      />
    </SwissGridShell>
  );
}

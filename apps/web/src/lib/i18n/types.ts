import type { AtomicLevel } from "../../../../../registry/schema";

export type Locale = "en" | "id";

export type CatalogKindKey =
  | "ui"
  | "section"
  | "atom"
  | "molecule"
  | "organism"
  | "template"
  | "page";

export interface WebCopy {
  common: {
    menu: string;
    close: string;
    closeNavAria: string;
    navMenuAria: string;
    reset: string;
    resetFilters: string;
    clearSearch: string;
    inspectAndCode: string;
    openDetails: string;
    viewAllUi: string;
    previous: string;
    next: string;
    showingOf: (shown: number, total: number) => string;
    copyCode: string;
    copyFile: string;
    copied: string;
    sourceFilesAria: string;
    newTab: string;
    exitEsc: string;
    fullscreen: string;
    fullscreenAria: string;
    desktop100: string;
    tablet: string;
    phone: string;
    scrollInside: string;
    realMediaQuery: string;
    languageAria: string;
  };
  landing: {
    tagline: string;
    cta: string;
  };
  sidebar: {
    registryTagline: string;
    searchPlaceholder: string;
    searchAria: string;
    navAria: string;
    overview: string;
    documentation: string;
    guides: string;
    usageGuide: string;
    mcpDocs: string;
    skillsPlugin: string;
    installGuide: string;
    websiteStyles: string;
    browseAllStyles: string;
    noMatches: (query: string) => string;
    levels: Record<AtomicLevel, { title: string; browseLabel: string }>;
  };
  overview: {
    headline: string;
    introPrefix: string;
    introSuffix: string;
    stylesTitle: string;
    stylesNote: string;
    uiTitle: string;
    uiNote: string;
    sectionsTitle: string;
    sectionsNote: string;
    wf1Tag: string;
    wf1Title: string;
    wf1BeforeStrong: string;
    wf1Strong: string;
    wf1Between: string;
    wf1AfterCode: string;
    wf2Tag: string;
    wf2Title: string;
    wf2BeforeStrong: string;
    wf2Strong: string;
    wf2Between: string;
    wf2AfterCode: string;
    featuredSection: string;
    featuredUi: string;
  };
  stylesPage: {
    title: string;
    subtitleBeforeCode: string;
    subtitleAfterCode: string;
    displayFont: string;
    bodyFont: string;
    bodySample: string;
    radiusGeometry: string;
  };
  catalog: {
    searchPlaceholder: (plural: string) => string;
    filterAria: (title: string) => string;
    categoryLabel: string;
    vibeLabel: string;
    styleLabel: string;
    allCategories: string;
    allVibes: string;
    allStyles: string;
    emptyTitle: (plural: string) => string;
    emptyHint: string;
    kindMeta: Record<CatalogKindKey, { title: string; subtitle: string; plural: string }>;
  };
  itemDetail: {
    breadcrumbAria: string;
    adjacentAria: string;
    copyMcp: string;
    copiedMcp: string;
    tabPreview: string;
    tabCodeSingle: string;
    tabCodeMulti: (count: number) => string;
    tabUsage: string;
    styleLabel: string;
    viewportLabel: string;
    metaNativeStyle: string;
    metaStylingLevel: string;
    metaDeps: string;
    metaZeroDeps: string;
    metaSourceRef: string;
    noUsageFile: string;
  };
  docs: {
    title: string;
    install: {
      tag: string;
      title: string;
      intro: string;
      note: string;
      clientLabel: string;
      checkTitle: string;
      checkFilename: string;
      tryPrompt: string;
      steps: Record<
        "claude" | "antigravity",
        { mcpTitle: string; mcpDesc: string; skillTitle: string; skillDesc: string; checkDesc: string }
      >;
    };
    introPart1: string;
    introPart2: string;
    sec1Tag: string;
    sec1Title: string;
    sec1Intro1: string;
    sec1Intro2: string;
    sec1Intro3: string;
    steps: Array<{
      step: string;
      title: string;
      beforeCode: string;
      code: string;
      afterCode: string;
    }>;
    sec2Tag: string;
    sec2TitlePrefix: string;
    sec2Intro1: string;
    sec2Intro2: string;
    sec2Intro3: string;
    tableTool: string;
    tableArgs: string;
    tablePurpose: string;
    mcpToolPurposes: Record<string, string>;
    sec3Tag: string;
    sec3Title: string;
    sec3Intro1: string;
    sec3Intro2: string;
    skill2Tag: string;
    skill2Desc1: string;
    skill2Desc2: string;
    skill2Desc3: string;
    skill2Prompt: string;
  };
}

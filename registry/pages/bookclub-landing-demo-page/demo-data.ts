import type { BookclubBookItem } from "@registry/sections/bookclub-books-carousel/component";
import type { BookclubStepItem } from "@registry/sections/bookclub-how-it-works/component";
import type { BookclubGenreItem } from "@registry/sections/bookclub-genre-showcase/component";
import type { BookclubBenefitPill } from "@registry/sections/bookclub-benefits-stage/component";
import type { BookclubFaqItem } from "@registry/sections/bookclub-faq-accordion/component";
import type { BookclubPressItem } from "@registry/sections/bookclub-gift-feature/component";
import type { BookclubWinnerItem } from "@registry/sections/bookclub-choice-winners/component";
import type { BookclubExclusiveTag } from "@registry/sections/bookclub-exclusive-showcase/component";
import type { BookclubNavItem, BookclubSocialItem } from "@registry/sections/bookclub-floating-header/component";
import { DEMO_MONTHLY_BOOKS, DEMO_WINNERS } from "./demo-books";

export interface BookclubDemoData {
  brandName: string;
  navLinks: BookclubNavItem[];
  socials: BookclubSocialItem[];
  headerCtaLabel: string;
  regionLabel: string;
  hero: { headline: string; description: string; ctaLabel: string; handwrittenNote: string; visualAlt: string };
  booksSection: { title: string; subtitle: string; handwrittenNote: string; books: BookclubBookItem[] };
  howItWorks: { title: string; handwrittenNote: string; ctaLabel: string; steps: BookclubStepItem[] };
  boxSequence: { headline: string; callOutNote: string; finalTagline: string };
  genres: { title: string; handwrittenNote: string; items: BookclubGenreItem[] };
  benefits: { heading: string; pills: BookclubBenefitPill[] };
  faq: { title: string; ctaLabel: string; items: BookclubFaqItem[] };
  gift: { curvedHeadline: string; description: string; ctaLabel: string; pressHeading: string; pressItems: BookclubPressItem[] };
  promo: { primaryText: string; secondaryText: string };
  winners: { title: string; description: string; items: BookclubWinnerItem[] };
  exclusive: {
    title: string; subtitle: string; bookTitle: string; bookDescription: string;
    ratingLabel: string; ratingValue: string; ctaLabel: string;
    tags: BookclubExclusiveTag[]; authorsHeading: string; authors: string[]; quote1: string; quote2: string;
  };
  footer: { newsletterHeading: string; copyrightText: string; creditDesign: string; creditDev: string };
}

export const BOOKCLUB_DEMO_DATA: BookclubDemoData = {
  brandName: "FABLE & FOLD",
  navLinks: [
    { label: "All Books", href: "#books" },
    { label: "Gifting", href: "#gift" },
    { label: "Merch", href: "#exclusive" },
    { label: "FAQ", href: "#faq" },
  ],
  socials: [
    { platform: "instagram", href: "https://instagram.com", ariaLabel: "Go to Instagram" },
    { platform: "tiktok", href: "https://tiktok.com", ariaLabel: "Go to TikTok" },
  ],
  headerCtaLabel: "Log-in / Sign-up",
  regionLabel: "Shopping from the UK?",
  hero: {
    headline: "Unbox stories worth talking about",
    description:
      "Join the book club that’s anything but traditional. Choose up to 3 new reads every month, delivered to your door. Then dive into the stories, and the conversations.",
    ctaLabel: "Log-in / Sign-up now",
    handwrittenNote: "Shipping to the USA & Canada",
    visualAlt: "Fable & Fold Book Club Box",
  },
  booksSection: {
    title: "Our Nov books",
    subtitle: "We drop new books on the 1st of every month. Call us creatures of habit.",
    handwrittenNote: "Discover hidden gems and buzzy new releases",
    books: DEMO_MONTHLY_BOOKS,
  },
  howItWorks: {
    title: "How it works",
    handwrittenNote: "Consider us your professional book curator",
    ctaLabel: "Become a member",
    steps: [
      { stepLabel: "Step #1", titleLines: ["Explore our books"], description: "The first of every month we reveal 6-7 new books. Follow us on socials to keep an eye on any hints we may post.", variant: "cyan" },
      { stepLabel: "Step #2", titleLines: ["Build your ", "box"], description: "Members can order up to 3 books per box. At least one title must be from the current month's selections.", variant: "bright-pink" },
      { stepLabel: "Step #3", titleLines: ["Check your doorstep"], description: "Your box is delivered right to your doorstep. This is the best excuse to cancel your Friday night plans.", variant: "yellow" },
      { stepLabel: "Step #4", titleLines: ["Share your reads"], description: "Share your box and tag us @fableandfold or participate in the Club discussions in-app!", variant: "periwinkle" },
    ],
  },
  boxSequence: {
    headline: "UNBOX YOUR NEXT READ",
    callOutNote: "Each box includes a bookmark per book and postcard with a challenge to win a free credit!",
    finalTagline: "Made for readers by readers",
  },
  genres: {
    title: "Choose from",
    handwrittenNote: "We've got a book for every kind of reader",
    items: [
      { label: "Horror" }, { label: "Science Fiction" }, { label: "Romance" }, { label: "Thriller" },
      { label: "Literary Fiction" }, { label: "Fantasy" }, { label: "Gothic Fiction" },
      { label: "Historical Fiction" }, { label: "Magical Realism" },
      { label: "Contemporary Fiction", hasWordBreak: true }, { label: "and more!" },
    ],
  },
  benefits: {
    heading: "Why Fable?",
    pills: [
      { position: "first", tone: "magenta", lines: ["Range of genres"] },
      { position: "second", tone: "orange", lines: ["Free shipping"] },
      { position: "third", tone: "periwinkle", lines: ["Affordable"] },
      { position: "fourth", tone: "cyan", lines: ["High quality ", "hardcovers"] },
      { position: "fifth", tone: "olive", lines: ["Curated books"] },
    ],
  },
  faq: {
    title: "Common questions",
    ctaLabel: "Show all FAQ",
    items: [
      { id: "membership-cost", question: "How much does membership cost, my wallet is asking?", answer: "In the USA, membership is $17.99 USD/month (accounts for 1 book) and $10.99 for each extra book. In Canada, membership is $25.99 CAD/month (accounts for 1 book) and $15.99 for each extra book." },
      { id: "shipping-countries", question: "What countries do we ship to?", answer: "We ship to the USA & Canada! Please contact support if you are mailing to Puerto Rico, an APO/FPO address, or PO box so we can set up your account.", contactEmail: "hello@fableandfold.example" },
      { id: "how-to-join", question: "How do I join the club?", answer: "You can sign up for membership by downloading our mobile app or by using our website. Place your first order to kickstart your membership!" },
    ],
  },
  gift: {
    curvedHeadline: "A gift outside of the box",
    description: "Gift a subscription and they can pick their own books. No spying on shelves needed. Order today and instantly receive an e-gift card to print out or forward. If you’re lucky, they might let you borrow a copy.",
    ctaLabel: "Shop gifts!",
    pressHeading: "Mentioned by",
    pressItems: [
      { name: "Publishers Weekly", shortLabel: "PW" },
      { name: "Literary Digest", shortLabel: "LD" },
      { name: "Book Riot", shortLabel: "BR" },
      { name: "Travel + Leisure", shortLabel: "T+L" },
    ],
  },
  promo: {
    primaryText: "1st book only $4 w/ code FALL (USA-only)!",
    secondaryText: "1st book only $4 w/ code FALL (USA-only)!",
  },
  winners: {
    title: "Members’ Choice Winners",
    description: "Every year readers vote on their favourite reads and we celebrate with a special reprinting. These titles have won our hearts and minds over the last few years.",
    items: DEMO_WINNERS,
  },
  exclusive: {
    title: "Club Exclusive",
    subtitle: "Horror anthology by club authors. No, you can't get it anywhere else.",
    bookTitle: "One Bad Night & Other Stories",
    bookDescription: "Fable & Fold launched in October 2022, and we’re celebrating our three-year anniversary with this original horror anthology featuring 8 past club authors.",
    ratingLabel: "Goodreads Rating",
    ratingValue: "4.0",
    ctaLabel: "Add to box!",
    tags: [
      { label: "Club Original", bgColor: "#8ef1fd", textColor: "black" },
      { label: "Horror", bgColor: "#000000", textColor: "white" },
    ],
    authorsHeading: "Authors",
    authors: ["Kay Chronister", "Del Sandeen", "Kylie Lee Baker", "Rachel Harrison", "CJ Leede", "Jennifer Thorne", "S.A. Barnes", "Stephen Graham Jones"],
    quote1: '"An absolutely phenomenal anthology of short stories from some of the best voices in horror right now!" - Trisha',
    quote2: '"Not a bad story in the bunch. “One Bad Night” wrecked me." - Brittany',
  },
  footer: {
    newsletterHeading: "Join our mailing list",
    copyrightText: "©2026 Fable & Fold Book Club. All rights reserved.",
    creditDesign: "Design by Studio North",
    creditDev: "Development by Guild Three",
  },
};

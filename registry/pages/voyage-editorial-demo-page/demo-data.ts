import type { AlternatingStoryItem } from "@registry/sections/alternating-story-split/component";
import type { FeaturedPackageItem } from "@registry/sections/featured-packages-grid/component";
import type { DestinationCarouselSlide } from "@registry/sections/parallax-destination-carousel/component";

export interface VoyageDemoData {
  brandName: string;
  heroTitle: string;
  heroBackground: string;
  destinationsTitle: string;
  destinations: DestinationCarouselSlide[];
  packagesHeading: string;
  packages: FeaturedPackageItem[];
  manifestoSurtext: string;
  manifestoStatement: string;
  stories: AlternatingStoryItem[];
  spotlightCategory: string;
  spotlightTitle: string;
  spotlightAuthor: string;
  spotlightImage: string;
  partnerTitle: string;
  partnerBody: string;
  newsletterTitle: string;
  newsletterBody: string;
}

export const VOYAGE_DEMO_DATA: VoyageDemoData = {
  brandName: "Meridian",
  heroTitle: "Meridian opens the world to you",
  heroBackground:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop",
  destinationsTitle: "Destinations",
  destinations: [
    {
      id: "africa",
      title: "Africa",
      href: "#africa",
      imageSrc:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1000&q=75&auto=format&fit=crop",
      imageAlt: "Savanna plains",
    },
    {
      id: "asia",
      title: "Asia",
      href: "#asia",
      imageSrc:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=75&auto=format&fit=crop",
      imageAlt: "Historic pagoda",
    },
    {
      id: "caribbean",
      title: "Central America & Caribbean",
      href: "#caribbean",
      imageSrc:
        "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1000&q=75&auto=format&fit=crop",
      imageAlt: "Coastal lagoon",
    },
    {
      id: "north-america",
      title: "North America",
      href: "#north-america",
      imageSrc:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1000&q=75&auto=format&fit=crop",
      imageAlt: "Alpine lake",
    },
    {
      id: "south-america",
      title: "South America",
      href: "#south-america",
      imageSrc:
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1000&q=75&auto=format&fit=crop",
      imageAlt: "Mountain pass",
    },
    {
      id: "europe",
      title: "Europe & Mediterranean",
      href: "#europe",
      imageSrc:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&q=75&auto=format&fit=crop",
      imageAlt: "Whitewashed coast",
    },
  ],
  packagesHeading: "Featured journeys",
  packages: [
    {
      id: "kyoto-rail",
      title: "Ancient Kyoto & Coastal Japan Tours",
      href: "#kyoto",
      imageSrc:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=75&auto=format&fit=crop",
      featuredBadge: "Expert Led",
      typeTags: ["Group Expedition", "Cruise"],
      specs: ["16 days", "14 nights", "38 meals"],
      price: 9899,
    },
    {
      id: "rhone-riviera",
      title: "Grand French River & Riviera",
      href: "#rhone",
      imageSrc:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=75&auto=format&fit=crop",
      featuredBadge: "Favorite",
      typeTags: ["Group Tour", "Cruise"],
      specs: ["18 days", "16 nights", "31 meals"],
      price: 8599,
    },
    {
      id: "andalusia-coast",
      title: "Andalusia & Sunny Coast Stay",
      href: "#andalusia",
      imageSrc:
        "https://images.unsplash.com/photo-1558642084-fd07fae5282e?w=900&q=75&auto=format&fit=crop",
      featuredBadge: "Guaranteed",
      typeTags: ["Group Tour", "Cruise"],
      specs: ["18 days", "16 nights", "23 meals"],
      price: 5799,
    },
    {
      id: "sicily-calabria",
      title: "Calabria & Sicily Escape",
      href: "#sicily",
      imageSrc:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=75&auto=format&fit=crop",
      featuredBadge: "Favorite",
      typeTags: ["Group Tour", "Stay"],
      specs: ["16 days", "14 nights", "31 meals"],
      price: 4999,
    },
    {
      id: "canadian-rockies",
      title: "Western Alpine & Coast",
      href: "#rockies",
      imageSrc:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=900&q=75&auto=format&fit=crop",
      featuredBadge: "Favorite",
      typeTags: ["Group Tour", "Circuit"],
      specs: ["13 days", "12 nights", "15 meals"],
      price: 6509,
    },
  ],
  manifestoSurtext: "SINCE 1970",
  manifestoStatement:
    "Meridian Voyages is far more than an ordinary tour operator, standing proudly as an enduring pioneer of curated journeys built on 56 years of craft.",
  stories: [
    {
      id: "craft",
      title: "Quality since 1970",
      body: "Meridian Voyages continues to bring memorable experiences across the globe to thousands of travelers through a passionate team of regional specialists. Over 100 destinations are offered across seven distinct collections: North America, Ocean Cruises, European Circuits, Far Horizons, Dream Islands, Mediterranean Sun, and Alpine Tours. Whatever pace or horizon you seek, we have the right journey for you.",
      ctaLabel: "Learn more",
      ctaHref: "#about",
      imageSrc:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&q=75&auto=format&fit=crop",
      parallaxY: 50,
    },
    {
      id: "gateway",
      title: "Your gateway to the world",
      body: "Open the door to unforgettable discoveries around the globe. Whether you dream of sweeping mountain parks, deep cultural immersion across historic European cities, or tranquil island lagoons, our itineraries turn a simple trip into a lasting story.",
      ctaLabel: "Learn more",
      ctaHref: "#destinations",
      imageSrc:
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1000&q=75&auto=format&fit=crop",
      parallaxY: -50,
    },
  ],
  spotlightCategory: "Journal",
  spotlightTitle: "Europe 2027: Reserve your seasonal cultural journey now!",
  spotlightAuthor: "Meridian Desk, 21/09/2026",
  spotlightImage:
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=80&auto=format&fit=crop",
  partnerTitle:
    "Entrust your travel plans to one of our fifty distinguished partner agencies of the year!",
  partnerBody:
    "Each year, the Meridian Voyages team selects the fifty independent travel agencies that stood out over the past twelve months. This recognition club celebrates the commitment, hospitality, and performance of our finest regional advisors.",
  newsletterTitle: "Subscribe to our newsletter",
  newsletterBody:
    "Stay informed about special offers, new departures, and seasonal releases. Sign up today so you never miss an update.",
};

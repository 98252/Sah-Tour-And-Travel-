import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryItem {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  video?: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: "Solo & Independent Travel",
    subtitle: "Freedom, self-discovery & handpicked safe stays",
    href: "/packages?theme=solo",
    image:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80",
    video: "/videos/327169_medium.mp4",
  },
  {
    title: "Alpine & Mountain Trails",
    subtitle: "High-altitude peaks, alpine lakes & pure serenity",
    href: "/packages?theme=adventure",
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    video: "/videos/223363_medium.mp4",
  },
  {
    title: "International Holidays",
    subtitle: "Iconic global cities & scenic continents",
    href: "/packages/international-tour-packages",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    video: "/videos/main.mp4",
  },
  {
    title: "Domestic Indian Holidays",
    subtitle: "Heritage, backwaters & mountain hill stations",
    href: "/packages/domestic-tour-packages",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Honeymoon & Romantic",
    subtitle: "Private hideaways & unforgettable couples' moments",
    href: "/packages/honeymoon-packages",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Family Vacations",
    subtitle: "Thoughtfully paced multi-generational retreats",
    href: "/packages/family-vacations",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Luxury & Bespoke",
    subtitle: "5-star palace hotels & VIP concierge care",
    href: "/packages/luxury-escapes",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Beach & Island Escapes",
    subtitle: "Pristine coastlines & tropical serenity",
    href: "/packages?theme=beach",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
  },
];

export function CuratedCategories() {
  return (
    <section className="py-18 sm:py-26 bg-[#fbfbf9] text-brand-navy-950">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-gold-600 block mb-2">
            Curated Travel Themes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-brand-navy-950">
            Journeys Designed for You
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Whether seeking solo adventure, high-altitude serenity, or luxury coastal escapes,
            explore vacations thoughtfully tailored to every travel preference.
          </p>
        </div>

        {/* Categories Grid (Photography & Motion Driven) - 30% Increased Height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative h-[375px] sm:h-[400px] rounded-3xl overflow-hidden shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-500 hover:-translate-y-1 block"
            >
              {/* Background Video (if available) or Poster Image */}
              {cat.video ? (
                <video
                  src={cat.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              )}

              {/* Multi-stop Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/90 via-brand-navy-950/40 to-black/20 transition-opacity duration-300 group-hover:opacity-95" />

              {/* Arrow Indicator Icon */}
              <div className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-transform duration-300 group-hover:bg-brand-gold-500 group-hover:text-white group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              {/* Text info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="font-serif text-xl font-normal text-white mb-1.5">{cat.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-1 font-light leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

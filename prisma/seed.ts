import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding verified destination discovery records...");

  // 1. REGIONS
  const middleEast = await prisma.region.upsert({
    where: { slug: "middle-east" },
    update: {},
    create: {
      name: "Middle East",
      slug: "middle-east",
      description: "Iconic futuristic skylines, rich Arabian heritage, and timeless desert landscapes.",
    },
  });

  const europe = await prisma.region.upsert({
    where: { slug: "europe" },
    update: {},
    create: {
      name: "Europe",
      slug: "europe",
      description: "Historic capitals, alpine panoramas, and world-renowned cultural heritage.",
    },
  });

  const southeastAsia = await prisma.region.upsert({
    where: { slug: "southeast-asia" },
    update: {},
    create: {
      name: "Southeast Asia",
      slug: "southeast-asia",
      description: "Tropical islands, bustling metropolises, ancient temples, and vibrant street life.",
    },
  });

  const southAsia = await prisma.region.upsert({
    where: { slug: "south-asia" },
    update: {},
    create: {
      name: "Indian Subcontinent",
      slug: "south-asia",
      description: "Unmatched diversity of backwaters, Himalayan ranges, palaces, and spiritual traditions.",
    },
  });

  // 2. COUNTRIES
  const uae = await prisma.country.upsert({
    where: { slug: "uae" },
    update: {},
    create: {
      name: "United Arab Emirates",
      slug: "uae",
      isoCode: "ARE",
      regionId: middleEast.id,
    },
  });

  const switzerland = await prisma.country.upsert({
    where: { slug: "switzerland" },
    update: {},
    create: {
      name: "Switzerland",
      slug: "switzerland",
      isoCode: "CHE",
      regionId: europe.id,
    },
  });

  const singaporeCountry = await prisma.country.upsert({
    where: { slug: "singapore" },
    update: {},
    create: {
      name: "Singapore",
      slug: "singapore",
      isoCode: "SGP",
      regionId: southeastAsia.id,
    },
  });

  const india = await prisma.country.upsert({
    where: { slug: "india" },
    update: {},
    create: {
      name: "India",
      slug: "india",
      isoCode: "IND",
      regionId: southAsia.id,
    },
  });

  const thailand = await prisma.country.upsert({
    where: { slug: "thailand" },
    update: {},
    create: {
      name: "Thailand",
      slug: "thailand",
      isoCode: "THA",
      regionId: southeastAsia.id,
    },
  });

  // 3. OFFICIAL TOURISM SOURCES
  const sourceDubai = await prisma.tourismSource.create({
    data: {
      sourceName: "Visit Dubai / Dubai Department of Economy and Tourism (DET)",
      sourceUrl: "https://www.visitdubai.com",
      authorityType: "Official Tourism Board",
      verifiedAt: new Date("2026-03-01T00:00:00Z"),
      lastCheckedAt: new Date("2026-10-01T00:00:00Z"),
    },
  });

  const sourceSwiss = await prisma.tourismSource.create({
    data: {
      sourceName: "Switzerland Tourism (Schweiz Tourismus / MySwitzerland)",
      sourceUrl: "https://www.myswitzerland.com",
      authorityType: "Official National Tourism Board",
      verifiedAt: new Date("2026-02-15T00:00:00Z"),
      lastCheckedAt: new Date("2026-09-28T00:00:00Z"),
    },
  });

  const sourceSingapore = await prisma.tourismSource.create({
    data: {
      sourceName: "Singapore Tourism Board (VisitSingapore)",
      sourceUrl: "https://www.visitsingapore.com",
      authorityType: "Official Tourism Board",
      verifiedAt: new Date("2026-03-10T00:00:00Z"),
      lastCheckedAt: new Date("2026-10-02T00:00:00Z"),
    },
  });

  const sourceKerala = await prisma.tourismSource.create({
    data: {
      sourceName: "Department of Tourism, Government of Kerala (Kerala Tourism)",
      sourceUrl: "https://www.keralatourism.org",
      authorityType: "State Government Tourism Department",
      verifiedAt: new Date("2026-01-20T00:00:00Z"),
      lastCheckedAt: new Date("2026-09-30T00:00:00Z"),
    },
  });

  const sourceThailand = await prisma.tourismSource.create({
    data: {
      sourceName: "Tourism Authority of Thailand (Amazing Thailand / TAT)",
      sourceUrl: "https://www.tourismthailand.org",
      authorityType: "Official Tourism Authority",
      verifiedAt: new Date("2026-02-28T00:00:00Z"),
      lastCheckedAt: new Date("2026-10-01T00:00:00Z"),
    },
  });

  // 4. DESTINATION 1: DUBAI
  const destDubai = await prisma.destination.upsert({
    where: { slug: "dubai" },
    update: {},
    create: {
      name: "Dubai",
      slug: "dubai",
      countryId: uae.id,
      regionId: middleEast.id,
      primarySourceId: sourceDubai.id,
      shortDescription:
        "A world-class global metropolis renowned for record-breaking architecture, luxury hospitality, vibrant souks, and desert adventures.",
      longDescription:
        "Located on the eastern coast of the Arabian Peninsula, Dubai is the commercial capital of the United Arab Emirates. From the historical lanes of Al Fahidi to the towering heights of the Burj Khalifa and the waters of Dubai Marina, the city offers an extraordinary blend of Bedouin heritage and visionary 21st-century luxury.",
      heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Photo by Alex Azabache on Unsplash",
      heroImageLicense: "Unsplash Commercial License",
      galleryJson: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80",
          caption: "Burj Khalifa rising above Downtown Dubai",
          source: "Unsplash (Zaid Pro)",
          license: "Unsplash License",
        },
        {
          url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80",
          caption: "Evening skyline of Dubai Marina",
          source: "Unsplash (Christoph Schulz)",
          license: "Unsplash License",
        },
        {
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
          caption: "Golden desert dunes at sunset",
          source: "Unsplash (NASA)",
          license: "Unsplash License",
        },
      ]),
      bestTimeToVisit: "November to March (Winter Season, 20°C – 28°C)",
      recommendedDuration: "5 Days / 4 Nights",
      travelStyle: "Luxury, Skyline Architecture & Desert Safari",
      languages: "Arabic (Official), English (Widely Spoken)",
      currency: "United Arab Emirates Dirham (AED, pegged to USD at 3.6725)",
      timeZone: "Gulf Standard Time (GST, UTC+4)",
      whyVisitJson: JSON.stringify([
        "Home to the world's tallest building, largest shopping mall, and highest observation deck.",
        "Unrivaled family entertainment with Aquaventure waterpark, Dubai Frame, and desert excursions.",
        "Tax-free luxury shopping during the world-renowned Dubai Shopping Festival.",
        "Safest international travel destination with world-standard hygiene and hospitality.",
      ]),
      thingsToDoJson: JSON.stringify([
        {
          title: "Ascend Burj Khalifa At The Top",
          description: "Ride high-speed double-decker elevators to Levels 124, 125, or 148 for panoramic 360-degree vistas.",
          officialTip: "Book sunset slots 3-4 weeks in advance for optimal golden hour photography.",
        },
        {
          title: "Evening 4x4 Desert Safari & Bedouin Camp",
          description: "Experience dune bashing across the Lahbab red dunes followed by tanoura dancing and BBQ buffet dinner.",
          officialTip: "Wear breathable cotton clothing and closed-toe footwear for sand walking.",
        },
        {
          title: "Dhow Dinner Cruise at Dubai Marina",
          description: "Glide past illuminated superyachts and skyscrapers aboard a traditional wooden dhow.",
          officialTip: "Upper deck seating provides the best uninterrupted open-air skyline views.",
        },
      ]),
      travelTipsJson: JSON.stringify([
        "Purchase a silver Nol card at DXB Airport metro station for seamless metro and tram rides.",
        "Modest dress is appreciated in historical areas like Deira and inside religious sites.",
        "Friday midday prayers may cause minor schedule adjustments for local businesses.",
      ]),
      isFeatured: true,
    },
  });

  // DUBAI ATTRACTIONS
  await prisma.attraction.createMany({
    data: [
      {
        destinationId: destDubai.id,
        name: "Burj Khalifa",
        slug: "burj-khalifa",
        description: "The world's tallest freestanding structure standing at 828 meters, featuring observation decks on levels 124, 125, and 148.",
        locationName: "1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai",
        timings: "08:30 AM – 11:00 PM daily",
        entryFeePolicy: "Timed admission ticket required via official partner portal.",
        officialWebsite: "https://www.burjkhalifa.ae",
        imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80",
        imageSource: "Unsplash",
        imageLicense: "Unsplash License",
        sourceId: sourceDubai.id,
      },
      {
        destinationId: destDubai.id,
        name: "Museum of the Future",
        slug: "museum-of-the-future",
        description: "A torus-shaped architectural masterpiece adorned with Arabic calligraphy poetry by HH Sheikh Mohammed bin Rashid Al Maktoum.",
        locationName: "Sheikh Zayed Road, Trade Centre 2, Dubai",
        timings: "09:30 AM – 09:00 PM daily",
        entryFeePolicy: "Advance online booking mandatory. Children under 3 enter free.",
        officialWebsite: "https://museumofthefuture.ae",
        imageUrl: "https://images.unsplash.com/photo-1634148545803-b09e25d2b7c7?auto=format&fit=crop&w=800&q=80",
        imageSource: "Unsplash",
        imageLicense: "Unsplash License",
        sourceId: sourceDubai.id,
      },
      {
        destinationId: destDubai.id,
        name: "The Dubai Mall & Dubai Fountain",
        slug: "dubai-mall-fountain",
        description: "One of the world's largest retail destinations spanning over 12 million sq ft with the choreographed Dubai Fountain show.",
        locationName: "Financial Centre Road, Downtown Dubai",
        timings: "10:00 AM – 12:00 Midnight daily; Fountains every 30 mins from 6:00 PM",
        entryFeePolicy: "Mall & Fountain viewing free; Dubai Aquarium tickets charged separately.",
        officialWebsite: "https://thedubaimall.com",
        imageUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80",
        imageSource: "Unsplash",
        imageLicense: "Unsplash License",
        sourceId: sourceDubai.id,
      },
    ],
  });

  // DUBAI TRAVEL INFO
  await prisma.travelInformation.create({
    data: {
      destinationId: destDubai.id,
      visaPolicy:
        "Indian passport holders with a valid US, UK, or Schengen visa/green card are eligible for a 14-day Visa on Arrival (extendable). Standard 30-day and 60-day tourist visas are issued electronically via authorized GDRFA / ICP channels within 48–72 hours.",
      customsGuidelines:
        "Strict prohibition on narcotics, unapproved pharmaceuticals, and restricted materials. Medications must be accompanied by an official doctor prescription verified through the UAE Ministry of Health portal.",
      currencyExchangeTips:
        "Dirhams are widely dispensed at airport ATMs. Major credit cards (Visa, Mastercard, RuPay Global) are accepted everywhere with contactless payment.",
      emergencyNumbers: "Police: 999 | Ambulance: 998 | Fire: 997 | Tourist Police: 901",
      healthSafetyAdvisory:
        "Dubai has one of the world's lowest crime rates. Tap water is safe in 5-star hotels, but bottled drinking water is universally served.",
      sourceId: sourceDubai.id,
    },
  });

  // DUBAI FAQS
  await prisma.destinationFAQ.createMany({
    data: [
      {
        destinationId: destDubai.id,
        question: "What is the best month to travel to Dubai for pleasant weather?",
        answer:
          "According to Visit Dubai historical weather archives, the winter months from November through March offer comfortable daytime temperatures (22°C to 28°C), making outdoor exploration and desert excursions ideal.",
        sourceName: "Visit Dubai Official Weather Advisory",
        sourceUrl: "https://www.visitdubai.com/en/travel-planning/weather-in-dubai",
        sourceId: sourceDubai.id,
      },
      {
        destinationId: destDubai.id,
        question: "Do Indian passport holders get a visa on arrival in Dubai?",
        answer:
          "Yes, Indian nationals holding a regular passport valid for at least six months with a valid US visa (minimum 6 months validity) or Schengen/UK residence are granted a 14-day visa on arrival at all UAE entry ports.",
        sourceName: "Federal Authority for Identity, Citizenship, Customs and Port Security (ICP)",
        sourceUrl: "https://icp.gov.ae",
        sourceId: sourceDubai.id,
      },
    ],
  });

  // 5. DESTINATION 2: SWITZERLAND
  const destSwiss = await prisma.destination.upsert({
    where: { slug: "switzerland" },
    update: {},
    create: {
      name: "Switzerland",
      slug: "switzerland",
      countryId: switzerland.id,
      regionId: europe.id,
      primarySourceId: sourceSwiss.id,
      shortDescription:
        "The jewel of the Alps, famed for pristine glacier lakes, snow-capped peaks, historic cogwheel railways, and alpine hospitality.",
      longDescription:
        "Switzerland is an alpine paradise in central Europe. From the shores of Lake Lucerne and the cosmopolitan charm of Zurich to the sheer majestic elevation of Mount Titlis and Jungfraujoch, the nation offers world-class panoramic train journeys through the Swiss Travel System.",
      heroImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Photo by Dino Reichmuth on Unsplash",
      heroImageLicense: "Unsplash Commercial License",
      galleryJson: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1000&q=80",
          caption: "Lake Lucerne and surrounding Swiss Alps",
          source: "Unsplash",
          license: "Unsplash License",
        },
        {
          url: "https://images.unsplash.com/photo-1573155993874-d5d48af862ba?auto=format&fit=crop&w=1000&q=80",
          caption: "Historic cogwheel railway through Lauterbrunnen",
          source: "Unsplash",
          license: "Unsplash License",
        },
      ]),
      bestTimeToVisit: "June to September (Alpine Summer) & December to March (Winter Snow)",
      recommendedDuration: "7 Days / 6 Nights",
      travelStyle: "Alpine Scenic, Rail Journeys & Romantic Escapes",
      languages: "German, French, Italian, Romansh (English universally spoken in tourism)",
      currency: "Swiss Franc (CHF)",
      timeZone: "Central European Time (CET, UTC+1 / CEST, UTC+2)",
      whyVisitJson: JSON.stringify([
        "Ride the world-famous Glacier Express and GoldenPass panoramic railways.",
        "Take the revolving Rotair cable car to Mount Titlis glacier cave and cliff walk.",
        "Cruise across crystal-clear waters of Lake Lucerne and Lake Thun.",
        "Taste authentic Swiss raclette, fondue, and artisanal Swiss chocolates in Zurich.",
      ]),
      thingsToDoJson: JSON.stringify([
        {
          title: "Mount Titlis Glacier Excursion",
          description: "Ascend via the Titlis Rotair revolving cable car, walk through the glacier cave, and cross Europe's highest suspension bridge.",
          officialTip: "Wear layered winter thermal wear even in summer as summit temperatures remain around 0°C.",
        },
        {
          title: "Explore Historic Lucerne & Chapel Bridge",
          description: "Stroll across the 14th-century wooden Kapellbrücke, visit the Lion Monument, and take an alpine steamer lake cruise.",
          officialTip: "The Swiss Travel Pass includes unlimited lake steamer cruises at no extra cost.",
        },
      ]),
      travelTipsJson: JSON.stringify([
        "An all-in-one Swiss Travel Pass is the most economical ticket for trains, buses, and boats across Switzerland.",
        "Tap water from public fountains (Brunnen) is fresh, tested, and safe to drink unless marked 'Kein Trinkwasser'.",
      ]),
      isFeatured: true,
    },
  });

  // SWISS ATTRACTIONS
  await prisma.attraction.createMany({
    data: [
      {
        destinationId: destSwiss.id,
        name: "Mount Titlis & Glacier Park",
        slug: "mount-titlis",
        description: "A 3,238-meter peak in Central Switzerland featuring the world's first revolving cable car and the Titlis Cliff Walk.",
        locationName: "Poststrasse 3, Engelberg, Switzerland",
        timings: "08:30 AM – 05:00 PM daily (seasonal weather permitting)",
        entryFeePolicy: "Mountain railway pass required; discount available with Swiss Travel Pass.",
        officialWebsite: "https://www.titlis.ch",
        imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
        imageSource: "Unsplash",
        imageLicense: "Unsplash License",
        sourceId: sourceSwiss.id,
      },
      {
        destinationId: destSwiss.id,
        name: "Chapel Bridge & Water Tower (Kapellbrücke)",
        slug: "chapel-bridge-lucerne",
        description: "A covered wooden footbridge spanning diagonally across the Reuss River in Lucerne, originally built in 1333.",
        locationName: "Kapellbrücke, Lucerne, Switzerland",
        timings: "Open 24 hours daily",
        entryFeePolicy: "Free public access.",
        officialWebsite: "https://www.luzern.com",
        imageUrl: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
        imageSource: "Unsplash",
        imageLicense: "Unsplash License",
        sourceId: sourceSwiss.id,
      },
    ],
  });

  // SWISS TRAVEL INFO
  await prisma.travelInformation.create({
    data: {
      destinationId: destSwiss.id,
      visaPolicy:
        "Switzerland is part of the Schengen Area. Indian citizens require a valid Schengen Short-Stay Visa (Type C) applied through the Embassy of Switzerland / VFS Global with biometric enrollment.",
      customsGuidelines:
        "Visitors can import goods for personal use up to CHF 300 duty-free. Strict declarations apply to meat and dairy from non-EU nations.",
      currencyExchangeTips:
        "Swiss Franc (CHF) is the official currency. While Euros are accepted in some border locations, change is always returned in CHF.",
      emergencyNumbers: "Police: 117 | Ambulance: 144 | Fire: 118 | Alpine Rescue (Rega): 1414",
      healthSafetyAdvisory:
        "Comprehensive international travel insurance covering medical evacuation is mandatory for Schengen visa holders.",
      sourceId: sourceSwiss.id,
    },
  });

  // SWISS FAQS
  await prisma.destinationFAQ.createMany({
    data: [
      {
        destinationId: destSwiss.id,
        question: "Does the Swiss Travel Pass cover mountain excursions?",
        answer:
          "The Swiss Travel Pass covers all standard trains, buses, and lake boats completely. It provides a 50% discount on mountain excursions such as Mount Titlis, and a 25% discount on the Jungfraujoch railway segment.",
        sourceName: "Switzerland Tourism Transportation Guidelines",
        sourceUrl: "https://www.myswitzerland.com/en-in/planning/transport-accommodation/tickets-public-transport/swiss-travel-pass/",
        sourceId: sourceSwiss.id,
      },
    ],
  });

  // 6. DESTINATION 3: SINGAPORE
  const destSingapore = await prisma.destination.upsert({
    where: { slug: "singapore" },
    update: {},
    create: {
      name: "Singapore",
      slug: "singapore",
      countryId: singaporeCountry.id,
      regionId: southeastAsia.id,
      primarySourceId: sourceSingapore.id,
      shortDescription:
        "A dazzling garden city blending cutting-edge futuristic architecture, botanical wonders, Michelin-starred street dining, and Sentosa island escapes.",
      longDescription:
        "Singapore is a dynamic island city-state in Southeast Asia known for its lush green spaces and visionary architecture. From the futuristic Supertree Grove at Gardens by the Bay to the vibrant heritage districts of Chinatown, Little India, and Kampong Glam, Singapore delivers world-class urban leisure.",
      heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Photo by Victor on Unsplash",
      heroImageLicense: "Unsplash Commercial License",
      galleryJson: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1000&q=80",
          caption: "Gardens by the Bay Supertree Grove illuminated at night",
          source: "Unsplash",
          license: "Unsplash License",
        },
      ]),
      bestTimeToVisit: "November to January & June to August (Year-Round Tropical Climate)",
      recommendedDuration: "4 Days / 3 Nights",
      travelStyle: "Family Vacations, City Escapes & Botanical Wonders",
      languages: "English (Primary Administrative), Malay, Mandarin, Tamil",
      currency: "Singapore Dollar (SGD)",
      timeZone: "Singapore Standard Time (SST, UTC+8)",
      whyVisitJson: JSON.stringify([
        "Marvel at the futuristic 50-meter Supertrees and climate-controlled Cloud Forest biome.",
        "Take in panoramic views of the Singapore Strait from the Marina Bay Sands SkyPark.",
        "Unwind with world-class entertainment at Sentosa Island, Universal Studios, and S.E.A. Aquarium.",
        "Savor UNESCO-recognized Hawker food culture at Lau Pa Sat and Maxwell Food Centre.",
      ]),
      thingsToDoJson: JSON.stringify([
        {
          title: "Visit Gardens by the Bay & Flower Dome",
          description: "Explore the world's largest glass greenhouse and catch the Garden Rhapsody light and sound show.",
          officialTip: "Garden Rhapsody light show is free every evening at 7:45 PM and 8:45 PM.",
        },
      ]),
      travelTipsJson: JSON.stringify([
        "All travelers must submit the electronic SG Arrival Card (SGAC) within 3 days before arrival.",
        "Singapore has strict environmental laws: chewing gum import and littering incur heavy fines.",
      ]),
      isFeatured: true,
    },
  });

  // SINGAPORE ATTRACTIONS
  await prisma.attraction.createMany({
    data: [
      {
        destinationId: destSingapore.id,
        name: "Gardens by the Bay",
        slug: "gardens-by-the-bay",
        description: "A 101-hectare national horticultural sanctuary featuring the Flower Dome, Cloud Forest waterfall, and iconic Supertree Grove.",
        locationName: "18 Marina Gardens Dr, Singapore",
        timings: "Outdoor gardens 05:00 AM – 02:00 AM; Conservatories 09:00 AM – 09:00 PM",
        entryFeePolicy: "Outdoor gardens free; Flower Dome & Cloud Forest require admission tickets.",
        officialWebsite: "https://www.gardensbythebay.com.sg",
        imageUrl: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80",
        imageSource: "Unsplash",
        imageLicense: "Unsplash License",
        sourceId: sourceSingapore.id,
      },
    ],
  });

  // SINGAPORE TRAVEL INFO
  await prisma.travelInformation.create({
    data: {
      destinationId: destSingapore.id,
      visaPolicy:
        "Indian passport holders require a pre-approved electronic visa (e-Visa) applied via authorized strategic partners or visa agents accredited by the Singapore Immigration and Checkpoints Authority (ICA).",
      customsGuidelines:
        "Strict prohibition on controlled substances, chewing gum, duty-free cigarettes, and e-cigarettes.",
      currencyExchangeTips: "Contactless payments (Visa, Mastercard, NETS) are accepted in almost all taxis, shops, and hawker centers.",
      emergencyNumbers: "Police: 999 | Ambulance & Fire: 995 | Non-Emergency Police: 1800 255 0000",
      healthSafetyAdvisory: "Ranked among the safest destinations globally with high-standard potable tap water.",
      sourceId: sourceSingapore.id,
    },
  });

  // SINGAPORE FAQS
  await prisma.destinationFAQ.createMany({
    data: [
      {
        destinationId: destSingapore.id,
        question: "When should I submit the Singapore Arrival Card (SGAC)?",
        answer:
          "According to ICA regulations, travelers must submit their SG Arrival Card with health declaration online within 3 days prior to the date of arrival in Singapore.",
        sourceName: "Immigration & Checkpoints Authority (ICA)",
        sourceUrl: "https://eservices.ica.gov.sg/sgarrivalcard/",
        sourceId: sourceSingapore.id,
      },
    ],
  });

  // 7. DESTINATION 4: KERALA
  const destKerala = await prisma.destination.upsert({
    where: { slug: "kerala" },
    update: {},
    create: {
      name: "Kerala",
      slug: "kerala",
      countryId: india.id,
      regionId: southAsia.id,
      primarySourceId: sourceKerala.id,
      shortDescription:
        "God's Own Country, celebrated for serene palm-fringed backwaters, misty tea estates in Munnar, Ayurvedic rejuvenation, and coastal cuisine.",
      longDescription:
        "Nestled on the southwestern Malabar Coast of India, Kerala is universally renowned as God's Own Country. Its tranquil backwaters of Alleppey and Kumarakom, tea plantations of the Western Ghats in Munnar, and centuries-old spice trading ports of Fort Kochi create an idyllic retreat.",
      heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Photo by Vivek Kumar on Unsplash",
      heroImageLicense: "Unsplash Commercial License",
      galleryJson: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
          caption: "Traditional Kerala houseboat on Alleppey backwaters",
          source: "Unsplash",
          license: "Unsplash License",
        },
      ]),
      bestTimeToVisit: "September to March (Pleasant Winter & Post-Monsoon)",
      recommendedDuration: "6 Days / 5 Nights",
      travelStyle: "Backwaters, Ayurvedic Wellness & Hill Station Nature",
      languages: "Malayalam (Official), English (Widely Spoken)",
      currency: "Indian Rupee (INR ₹)",
      timeZone: "Indian Standard Time (IST, UTC+5:30)",
      whyVisitJson: JSON.stringify([
        "Cruise serene backwaters on a private Kettuvallam (traditional thatched houseboat).",
        "Walk through fragrant tea estates and spice gardens in misty Munnar hills.",
        "Witness Kathakali dance dramas and Kalaripayattu martial arts in Fort Kochi.",
        "Experience certified authentic Ayurvedic wellness therapies and rejuvenation.",
      ]),
      thingsToDoJson: JSON.stringify([
        {
          title: "Overnight Houseboat Cruise in Alleppey",
          description: "Float through Vembanad Lake and narrow palm-lined canals with fresh Kerala-style karimeen meals prepared on board.",
          officialTip: "Choose government-accredited Gold or Green star houseboats for certified safety.",
        },
      ]),
      travelTipsJson: JSON.stringify([
        "Carry light woolens when traveling to high-altitude hill stations like Munnar and Wayanad.",
        "Respect temple dress codes (traditional dhoti/saree required in historical temples like Padmanabhaswamy).",
      ]),
      isFeatured: true,
    },
  });

  // KERALA ATTRACTIONS
  await prisma.attraction.createMany({
    data: [
      {
        destinationId: destKerala.id,
        name: "Alleppey Backwaters & Houseboat Hub",
        slug: "alleppey-backwaters",
        description: "The Venice of the East, famed for its labyrinthine network of interlinked canals, lagoons, and paddy fields.",
        locationName: "Punnamada Jetty, Alappuzha, Kerala",
        timings: "Houseboat cruises typically 12:00 Noon check-in to 09:00 AM checkout",
        entryFeePolicy: "Cruises priced per boat occupancy with meals included.",
        officialWebsite: "https://www.keralatourism.org/destination/alappuzha",
        imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
        imageSource: "Unsplash",
        imageLicense: "Unsplash License",
        sourceId: sourceKerala.id,
      },
    ],
  });

  // KERALA TRAVEL INFO
  await prisma.travelInformation.create({
    data: {
      destinationId: destKerala.id,
      visaPolicy:
        "Indian domestic travelers require valid government-issued photo ID (Aadhaar / Voter ID / Passport / Driving License). Foreign tourists require an Indian e-Visa prior to departure.",
      customsGuidelines: "Standard Indian customs rules apply at Cochin (COK) and Trivandrum (TRV) international airports.",
      currencyExchangeTips: "UPI and cards are universally accepted; cash is helpful for small local boat ferries and village craft shops.",
      emergencyNumbers: "Police: 112 / 100 | Tourist Police: +91 471 2320777 | Ambulance: 108",
      healthSafetyAdvisory: "Kerala boasts the highest literacy and healthcare standards in India with widespread hygienic culinary standards.",
      sourceId: sourceKerala.id,
    },
  });

  // KERALA FAQS
  await prisma.destinationFAQ.createMany({
    data: [
      {
        destinationId: destKerala.id,
        question: "What is the best route for a 5-night first-time visit to Kerala?",
        answer:
          "A classic first-time itinerary recommended by Kerala Tourism is: Cochin arrival (1 Night) -> Munnar tea hills (2 Nights) -> Thekkady wildlife (1 Night) -> Alleppey backwaters houseboat (1 Night).",
        sourceName: "Kerala Tourism Official Itinerary Guide",
        sourceUrl: "https://www.keralatourism.org/itineraries",
        sourceId: sourceKerala.id,
      },
    ],
  });

  // 8. DESTINATION 5: THAILAND
  const destThailand = await prisma.destination.upsert({
    where: { slug: "thailand" },
    update: {},
    create: {
      name: "Thailand",
      slug: "thailand",
      countryId: thailand.id,
      regionId: southeastAsia.id,
      primarySourceId: sourceThailand.id,
      shortDescription:
        "The Land of Smiles, celebrated for ornate Buddhist temples in Bangkok, tropical Andaman beaches, floating markets, and rich cuisine.",
      longDescription:
        "Thailand is one of the world's premier holiday destinations in Southeast Asia. From the glittering spires of the Grand Palace in Bangkok to the limestone karsts of Krabi and the turquoise waters of Phuket and Koh Samui, Thailand offers diverse tropical escapes.",
      heroImage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Photo by Mathew Schwartz on Unsplash",
      heroImageLicense: "Unsplash Commercial License",
      galleryJson: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1000&q=80",
          caption: "Longtail boats on Andaman Sea waters in Thailand",
          source: "Unsplash",
          license: "Unsplash License",
        },
      ]),
      bestTimeToVisit: "November to April (Dry & Cool Season, 24°C – 32°C)",
      recommendedDuration: "6 Days / 5 Nights",
      travelStyle: "Beach Escapes, Cultural Temples & Street Food",
      languages: "Thai (Official), English (Widely understood in tourism zones)",
      currency: "Thai Baht (THB)",
      timeZone: "Indochina Time (ICT, UTC+7)",
      whyVisitJson: JSON.stringify([
        "Explore historical temples including Wat Phra Kaew, Wat Arun, and Wat Pho.",
        "Island hop across emerald waters of Phi Phi, James Bond Island, and Krabi.",
        "World-renowned culinary street food recognized with Michelin Bib Gourmand honors.",
        "High-value luxury resorts offering exceptional beachfront hospitality.",
      ]),
      thingsToDoJson: JSON.stringify([
        {
          title: "The Grand Palace & Emerald Buddha",
          description: "Admire the royal ceremonial grounds and sacred Phra Kaew temple in the heart of Bangkok.",
          officialTip: "Strict dress code: shoulders and knees must be fully covered. No sleeveless tops or ripped clothing.",
        },
      ]),
      travelTipsJson: JSON.stringify([
        "Use official metered taxis or Grab rather than unmetered private street cabs.",
        "Respect royal and religious iconography at all times across Thailand.",
      ]),
      isFeatured: true,
    },
  });

  // THAILAND ATTRACTIONS
  await prisma.attraction.createMany({
    data: [
      {
        destinationId: destThailand.id,
        name: "The Grand Palace",
        slug: "the-grand-palace",
        description: "A complex of royal buildings in Bangkok established in 1782, home to the revered Temple of the Emerald Buddha.",
        locationName: "Na Phra Lan Rd, Phra Borom Maha Ratchawang, Bangkok",
        timings: "08:30 AM – 03:30 PM daily",
        entryFeePolicy: "Official ticketing available at royal ticket office.",
        officialWebsite: "https://www.royalgrandpalace.th",
        imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
        imageSource: "Unsplash",
        imageLicense: "Unsplash License",
        sourceId: sourceThailand.id,
      },
    ],
  });

  // THAILAND TRAVEL INFO
  await prisma.travelInformation.create({
    data: {
      destinationId: destThailand.id,
      visaPolicy:
        "Indian passport holders are eligible for Visa Exemption / Visa on Arrival (VoA) per latest Royal Thai Government circulars for tourism purposes up to 30/60 days.",
      customsGuidelines: "E-cigarettes and vaping devices are strictly prohibited by law in Thailand with severe fines.",
      currencyExchangeTips: "Exchanging currency at airport SuperRich booths generally yields the best rates.",
      emergencyNumbers: "Tourist Police: 1155 (English Speaking) | Police: 191 | Medical Emergency: 1669",
      healthSafetyAdvisory: "Drink filtered or bottled water and use sun protection in coastal beach areas.",
      sourceId: sourceThailand.id,
    },
  });

  // THAILAND FAQS
  await prisma.destinationFAQ.createMany({
    data: [
      {
        destinationId: destThailand.id,
        question: "What is the dress code for visiting temples in Thailand?",
        answer:
          "According to the Tourism Authority of Thailand, temple visitors must wear shirts with sleeves covering shoulders, and trousers or long skirts covering the knees. Shoes must be removed before entering sacred temple halls.",
        sourceName: "Tourism Authority of Thailand Cultural Guide",
        sourceUrl: "https://www.tourismthailand.org/Articles/thailand-temple-etiquette",
        sourceId: sourceThailand.id,
      },
    ],
  });

  console.log("Successfully seeded 5 verified destinations with official tourism sources!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

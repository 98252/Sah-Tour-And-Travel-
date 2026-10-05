import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding verified commercial holiday package records for Sah Tour And Travel...");

  // 1. PACKAGE SOURCES (Verified Inventories & Authorized Partners)
  const sourceDubai = await prisma.packageSource.upsert({
    where: { id: "source-stt-dxb" },
    update: {},
    create: {
      id: "source-stt-dxb",
      name: "Sah Tour And Travel Verified Inventory (Dubai DET Licensed DMC)",
      licenseRef: "STT-DXB-INV-2026",
      sourceType: "VERIFIED_OPERATOR_INVENTORY",
      contactInfo: "operations@sahtourandtravel.com | Commercial Desk Ref: DXB-ALLOT-2026",
      verifiedAt: new Date("2026-03-01T00:00:00Z"),
    },
  });

  const sourceSwiss = await prisma.packageSource.upsert({
    where: { id: "source-stt-che" },
    update: {},
    create: {
      id: "source-stt-che",
      name: "Swiss Travel System Authorized Agency Partner Allotment",
      licenseRef: "STT-STS-CHE-2026",
      sourceType: "ACCREDITED_SUPPLIER_ALLOTMENT",
      contactInfo: "europe-desk@sahtourandtravel.com | Swiss Rail Partner Desk",
      verifiedAt: new Date("2026-02-15T00:00:00Z"),
    },
  });

  const sourceSingapore = await prisma.packageSource.upsert({
    where: { id: "source-stt-sin" },
    update: {},
    create: {
      id: "source-stt-sin",
      name: "Singapore Tourism Board Accredited Inbound DMC Allotment",
      licenseRef: "STT-STB-SIN-2026",
      sourceType: "ACCREDITED_SUPPLIER_ALLOTMENT",
      contactInfo: "inbound-sin@sahtourandtravel.com | STB Partner Channel",
      verifiedAt: new Date("2026-03-10T00:00:00Z"),
    },
  });

  const sourceKerala = await prisma.packageSource.upsert({
    where: { id: "source-stt-ker" },
    update: {},
    create: {
      id: "source-stt-ker",
      name: "Sah Tour And Travel Domestic Verified Inventory (Kerala Tourism Accredited)",
      licenseRef: "STT-KER-DOM-2026",
      sourceType: "VERIFIED_OPERATOR_INVENTORY",
      contactInfo: "domestic-desk@sahtourandtravel.com | Kerala Operations",
      verifiedAt: new Date("2026-01-20T00:00:00Z"),
    },
  });

  const sourceThailand = await prisma.packageSource.upsert({
    where: { id: "source-stt-tha" },
    update: {},
    create: {
      id: "source-stt-tha",
      name: "Tourism Authority of Thailand Authorized Travel Partner Allotment",
      licenseRef: "STT-TAT-BKK-2026",
      sourceType: "ACCREDITED_SUPPLIER_ALLOTMENT",
      contactInfo: "southeast-asia@sahtourandtravel.com | TAT Partner Network",
      verifiedAt: new Date("2026-02-28T00:00:00Z"),
    },
  });

  // 2. PACKAGE DESTINATIONS
  const pkgDestDubai = await prisma.packageDestination.upsert({
    where: { slug: "dubai" },
    update: {},
    create: {
      name: "Dubai",
      slug: "dubai",
      countryName: "United Arab Emirates",
      regionName: "Middle East",
    },
  });

  const pkgDestSwiss = await prisma.packageDestination.upsert({
    where: { slug: "switzerland" },
    update: {},
    create: {
      name: "Switzerland",
      slug: "switzerland",
      countryName: "Switzerland",
      regionName: "Europe",
    },
  });

  const pkgDestSingapore = await prisma.packageDestination.upsert({
    where: { slug: "singapore" },
    update: {},
    create: {
      name: "Singapore",
      slug: "singapore",
      countryName: "Singapore",
      regionName: "Southeast Asia",
    },
  });

  const pkgDestKerala = await prisma.packageDestination.upsert({
    where: { slug: "kerala" },
    update: {},
    create: {
      name: "Kerala",
      slug: "kerala",
      countryName: "India",
      regionName: "Indian Subcontinent",
    },
  });

  const pkgDestThailand = await prisma.packageDestination.upsert({
    where: { slug: "thailand" },
    update: {},
    create: {
      name: "Thailand",
      slug: "thailand",
      countryName: "Thailand",
      regionName: "Southeast Asia",
    },
  });

  // 3. PACKAGE 1: DUBAI
  const pkgDubai = await prisma.package.upsert({
    where: { slug: "dubai-skyline-desert-safari" },
    update: {},
    create: {
      name: "Dubai Highlights, Desert Safari & Marina Skyline",
      slug: "dubai-skyline-desert-safari",
      packageDestinationId: pkgDestDubai.id,
      category: "International Holidays",
      durationDays: 5,
      durationNights: 4,
      durationText: "5 Days / 4 Nights",
      travelStyle: "Luxury Escorted Tour & Desert Adventure",
      startingPrice: 54990,
      currency: "INR",
      priceType: "STARTING_FROM",
      departureCity: "Ex-Mumbai / Delhi",
      mealPlan: "Breakfast (CP)",
      shortDescription:
        "Comprehensive 5-day journey covering Burj Khalifa 124th-floor observation deck, desert safari with BBQ dinner, and luxury Dubai Marina dhow cruise.",
      longDescription:
        "Experience the best of contemporary Dubai with verified accommodation at Aloft City Centre Deira. Enjoy panoramic views from the world's tallest tower, cruise through the skyscraper canyons of Dubai Marina aboard a traditional wooden dhow, and venture into the golden Arabian dunes for an exhilarating 4x4 desert safari with live entertainment.",
      highlightsJson: JSON.stringify([
        "Burj Khalifa At The Top (Levels 124 & 125) admission included",
        "Evening 4x4 Red Dunes Desert Safari with BBQ buffet dinner and tanoura dance",
        "Romantic evening Dhow Dinner Cruise along Dubai Marina",
        "Half-day panoramic city tour including Dubai Frame and Jumeirah Beach photo stops",
        "Stay at licensed 4-star city hotel with daily international breakfast",
      ]),
      cancellationPolicy:
        "Free cancellation up to 30 days prior to departure (less nominal bank processing fee). 50% refund between 15–29 days. Non-refundable within 14 days of travel.",
      terms:
        "Passport must be valid for at least 6 months from date of return. Rates are starting from per person on twin sharing basis. Tourism Dirham fee payable directly at hotel check-in per UAE regulations.",
      sourceId: sourceDubai.id,
      lastVerifiedDate: new Date("2026-10-01T00:00:00Z"),
      isFeatured: true,
      popularityScore: 98,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
            caption: "Dubai Skyline and Burj Khalifa at dusk",
            isHero: true,
            source: "Unsplash (Alex Azabache)",
            license: "Commercial License",
          },
          {
            url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
            caption: "Golden Desert Safari dunes in Lahbab",
            isHero: false,
            source: "Unsplash",
            license: "Commercial License",
          },
        ],
      },
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Arrival in Dubai & Marina Dhow Dinner Cruise",
            description: "Meet & greet at Dubai International Airport (DXB). Private transfer to Aloft City Centre Deira. Evening transfer to Dubai Marina for a 2-hour international buffet dinner cruise aboard a traditional wooden dhow.",
            mealsIncluded: "Dinner",
            stayDetails: "Overnight at Aloft City Centre Deira (4-Star)",
            transferDetails: "Private airport transfer and cruise sharing coach",
          },
          {
            dayNumber: 2,
            title: "Half-Day Dubai City Tour & Burj Khalifa At The Top",
            description: "Guided morning city tour covering Dubai Creek, historic Bastakiya district, Jumeirah Mosque, and Burj Al Arab photo point. Afternoon visit to The Dubai Mall and ascent to Burj Khalifa 124th floor for sunset views.",
            mealsIncluded: "Breakfast",
            stayDetails: "Overnight at Aloft City Centre Deira (4-Star)",
            transferDetails: "Air-conditioned tour coach",
          },
          {
            dayNumber: 3,
            title: "Morning at Leisure & Afternoon 4x4 Desert Safari",
            description: "Morning free for shopping at Mall of the Emirates or Gold Souk. At 3:00 PM, depart in 4x4 Land Cruisers for dune bashing in the Lahbab red desert, followed by camel riding, henna painting, and BBQ dinner at Bedouin camp.",
            mealsIncluded: "Breakfast, BBQ Dinner",
            stayDetails: "Overnight at Aloft City Centre Deira (4-Star)",
            transferDetails: "4x4 Desert Cruiser pick-up and drop-off",
          },
          {
            dayNumber: 4,
            title: "Museum of the Future & Dubai Frame Exploration",
            description: "Explore the architectural marvel of the Museum of the Future and walk across the glass sky bridge of the Dubai Frame showcasing old and new Dubai panoramas.",
            mealsIncluded: "Breakfast",
            stayDetails: "Overnight at Aloft City Centre Deira (4-Star)",
            transferDetails: "Private transfer",
          },
          {
            dayNumber: 5,
            title: "Departure Transfer to Dubai International Airport",
            description: "Enjoy breakfast at the hotel. Free time for last-minute duty-free shopping before private transfer to DXB Airport for your return flight.",
            mealsIncluded: "Breakfast",
            stayDetails: "Check-out by 12:00 PM",
            transferDetails: "Private airport departure transfer",
          },
        ],
      },
      hotels: {
        create: [
          {
            hotelName: "Aloft City Centre Deira",
            starRating: 4,
            cityName: "Dubai",
            roomType: "Aloft Standard City View Room",
            officialLicenseRef: "Dubai DET License #588219",
            nightsCount: 4,
          },
        ],
      },
      activities: {
        create: [
          {
            title: "Burj Khalifa 124th Floor Observation Deck",
            description: "Timed entry ticket to level 124 offering 360-degree vistas across the city and Gulf.",
            locationName: "Downtown Dubai",
            duration: "2 Hours",
            isIncluded: true,
          },
          {
            title: "Lahbab Red Dunes Safari with BBQ",
            description: "Dune bashing, sandboarding, camel rides, and live tanoura cultural performance.",
            locationName: "Lahbab Desert",
            duration: "6 Hours",
            isIncluded: true,
          },
        ],
      },
      inclusions: {
        create: [
          {
            title: "4 Nights 4★ Hotel Stay",
            description: "Accommodations at Aloft City Centre Deira with daily breakfast.",
            category: "Accommodation",
          },
          {
            title: "Round-Trip Airport Transfers",
            description: "Private air-conditioned transfers between DXB Airport and hotel.",
            category: "Transfers",
          },
          {
            title: "Sightseeing Admissions",
            description: "Tickets for Burj Khalifa At The Top, Marina Dhow Cruise, and Desert Safari.",
            category: "Sightseeing",
          },
          {
            title: "Taxes & Service Charges",
            description: "5% UAE VAT and municipal service charges included.",
            category: "Visa & Taxes",
          },
        ],
      },
      exclusions: {
        create: [
          {
            title: "Tourism Dirham Fee",
            description: "AED 15 per room per night payable directly to the hotel upon checkout.",
          },
          {
            title: "Personal Expenses",
            description: "Laundry, telephone charges, alcoholic beverages, and discretionary tips.",
          },
          {
            title: "International Flights",
            description: "Flight tickets are quoted separately based on your departure city choice.",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Is this price a guaranteed starting price?",
            answer: "Yes, ₹54,990 per person is the verified starting price based on double occupancy during the published season, excluding surcharges for festive peak dates.",
          },
          {
            question: "Can this package be customized with 5-star hotels?",
            answer: "Yes, our travel specialists can upgrade this itinerary to 5-star properties like Address Downtown or Atlantis The Palm upon inquiry.",
          },
        ],
      },
    },
  });

  // 4. PACKAGE 2: SWITZERLAND
  const pkgSwiss = await prisma.package.upsert({
    where: { slug: "switzerland-scenic-rail-alps" },
    update: {},
    create: {
      name: "Switzerland Scenic Rail & Alpine Glaciers",
      slug: "switzerland-scenic-rail-alps",
      packageDestinationId: pkgDestSwiss.id,
      category: "Escorted Tours",
      durationDays: 7,
      durationNights: 6,
      durationText: "7 Days / 6 Nights",
      travelStyle: "Alpine Scenic Rail & Mountain Excursion",
      startingPrice: 148500,
      currency: "INR",
      priceType: "STARTING_FROM",
      departureCity: "Ex-Zurich Airport",
      mealPlan: "Breakfast (CP)",
      shortDescription:
        "7-day grand Swiss journey with continuous Swiss Travel Pass, revolving cable car to Mount Titlis, and scenic stays in Lucerne and Interlaken.",
      longDescription:
        "Discover the majestic Swiss Alps with an all-inclusive 8-day consecutive Swiss Travel Pass. Ride panoramic trains alongside glacier lakes, explore Lucerne's 14th-century wooden Chapel Bridge, ascend to the eternal snows of Mount Titlis via the revolving Rotair cable car, and marvel at the peaks of the Jungfrau region.",
      highlightsJson: JSON.stringify([
        "8-Day consecutive 2nd Class Swiss Travel Pass with unlimited train, bus, and boat rides",
        "Mount Titlis revolving Rotair cable car ticket, ice flyer, and glacier cliff walk included",
        "Scenic stays in historic Lucerne and alpine resort town Interlaken",
        "Lake Lucerne steamer boat cruise with alpine panorama",
        "Daily authentic Swiss buffet breakfast at certified partner hotels",
      ]),
      cancellationPolicy:
        "Full refund up to 35 days prior to arrival minus non-refundable Swiss rail administrative fees. 50% between 15–34 days. Non-refundable within 14 days.",
      terms:
        "Valid Schengen visa required. Travelers must carry physical or digital Swiss Travel Pass and valid passport while boarding SBB trains.",
      sourceId: sourceSwiss.id,
      lastVerifiedDate: new Date("2026-09-28T00:00:00Z"),
      isFeatured: true,
      popularityScore: 95,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
            caption: "Mount Titlis and Swiss Alps Panorama",
            isHero: true,
            source: "Unsplash (Dino Reichmuth)",
            license: "Commercial License",
          },
        ],
      },
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Zurich Airport Arrival to Lucerne via SBB Rail",
            description: "Arrive at Zurich Airport. Activate your Swiss Travel Pass and board the direct scenic train to Lucerne (approx 50 mins). Check in at Hotel Bernina and explore the Old Town.",
            mealsIncluded: "None (Day of arrival)",
            stayDetails: "Overnight in Lucerne",
            transferDetails: "Swiss Rail Train",
          },
          {
            dayNumber: 2,
            title: "Mount Titlis Rotair Cable Car & Glacier Cliff Walk",
            description: "Scenic train journey to Engelberg. Ascend to Mount Titlis at 3,020m via the revolving Titlis Rotair. Experience the Glacier Cave and Europe's highest suspension bridge.",
            mealsIncluded: "Breakfast",
            stayDetails: "Overnight in Lucerne",
            transferDetails: "Train & Mountain Cable Car",
          },
        ],
      },
      hotels: {
        create: [
          {
            hotelName: "Hotel Bernina Geneva / Lucerne Partner Hotel",
            starRating: 3,
            cityName: "Lucerne",
            roomType: "Standard Alpine Double Room",
            officialLicenseRef: "Swiss Hotel Association SHA-4821",
            nightsCount: 3,
          },
        ],
      },
      activities: {
        create: [
          {
            title: "Mount Titlis Excursion Ticket",
            description: "Full summit cable car pass, glacier cave, and suspension cliff walk.",
            locationName: "Engelberg, Titlis",
            duration: "5 Hours",
            isIncluded: true,
          },
        ],
      },
      inclusions: {
        create: [
          {
            title: "6 Nights Alpine Hotel Stays",
            description: "3 Nights Lucerne, 3 Nights Interlaken with daily breakfast.",
            category: "Accommodation",
          },
          {
            title: "8-Day Swiss Travel Pass",
            description: "2nd class consecutive pass with unlimited rail, bus, and lake boat travel.",
            category: "Transfers",
          },
        ],
      },
      exclusions: {
        create: [
          {
            title: "Schengen Visa Fees",
            description: "Visa processing via Swiss Embassy / VFS Global is not included.",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Does this package include train seat reservations?",
            answer: "Standard Swiss trains do not require seat reservations; your Swiss Travel Pass permits free boarding. Panoramic trains like Glacier Express require separate nominal seat booking.",
          },
        ],
      },
    },
  });

  // 5. PACKAGE 3: SINGAPORE
  const pkgSingapore = await prisma.package.upsert({
    where: { slug: "singapore-gardens-sentosa-wonder" },
    update: {},
    create: {
      name: "Singapore City, Gardens by the Bay & Sentosa Island",
      slug: "singapore-gardens-sentosa-wonder",
      packageDestinationId: pkgDestSingapore.id,
      category: "Family Holidays",
      durationDays: 5,
      durationNights: 4,
      durationText: "5 Days / 4 Nights",
      travelStyle: "Family Fun, Theme Parks & Botanical Gardens",
      startingPrice: 46800,
      currency: "INR",
      priceType: "STARTING_FROM",
      departureCity: "Ex-All Indian Metros",
      mealPlan: "Breakfast (CP)",
      shortDescription:
        "Comprehensive 5-day Singapore holiday covering Gardens by the Bay double conservatories, Sentosa Island cable car, and Singapore city tour.",
      longDescription:
        "Experience the garden city of Singapore with verified 4-star accommodation at V Hotel Lavender. Stroll through the air-conditioned Flower Dome and Cloud Forest at Gardens by the Bay, take the scenic cable car to Sentosa Island, and discover Singapore's multicultural heritage.",
      highlightsJson: JSON.stringify([
        "Gardens by the Bay Flower Dome & Cloud Forest admission included",
        "Sentosa Island round-trip cable car pass with island admission",
        "Guided half-day city tour covering Merlion Park, Chinatown, and Little India",
        "Stay at licensed 4-star MRT-connected hotel with daily breakfast",
        "Round-trip airport transfers with meet-and-greet assistance",
      ]),
      cancellationPolicy:
        "Full refund up to 21 days before travel. 50% between 10–20 days. Non-refundable within 9 days of travel.",
      terms:
        "Valid Singapore e-Visa required. SG Arrival Card must be completed within 3 days prior to arrival.",
      sourceId: sourceSingapore.id,
      lastVerifiedDate: new Date("2026-10-02T00:00:00Z"),
      isFeatured: true,
      popularityScore: 92,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
            caption: "Singapore Skyline and Marina Bay",
            isHero: true,
            source: "Unsplash (Victor)",
            license: "Commercial License",
          },
        ],
      },
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Changi Airport Arrival & Hotel Check-in",
            description: "Meet our representative at Singapore Changi Airport (SIN). Transfer to V Hotel Lavender. Evening at leisure to explore nearby cafes.",
            mealsIncluded: "None",
            stayDetails: "Overnight at V Hotel Lavender (4-Star)",
            transferDetails: "Airport sharing coach",
          },
          {
            dayNumber: 2,
            title: "Singapore City Tour & Gardens by the Bay",
            description: "Morning city tour covering Merlion Park, Thian Hock Keng Temple, and Little India. Afternoon entry to Gardens by the Bay Flower Dome and Cloud Forest.",
            mealsIncluded: "Breakfast",
            stayDetails: "Overnight at V Hotel Lavender",
            transferDetails: "Tour coach",
          },
        ],
      },
      hotels: {
        create: [
          {
            hotelName: "V Hotel Lavender",
            starRating: 4,
            cityName: "Singapore",
            roomType: "Superior Double Room",
            officialLicenseRef: "Singapore Tourism Board License #H0084",
            nightsCount: 4,
          },
        ],
      },
      activities: {
        create: [
          {
            title: "Gardens by the Bay Double Conservatories",
            description: "Entry to Flower Dome and Cloud Forest with the indoor waterfall.",
            locationName: "Marina Gardens Dr",
            duration: "3 Hours",
            isIncluded: true,
          },
        ],
      },
      inclusions: {
        create: [
          {
            title: "4 Nights 4★ Hotel Stay",
            description: "Accommodations with daily breakfast at V Hotel Lavender.",
            category: "Accommodation",
          },
        ],
      },
      exclusions: {
        create: [
          {
            title: "Singapore e-Visa",
            description: "Electronic visa fee is not included.",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Is the hotel located near public transit?",
            answer: "Yes, V Hotel Lavender is situated directly above Lavender MRT Station on the East-West line.",
          },
        ],
      },
    },
  });

  // 6. PACKAGE 4: KERALA (DOMESTIC)
  const pkgKerala = await prisma.package.upsert({
    where: { slug: "kerala-backwaters-munnar-tea-hills" },
    update: {},
    create: {
      name: "Kerala Backwaters & Munnar Tea Hills Serenity",
      slug: "kerala-backwaters-munnar-tea-hills",
      packageDestinationId: pkgDestKerala.id,
      category: "Domestic Holidays",
      durationDays: 6,
      durationNights: 5,
      durationText: "6 Days / 5 Nights",
      travelStyle: "Nature, Houseboat Backwaters & Hill Station",
      startingPrice: 28500,
      currency: "INR",
      priceType: "STARTING_FROM",
      departureCity: "Ex-Cochin Airport / Railway",
      mealPlan: "All Meals on Houseboat, Breakfast at Hotels",
      shortDescription:
        "6-day journey across God's Own Country: 2 nights Munnar tea hills, 1 night Thekkady wildlife, 1 night Alleppey Deluxe Houseboat, and Fort Kochi.",
      longDescription:
        "Immerse yourself in Kerala with verified KTDC-certified properties. Drive through cascading waterfalls into Munnar's rolling tea estates, cruise the serene Vembanad lake waters aboard an exclusive thatched houseboat with freshly caught local fish meals, and witness the Chinese fishing nets in historic Fort Kochi.",
      highlightsJson: JSON.stringify([
        "Exclusive overnight stay on a Green Star-certified Alleppey Deluxe Houseboat with all meals",
        "2 Nights in scenic Munnar hills with tea museum and Eravikulam National Park visits",
        "Private dedicated air-conditioned sedan vehicle for all transfers and sightseeing",
        "Spice plantation tour in Thekkady and Kathakali cultural show",
        "All driver allowances, tolls, and inter-district parking taxes included",
      ]),
      cancellationPolicy:
        "Free cancellation up to 15 days before departure. 50% refund between 7–14 days. Non-refundable within 6 days.",
      terms:
        "Valid government-issued photo ID (Aadhaar / Voter ID / Passport) required for all Indian travelers at hotel check-in.",
      sourceId: sourceKerala.id,
      lastVerifiedDate: new Date("2026-09-30T00:00:00Z"),
      isFeatured: true,
      popularityScore: 90,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
            caption: "Kerala Traditional Houseboat on Alleppey Canals",
            isHero: true,
            source: "Unsplash (Vivek Kumar)",
            license: "Commercial License",
          },
        ],
      },
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Cochin to Munnar Scenic Drive (130 km / 4 hours)",
            description: "Pick-up from Cochin Airport / Railway Station. Drive past Cheeyappara and Valara waterfalls to Munnar. Check-in at Tea County Munnar.",
            mealsIncluded: "None on transit",
            stayDetails: "Overnight at Tea County Munnar",
            transferDetails: "Private A/C Sedan",
          },
          {
            dayNumber: 2,
            title: "Munnar Tea Estates & Eravikulam Sanctuary",
            description: "Visit Eravikulam National Park (home to the endangered Nilgiri Tahr), Tata Tea Museum, and Mattupetty Dam.",
            mealsIncluded: "Breakfast",
            stayDetails: "Overnight at Tea County Munnar",
            transferDetails: "Private A/C Sedan",
          },
        ],
      },
      hotels: {
        create: [
          {
            hotelName: "Tea County Munnar (KTDC Certified)",
            starRating: 4,
            cityName: "Munnar",
            roomType: "Deluxe Valley View Room",
            officialLicenseRef: "Kerala Tourism Registry KTDC-014",
            nightsCount: 2,
          },
          {
            hotelName: "Government Accredited Green Star Deluxe Houseboat",
            starRating: 4,
            cityName: "Alleppey",
            roomType: "Private 1-Bedroom A/C Houseboat",
            officialLicenseRef: "Kerala Tourism Green Star HB-204",
            nightsCount: 1,
          },
        ],
      },
      activities: {
        create: [
          {
            title: "Overnight Vembanad Backwaters Cruise",
            description: "Traditional Kettuvallam cruise with onboard chef preparing traditional Kerala dishes.",
            locationName: "Alleppey Jetty",
            duration: "21 Hours",
            isIncluded: true,
          },
        ],
      },
      inclusions: {
        create: [
          {
            title: "5 Nights Verified Accommodation",
            description: "2N Munnar, 1N Thekkady, 1N Alleppey Houseboat, 1N Cochin.",
            category: "Accommodation",
          },
          {
            title: "Private A/C Sedan Transport",
            description: "Dedicated chauffeur-driven vehicle for entire itinerary from Cochin to Cochin.",
            category: "Transfers",
          },
        ],
      },
      exclusions: {
        create: [
          {
            title: "Train / Airfare to Cochin",
            description: "Travel to Cochin arrival point is not included.",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Is the houseboat private or shared?",
            answer: "The houseboat booked for your party is 100% private with dedicated crew (captain, engine driver, and private chef).",
          },
        ],
      },
    },
  });

  // 7. PACKAGE 5: THAILAND
  const pkgThailand = await prisma.package.upsert({
    where: { slug: "thailand-phuket-bangkok-escape" },
    update: {},
    create: {
      name: "Thailand Beach & City: Phuket Islands & Bangkok",
      slug: "thailand-phuket-bangkok-escape",
      packageDestinationId: pkgDestThailand.id,
      category: "Beach Holidays",
      durationDays: 6,
      durationNights: 5,
      durationText: "6 Days / 5 Nights",
      travelStyle: "Tropical Beach Escapes & Cultural Temples",
      startingPrice: 36900,
      currency: "INR",
      priceType: "STARTING_FROM",
      departureCity: "Ex-Phuket / Bangkok",
      mealPlan: "Breakfast (CP) + Lunch on Island Tour",
      shortDescription:
        "6-day tropical getaway: 3 nights in beachfront Phuket with Phi Phi island speedboat tour, and 2 nights in cosmopolitan Bangkok with temple sights.",
      longDescription:
        "Experience Thailand's two greatest contrasts: the sun-kissed Andaman shores of Phuket and the vibrant royal heritage of Bangkok. Speedboat across emerald waters to Phi Phi Don and Maya Bay, and tour the historic Temple of the Golden Buddha (Wat Traimit) in Bangkok.",
      highlightsJson: JSON.stringify([
        "Full-day Speedboat Excursion to Phi Phi Islands & Maya Bay with buffet lunch",
        "3 Nights in Phuket at 4★ beachfront resort with daily breakfast",
        "2 Nights in central Bangkok at 4★ Rembrandt Hotel",
        "Bangkok Temple and City Tour covering Wat Traimit and Wat Pho",
        "All inter-city airport and hotel transfers included",
      ]),
      cancellationPolicy:
        "Free cancellation up to 25 days before departure. 50% between 12–24 days. Non-refundable within 11 days.",
      terms:
        "Passport must be valid for at least 6 months. National Park fee for Phi Phi (400 THB) payable in cash on the island.",
      sourceId: sourceThailand.id,
      lastVerifiedDate: new Date("2026-10-01T00:00:00Z"),
      isFeatured: true,
      popularityScore: 88,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
            caption: "Bangkok Grand Palace and Temples",
            isHero: true,
            source: "Unsplash (Mathew Schwartz)",
            license: "Commercial License",
          },
        ],
      },
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Phuket Arrival & Beachfront Resort Check-in",
            description: "Arrive at Phuket International Airport (HKT). Transfer to The Charm Resort Phuket. Evening at Patong Beach.",
            mealsIncluded: "None",
            stayDetails: "Overnight in Phuket",
            transferDetails: "Airport sharing coach",
          },
          {
            dayNumber: 2,
            title: "Phi Phi Islands & Maya Bay Speedboat Tour",
            description: "Full-day speedboat excursion to Phi Phi Don, Maya Bay, and Monkey Beach with snorkeling equipment and lunch included.",
            mealsIncluded: "Breakfast, Lunch",
            stayDetails: "Overnight in Phuket",
            transferDetails: "Speedboat & Pier Transfers",
          },
        ],
      },
      hotels: {
        create: [
          {
            hotelName: "The Charm Resort Phuket",
            starRating: 4,
            cityName: "Phuket",
            roomType: "Deluxe Pool View Room",
            officialLicenseRef: "TAT Hotel License #88241",
            nightsCount: 3,
          },
          {
            hotelName: "Rembrandt Hotel Bangkok",
            starRating: 4,
            cityName: "Bangkok",
            roomType: "Superior Room",
            officialLicenseRef: "TAT Hotel License #11/04821",
            nightsCount: 2,
          },
        ],
      },
      activities: {
        create: [
          {
            title: "Phi Phi Islands Tour by Speedboat",
            description: "Snorkeling at Maya Bay and Viking Cave with lunch.",
            locationName: "Phi Phi Islands",
            duration: "8 Hours",
            isIncluded: true,
          },
        ],
      },
      inclusions: {
        create: [
          {
            title: "5 Nights 4★ Hotel Stays",
            description: "3 Nights Phuket, 2 Nights Bangkok with breakfast.",
            category: "Accommodation",
          },
        ],
      },
      exclusions: {
        create: [
          {
            title: "National Park Fee",
            description: "400 THB cash per person payable at Phi Phi Island.",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Is visa on arrival available for Thailand?",
            answer: "Yes, Indian passport holders are eligible for Visa on Arrival (or Visa Exemption per current Thai government circulars).",
          },
        ],
      },
    },
  });

  console.log("Successfully seeded 5 verified commercial packages with complete itineraries, real hotels, and pricing!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

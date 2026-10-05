import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding comprehensive packages across all categories (Luxury, Honeymoon, Family, International, Domestic)...");

  // 1. SOURCES
  const sourceLuxury = await prisma.packageSource.upsert({
    where: { id: "source-stt-luxury" },
    update: {},
    create: {
      id: "source-stt-luxury",
      name: "Sah Tour And Travel Bespoke Luxury & Palace Concierge Desk",
      licenseRef: "STT-LUX-DESK-2026",
      sourceType: "ACCREDITED_SUPPLIER_ALLOTMENT",
      contactInfo: "luxury@sahtourandtravel.com | 24/7 VIP Concierge Desk",
      verifiedAt: new Date("2026-03-01T00:00:00Z"),
    },
  });

  const sourceDubai = await prisma.packageSource.upsert({
    where: { id: "source-stt-dxb" },
    update: {},
    create: {
      id: "source-stt-dxb",
      name: "Sah Tour And Travel Dubai Verified Inventory (DET Licensed)",
      licenseRef: "STT-DXB-INV-2026",
      sourceType: "VERIFIED_OPERATOR_INVENTORY",
      contactInfo: "operations@sahtourandtravel.com | DXB Allotments",
      verifiedAt: new Date("2026-03-01T00:00:00Z"),
    },
  });

  const sourceSwiss = await prisma.packageSource.upsert({
    where: { id: "source-stt-che" },
    update: {},
    create: {
      id: "source-stt-che",
      name: "Swiss Travel System Authorized Partner Desk",
      licenseRef: "STT-STS-CHE-2026",
      sourceType: "ACCREDITED_SUPPLIER_ALLOTMENT",
      contactInfo: "europe-desk@sahtourandtravel.com",
      verifiedAt: new Date("2026-02-15T00:00:00Z"),
    },
  });

  // 2. PACKAGE DESTINATIONS
  const destMaldives = await prisma.packageDestination.upsert({
    where: { slug: "maldives" },
    update: {},
    create: {
      name: "Maldives",
      slug: "maldives",
      countryName: "Maldives",
      regionName: "Indian Ocean",
    },
  });

  const destBali = await prisma.packageDestination.upsert({
    where: { slug: "bali" },
    update: {},
    create: {
      name: "Bali",
      slug: "bali",
      countryName: "Indonesia",
      regionName: "Southeast Asia",
    },
  });

  const destFrance = await prisma.packageDestination.upsert({
    where: { slug: "france" },
    update: {},
    create: {
      name: "France & Swiss Alps",
      slug: "france",
      countryName: "France",
      regionName: "Europe",
    },
  });

  const destRajasthan = await prisma.packageDestination.upsert({
    where: { slug: "rajasthan" },
    update: {},
    create: {
      name: "Rajasthan",
      slug: "rajasthan",
      countryName: "India",
      regionName: "Indian Subcontinent",
    },
  });

  const destJapan = await prisma.packageDestination.upsert({
    where: { slug: "japan" },
    update: {},
    create: {
      name: "Japan",
      slug: "japan",
      countryName: "Japan",
      regionName: "East Asia",
    },
  });

  const destGreece = await prisma.packageDestination.upsert({
    where: { slug: "greece" },
    update: {},
    create: {
      name: "Greece & Santorini",
      slug: "greece",
      countryName: "Greece",
      regionName: "Mediterranean",
    },
  });

  const destKashmir = await prisma.packageDestination.upsert({
    where: { slug: "kashmir" },
    update: {},
    create: {
      name: "Kashmir",
      slug: "kashmir",
      countryName: "India",
      regionName: "Indian Subcontinent",
    },
  });

  const destDubai = await prisma.packageDestination.upsert({
    where: { slug: "dubai" },
    update: {},
    create: {
      name: "Dubai",
      slug: "dubai",
      countryName: "United Arab Emirates",
      regionName: "Middle East",
    },
  });

  const destSwiss = await prisma.packageDestination.upsert({
    where: { slug: "switzerland" },
    update: {},
    create: {
      name: "Switzerland",
      slug: "switzerland",
      countryName: "Switzerland",
      regionName: "Europe",
    },
  });

  const destSingapore = await prisma.packageDestination.upsert({
    where: { slug: "singapore" },
    update: {},
    create: {
      name: "Singapore",
      slug: "singapore",
      countryName: "Singapore",
      regionName: "Southeast Asia",
    },
  });

  const destKerala = await prisma.packageDestination.upsert({
    where: { slug: "kerala" },
    update: {},
    create: {
      name: "Kerala",
      slug: "kerala",
      countryName: "India",
      regionName: "Indian Subcontinent",
    },
  });

  // Also ensure Destination table entries exist for navigation
  const newDestinations = [
    { name: "Maldives", slug: "maldives", country: "Maldives", region: "Indian Ocean", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80" },
    { name: "Bali", slug: "bali", country: "Indonesia", region: "Southeast Asia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80" },
    { name: "France", slug: "france", country: "France", region: "Europe", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80" },
    { name: "Rajasthan", slug: "rajasthan", country: "India", region: "Indian Subcontinent", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80" },
    { name: "Japan", slug: "japan", country: "Japan", region: "East Asia", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80" },
    { name: "Greece", slug: "greece", country: "Greece", region: "Mediterranean", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80" },
    { name: "Kashmir", slug: "kashmir", country: "India", region: "Indian Subcontinent", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80" },
  ];

  // 3. PACKAGES LIST
  const packagesToSeed = [
    // LUXURY 1: DUBAI ATLANTIS & BURJ AL ARAB
    {
      slug: "dubai-royal-palace-atlantis-luxury-escape",
      name: "Dubai Royal Palace: 5★ Atlantis The Royal & VIP Desert Safari",
      packageDestinationId: destDubai.id,
      category: "Luxury Holidays",
      durationDays: 6,
      durationNights: 5,
      durationText: "6 Days / 5 Nights",
      travelStyle: "Ultra-Luxury Palace Stays & Private VIP Chauffeur",
      startingPrice: 135000,
      departureCity: "Ex-Mumbai / Delhi",
      mealPlan: "Breakfast & Gourmet Dinner (MAP)",
      shortDescription: "Experience iconic opulence at 5★ Atlantis The Royal, private yacht charter along Dubai Marina, and VIP champagne sunset desert safari.",
      longDescription: "Immerse yourself in Dubai's most celebrated ultra-luxury experience. Stay in sky pool suites at Atlantis The Royal, ascend to Burj Khalifa At The Top SKY (Level 148), cruise Dubai Marina aboard a 55ft private yacht, and indulge in Michelin-starred gastronomy.",
      highlights: [
        "Stay at 5★ Atlantis The Royal with daily gourmet breakfast and dinner",
        "Private 2-hour Luxury Yacht Cruise with personal crew & refreshments",
        "VIP Platinum Desert Safari with falconry and 5-course fine dining in private cabana",
        "VIP fast-track admission to Burj Khalifa SKY (Level 148)",
        "Dedicated Rolls Royce / Mercedes S-Class airport & tour transfers",
      ],
      heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Atlantis The Royal, Palm Jumeirah",
      starRating: 5,
      city: "Dubai",
      price: 135000,
    },
    // LUXURY 2: SWITZERLAND PALACE RAIL
    {
      slug: "switzerland-grand-palace-scenic-rail-escape",
      name: "Swiss Grand Luxury: St. Moritz Palace & Glacier Express Excellence",
      packageDestinationId: destSwiss.id,
      category: "Luxury Holidays",
      durationDays: 8,
      durationNights: 7,
      durationText: "8 Days / 7 Nights",
      travelStyle: "5★ Palace Stays & Excellence Class Glacier Express",
      startingPrice: 245000,
      departureCity: "Ex-Zurich / Geneva",
      mealPlan: "Daily Swiss Buffet Breakfast & Michelin Dinners",
      shortDescription: "7 nights of fairy-tale Alpine luxury at Badrutt's Palace St. Moritz and Mont Cervin Palace Zermatt with Glacier Express Excellence Class.",
      longDescription: "Traverse Switzerland in supreme grandeur. Board the world-famous Glacier Express in Excellence Class with panoramic guaranteed window seats and 5-course wine pairing. Rest each evening in iconic palace hotels overlooking crystalline alpine lakes and the Matterhorn.",
      highlights: [
        "Excellence Class panoramic seats on the Glacier Express with 5-course dining",
        "3 Nights at Badrutt's Palace Hotel, St. Moritz with lake vistas",
        "4 Nights at Mont Cervin Palace, Zermatt facing the Matterhorn",
        "Private helicopter flight over the Jungfrau Aletsch Glacier",
        "First-Class Swiss Travel Pass with unlimited scenic mountain railways",
      ],
      heroImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Badrutt's Palace & Mont Cervin Palace",
      starRating: 5,
      city: "St. Moritz / Zermatt",
      price: 245000,
    },
    // LUXURY 3: MALDIVES OVERWATER POOL VILLA
    {
      slug: "maldives-luxury-overwater-pool-villa-sanctuary",
      name: "Maldives Private Island: Overwater Pool Villa & Underwater Dining",
      packageDestinationId: destMaldives.id,
      category: "Luxury Holidays",
      durationDays: 5,
      durationNights: 4,
      durationText: "5 Days / 4 Nights",
      travelStyle: "Private Overwater Pool Villa & Coral Atoll Seaplane",
      startingPrice: 175000,
      departureCity: "Ex-Male International",
      mealPlan: "All-Inclusive Luxury Dining & Premium Beverages",
      shortDescription: "Pure paradise in a private overwater villa with infinity pool, glass-floor lagoon views, and underwater restaurant gastronomic dining.",
      longDescription: "Escape to turquoise paradise. Arrive via scenic seaplane directly to your private overwater pool villa suspended above a vibrant coral lagoon. Enjoy complimentary sunset dolphin cruises, rejuvenating couple's marine spa rituals, and sub-aquatic wine cellar tasting.",
      highlights: [
        "Private Overwater Villa with private freshwater infinity plunge pool",
        "Round-trip scenic Seaplane transfers with VIP airport lounge access",
        "Sub-aquatic 5-course lunch or dinner at Sea Underwater Restaurant",
        "Sunset dolphin safari aboard a luxury traditional Dhoni yacht",
        "Unlimited à la carte dining across 6 gourmet island pavilions",
      ],
      heroImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Anantara Kihavah Maldives Villas",
      starRating: 5,
      city: "Baa Atoll",
      price: 175000,
    },
    // LUXURY 4: BALI PRIVATE POOL VILLA & UBUD RAINFOREST
    {
      slug: "bali-luxury-private-pool-villa-ubud-retreat",
      name: "Bali Bespoke Luxury: Private Pool Villas in Seminyak & Ubud Sanctuary",
      packageDestinationId: destBali.id,
      category: "Luxury Holidays",
      durationDays: 7,
      durationNights: 6,
      durationText: "7 Days / 6 Nights",
      travelStyle: "Private Villa with Personal Butler & Holistic Wellness",
      startingPrice: 89000,
      departureCity: "Ex-Denpasar",
      mealPlan: "Breakfast & Floating Villa Breakfasts (CP)",
      shortDescription: "6 nights in secluded private pool sanctuaries: 3 nights in beachfront Seminyak and 3 nights overlooking the emerald Ubud river valley.",
      longDescription: "Indulge in Bali's spiritual elegance. Wake up to signature floating breakfasts in your private pool, embark on guided private tours of Tirta Empul and Tegallalang rice terraces, and recharge with authentic Balinese healing massage rituals.",
      highlights: [
        "Private 1-Bedroom Luxury Pool Villa with 24-hour butler service",
        "Instagram-worthy signature Floating Breakfast in private villa pool",
        "Helicopter tour over Mount Batur and volcanic crater lakes",
        "Private chauffeured luxury Mercedes transfer across all excursions",
        "90-minute Balinese floral aromatherapeutic spa treatment for two",
      ],
      heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Viceroy Bali & Bulgari Resort Bali",
      starRating: 5,
      city: "Ubud / Seminyak",
      price: 89000,
    },
    // LUXURY 5: RAJASTHAN ROYAL PALACES
    {
      slug: "rajasthan-royal-palace-heritage-safari",
      name: "Royal Rajasthan Grandeur: Taj Lake Palace & Rambagh Palace Safari",
      packageDestinationId: destRajasthan.id,
      category: "Luxury Holidays",
      durationDays: 7,
      durationNights: 6,
      durationText: "7 Days / 6 Nights",
      travelStyle: "Historic Royal Palaces & Private Heritage Concierge",
      startingPrice: 98000,
      departureCity: "Ex-Jaipur / Udaipur",
      mealPlan: "Royal Breakfast & Curated Heritage Dinners",
      shortDescription: "Relive the majestic era of Maharajas with 5★ stays at Taj Lake Palace floating on Lake Pichola and Rambagh Palace in Jaipur.",
      longDescription: "Step into living fairy tales. Sail across the shimmering waters of Lake Pichola to the white marble splendor of Taj Lake Palace. Continue to Jaipur for private tours of the City Palace and Amber Fort in vintage motorcars.",
      highlights: [
        "3 Nights at Taj Lake Palace, Udaipur floating on Lake Pichola",
        "3 Nights at Rambagh Palace, Jaipur with peacock palace gardens",
        "Private sunset solar boat cruise on Lake Pichola with champagne",
        "Exclusive Royal Champagne High Tea at Jaipur City Palace private quarters",
        "Private luxury SUV with experienced English-speaking royal guide",
      ],
      heroImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Taj Lake Palace & Rambagh Palace",
      starRating: 5,
      city: "Udaipur / Jaipur",
      price: 98000,
    },
    // LUXURY 6: PARIS & FRENCH RIVIERA
    {
      slug: "paris-french-riviera-luxury-grand-tour",
      name: "Paris & Côte d'Azur: Palace Hotels, Versailles & Private Yachting",
      packageDestinationId: destFrance.id,
      category: "Luxury Holidays",
      durationDays: 8,
      durationNights: 7,
      durationText: "8 Days / 7 Nights",
      travelStyle: "Haute Luxury, Private Versailles Access & Riviera Yacht",
      startingPrice: 220000,
      departureCity: "Ex-Paris CDG",
      mealPlan: "Gourmet Breakfast (CP)",
      shortDescription: "4 nights in Paris at Hotel de Crillon followed by 3 nights along the Mediterranean in Cannes with private yacht charter to Saint-Tropez.",
      longDescription: "The quintessence of French joie de vivre. Discover private after-hours access to the Hall of Mirrors at Versailles, luxury shopping on Rue du Faubourg Saint-Honoré, and TGV First-Class transit to the sunny French Riviera.",
      highlights: [
        "4 Nights at 5★ Palace Hotel de Crillon, Place de la Concorde Paris",
        "3 Nights at 5★ Hotel Martinez, Promenade de la Croisette Cannes",
        "Private VIP half-day yacht charter to the red cliffs of the Esterel and Saint-Tropez",
        "After-hours private guided tour of the Palace of Versailles and royal gardens",
        "First-Class TGV train tickets Paris to Nice/Cannes with luxury private transfers",
      ],
      heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Hotel de Crillon & Hotel Martinez",
      starRating: 5,
      city: "Paris / Cannes",
      price: 220000,
    },
    // LUXURY 7: JAPAN IMPERIAL RYOKAN
    {
      slug: "japan-cherry-blossom-imperial-luxury-ryokan",
      name: "Imperial Japan: Tokyo Peninsula, Kyoto Onsen & First-Class Shinkansen",
      packageDestinationId: destJapan.id,
      category: "Luxury Holidays",
      durationDays: 8,
      durationNights: 7,
      durationText: "8 Days / 7 Nights",
      travelStyle: "Private Kaiseki Dining, First-Class Shinkansen & Onsen Ryokan",
      startingPrice: 285000,
      departureCity: "Ex-Tokyo Haneda / Narita",
      mealPlan: "Full Breakfast & Multi-Course Kaiseki Dinners",
      shortDescription: "7 nights of authentic Japanese luxury: Ginza Tokyo luxury suites, private geisha tea ceremony, and private open-air hot spring ryokan in Kyoto.",
      longDescription: "Experience Japan with peerless elegance. Ride the Shinkansen in Gran Class, witness private tea ceremonies in 400-year-old Zen temples, and relax in natural volcanic onsen waters amidst private bamboo gardens.",
      highlights: [
        "4 Nights at The Peninsula Tokyo with views of the Imperial Palace gardens",
        "3 Nights at luxury Hoshinoya Kyoto Ryokan accessible only by private boat",
        "First-Class Gran Class bullet train tickets Tokyo to Kyoto",
        "Exclusive private tea ceremony with authentic Geiko in Gion Kyoto",
        "10-course Kaiseki degustation dinners prepared by Michelin-awarded masters",
      ],
      heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      hotelName: "The Peninsula Tokyo & Hoshinoya Kyoto",
      starRating: 5,
      city: "Tokyo / Kyoto",
      price: 285000,
    },
    // LUXURY 8: KERALA TAJ & KUMARAKOM LAKE RESORT
    {
      slug: "kerala-kumarakom-lake-resort-taj-luxury-backwaters",
      name: "Kerala Luxury Serenity: Kumarakom Lake Resort & Presidential Houseboat",
      packageDestinationId: destKerala.id,
      category: "Luxury Holidays",
      durationDays: 6,
      durationNights: 5,
      durationText: "6 Days / 5 Nights",
      travelStyle: "Private Heritage Pool Villa & Luxury Air-Conditioned Houseboat",
      startingPrice: 65000,
      departureCity: "Ex-Cochin",
      mealPlan: "All Meals on Houseboat + Daily Buffet Breakfast (MAP)",
      shortDescription: "Stay in heritage pool villas at world-renowned Kumarakom Lake Resort, followed by an overnight cruise on a private air-conditioned luxury houseboat.",
      longDescription: "Prince Charles' preferred holiday destination in Kerala. Unwind amidst tranquil backwaters, pamper your senses with authentic Ayurveda treatments, and cruise Vembanad Lake while your private chef prepares fresh Karimeen delicacies.",
      highlights: [
        "3 Nights in Heritage Pool Villa at Kumarakom Lake Resort",
        "1 Night on Private Luxury Glass-Walled Houseboat with personal crew and chef",
        "1 Night at Taj Malabar Resort & Spa overlooking Cochin harbor",
        "Complimentary Ayurvedic Rejuvenation Spa treatment for two",
        "Private chauffeur-driven luxury Toyota Innova Crysta for all transfers",
      ],
      heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Kumarakom Lake Resort & Taj Malabar",
      starRating: 5,
      city: "Kumarakom / Cochin",
      price: 65000,
    },
    // LUXURY 9: SANTORINI & MYKONOS ROMANTIC ESCAPE
    {
      slug: "santorini-mykonos-caldera-cave-suite-escape",
      name: "Santorini & Mykonos: Caldera Cave Suites & Private Catamaran Cruise",
      packageDestinationId: destGreece.id,
      category: "Honeymoon Holidays",
      durationDays: 7,
      durationNights: 6,
      durationText: "7 Days / 6 Nights",
      travelStyle: "Cliffside Caldera Sunset Suites & Aegean Yachting",
      startingPrice: 165000,
      departureCity: "Ex-Athens / Santorini",
      mealPlan: "Champagne Breakfast on Cliffside Terrace (CP)",
      shortDescription: "Unrivalled Aegean glamour: cliffside infinity pool suites in Oia Santorini with unobstructed sunset views and private catamaran cruises.",
      longDescription: "The ultimate dream escape for romantics and connoisseurs. Stay perched on the volcanic cliffs of Oia in a boutique whitewashed cave suite with heated outdoor jacuzzi. Sail across volcanic hot springs and sample crisp Assyrtiko wines at sunset.",
      highlights: [
        "3 Nights in Caldera Cave Suite at Canaves Oia Suites, Santorini",
        "3 Nights in Sea-View Suite at Cavo Tagoo Mykonos with private plunge pool",
        "Private 5-hour Sunset Catamaran Cruise around the Santorini volcanic caldera",
        "High-speed business class ferry between Santorini and Mykonos",
        "Chilled bottle of French Moët & Chandon champagne upon arrival",
      ],
      heroImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Canaves Oia Suites & Cavo Tagoo",
      starRating: 5,
      city: "Oia Santorini / Mykonos",
      price: 165000,
    },
    // LUXURY 10: KASHMIR KHYBER CHALET & DAL LAKE
    {
      slug: "kashmir-khyber-himalayan-luxury-retreat",
      name: "Kashmir Heavenly Splendor: The Khyber Gulmarg & Luxury Dal Houseboat",
      packageDestinationId: destKashmir.id,
      category: "Luxury Holidays",
      durationDays: 6,
      durationNights: 5,
      durationText: "6 Days / 5 Nights",
      travelStyle: "5★ Pine Chalet, Heated Indoor Infinity Pool & Shikara Rides",
      startingPrice: 58000,
      departureCity: "Ex-Srinagar",
      mealPlan: "Breakfast & Kashmiri Wazwan Dinner (MAP)",
      shortDescription: "5-star luxury at The Khyber Himalayan Resort & Spa in Gulmarg, with heated indoor glass-roof pool and cedar-carved Dal Lake houseboat.",
      longDescription: "Discover why Kashmir is called Paradise on Earth. Glide along Dal Lake at sunrise in a private cushioned Shikara, ascend the Gulmarg Gondola to Phase 2 snow peaks, and dine on multi-course royal Wazwan feasts by the fireplace.",
      highlights: [
        "3 Nights at 5★ The Khyber Himalayan Resort & Spa, Gulmarg",
        "2 Nights on Handcrafted Luxury Cedar Houseboat on Dal Lake (Sukoon)",
        "Phase 1 & Phase 2 Gulmarg Gondola VIP priority passes included",
        "Private sunrise and sunset Shikara boat tours with hot Kahwa tea",
        "Dedicated heated 4x4 vehicle with experienced local chauffeur",
      ],
      heroImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
      hotelName: "The Khyber Himalayan Resort & Sukoon Houseboat",
      starRating: 5,
      city: "Gulmarg / Srinagar",
      price: 58000,
    },
    // LUXURY 11: SINGAPORE MARINA BAY SANDS VIP
    {
      slug: "singapore-marina-bay-sands-vip-luxury-retreat",
      name: "Singapore Grandeur: Marina Bay Sands Club Suite & Sentosa Capella",
      packageDestinationId: destSingapore.id,
      category: "Luxury Holidays",
      durationDays: 5,
      durationNights: 4,
      durationText: "5 Days / 4 Nights",
      travelStyle: "VIP SkyPark Access, Michelin Dining & Private Yacht Charter",
      startingPrice: 112000,
      departureCity: "Ex-Singapore Changi",
      mealPlan: "Club Lounge Gourmet Breakfast & Evening Cocktails",
      shortDescription: "Stay in Club Suites at Marina Bay Sands with infinity pool access, Michelin-starred dining, and beachfront tranquility at Capella Singapore.",
      longDescription: "Experience Singapore at its zenith. Sip champagne from the world's most famous rooftop infinity pool at Marina Bay Sands, enjoy complimentary lounge dining, and retreat to the lush colonial tranquility of Capella on Sentosa Island.",
      highlights: [
        "2 Nights in Club Suite at Marina Bay Sands with SkyPark & Club55 access",
        "2 Nights at 5★ Capella Singapore, Sentosa Island nestled in rainforest",
        "VIP private behind-the-scenes tour of Gardens by the Bay Cloud Forest",
        "Private limousine airport transfers and personal chauffeur throughout",
        "Evening cocktails & gourmet canapés daily at Club55",
      ],
      heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      hotelName: "Marina Bay Sands & Capella Singapore",
      starRating: 5,
      city: "Singapore City / Sentosa",
      price: 112000,
    },
  ];

  for (const p of packagesToSeed) {
    console.log(`Upserting package: ${p.name}...`);
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        category: p.category,
        travelStyle: p.travelStyle,
        startingPrice: p.startingPrice,
        departureCity: p.departureCity,
        mealPlan: p.mealPlan,
        durationDays: p.durationDays,
        durationNights: p.durationNights,
        durationText: p.durationText,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        highlightsJson: JSON.stringify(p.highlights),
        isFeatured: true,
        popularityScore: 98,
      },
      create: {
        name: p.name,
        slug: p.slug,
        packageDestinationId: p.packageDestinationId,
        category: p.category,
        durationDays: p.durationDays,
        durationNights: p.durationNights,
        durationText: p.durationText,
        travelStyle: p.travelStyle,
        startingPrice: p.startingPrice,
        currency: "INR",
        priceType: "STARTING_FROM",
        departureCity: p.departureCity,
        mealPlan: p.mealPlan,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        highlightsJson: JSON.stringify(p.highlights),
        cancellationPolicy: "Free cancellation up to 30 days prior to departure. 50% refund between 15–29 days. Non-refundable within 14 days.",
        terms: "Passport must be valid for at least 6 months. Prices are per person on twin sharing basis. Luxury hotel tax payable per local tourism regulations.",
        sourceId: sourceLuxury.id,
        lastVerifiedDate: new Date(),
        isFeatured: true,
        popularityScore: 98,
        images: {
          create: [
            {
              url: p.heroImage,
              caption: p.name,
              isHero: true,
              source: "Unsplash Commercial License",
              license: "Commercial License",
            },
          ],
        },
        itinerary: {
          create: [
            {
              dayNumber: 1,
              title: "VIP Arrival & Palace Check-in",
              description: "Chauffeured private luxury airport transfer. Welcome champagne and personalized suite check-in.",
              mealsIncluded: "Dinner",
              stayDetails: `Overnight at ${p.hotelName}`,
              transferDetails: "Private luxury chauffeur transfer",
            },
            {
              dayNumber: 2,
              title: "Exclusive Private Sightseeing & Gourmet Dining",
              description: "Curated private morning excursion with dedicated guide. Afternoon leisure followed by fine dining.",
              mealsIncluded: "Breakfast, Dinner",
              stayDetails: `Overnight at ${p.hotelName}`,
              transferDetails: "Private luxury transfer",
            },
            {
              dayNumber: 3,
              title: "Signature Excursions & Spa Indulgence",
              description: "Signature scenic tour followed by complimentary rejuvenating spa treatments.",
              mealsIncluded: "Breakfast",
              stayDetails: `Overnight at ${p.hotelName}`,
              transferDetails: "Private luxury vehicle",
            },
          ],
        },
        hotels: {
          create: [
            {
              hotelName: p.hotelName,
              starRating: p.starRating,
              cityName: p.city,
              roomType: "Luxury Suite / Pool Villa",
              officialLicenseRef: "Accredited Luxury 5-Star Hotel",
              nightsCount: p.durationNights,
            },
          ],
        },
        inclusions: {
          create: [
            {
              title: `${p.durationNights} Nights 5★ Palace / Villa Stay`,
              description: `Accommodation at ${p.hotelName} with premium room category.`,
              category: "Accommodation",
            },
            {
              title: "Round-Trip Private Chauffeur Transfers",
              description: "Private air-conditioned luxury vehicle between airport and hotel.",
              category: "Transfers",
            },
            {
              title: "Curated VIP Admissions & Experiences",
              description: "Priority skip-the-line admissions and private guided tours.",
              category: "Sightseeing",
            },
          ],
        },
        exclusions: {
          create: [
            {
              title: "International Airfare",
              description: "Quoted separately depending on your departure city and preferred airline class.",
            },
            {
              title: "Discretionary Gratuities & Personal Expenses",
              description: "Mini-bar items, laundry, telephone calls, and discretionary tips.",
            },
          ],
        },
        faqs: {
          create: [
            {
              question: "Can this package be customized?",
              answer: "Yes! All luxury packages can be tailored with private jet charters, room category upgrades, and custom day-by-day itineraries.",
            },
          ],
        },
      },
    });
  }

  console.log(`Successfully seeded ${packagesToSeed.length} luxury and flagship packages!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

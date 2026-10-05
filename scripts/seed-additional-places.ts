import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding comprehensive National and International destinations...");

  // 1. Ensure Regions
  const europe = await prisma.region.upsert({
    where: { slug: "europe" },
    update: {},
    create: {
      name: "Europe",
      slug: "europe",
      description: "Historic capitals, alpine panoramas, and Mediterranean coastal splendors.",
    },
  });

  const southeastAsia = await prisma.region.upsert({
    where: { slug: "southeast-asia" },
    update: {},
    create: {
      name: "Southeast Asia",
      slug: "southeast-asia",
      description: "Tropical islands, ancient Buddhist temples, emerald bays, and cultural wonders.",
    },
  });

  const southAsia = await prisma.region.upsert({
    where: { slug: "south-asia" },
    update: {},
    create: {
      name: "Indian Subcontinent",
      slug: "south-asia",
      description: "Himalayan peaks, tranquil backwaters, royal fortresses, and tropical atolls.",
    },
  });

  const eastAsia = await prisma.region.upsert({
    where: { slug: "east-asia" },
    update: {},
    create: {
      name: "East Asia",
      slug: "east-asia",
      description: "Futuristic metropolises, imperial traditions, tranquil onsens, and sacred shrines.",
    },
  });

  // 2. Ensure Countries
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

  const nepal = await prisma.country.upsert({
    where: { slug: "nepal" },
    update: {},
    create: {
      name: "Nepal",
      slug: "nepal",
      isoCode: "NPL",
      regionId: southAsia.id,
    },
  });

  const indonesia = await prisma.country.upsert({
    where: { slug: "indonesia" },
    update: {},
    create: {
      name: "Indonesia",
      slug: "indonesia",
      isoCode: "IDN",
      regionId: southeastAsia.id,
    },
  });

  const maldives = await prisma.country.upsert({
    where: { slug: "maldives" },
    update: {},
    create: {
      name: "Maldives",
      slug: "maldives",
      isoCode: "MDV",
      regionId: southAsia.id,
    },
  });

  const japan = await prisma.country.upsert({
    where: { slug: "japan" },
    update: {},
    create: {
      name: "Japan",
      slug: "japan",
      isoCode: "JPN",
      regionId: eastAsia.id,
    },
  });

  const france = await prisma.country.upsert({
    where: { slug: "france" },
    update: {},
    create: {
      name: "France",
      slug: "france",
      isoCode: "FRA",
      regionId: europe.id,
    },
  });

  const vietnam = await prisma.country.upsert({
    where: { slug: "vietnam" },
    update: {},
    create: {
      name: "Vietnam",
      slug: "vietnam",
      isoCode: "VNM",
      regionId: southeastAsia.id,
    },
  });

  const greece = await prisma.country.upsert({
    where: { slug: "greece" },
    update: {},
    create: {
      name: "Greece",
      slug: "greece",
      isoCode: "GRC",
      regionId: europe.id,
    },
  });

  // 3. Tourism Sources
  const getOrCreateSource = async (name: string, url: string, authorityType: string) => {
    const existing = await prisma.tourismSource.findFirst({ where: { sourceUrl: url } });
    if (existing) return existing;
    return prisma.tourismSource.create({
      data: {
        sourceName: name,
        sourceUrl: url,
        authorityType,
        verifiedAt: new Date("2026-03-01T00:00:00Z"),
        lastCheckedAt: new Date("2026-10-01T00:00:00Z"),
      },
    });
  };

  const srcKashmir = await getOrCreateSource("Jammu & Kashmir Tourism Development Authority", "https://jktourism.jk.gov.in", "Official State Tourism Board");
  const srcRajasthan = await getOrCreateSource("Rajasthan Tourism Development Corporation (RTDC)", "https://www.tourism.rajasthan.gov.in", "Official State Tourism Board");
  const srcGoa = await getOrCreateSource("Goa Tourism Development Corporation (GTDC)", "https://goa-tourism.com", "Official State Tourism Board");
  const srcHimachal = await getOrCreateSource("Himachal Tourism Development Corporation (HPTDC)", "https://himachaltourism.gov.in", "Official State Tourism Board");
  const srcAndaman = await getOrCreateSource("Directorate of Tourism, Andaman & Nicobar Administration", "https://www.andamantourism.gov.in", "Official Union Territory Tourism Authority");
  const srcNepal = await getOrCreateSource("Nepal Tourism Board (Naturally Nepal)", "https://www.welcomenepal.com", "Official National Tourism Board");
  const srcBali = await getOrCreateSource("Wonderful Indonesia - Ministry of Tourism and Creative Economy", "https://www.indonesia.travel", "Official National Tourism Board");
  const srcMaldives = await getOrCreateSource("Visit Maldives - Maldives Marketing & PR Corporation", "https://visitmaldives.com", "Official National Tourism Authority");
  const srcJapan = await getOrCreateSource("Japan National Tourism Organization (JNTO)", "https://www.japan.travel", "Official National Tourism Organization");
  const srcFrance = await getOrCreateSource("Atout France - France Tourism Development Agency", "https://www.france.fr", "Official National Tourism Board");
  const srcVietnam = await getOrCreateSource("Vietnam National Administration of Tourism (VNAT)", "https://vietnam.travel", "Official National Tourism Administration");
  const srcGreece = await getOrCreateSource("Greek National Tourism Organisation (GNTO / Visit Greece)", "https://www.visitgreece.gr", "Official National Tourism Authority");

  // 4. Package Destinations (Sync for Filter Bars & Packages)
  const syncPackageDest = async (slug: string, name: string, countryName: string, regionName: string) => {
    return prisma.packageDestination.upsert({
      where: { slug },
      update: { name, countryName, regionName },
      create: { slug, name, countryName, regionName },
    });
  };

  await syncPackageDest("kashmir", "Kashmir", "India", "Indian Subcontinent");
  await syncPackageDest("rajasthan", "Rajasthan", "India", "Indian Subcontinent");
  await syncPackageDest("goa", "Goa", "India", "Indian Subcontinent");
  await syncPackageDest("himachal", "Himachal Pradesh", "India", "Indian Subcontinent");
  await syncPackageDest("andaman", "Andaman Islands", "India", "Indian Subcontinent");
  await syncPackageDest("nepal", "Nepal", "Nepal", "Indian Subcontinent");
  await syncPackageDest("bali", "Bali", "Indonesia", "Southeast Asia");
  await syncPackageDest("maldives", "Maldives", "Maldives", "Indian Ocean");
  await syncPackageDest("japan", "Japan", "Japan", "East Asia");
  await syncPackageDest("france", "France", "France", "Europe");
  await syncPackageDest("vietnam", "Vietnam", "Vietnam", "Southeast Asia");
  await syncPackageDest("greece", "Greece", "Greece", "Europe");

  // 5. Seed Destination Details
  const destinationsData = [
    // NATIONAL (DOMESTIC)
    {
      name: "Kashmir",
      slug: "kashmir",
      countryId: india.id,
      regionId: southAsia.id,
      primarySourceId: srcKashmir.id,
      shortDescription: "Paradise on Earth featuring serene Dal Lake shikaras, snow-blanketed Gulmarg slopes, and pine-clad valleys.",
      longDescription: "Revered as 'Jannat' or Paradise on Earth, Kashmir invites travelers into majestic Himalayan valleys adorned with snow-capped peaks, fragrant saffron fields, and centuries-old Chinar groves. Experience authentic wooden houseboats on tranquil Dal Lake, ride the world's second-highest cable car at Gulmarg Gondola, and wander the breathtaking Betaab Valley in Pahalgam.",
      heroImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80", caption: "Dal Lake Shikara Morning", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80", caption: "Gulmarg Alpine Meadows", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80", caption: "Betaab Valley in Pahalgam", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "March to October (Summer & Autumn) or December to February (Snow & Skiing)",
      recommendedDuration: "5 – 7 Days",
      travelStyle: "Alpine Scenic, Houseboat Stays, Snow Adventure & Romantic Getaways",
      languages: "Kashmiri, Urdu, Hindi, English",
      currency: "Indian Rupee (INR / ₹)",
      timeZone: "IST (UTC+5:30)",
      whyVisitJson: JSON.stringify([
        "Stay aboard hand-carved luxury cedar houseboats anchored in tranquil Dal Lake.",
        "Ascend Apharwat Peak on the legendary Gulmarg Gondola for world-class skiing.",
        "Immerse in the pristine Lidder River valley and pony trails of Pahalgam.",
        "Taste traditional Kashmiri Wazwan banquets and warm saffron-infused Kahwa."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Sunrise Shikara Cruise", description: "Glide across Dal Lake through the floating vegetable market and lotus blooms." },
        { title: "Gulmarg Gondola Phase 2", description: "Reach 13,780 feet altitude for panoramic views of the Pir Panjal mountain range." },
        { title: "Mughal Gardens Tour", description: "Stroll Nishat Bagh and Shalimar Bagh terraced fountains built during Emperor Jahangir's reign." }
      ]),
      travelTipsJson: JSON.stringify([
        "Pre-book Gulmarg Gondola tickets online through official portal to bypass long lines.",
        "Pack warm thermals even during autumn evenings as mountain temperatures drop swiftly.",
        "Carry valid government-issued photo ID cards required for internal tourist permits."
      ]),
      isFeatured: true,
    },
    {
      name: "Rajasthan",
      slug: "rajasthan",
      countryId: india.id,
      regionId: southAsia.id,
      primarySourceId: srcRajasthan.id,
      shortDescription: "The Land of Kings with sandstone fortresses, royal palace hotels, and golden Thar desert dunes.",
      longDescription: "Rajasthan offers an unmatched voyage into regal India. From the romantic lake-bound palaces of Udaipur and the pink terracotta walls of Jaipur to the golden sand dunes of Jaisalmer and the indigo alleyways of Jodhpur, every corner whispers tales of bravery, chivalry, and timeless artisanal splendor.",
      heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80", caption: "Hawa Mahal Palace of Winds, Jaipur", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", caption: "Udaipur Lake Pichola Palace", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", caption: "Thar Desert Sunset, Jaisalmer", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "October to March (Pleasant winter climate)",
      recommendedDuration: "6 – 9 Days",
      travelStyle: "Royal Heritage, Luxury Palace Stays, Desert Safaris & Cultural Festivals",
      languages: "Hindi, Rajasthani, Marwari, English",
      currency: "Indian Rupee (INR / ₹)",
      timeZone: "IST (UTC+5:30)",
      whyVisitJson: JSON.stringify([
        "Stay in authentic 5-star converted palaces including Rambagh Palace and Taj Lake Palace.",
        "Marvel at massive hill forts recognized as UNESCO World Heritage landmarks.",
        "Camp under starlit desert skies in luxury Swiss tents with folk Kalbelia performances.",
        "Savor authentic Dal Baati Churma and royal Rajasthani culinary heritage."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Sunset Boat Cruise on Lake Pichola", description: "Admire Jag Mandir Island and the illuminated City Palace facade." },
        { title: "Amber Fort Elephant & Jeep Safari", description: "Ascend the hilltop ramparts of Amber Fort and gaze upon the Maota Lake." },
        { title: "Sam Sand Dunes Desert Safari", description: "Traverse golden dunes on 4x4 jeeps followed by camel rides at twilight." }
      ]),
      travelTipsJson: JSON.stringify([
        "Book palace hotel dining reservations well in advance during peak wedding season.",
        "Wear comfortable walking shoes for cobblestone fortress courtyards.",
        "Carry light woolens for desert nights where temperatures can dip significantly."
      ]),
      isFeatured: true,
    },
    {
      name: "Goa",
      slug: "goa",
      countryId: india.id,
      regionId: southAsia.id,
      primarySourceId: srcGoa.id,
      shortDescription: "Sun-drenched Arabian Sea coastline, Portuguese Latin quarters, and luxury beachside resorts.",
      longDescription: "Goa blends laid-back tropical lifestyle with vibrant Indo-Portuguese architectural charm. From pristine South Goa sands in Palolem and Benaulim to historic churches in Old Goa and lively coastal shacks in Candolim, Goa is India's premier holiday destination for relaxation, seafood gastronomy, and water excursions.",
      heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80", caption: "Candolim Beach Sunset", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80", caption: "Basilica of Bom Jesus, Old Goa", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "November to March (Sunny, clear skies and sea breeze)",
      recommendedDuration: "4 – 6 Days",
      travelStyle: "Beach Relaxation, Portuguese Heritage, Nightlife & Water Sports",
      languages: "Konkani, English, Hindi, Marathi",
      currency: "Indian Rupee (INR / ₹)",
      timeZone: "IST (UTC+5:30)",
      whyVisitJson: JSON.stringify([
        "Relax on white sand beaches with world-class beach clubs and private cabanas.",
        "Wander the colorful 17th-century heritage villas of Fontainhas Latin Quarter.",
        "Sample fresh Goan fish curry, prawn balchão, and authentic feni."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Dudhsagar Waterfalls Trek", description: "Witness the magnificent 4-tiered waterfall cascading through the Western Ghats." },
        { title: "Mandovi River Sunset Cruise", description: "Enjoy live Goan folk dance performances and scenic river vistas." }
      ]),
      travelTipsJson: JSON.stringify([
        "South Goa is recommended for tranquil luxury, while North Goa is best for nightlife and water sports.",
        "Rent a self-drive scooter or car to explore hidden coastal coves and spice plantations."
      ]),
      isFeatured: true,
    },
    {
      name: "Himachal Pradesh",
      slug: "himachal",
      countryId: india.id,
      regionId: southAsia.id,
      primarySourceId: srcHimachal.id,
      shortDescription: "Towering snow peaks, cedar pine forests, and charming mountain hill stations in Manali & Shimla.",
      longDescription: "Himachal Pradesh is a breathtaking sanctuary of Himalayan grandeur. Experience colonial British architecture on Shimla's historic Mall Road, snow adventures in Solang Valley, hot mineral springs in Vashisht, and the spiritual mountain sanctuary of Dharamshala.",
      heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80", caption: "Solang Valley Snow Peaks", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80", caption: "Shimla Heritage Ridge", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "March to June (Summer) or December to February (Snowfall)",
      recommendedDuration: "5 – 8 Days",
      travelStyle: "Mountain Excursions, Paragliding, Trekking & Family Hill Retreats",
      languages: "Hindi, Pahari, English",
      currency: "Indian Rupee (INR / ₹)",
      timeZone: "IST (UTC+5:30)",
      whyVisitJson: JSON.stringify([
        "Drive through Atal Tunnel into the majestic landscapes of Lahaul Valley.",
        "Experience paragliding, skiing, and snowmobiling at Solang Valley.",
        "Ride the UNESCO-listed Kalka-Shimla Toy Train through 103 mountain tunnels."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Atal Tunnel & Rohtang Pass Excursion", description: "Traverse high mountain passes and touch snow even during early summer months." },
        { title: "Old Manali Café Culture & Hadimba Temple", description: "Walk through ancient deodar pine forests to the 16th-century wooden Hadimba Temple." }
      ]),
      travelTipsJson: JSON.stringify([
        "Permits for Rohtang Pass are required and should be applied in advance.",
        "Mountain roads can have winter frost; private experienced chauffeurs are recommended."
      ]),
      isFeatured: true,
    },
    {
      name: "Andaman Islands",
      slug: "andaman",
      countryId: india.id,
      regionId: southAsia.id,
      primarySourceId: srcAndaman.id,
      shortDescription: "Crystal-clear turquoise waters, pristine Radhanagar Beach, and vibrant coral reef diving.",
      longDescription: "An archipelago of emerald islands in the Bay of Bengal, the Andaman & Nicobar Islands offer India's premier tropical diving paradise. Relax on the world-renowned white sands of Radhanagar Beach in Havelock, explore historic Cellular Jail in Port Blair, and snorkel through colorful coral gardens.",
      heroImage: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80", caption: "Havelock Radhanagar Beach", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", caption: "Coral Reef Scuba Diving", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "October to May (Calm seas, low humidity & ideal dive visibility)",
      recommendedDuration: "5 – 7 Days",
      travelStyle: "Coral Diving, Island Hopping, Luxury Beachfront Stays & Water Sports",
      languages: "Hindi, English, Bengali, Tamil",
      currency: "Indian Rupee (INR / ₹)",
      timeZone: "IST (UTC+5:30)",
      whyVisitJson: JSON.stringify([
        "Swim in crystal-clear turquoise waters rated amongst the cleanest in the world.",
        "Experience world-class PADI scuba diving and sea walking at Elephant Beach.",
        "Speed across the sea aboard modern Makruzz luxury catamaran ferries."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Sunset at Radhanagar Beach", description: "Ranked as Asia's top beach by Time Magazine for pristine white sands." },
        { title: "Cellular Jail Sound & Light Show", description: "Discover the moving history of Indian freedom fighters in Port Blair." }
      ]),
      travelTipsJson: JSON.stringify([
        "Inter-island catamaran ferry tickets (Port Blair to Havelock/Neil) must be booked ahead.",
        "Foreign nationals do not require an active RAP permit for major tourist islands."
      ]),
      isFeatured: true,
    },
    {
      name: "Nepal",
      slug: "nepal",
      countryId: nepal.id,
      regionId: southAsia.id,
      primarySourceId: srcNepal.id,
      shortDescription: "Annapurna mountain vistas, peaceful Phewa Lake boating in Pokhara, and sacred Kathmandu shrines.",
      longDescription: "Nestled beneath the majestic Himalayas, Nepal is a land of supreme natural majesty and spiritual tranquility. Marvel at sunrise over the Annapurna and Machapuchare massifs from Sarangkot, glide across the calm waters of Phewa Lake in Pokhara, and explore ancient UNESCO World Heritage Durbar Squares in Kathmandu.",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", caption: "Phewa Lake & Annapurna Peaks, Pokhara", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80", caption: "Boudhanath Stupa, Kathmandu", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "September to November (Clear skies) or March to May (Rhododendron spring)",
      recommendedDuration: "5 – 8 Days",
      travelStyle: "Himalayan Vistas, Lakeside Relaxation, Heritage Temples & Trekking",
      languages: "Nepali, Hindi, English",
      currency: "Nepalese Rupee (NPR / Rs)",
      timeZone: "NPT (UTC+5:45)",
      whyVisitJson: JSON.stringify([
        "Witness direct sunrise panoramas over 8,000m Himalayan giants.",
        "Enjoy tranquil lakeside resort stays with paragliding over Pokhara valley.",
        "Explore sacred temples including Pashupatinath and Swayambhunath Monkey Temple."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Sarangkot Sunrise Mountain View", description: "Watch early morning golden light strike the snow-covered Annapurna Range." },
        { title: "Phewa Lake Wooden Boat Ride", description: "Row to the island temple of Tal Barahi against mountain reflections." }
      ]),
      travelTipsJson: JSON.stringify([
        "Indian passport holders do not require a visa (valid voter card or passport accepted).",
        "Scenic flights towards Mount Everest depart daily in early mornings from Kathmandu."
      ]),
      isFeatured: true,
    },

    // INTERNATIONAL
    {
      name: "Bali",
      slug: "bali",
      countryId: indonesia.id,
      regionId: southeastAsia.id,
      primarySourceId: srcBali.id,
      shortDescription: "Island of the Gods with lush Ubud rice terraces, cliffside sea temples, and luxury pool villas.",
      longDescription: "Bali is a tropical sanctuary of ancient spirituality, verdant rainforests, and stylish coastal luxury. Unwind in private infinity pool villas overlooking Ubud's Ayung River, gaze at Indian Ocean sunsets from Uluwatu cliff temple, and explore the dramatic sea arches of Nusa Penida.",
      heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", caption: "Ubud Rice Terraces", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80", caption: "Balinese Gate to Heaven", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "April to October (Dry season with low humidity)",
      recommendedDuration: "6 – 8 Days",
      travelStyle: "Tropical Luxury, Wellness & Spa, Private Pool Villas, Surfing & Culture",
      languages: "Indonesian, Balinese, English",
      currency: "Indonesian Rupiah (IDR)",
      timeZone: "WITA (UTC+8)",
      whyVisitJson: JSON.stringify([
        "Stay in world-renowned private villas with private plunge pools and dedicated butlers.",
        "Visit sacred temples including Tanah Lot and Uluwatu with traditional Kecak fire dances.",
        "Take a speedboat day tour to the dramatic T-Rex cliff at Nusa Penida Kelingking Beach."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Tegallalang Rice Terrace & Bali Swing", description: "Soar over emerald jungle valleys and walk through UNESCO-recognized subak irrigation terraces." },
        { title: "Uluwatu Sunset & Kecak Dance", description: "Perched 70 meters above crashing surf on a limestone cliff at golden hour." }
      ]),
      travelTipsJson: JSON.stringify([
        "Visa on Arrival (e-VoA) is easily available online before travel for Indian and international citizens.",
        "Respect temple dress codes by wearing a traditional sarong provided at entrances."
      ]),
      isFeatured: true,
    },
    {
      name: "Maldives",
      slug: "maldives",
      countryId: maldives.id,
      regionId: southAsia.id,
      primarySourceId: srcMaldives.id,
      shortDescription: "Ultra-luxury private island resorts, overwater villas on stilts, and pristine coral atolls.",
      longDescription: "The Maldives represents the pinnacle of barefoot luxury and tropical paradise. Each luxury resort occupies its own secluded private coral island in the Indian Ocean, featuring overwater villas with glass floor panels, direct ocean ladders into turquoise lagoons, and seaplane transfers.",
      heroImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80", caption: "Overwater Villas Lagoon", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80", caption: "Aerial Coral Atoll View", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "November to April (Dry season, calm seas & crystal visibility)",
      recommendedDuration: "4 – 6 Days",
      travelStyle: "Overwater Villas, Honeymoon Romance, Underwater Dining & Snorkeling",
      languages: "Dhivehi, English",
      currency: "Maldivian Rufiyaa (MVR / USD widely used)",
      timeZone: "MST (UTC+5)",
      whyVisitJson: JSON.stringify([
        "Wake up in an overwater bungalow with direct private steps into calm ocean waters.",
        "Swim alongside manta rays, sea turtles, and harmless reef sharks in protected coral reefs.",
        "Dine beneath the ocean waves in iconic underwater glass restaurants."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Scenic Seaplane Transfer", description: "Fly over turquoise lagoons and ring-shaped coral atolls." },
        { title: "Sunset Dolphin Cruise", description: "Cruise aboard a traditional Dhoni boat as pods of spinner dolphins leap alongside." }
      ]),
      travelTipsJson: JSON.stringify([
        "Free 30-day tourist visa on arrival provided to all nationalities with confirmed hotel booking.",
        "Speedboat transfers operate in North/South Malé atolls; seaplanes operate during daylight hours only."
      ]),
      isFeatured: true,
    },
    {
      name: "Japan",
      slug: "japan",
      countryId: japan.id,
      regionId: eastAsia.id,
      primarySourceId: srcJapan.id,
      shortDescription: "Ultra-modern Tokyo skylines, historic Kyoto wooden shrines, Mount Fuji, and Shinkansen bullet trains.",
      longDescription: "Japan offers an enchanting synthesis of ancient heritage and futuristic precision. Experience the neon energy of Tokyo's Shibuya Crossing, glide across the country at 320 km/h aboard the Shinkansen, walk beneath thousands of vermilion torii gates at Fushimi Inari in Kyoto, and relax in volcanic hot spring onsens.",
      heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", caption: "Kyoto Bamboo Grove & Pagoda", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80", caption: "Tokyo Skyline & Tokyo Tower", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "March to May (Cherry Blossom Spring) or October to November (Autumn Foliage)",
      recommendedDuration: "7 – 10 Days",
      travelStyle: "Cultural Heritage, Bullet Train Rail, Gourmet Gastronomy & Futuristic Metropolises",
      languages: "Japanese, English in major tourist hubs",
      currency: "Japanese Yen (JPY / ¥)",
      timeZone: "JST (UTC+9)",
      whyVisitJson: JSON.stringify([
        "Travel effortlessly between cities on the world's most punctual bullet train network.",
        "Indulge in authentic multi-course Kaiseki dining and fresh Tsukiji/Toyosu sushi.",
        "Immerse in Japanese hospitality (Omotenashi) at traditional luxury Ryokan inns with private onsens."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Mount Fuji & Lake Kawaguchiko Day Tour", description: "Gaze upon the iconic snow-capped volcanic cone reflecting in still alpine waters." },
        { title: "Kyoto Fushimi Inari Shrine Walk", description: "Hike through 10,000 sacred red torii gates winding up Mount Inari." }
      ]),
      travelTipsJson: JSON.stringify([
        "Purchase a Japan Rail (JR) Pass or IC card (Suica/Pasmo) for seamless train and metro transport.",
        "Cash is still appreciated at small noodle bars and temple souvenir shops."
      ]),
      isFeatured: true,
    },
    {
      name: "France",
      slug: "france",
      countryId: france.id,
      regionId: europe.id,
      primarySourceId: srcFrance.id,
      shortDescription: "Iconic Parisian landmarks, Eiffel Tower sunset cruises, Versailles Palace, and Côte d'Azur glamour.",
      longDescription: "France is the global capital of elegance, art, and romantic gastronomy. Gaze upon the illuminated Eiffel Tower from a glass-roof Seine River cruise, wander the priceless galleries of the Louvre Museum, marvel at the Hall of Mirrors in Versailles, and soak in Mediterranean sunshine on the French Riviera.",
      heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", caption: "Eiffel Tower Paris", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80", caption: "French Riviera Coastal View", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "April to October (Spring through early Autumn)",
      recommendedDuration: "6 – 9 Days",
      travelStyle: "Art & Architecture, Romance, Wine & Gastronomy, Luxury River Cruises",
      languages: "French, English widely understood",
      currency: "Euro (EUR / €)",
      timeZone: "CET (UTC+1)",
      whyVisitJson: JSON.stringify([
        "Climb the Eiffel Tower and savor champagne overlooking the City of Light.",
        "Explore royal history in the sprawling gardens and Hall of Mirrors at Palace of Versailles.",
        "Taste freshly baked baguettes, artisanal cheeses, and world-class pastries at Parisian bistros."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Seine River Dinner Cruise", description: "Glide past Notre-Dame and the Musée d'Orsay while savoring a 3-course French dinner." },
        { title: "Louvre Museum Masterpieces Tour", description: "View the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace." }
      ]),
      travelTipsJson: JSON.stringify([
        "Schengen visa required for Indian citizens; apply at least 4 to 8 weeks prior to departure.",
        "Book Louvre Museum and Eiffel Tower summit timed tickets online well in advance."
      ]),
      isFeatured: true,
    },
    {
      name: "Vietnam",
      slug: "vietnam",
      countryId: vietnam.id,
      regionId: southeastAsia.id,
      primarySourceId: srcVietnam.id,
      shortDescription: "Emerald limestone karsts of Ha Long Bay, lantern-lit ancient Hoi An, and vibrant street cuisine.",
      longDescription: "Vietnam captivates travelers with dramatic landscapes, deep-rooted cultural heritage, and warm hospitality. Cruise past thousands of limestone islets aboard luxury junk boats in UNESCO-protected Ha Long Bay, stroll beneath thousands of colorful silk lanterns in Hoi An, and marvel at the giant stone hands holding the Golden Bridge in Ba Na Hills.",
      heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80", caption: "Ha Long Bay Limestone Peaks", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80", caption: "Hoi An Ancient Lantern Town", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "November to April (Dry season, pleasant temperatures across north and central)",
      recommendedDuration: "6 – 9 Days",
      travelStyle: "Scenic Cruises, Lantern Festivals, French Indochine Heritage & Street Food",
      languages: "Vietnamese, English in tourist hubs",
      currency: "Vietnamese Dong (VND / ₫)",
      timeZone: "ICT (UTC+7)",
      whyVisitJson: JSON.stringify([
        "Spend an unforgettable night aboard a 5-star luxury cruise ship in Ha Long Bay.",
        "Walk the cobblestone lanes of Hoi An Ancient Town filled with illuminated silk lanterns.",
        "Walk across the viral Golden Bridge held aloft by giant stone hands in Da Nang."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Overnight Ha Long Bay Cruise", description: "Kayak through Sung Sot Surprise Cave and watch sunset over limestone karsts." },
        { title: "Ba Na Hills & Golden Bridge", description: "Ride the world's longest single-rope cable car to the French Village and Golden Bridge." }
      ]),
      travelTipsJson: JSON.stringify([
        "E-visas are available online within 3 working days for most passports.",
        "Domestic flights between Hanoi, Da Nang, and Ho Chi Minh City save substantial travel time."
      ]),
      isFeatured: true,
    },
    {
      name: "Greece",
      slug: "greece",
      countryId: greece.id,
      regionId: europe.id,
      primarySourceId: srcGreece.id,
      shortDescription: "Dramatic Aegean caldera sunsets in Santorini, whitewashed Cycladic alleyways, and the Acropolis in Athens.",
      longDescription: "Greece is a dreamscape of azure seas, sun-bleached whitewashed architecture, and legendary classical antiquity. Gaze upon the world's most famous sunset over the volcanic caldera in Oia, Santorini, sail to secluded Mediterranean beaches on private catamarans, and walk in the footsteps of ancient philosophers at the Acropolis of Athens.",
      heroImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80",
      heroImageSource: "Unsplash / Verified Photographer Curation",
      heroImageLicense: "Commercial Unsplash Editorial License",
      galleryJson: JSON.stringify([
        { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80", caption: "Oia Caldera Sunset, Santorini", source: "Unsplash", license: "Commercial" },
        { url: "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80", caption: "Acropolis of Athens", source: "Unsplash", license: "Commercial" }
      ]),
      bestTimeToVisit: "May to October (Sunny Mediterranean climate & island beach warmth)",
      recommendedDuration: "6 – 8 Days",
      travelStyle: "Caldera Sunsets, Island Hopping, Aegean Catamaran Sailing & Ancient Heritage",
      languages: "Greek, English widely spoken",
      currency: "Euro (EUR / €)",
      timeZone: "EET (UTC+2)",
      whyVisitJson: JSON.stringify([
        "Stay in cave suites carved into the volcanic cliffs of Santorini with private plunge pools.",
        "Sail aboard luxury catamarans to volcanic hot springs and Red Beach.",
        "Marvel at the 2,500-year-old Parthenon temple overlooking Athens."
      ]),
      thingsToDoJson: JSON.stringify([
        { title: "Santorini Semi-Private Catamaran Cruise", description: "Snorkel in crystal Aegean waters with BBQ lunch and Greek wine served onboard." },
        { title: "Oia Sunset Walk", description: "Perch near the Byzantine Castle ruins for the world's most photographed sunset." }
      ]),
      travelTipsJson: JSON.stringify([
        "Schengen visa required for Indian travelers; book appointments 2 months in advance.",
        "Wear non-slip footwear for smooth marble cobblestones in Santorini and Mykonos."
      ]),
      isFeatured: true,
    }
  ];

  for (const item of destinationsData) {
    await prisma.destination.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        countryId: item.countryId,
        regionId: item.regionId,
        primarySourceId: item.primarySourceId,
        shortDescription: item.shortDescription,
        longDescription: item.longDescription,
        heroImage: item.heroImage,
        heroImageSource: item.heroImageSource,
        heroImageLicense: item.heroImageLicense,
        galleryJson: item.galleryJson,
        bestTimeToVisit: item.bestTimeToVisit,
        recommendedDuration: item.recommendedDuration,
        travelStyle: item.travelStyle,
        languages: item.languages,
        currency: item.currency,
        timeZone: item.timeZone,
        whyVisitJson: item.whyVisitJson,
        thingsToDoJson: item.thingsToDoJson,
        travelTipsJson: item.travelTipsJson,
        isFeatured: item.isFeatured,
      },
      create: {
        name: item.name,
        slug: item.slug,
        countryId: item.countryId,
        regionId: item.regionId,
        primarySourceId: item.primarySourceId,
        shortDescription: item.shortDescription,
        longDescription: item.longDescription,
        heroImage: item.heroImage,
        heroImageSource: item.heroImageSource,
        heroImageLicense: item.heroImageLicense,
        galleryJson: item.galleryJson,
        bestTimeToVisit: item.bestTimeToVisit,
        recommendedDuration: item.recommendedDuration,
        travelStyle: item.travelStyle,
        languages: item.languages,
        currency: item.currency,
        timeZone: item.timeZone,
        whyVisitJson: item.whyVisitJson,
        thingsToDoJson: item.thingsToDoJson,
        travelTipsJson: item.travelTipsJson,
        isFeatured: item.isFeatured,
      },
    });
    console.log(`✓ Seeded Destination: ${item.name} (${item.slug})`);
  }

  // 6. Connect Existing Tour Packages to their PackageDestinations
  const packageUpdates = [
    { slug: "kashmir-khyber-himalayan-luxury-retreat", destSlug: "kashmir" },
    { slug: "rajasthan-royal-palace-heritage-safari", destSlug: "rajasthan" },
    { slug: "bali-luxury-private-pool-villa-ubud-retreat", destSlug: "bali" },
    { slug: "maldives-luxury-overwater-pool-villa-sanctuary", destSlug: "maldives" },
    { slug: "japan-cherry-blossom-imperial-luxury-ryokan", destSlug: "japan" },
    { slug: "paris-french-riviera-luxury-grand-tour", destSlug: "france" },
    { slug: "santorini-mykonos-caldera-cave-suite-escape", destSlug: "greece" },
  ];

  for (const upd of packageUpdates) {
    const pkgDest = await prisma.packageDestination.findUnique({ where: { slug: upd.destSlug } });
    if (pkgDest) {
      await prisma.package.updateMany({
        where: { slug: upd.slug },
        data: { packageDestinationId: pkgDest.id },
      });
      console.log(`✓ Linked package ${upd.slug} to ${upd.destSlug}`);
    }
  }

  // 7. Seed Fresh Packages for Newly Added Places: Goa, Himachal, Andaman, Nepal, Vietnam
  const defaultSource = await prisma.packageSource.findFirst();
  if (defaultSource) {
    const newPackages = [
      {
        name: "Goa Luxury Coastal Haven: Taj Fort Aguada & Mandovi Sunset Yacht",
        slug: "goa-luxury-coastal-haven-taj-fort-aguada",
        category: "Domestic Holidays",
        destSlug: "goa",
        durationDays: 4,
        durationNights: 3,
        durationText: "4 Days / 3 Nights",
        travelStyle: "Luxury Coastal Resort & Portuguese Heritage",
        startingPrice: 38500,
        departureCity: "Mumbai / Delhi / Ex-Goa",
        mealPlan: "Breakfast (CP) & Welcome Drinks",
        shortDescription: "Stay at 5-star Taj Fort Aguada overlooking the Arabian Sea with private catamaran sunset cruise and Old Goa Latin quarter walking tour.",
        longDescription: "Unwind on the sun-kissed beaches of Goa with personalized luxury. Reside in sea-view luxury rooms at Taj Fort Aguada, enjoy a private catamaran cruise on the Mandovi River with sundowner cocktails, and discover the hidden artistic heritage of Fontainhas Latin Quarter with an architectural guide.",
        highlightsJson: JSON.stringify([
          "3 Nights 5-star sea-facing luxury stay at Taj Fort Aguada Resort & Spa",
          "Private 2-hour Mandovi River sunset yacht charter with wine & canapés",
          "Guided architectural heritage tour through Fontainhas Portuguese Quarter",
          "Private airport chauffeur transfers in luxury air-conditioned SUV"
        ]),
        cancellationPolicy: "100% refund up to 14 days prior to departure. 50% refund up to 7 days.",
        terms: "Package rates per person on twin-sharing. Subject to seasonal blackouts.",
        isFeatured: true,
        heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Himachal Alpine Bliss: Manali Solang Snow Adventure & Shimla Ridge",
        slug: "himachal-alpine-bliss-manali-solang-shimla",
        category: "Domestic Holidays",
        destSlug: "himachal",
        durationDays: 6,
        durationNights: 5,
        durationText: "6 Days / 5 Nights",
        travelStyle: "Snow Excursions, Pine Valleys & Heritage Rail",
        startingPrice: 42000,
        departureCity: "Delhi / Chandigarh",
        mealPlan: "Breakfast & Dinner (MAP)",
        shortDescription: "Experience Atal Tunnel into snow peaks, Solang Valley paragliding, and colonial British heritage on Shimla Mall Road.",
        longDescription: "A magnificent mountain retreat through Himachal's most iconic landscapes. Traverse pine-scented valleys to Solang, drive through the engineering marvel of Atal Tunnel to Lahaul, walk the deodar forests of Hadimba, and savor leisurely evenings along Shimla's historic Ridge.",
        highlightsJson: JSON.stringify([
          "3 Nights in 4-star boutique pine chalet in Manali + 2 Nights in Shimla",
          "Full-day excursion to Solang Valley and Atal Tunnel with snow activities",
          "Private sightseeing covering Hadimba Temple, Vashisht Springs & Mall Road",
          "Dedicated chauffeur-driven Toyota Innova throughout the journey from Delhi"
        ]),
        cancellationPolicy: "Full refund up to 10 days before departure.",
        terms: "Standard commercial allotment. Seasonal snow activity equipment charges direct.",
        isFeatured: true,
        heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Andaman Tropical Splendor: Havelock Radhanagar & Scuba Diving",
        slug: "andaman-tropical-splendor-havelock-scuba-paradise",
        category: "Domestic Holidays",
        destSlug: "andaman",
        durationDays: 5,
        durationNights: 4,
        durationText: "5 Days / 4 Nights",
        travelStyle: "Coral Diving, Luxury Beachfront Villas & Island Catamarans",
        startingPrice: 49500,
        departureCity: "Kolkata / Chennai / Ex-Port Blair",
        mealPlan: "Breakfast (CP) & Beachside Dinners",
        shortDescription: "Discover Asia's finest white sand at Radhanagar Beach, luxury beach resort cottages, and guided coral scuba diving.",
        longDescription: "Escape to the turquoise waters of the Andaman Sea. Sail on high-speed Makruzz luxury catamarans to Havelock Island, stay in private beachfront luxury cottages nestled in coconut palms, experience PADI-certified coral reef scuba diving at Elephant Beach, and witness the poignant Cellular Jail light show.",
        highlightsJson: JSON.stringify([
          "2 Nights Havelock luxury beach villa + 2 Nights Port Blair sea-view hotel",
          "Guided beginner scuba diving experience with underwater photography included",
          "Sunset experience at world-famous Radhanagar Beach (Beach No. 7)",
          "All inter-island premium catamaran ferry tickets (Makruzz / Green Ocean) confirmed"
        ]),
        cancellationPolicy: "Cancellations 15 days prior receive full refund less administrative charges.",
        terms: "Subject to sea weather and ferry schedules.",
        isFeatured: true,
        heroImage: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Nepal Himalayan Horizons: Pokhara Lakeside Resort & Kathmandu Temples",
        slug: "nepal-himalayan-horizons-pokhara-kathmandu-wonder",
        category: "International Holidays",
        destSlug: "nepal",
        durationDays: 5,
        durationNights: 4,
        durationText: "5 Days / 4 Nights",
        travelStyle: "Himalayan Sunrise, Lakeside Serenity & Sacred Temples",
        startingPrice: 34999,
        departureCity: "Kathmandu / Delhi / Ex-Destination",
        mealPlan: "Breakfast (CP)",
        shortDescription: "Breathtaking Sarangkot Annapurna sunrise, private Phewa Lake wooden boat cruise, and sacred Kathmandu Durbar Square.",
        longDescription: "Immerse in the peace and grandeur of Nepal. Gaze at the towering snow-covered massifs of Annapurna and Machapuchare reflecting in Pokhara's tranquil Phewa Lake, watch the dawn break over Himalayan peaks from Sarangkot, and explore the ancient sacred shrines of Pashupatinath and Boudhanath Stupa.",
        highlightsJson: JSON.stringify([
          "2 Nights luxury lakeside resort in Pokhara + 2 Nights in Kathmandu",
          "Private wooden boat ride to Tal Barahi Temple on Phewa Lake",
          "Early morning Sarangkot Annapurna sunrise excursion",
          "Sightseeing of Pashupatinath Temple, Boudhanath Stupa & Patan Durbar Square"
        ]),
        cancellationPolicy: "Full refund up to 14 days before journey.",
        terms: "Indian citizens only require valid Passport or Election Voter ID card (No Visa required).",
        isFeatured: true,
        heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Vietnam Indochine Splendor: 5★ Ha Long Bay Luxury Cruise & Hoi An Lanterns",
        slug: "vietnam-indochine-luxury-ha-long-bay-hoi-an-danang",
        category: "International Holidays",
        destSlug: "vietnam",
        durationDays: 7,
        durationNights: 6,
        durationText: "7 Days / 6 Nights",
        travelStyle: "Luxury Junk Cruise, Golden Bridge & Ancient Lantern Towns",
        startingPrice: 68500,
        departureCity: "Delhi / Mumbai / Ex-Hanoi",
        mealPlan: "Breakfast & All Meals on Ha Long Bay Cruise",
        shortDescription: "Overnight 5★ luxury cruise amongst Ha Long Bay karsts, Ba Na Hills Golden Hands Bridge, and magical lantern-lit Hoi An.",
        longDescription: "An enchanting journey across Vietnam's most iconic wonders. Cruise aboard a 5-star balcony junk ship through the emerald waters of Ha Long Bay with fresh seafood dining, explore Hanoi's French Colonial quarter, ride the cloud cable car to Da Nang's Golden Bridge, and stroll through the magical riverside lanterns of Hoi An.",
        highlightsJson: JSON.stringify([
          "1 Night 5★ Balcony Suite aboard Ha Long Bay luxury overnight cruise ship",
          "2 Nights in Hanoi French Quarter + 3 Nights in beachside Da Nang / Hoi An resort",
          "Excursion to Ba Na Hills with Golden Bridge cable car access",
          "Lantern-lit wooden sampan boat ride on Hoai River in ancient Hoi An"
        ]),
        cancellationPolicy: "100% refund up to 21 days prior to departure.",
        terms: "E-visa assistance included. All domestic flights included.",
        isFeatured: true,
        heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
      },
    ];

    for (const p of newPackages) {
      const pkgDest = await prisma.packageDestination.findUnique({ where: { slug: p.destSlug } });
      if (!pkgDest) continue;

      const existingPkg = await prisma.package.findUnique({ where: { slug: p.slug } });
      if (existingPkg) {
        console.log(`Package ${p.name} already exists. Skipping.`);
        continue;
      }

      const created = await prisma.package.create({
        data: {
          name: p.name,
          slug: p.slug,
          packageDestinationId: pkgDest.id,
          category: p.category,
          durationDays: p.durationDays,
          durationNights: p.durationNights,
          durationText: p.durationText,
          travelStyle: p.travelStyle,
          startingPrice: p.startingPrice,
          departureCity: p.departureCity,
          mealPlan: p.mealPlan,
          shortDescription: p.shortDescription,
          longDescription: p.longDescription,
          highlightsJson: p.highlightsJson,
          cancellationPolicy: p.cancellationPolicy,
          terms: p.terms,
          sourceId: defaultSource.id,
          isFeatured: p.isFeatured,
          images: {
            create: [
              {
                url: p.heroImage,
                caption: `${p.name} Hero View`,
                isHero: true,
                source: "Unsplash Verified License",
                license: "Commercial Editorial",
              },
            ],
          },
          inclusions: {
            create: [
              { title: "Handpicked 4-star and 5-star verified hotel allotments", category: "Accommodation" },
              { title: "Daily gourmet buffet breakfast and select chef dinners", category: "Meals" },
              { title: "All airport and inter-city chauffeur transfers in AC vehicle", category: "Transfers" },
              { title: "24/7 dedicated Sah Tour and Travel concierge care", category: "Sightseeing" },
            ],
          },
          exclusions: {
            create: [
              { title: "International airfares (unless flight-inclusive selected)" },
              { title: "Personal laundry, beverages, and optional spa services" },
              { title: "Travel insurance (can be added during checkout)" },
            ],
          },
        },
      });
      console.log(`✓ Seeded New Package: ${created.name}`);
    }
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

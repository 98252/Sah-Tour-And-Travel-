import { PrismaClient } from "@prisma/client";
import {
  CONTENT_CATEGORIES,
  getPublishedArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "../lib/content";

const prisma = new PrismaClient();

async function runPhase13Tests() {
  console.log("==================================================");
  console.log("PHASE 13 AUTOMATED VERIFICATION: TRAVEL CONTENT SYSTEM");
  console.log("==================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      throw new Error(message);
    }
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  }

  try {
    // TEST 1: All 9 Required Categories Defined
    console.log("\n--- Test 1: Category Coverage ---");
    const requiredCategories = [
      "Destination Guides",
      "Travel Tips",
      "Visa Guides",
      "Packing Guides",
      "Honeymoon Guides",
      "Family Travel",
      "Budget Travel",
      "Luxury Travel",
      "Adventure Travel",
    ];

    const existingCategoryNames = CONTENT_CATEGORIES.map((c) => c.name);
    for (const reqCat of requiredCategories) {
      assert(
        existingCategoryNames.includes(reqCat as any),
        `Required category "${reqCat}" is defined in system`
      );
    }

    // TEST 2: Database Articles Verification across all categories
    console.log("\n--- Test 2: Database Articles Across All 9 Categories ---");
    const { articles, total } = await getPublishedArticles({ limit: 100 });
    assert(total >= 9, `Total articles published (${total}) is at least 9`);

    for (const reqCat of requiredCategories) {
      const found = articles.find((a) => a.category === reqCat);
      assert(Boolean(found), `Found published article for category "${reqCat}"`);
    }

    // TEST 3: Article Structure & Mandatory Fields
    console.log("\n--- Test 3: Article Fields Contract ---");
    for (const article of articles) {
      assert(Boolean(article.title), `Article "${article.slug}" has title`);
      assert(Boolean(article.slug), `Article "${article.title}" has slug`);
      assert(Boolean(article.author), `Article "${article.title}" has author (${article.author})`);
      assert(Boolean(article.coverImage), `Article "${article.title}" has cover image`);
      assert(Boolean(article.body), `Article "${article.title}" has content body`);
      assert(Boolean(article.publishedAt), `Article "${article.title}" has published date`);
      assert(Boolean(article.updatedAt), `Article "${article.title}" has updated date`);
      assert(Array.isArray(article.sources), `Article "${article.title}" has sources array`);
      assert(article.sources.length > 0, `Article "${article.title}" has at least 1 verified source`);
      assert(Array.isArray(article.relatedDestinations), `Article "${article.title}" has related destinations`);
      assert(Array.isArray(article.relatedPackages), `Article "${article.title}" has related packages`);
    }

    // TEST 4: Authoritative Visa Sourcing Mandate
    console.log("\n--- Test 4: Visa Information Authoritative Sourcing ---");
    const visaArticle = articles.find((a) => a.category === "Visa Guides");
    assert(Boolean(visaArticle), "Visa guide article is present");
    if (visaArticle) {
      const hasGovOrConsularSource = visaArticle.sources.some(
        (s) =>
          s.type === "Official Government Portal" ||
          s.type === "Consular & Visa Authority" ||
          s.url.includes("europa.eu") ||
          s.url.includes("vfsglobal.com") ||
          s.url.includes("admin.ch")
      );
      assert(
        hasGovOrConsularSource,
        "Visa Guide strictly cites official government / consular / VFS authority portal"
      );
      assert(
        visaArticle.sources.every((s) => s.isVerified === true),
        "All cited visa sources are verified"
      );
    }

    // TEST 5: Single Article Retrieval by Slug
    console.log("\n--- Test 5: Single Article Fetch ---");
    const single = await getArticleBySlug("comprehensive-guide-to-switzerland-alpine-rails-and-lakes");
    assert(Boolean(single), "Retrieved article by slug successfully");
    assert(
      single?.category === "Destination Guides",
      "Article category matches 'Destination Guides'"
    );
    assert(single?.sources.length! >= 2, "Switzerland guide cites multiple authoritative sources");

    // TEST 6: Category Filtering & Search Queries
    console.log("\n--- Test 6: Content Filtering & Search ---");
    const filteredVisa = await getPublishedArticles({ category: "Visa Guides" });
    assert(
      filteredVisa.articles.every((a) => a.category === "Visa Guides"),
      "Filtered query returns strictly Visa Guides"
    );

    const searchResults = await getPublishedArticles({ search: "Schengen" });
    assert(searchResults.articles.length > 0, "Search for 'Schengen' returns matching guides");

    // TEST 7: Related Articles Recommendation Engine
    console.log("\n--- Test 7: Related Articles Engine ---");
    const related = await getRelatedArticles(
      "comprehensive-guide-to-switzerland-alpine-rails-and-lakes",
      "Destination Guides",
      3
    );
    assert(Array.isArray(related), "Related articles returned as array");
    assert(
      !related.some((r) => r.slug === "comprehensive-guide-to-switzerland-alpine-rails-and-lakes"),
      "Related articles exclude the active article itself"
    );

    console.log("\n==================================================");
    console.log(`ALL ${passedTests}/${totalTests} PHASE 13 CONTENT TESTS PASSED!`);
    console.log("==================================================");
  } catch (error) {
    console.error("Phase 13 Verification Failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase13Tests();

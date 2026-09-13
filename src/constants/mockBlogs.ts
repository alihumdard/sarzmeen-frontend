import type { BlogCategory, BlogPost, BlogTag } from "@/types/blog";

/**
 * Placeholder media — every post points at the same two files for now.
 * Drop your own images at these paths and all cards pick them up; once the
 * API is wired in each post brings its own URLs and these constants go away.
 */
const BLOG_IMAGE = "/images/blog-1.jpg";
const AUTHOR_AVATAR = "/images/agent-1.jpg";

/** Mock blog posts — replaced by the Laravel API in Phase 4. */
export const latestPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "real-estate-market-trends-in-pakistan-2024",
    title: "Real Estate Market Trends in Pakistan 2024: What to Expect?",
    category: "Market Updates",
    categorySlug: "market-updates",
    excerpt:
      "An in-depth look at the current real estate market trends and future predictions for major cities.",
    publishedAt: "2024-05-15",
    readTime: 5,
    image: BLOG_IMAGE,
    author: {
      id: "au1",
      name: "Ali Hassan",
      title: "Real Estate Expert",
      avatar: AUTHOR_AVATAR,
    },
  },
  {
    id: "b2",
    slug: "complete-guide-to-buying-property-in-pakistan",
    title: "A Complete Guide to Buying Property in Pakistan",
    category: "Buying Guide",
    categorySlug: "buying-guide",
    excerpt:
      "Step-by-step guide for first-time buyers to make a safe and smart property investment.",
    publishedAt: "2024-05-12",
    readTime: 6,
    image: BLOG_IMAGE,
    author: {
      id: "au2",
      name: "Fatima Noor",
      title: "Property Consultant",
      avatar: AUTHOR_AVATAR,
    },
  },
  {
    id: "b3",
    slug: "best-areas-to-invest-in-lahore-right-now",
    title: "Best Areas to Invest in Lahore Right Now",
    category: "Investment Tips",
    categorySlug: "investment-tips",
    excerpt:
      "Explore top investment hotspots in Lahore with high ROI and future growth potential.",
    publishedAt: "2024-05-10",
    readTime: 4,
    image: BLOG_IMAGE,
    author: {
      id: "au3",
      name: "Ahmed Raza",
      title: "Investment Advisor",
      avatar: AUTHOR_AVATAR,
    },
  },
  {
    id: "b4",
    slug: "new-metro-city-lahore-a-game-changer-for-real-estate",
    title: "New Metro City Lahore – A Game Changer for Real Estate",
    category: "Property News",
    categorySlug: "property-news",
    excerpt:
      "How New Metro City Lahore is transforming the real estate landscape with world-class living.",
    publishedAt: "2024-05-08",
    readTime: 4,
    image: BLOG_IMAGE,
    author: {
      id: "au4",
      name: "Sara Khan",
      title: "Content Writer",
      avatar: AUTHOR_AVATAR,
    },
  },
  {
    id: "b5",
    slug: "home-loan-in-pakistan-everything-you-need-to-know",
    title: "Home Loan in Pakistan: Everything You Need to Know",
    category: "Home Loan",
    categorySlug: "home-loan",
    excerpt:
      "Complete guide to home loans, interest rates, eligibility and application process in Pakistan.",
    publishedAt: "2024-05-05",
    readTime: 6,
    image: BLOG_IMAGE,
    author: {
      id: "au5",
      name: "Usman Tariq",
      title: "Finance Expert",
      avatar: AUTHOR_AVATAR,
    },
  },
  {
    id: "b6",
    slug: "5-home-interior-trends-that-add-value-to-your-property",
    title: "5 Home Interior Trends That Add Value to Your Property",
    category: "Lifestyle",
    categorySlug: "lifestyle",
    excerpt:
      "Simple and modern interior trends that can increase the value of your home.",
    publishedAt: "2024-05-03",
    readTime: 5,
    image: BLOG_IMAGE,
    author: {
      id: "au6",
      name: "Maryam Iqbal",
      title: "Interior Specialist",
      avatar: AUTHOR_AVATAR,
    },
  },
  {
    id: "b7",
    slug: "how-to-verify-property-documents-in-pakistan",
    title: "How to Verify Property Documents in Pakistan",
    category: "Buying Guide",
    categorySlug: "buying-guide",
    excerpt:
      "Avoid fraud with this checklist for verifying ownership, transfer and society records.",
    publishedAt: "2024-05-01",
    readTime: 8,
    image: BLOG_IMAGE,
    author: {
      id: "au7",
      name: "Bilal Ahmed",
      title: "Legal Advisor",
      avatar: AUTHOR_AVATAR,
    },
  },
  {
    id: "b8",
    slug: "rental-yield-guide-for-pakistani-cities",
    title: "Rental Yield Guide for Pakistani Cities",
    category: "Investment Tips",
    categorySlug: "investment-tips",
    excerpt:
      "Compare rental returns across Karachi, Lahore and Islamabad before you buy to let.",
    publishedAt: "2024-04-28",
    readTime: 5,
    image: BLOG_IMAGE,
    author: {
      id: "au8",
      name: "Hina Malik",
      title: "Market Analyst",
      avatar: AUTHOR_AVATAR,
    },
  },
  {
    id: "b9",
    slug: "top-upcoming-housing-societies-in-islamabad",
    title: "Top Upcoming Housing Societies in Islamabad",
    category: "Property News",
    categorySlug: "property-news",
    excerpt:
      "A look at the approved societies drawing the most buyer interest this year.",
    publishedAt: "2024-04-25",
    readTime: 6,
    image: BLOG_IMAGE,
    author: {
      id: "au9",
      name: "Zain Abbas",
      title: "Real Estate Expert",
      avatar: AUTHOR_AVATAR,
    },
  },
];

/** Sidebar categories. Counts are mock values until the API provides them. */
export const blogCategories: BlogCategory[] = [
  { id: "c1", slug: "market-updates", name: "Market Updates", count: 12 },
  { id: "c2", slug: "investment-tips", name: "Investment Tips", count: 18 },
  { id: "c3", slug: "buying-guide", name: "Buying Guide", count: 15 },
  { id: "c4", slug: "home-loan", name: "Home Loan", count: 9 },
  { id: "c5", slug: "lifestyle", name: "Lifestyle", count: 10 },
  { id: "c6", slug: "property-news", name: "Property News", count: 14 },
];

/** Sidebar tag cloud. */
export const blogTags: BlogTag[] = [
  { id: "t1", slug: "investment", name: "Investment" },
  { id: "t2", slug: "property-tips", name: "Property Tips" },
  { id: "t3", slug: "lahore", name: "Lahore" },
  { id: "t4", slug: "karachi", name: "Karachi" },
  { id: "t5", slug: "plots", name: "Plots" },
  { id: "t6", slug: "home-loan", name: "Home Loan" },
  { id: "t7", slug: "market-trends", name: "Market Trends" },
  { id: "t8", slug: "real-estate", name: "Real Estate" },
];

/** Total published posts — drives the "Showing 1-9 of 68 Blogs" line. */
export const totalBlogCount = 68;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRightIcon,
  HomeStatIcon,
} from "@/components/ui/Icons";
import {
  blogCategories,
  latestPosts,
} from "@/constants/mockBlogs";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const articleContent = {
  intro:
    "Pakistan's real estate market continues to evolve as buyers, investors and developers adapt to changing economic conditions and new opportunities. Understanding current market trends can help you make more informed property decisions.",

  sections: [
    {
      heading: "Understanding the Current Market",
      paragraphs: [
        "The real estate sector remains one of the most important parts of Pakistan's economy. Major cities such as Lahore, Karachi and Islamabad continue to attract both local and overseas investors.",
        "While market conditions can vary from one area to another, well-planned developments, established communities and locations with strong infrastructure continue to receive significant interest from buyers.",
      ],
    },
    {
      heading: "What Buyers Should Look For",
      paragraphs: [
        "Location remains one of the most important factors when evaluating a property. Buyers should consider accessibility, nearby facilities, development quality and the long-term potential of the surrounding area.",
        "It is also important to verify property documentation, understand the payment structure and compare similar properties before making a final decision.",
      ],
    },
    {
      heading: "Investment Opportunities",
      paragraphs: [
        "For investors, the best opportunities often come from understanding the difference between short-term market movements and long-term development potential.",
        "Areas with improving infrastructure, new commercial activity and growing demand can offer interesting opportunities, although every investment should be evaluated carefully.",
      ],
    },
    {
      heading: "The Future of Real Estate in Pakistan",
      paragraphs: [
        "Technology is changing the way people search for, compare and purchase properties. Digital platforms are making property information more accessible and helping buyers discover opportunities from anywhere.",
        "As the market continues to develop, transparency, verified information and better digital experiences will become increasingly important for buyers, sellers and investors.",
      ],
    },
  ],
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = latestPosts.find((item) => item.slug === slug);

  return {
    title: post ? post.title : "Blog Detail",
    description:
      post?.excerpt ?? "Real estate insights from Sarzameen.com.",
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;

  const post = latestPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <main className="bg-surface py-20">
        <div className="container-page text-center">
          <h1 className="text-2xl font-bold text-heading">
            Blog Not Found
          </h1>

          <p className="mt-3 text-sm text-muted">
            The blog post you're looking for does not exist.
          </p>

          <Link
            href="/blog"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  const recentPosts = latestPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 4);

  const formattedDate = new Date(
    post.publishedAt
  ).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="bg-surface">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white">
        <div className="container-page py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[12px] text-muted">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  <HomeStatIcon className="h-3.5 w-3.5" />
                  Home
                </Link>
              </li>

              <ChevronRightIcon className="h-3 w-3 text-gray-400" />

              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-primary"
                >
                  Blogs
                </Link>
              </li>

              <ChevronRightIcon className="h-3 w-3 text-gray-400" />

              <li className="max-w-[250px] truncate font-medium text-heading sm:max-w-none">
                {post.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Detail */}
      <section className="py-8 sm:py-10 lg:py-14">
        <div className="container-page">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-12">
            {/* Main Article */}
            <article className="min-w-0">
              {/* Category */}
              <Link
                href={`/blog/category/${post.categorySlug}`}
                className="inline-flex rounded-full bg-primary-light px-3 py-1.5 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {post.category}
              </Link>

              {/* Title */}
              <h1 className="mt-4 max-w-[900px] text-[30px] font-bold leading-[1.15] text-heading sm:text-[38px] lg:text-[46px]">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12px] text-muted">
                <span>{formattedDate}</span>

                <span className="h-1 w-1 rounded-full bg-gray-300" />

                <span>{post.readTime} min read</span>

                <span className="h-1 w-1 rounded-full bg-gray-300" />

                <div className="flex items-center gap-2">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />

                  <span>
                    By{" "}
                    <span className="font-semibold text-heading">
                      {post.author.name}
                    </span>
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative mt-8 aspect-[16/8.5] overflow-hidden rounded-2xl bg-white">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="mt-8 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8 lg:p-10">
                <p className="text-[16px] font-medium leading-8 text-heading">
                  {articleContent.intro}
                </p>

                <div className="mt-8 space-y-9">
                  {articleContent.sections.map((section) => (
                    <section key={section.heading}>
                      <h2 className="text-[21px] font-bold text-heading sm:text-[24px]">
                        {section.heading}
                      </h2>

                      <div className="mt-4 space-y-4">
                        {section.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-[14px] leading-7 text-muted"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-10 border-t border-border pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-[12px] font-bold text-heading">
                      Tags:
                    </span>

                    {[
                      "Real Estate",
                      "Property Tips",
                      "Pakistan",
                      post.category,
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface px-3 py-1.5 text-[11px] font-medium text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="mt-6 flex gap-4 rounded-2xl border border-border bg-white p-5 sm:p-6">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                    Written By
                  </p>

                  <h3 className="mt-1 text-[16px] font-bold text-heading">
                    {post.author.name}
                  </h3>

                  <p className="mt-1 text-[12px] text-muted">
                    {post.author.title}
                  </p>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              {/* Social Share */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <h2 className="text-[15px] font-bold text-heading">
                  Share This Article
                </h2>

                <p className="mt-1.5 text-[12px] leading-5 text-muted">
                  Share this article with your network.
                </p>

                <div className="mt-4 flex gap-2">
                  <a
                    href="#"
                    aria-label="Share on Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-[14px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    f
                  </a>

                  <a
                    href="#"
                    aria-label="Share on X"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-[13px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    X
                  </a>

                  <a
                    href="#"
                    aria-label="Share on LinkedIn"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    in
                  </a>
                </div>
              </div>

              {/* Categories */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <h2 className="text-[15px] font-bold text-heading">
                  Categories
                </h2>

                <div className="mt-4 space-y-1">
                  {blogCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog/category/${category.slug}`}
                      className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-[12px] text-muted transition-colors hover:bg-primary-light hover:text-primary"
                    >
                      <span>{category.name}</span>

                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium group-hover:bg-white">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Blogs */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <h2 className="text-[15px] font-bold text-heading">
                  Recent Blogs
                </h2>

                <div className="mt-4 space-y-4">
                  {recentPosts.map((recentPost) => (
                    <Link
                      key={recentPost.id}
                      href={`/blog/${recentPost.slug}`}
                      className="group flex gap-3"
                    >
                      <div className="relative h-[68px] w-[82px] shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Image
                          src={recentPost.image}
                          alt={recentPost.title}
                          fill
                          sizes="82px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 text-[12px] font-semibold leading-5 text-heading transition-colors group-hover:text-primary">
                          {recentPost.title}
                        </p>

                        <p className="mt-1 text-[10px] text-muted">
                          {recentPost.readTime} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/blog"
                  className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-4 text-[12px] font-semibold text-primary"
                >
                  View All Blogs
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
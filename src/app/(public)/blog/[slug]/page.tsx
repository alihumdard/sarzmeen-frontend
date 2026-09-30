import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRightIcon,
  HomeStatIcon,
} from "@/components/ui/Icons";
import { serverApi } from "@/lib/api/server";
import type { BlogPost, BlogCategory, BlogTag } from "@/types/blog";

type BlogDetail = BlogPost & {
  content: string;
  tags: BlogTag[];
};

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getBlog(slug: string): Promise<BlogDetail> {
  try {
    const res = await serverApi<{ data: BlogDetail }>(`/blogs/${slug}`);
    return res.data;
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlog(slug);

  let recentPosts: BlogPost[] = [];
  let blogCategories: BlogCategory[] = [];

  try {
    const [postsRes, catsRes] = await Promise.all([
      serverApi<{ data: BlogPost[] }>("/blogs?per_page=5"),
      serverApi<{ data: BlogCategory[] }>("/blog-categories"),
    ]);
    recentPosts = postsRes.data.filter((p) => p.slug !== slug).slice(0, 4);
    blogCategories = catsRes.data;
  } catch {
    // non-critical
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-PK", {
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
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  )}

                  <span>
                    By{" "}
                    <span className="font-semibold text-heading">
                      {post.author.name}
                    </span>
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              {post.image && (
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
              )}

              {/* Article Content */}
              <div className="mt-8 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8 lg:p-10">
                <div
                  className="prose prose-sm max-w-none prose-headings:text-heading prose-p:text-muted prose-p:leading-7"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-10 border-t border-border pt-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-[12px] font-bold text-heading">
                        Tags:
                      </span>

                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-surface px-3 py-1.5 text-[11px] font-medium text-muted"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Author */}
              <div className="mt-6 flex gap-4 rounded-2xl border border-border bg-white p-5 sm:p-6">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                  />
                )}

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
              {blogCategories.length > 0 && (
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
              )}

              {/* Recent Blogs */}
              {recentPosts.length > 0 && (
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
                        {recentPost.image && (
                          <div className="relative h-[68px] w-[82px] shrink-0 overflow-hidden rounded-lg bg-surface">
                            <Image
                              src={recentPost.image}
                              alt={recentPost.title}
                              fill
                              sizes="82px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}

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
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

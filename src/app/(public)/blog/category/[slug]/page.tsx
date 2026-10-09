import { redirect } from "next/navigation";
import { blogUrl } from "@/lib/blogFilters";

type Props = { params: Promise<{ slug: string }> };

/** Legacy category path — the listing handles categories as a filter now. */
export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(blogUrl({ category: slug }));
}

"use client";

import BlogTaxonomyManager from "@/components/admin/BlogTaxonomyManager";
import {
  createBlogTag,
  deleteBlogTag,
  listBlogTags,
  updateBlogTag,
} from "@/lib/api/blogTaxonomy";

export default function BlogTagsPage() {
  return (
    <BlogTaxonomyManager
      noun="Tag"
      heading="Blog Tags"
      description="Tags applied to posts. A post can carry several."
      deleteNote="Deleting a tag removes it from any post carrying it. The posts themselves are not affected."
      load={listBlogTags}
      create={createBlogTag}
      update={updateBlogTag}
      remove={deleteBlogTag}
    />
  );
}

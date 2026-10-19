"use client";

import BlogTaxonomyManager from "@/components/admin/BlogTaxonomyManager";
import {
  createBlogCategory,
  deleteBlogCategory,
  listBlogCategories,
  updateBlogCategory,
} from "@/lib/api/blogTaxonomy";

export default function BlogCategoriesPage() {
  return (
    <BlogTaxonomyManager
      noun="Category"
      heading="Blog Categories"
      description="Categories posts are filed under. These drive the /blog category filters."
      deleteNote="A category can only be removed once no post uses it."
      load={listBlogCategories}
      create={createBlogCategory}
      update={updateBlogCategory}
      remove={deleteBlogCategory}
    />
  );
}

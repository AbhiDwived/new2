"use client";

import { useParams } from "next/navigation";
import { useGetAllBlogsQuery } from "@/features/blogs/adminblogsAPI";
import Loader from "@/components/shared/Loader";
import { env } from "@/constants";

const IDEA_BLOG_HEADER_PATH = "/newPics/IdeaBlogHeader.avif";

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: adminBlogsData, isLoading, isError } = useGetAllBlogsQuery();

  if (isLoading) return <Loader fullScreen />;
  if (isError) return <p>Error loading blog</p>;

  const blog = adminBlogsData?.blogs.find((b) => {
    const generatedSlug =
      b.slug ||
      b.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-");
    return generatedSlug === slug;
  });

  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  const baseUrl = env.NEXT_PUBLIC_API_BACKEND?.replace("/api/v1", "") || "";
  const imageUrl = blog.featuredImage?.startsWith("http")
    ? blog.featuredImage
    : `${baseUrl}${blog.featuredImage}`;

  // Fix <img> tags in blog content so they always use full URLs
  function fixImageUrls(htmlContent) {
    if (!htmlContent) return "";

    return htmlContent.replace(
      /<img\s+[^>]*src=['"]([^'"]+)['"][^>]*>/gi,
      (match, src) => {
        if (src.startsWith("http") || src.startsWith("data:")) {
          return match; // already valid
        }

        // Ensure no double slashes
        const fixedSrc = `${baseUrl}${src.startsWith("/") ? src : `/${src}`}`;

        return match.replace(src, fixedSrc);
      }
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-6">
        {new Date(blog.createdAt).toLocaleDateString()} • By{" "}
        {blog.createdBy?.name || "Admin"}
      </p>

      {/* Main featured image */}
      <img
        src={imageUrl || IDEA_BLOG_HEADER_PATH}
        alt={blog.title}
        className="w-full h-[400px] object-cover rounded-lg mb-6"
      />

      {/* Blog content with fixed image URLs */}
      <div
        className="prose max-w-none prose-img:rounded-lg prose-img:my-6"
        dangerouslySetInnerHTML={{ __html: fixImageUrls(blog.content || "") }}
      />
    </div>
  );
}

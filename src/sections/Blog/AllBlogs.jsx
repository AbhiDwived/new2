"use client";
import React from "react";
import { useGetAllBlogsQuery } from "@/features/blogs/blogsAPI";
import Loader from "@/components/shared/Loader";
import { env } from "@/constants";
import Link from "next/link";

export default function AllBlogs() {
  const { data, isLoading, isError, error } = useGetAllBlogsQuery();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 font-medium">
            Error: {error?.data?.message || "Failed to load blogs"}
          </p>
        </div>
      </div>
    );
  }

  const blogs = data?.blogs || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">All Blogs</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => {
            const slug = blog.title
              .toLowerCase()
              .replace(/[^a-z0-9 -]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim("-");

            let imageUrl;
            if (blog.featuredImage) {
              if (blog.featuredImage.startsWith("http")) {
                imageUrl = blog.featuredImage;
              } else {
                const baseUrl = (process.env.NEXT_PUBLIC_API_BACKEND || 'https://api.mybestvenue.com/api/v1').replace("/api/v1", "");
                imageUrl = `${baseUrl}${blog.featuredImage}`;
              }
            } else {
              imageUrl = "https://via.placeholder.com/1200x600?text=No+Image";
            }

            return (
              <article
                key={blog._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link href={`/blog/${slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {blog.category || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt || blog.content?.slice(0, 150) + "..."}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Read More
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

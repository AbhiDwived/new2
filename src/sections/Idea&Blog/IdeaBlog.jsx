"use client"

import React, { useState, useMemo } from 'react';
import { Calendar } from "lucide-react";
import { useGetAllBlogsQuery } from '@/features/blogs/adminblogsAPI';
// Default image path for blog posts without featured images
const IDEA_BLOG_HEADER_PATH = '/newPics/IdeaBlogHeader.avif';
import { useRouter } from 'next/navigation';
import Loader from "@/components/shared/Loader";
import { env } from '@/constants';


export default function IdeaBlog() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const { data: adminBlogsData, isLoading, isError, error } = useGetAllBlogsQuery();
  const blogs = adminBlogsData?.blogs || [];

  const formattedBlogs = useMemo(() => {
    return blogs.map((blog) => {
      let imageUrl;

      if (blog.featuredImage) {
        if (blog.featuredImage.startsWith('http')) {
          imageUrl = blog.featuredImage;
        } else {
          const baseUrl = env.NEXT_PUBLIC_API_BACKEND.replace('/api/v1', '');
          imageUrl = `${baseUrl}${blog.featuredImage}`;
        }
      } else {
        imageUrl = IDEA_BLOG_HEADER_PATH;
      }

      const slug = blog.slug || blog.title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
        
      return {
        id: blog._id,
        slug: slug,
        title: blog.title,
        description: blog.excerpt || (blog.content ? blog.content.slice(0, 150) + '...' : ''),
        category: blog.category || 'General',
        date: new Date(blog.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        image: imageUrl,
        author: blog.createdBy?.name || 'Admin',
        featured: false,
      };
    });
  }, [blogs]);

  const handleReadBlog = (blogSlug) => {
    router.push(`/blog/${blogSlug}`);
  };

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(formattedBlogs.map(blog => blog.category))];
    return ["All", ...uniqueCategories];
  }, [formattedBlogs]);

  const featuredArticle = formattedBlogs.length > 0 ?
    { ...formattedBlogs[0], featured: true } :
    {
      title: "Welcome to Our Blog",
      description: "Discover amazing ideas and tips for your events.",
      category: "General",
      date: "Today",
      author: "Admin",
      image: IDEA_BLOG_HEADER_PATH,
      featured: true
    };

  const filteredArticles = formattedBlogs
    .filter(article => {
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = page * ITEMS_PER_PAGE < filteredArticles.length;

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading blogs</p>
          <p className="text-gray-600">{error?.data?.message || error?.error || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[#E8EDF3] py-10 text-black">
        <div className="mx-auto text-center px-4 sm:px-6 lg:px-12 max-w-4xl">
          <p className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-black">
            Blogs
          </p>
          <p className="mb-8 text-gray-800 text-base sm:text-lg">
            Get inspired with our collection of articles, tips, and ideas
          </p>
          <div className="bg-white text-sm rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
            <input
              type="text"
              placeholder="Search by title or description..."
              className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              style={{ borderRadius: '5px' }}
              className="bg-[#10497a] hover:bg-[#062b4b] text-white px-5 py-2"
              onClick={() => {
                setSearchQuery(searchInput);
                setPage(1);
              }}
            >
              Search
            </button>
            
          </div>
        </div>
      </div>

      {/* Featured Article */}
      {formattedBlogs.length > 0 && (
        <div className="py-12 bg-white px-4 sm:px-6 lg:px-12">
          <div
            className="grid md:grid-cols-2 gap-8 items-center mb-12 cursor-pointer group"
            onClick={() => handleReadBlog(featuredArticle.slug)}
          >
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="w-full h-[320px] sm:h-[400px] lg:h-[420px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = IDEA_BLOG_HEADER_PATH;
              }}
            />
            <div>
              <span className="inline-block bg-blue-900 text-white px-3 py-1 rounded-full text-sm mb-2">
                {featuredArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 font-playfair group-hover:text-blue-900 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-gray-600 mb-4 text-base sm:text-lg">{featuredArticle.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4 gap-2 flex-wrap">
                <Calendar size={16} />
                <span>{featuredArticle.date}</span>
                <span>• By {featuredArticle.author}</span>
              </div>
              <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                Read Article
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                style={{ borderRadius: '25px', height: '50px' }}
                className={`border px-4 py-1 text-sm sm:text-base transition ${selectedCategory === cat
                    ? "bg-[#062945] text-white"
                    : "text-gray-800 hover:text-white hover:bg-[#062945]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.length > 0 ? (
              paginatedArticles.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                  onClick={() => handleReadBlog(post.slug)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = IDEA_BLOG_HEADER_PATH;
                      }}
                    />
                    <span className="absolute top-3 left-4 bg-blue-900 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
                      {post.category}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
                    <div className="mb-4">
                      <h5 className="text-lg font-playfair font-semibold mb-1 leading-snug group-hover:text-blue-900 transition-colors">
                        {post.title}
                      </h5>
                      <p className="text-sm text-gray-600 mb-5 mt-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                    <div className="border-t pt-3 mt-auto flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                      </div>
                      <span className="text-blue-900 font-medium group-hover:text-blue-700 transition-colors">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-600">
                {formattedBlogs.length === 0 ? 'No blogs available.' : 'No articles found for your search.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <section className="mt-2 mb-8 text-center px-4 sm:px-6 lg:px-12">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="inline-block bg-white text-black px-5 py-2 mb-10 border rounded hover:bg-[#09365d] hover:text-white transition-colors duration-300"
          >
            Load More Articles
          </button>
        </section>
      )}
    </div>
  );
}

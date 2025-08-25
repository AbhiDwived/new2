"use client"

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetBlogBySlugQuery, useGetAllBlogsQuery } from '@/features/blogs/blogsAPI';
<<<<<<< HEAD
import { Calendar, ArrowLeft, Tag, User } from 'lucide-react';
=======
import { Calendar, ArrowLeft, Clock, Tag, User } from 'lucide-react';
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
import DOMPurify from 'dompurify';
import Loader from "@/components/shared/Loader";

import AllBlogs from './AllBlogs';


export default function PublicBlogDetails() {
  const { slug } = useParams();
  const router = useRouter();
  
<<<<<<< HEAD
=======
  if (!slug) {
    return <AllBlogs />;
  }
  
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  // Get all blogs for fallback
  const { data: allBlogsData } = useGetAllBlogsQuery();
  
  const { data, isLoading, isError, error } = useGetBlogBySlugQuery(slug, {
    skip: !slug
  });
  
  // Find blog by matching title if slug API fails
  const matchingBlog = React.useMemo(() => {
    if (allBlogsData?.blogs && slug) {
      return allBlogsData.blogs.find(blog => {
        const generatedSlug = blog.title.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
        return generatedSlug === slug;
      });
    }
    return null;
  }, [allBlogsData, slug]);
  
  // Use matching blog if API is slow
  const blog = data?.blog || matchingBlog;

<<<<<<< HEAD
  // Add smooth scrolling for TOC links
=======
  // Add smooth scrolling for TOC links - MOVED BEFORE CONDITIONAL RETURNS
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  React.useEffect(() => {
    const handleTocClick = (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const tocContainer = document.querySelector('.toc-container');
    if (tocContainer) {
      tocContainer.addEventListener('click', handleTocClick);
      return () => tocContainer.removeEventListener('click', handleTocClick);
    }
  }, [blog]);

<<<<<<< HEAD
  if (!slug) {
    return <AllBlogs />;
  }

=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-md">
          <p className="text-red-700 font-medium">
            {error?.data?.message || "Blog not found"}
          </p>
          <button
            onClick={() => router.push('/blog')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // Build image URL
  let imageUrl;
  if (blog.featuredImage) {
    if (blog.featuredImage.startsWith('http')) {
      imageUrl = blog.featuredImage;
    } else {
      const baseUrl = (process.env.NEXT_PUBLIC_API_BACKEND || 'https://api.mybestvenue.com/api/v1').replace('/api/v1', '');
      imageUrl = `${baseUrl}${blog.featuredImage}`;
    }
  } else {
    imageUrl = 'https://via.placeholder.com/1200x600?text=No+Image';
  }

  // Generate table of contents from content
  const generateTOC = (content) => {
    if (!content) return [];
    
    const headings = content.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/g);
    if (!headings) return [];
    
    return headings.map((heading, index) => {
      const level = heading.match(/<h([2-6])/)[1];
      const text = heading.replace(/<[^>]*>/g, '');
      const id = `heading-${index}`;
      
      // Add ID to the heading in content
      content = content.replace(heading, heading.replace(/<h([2-6])/, `<h$1 id="${id}"`));
      
      return { level: parseInt(level), text, id };
    });
  };

  const toc = generateTOC(blog.content);
  const sanitizedContent = DOMPurify.sanitize(blog.content || '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </button>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {blog.category && (
              <span className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {blog.category}
              </span>
            )}
            {blog.author && (
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {blog.author}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {imageUrl && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          {toc.length > 0 && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg shadow-sm p-6 toc-container">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {toc.map((item, index) => (
                      <a
                        key={index}
                        href={`#${item.id}`}
                        className={`block text-sm hover:text-blue-600 transition-colors ${
                          item.level === 2 ? 'font-medium' : 'ml-4 text-gray-600'
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`${toc.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

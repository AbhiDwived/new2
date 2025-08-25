"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-900 via-black to-indigo-900 animate-[gradient-x_8s_ease_infinite] bg-[length:200%_200%] opacity-40"></div>

      {/* Big 404 */}
      <h1 className="relative text-[7rem] md:text-[12rem] font-extrabold tracking-widest text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]">
        404
      </h1>

      {/* Sub message */}
      <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-lg text-center">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition shadow-lg shadow-red-900/50"
        >
          Go Back
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-gray-600 hover:border-gray-300 transition"
        >
          Go Home
        </Link>
      </div>

      {/* Inline keyframes for gradient */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </main>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BACKEND || "https://api.mybestvenue.com/api/v1";

    return [
      { source: "/api/v1/admin/:path*", destination: `${backendUrl}/admin/:path*` },
      { source: "/api/v1/blog/:path*", destination: `${backendUrl}/blog/:path*` },
      { source: "/api/v1/vendor/:path*", destination: `${backendUrl}/vendor/:path*` },
      { source: "/api/v1/user/:path*", destination: `${backendUrl}/user/:path*` },
      { source: "/api/v1/auth/:path*", destination: `${backendUrl}/auth/:path*` },
      { source: "/api/v1/booking/:path*", destination: `${backendUrl}/booking/:path*` },
      { source: "/api/v1/reviews/:path*", destination: `${backendUrl}/reviews/:path*` },
      { source: "/api/v1/saved-vendors/:path*", destination: `${backendUrl}/saved-vendors/:path*` },
      { source: "/api/v1/activity/:path*", destination: `${backendUrl}/activity/:path*` },
      {
        source: "/api/reverse-geocode",
        destination: `${backendUrl.replace("/api/v1", "")}/reverse-geocode`,
      },
      {
        source: "/api/ip-location",
        destination: `${backendUrl.replace("/api/v1", "")}/ip-location`,
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true, // ✅ ignores TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ignores lint errors
  },
};

export default nextConfig;

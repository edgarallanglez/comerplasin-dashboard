
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google profile images
  },
  // Ensure we can use top-level await if needed, though usually automatic in App Router
};

export default nextConfig;

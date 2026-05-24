/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js needs unsafe-inline/unsafe-eval for its runtime hydration scripts
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data: https://cdn.sanity.io https://images.unsplash.com https://images.stripe.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  // Stripe Checkout opens in an iframe
  "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
  // API calls: Supabase (HTTPS + WSS), Stripe, Sanity
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.api.sanity.io https://*.apicdn.sanity.io",
].join("; ");

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Stop leaking referrer to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser feature APIs not needed by this site
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self https://checkout.stripe.com)" },
  // Force HTTPS for 2 years once deployed (omit in dev — browsers cache this header)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disable X-Powered-By (Next.js strips this automatically, belt-and-suspenders)
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig = {
  headers: async () => [
    {
      // Apply security headers to every route
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

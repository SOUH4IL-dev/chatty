/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {
    // By default Next.js inferred the root from C:\Users\pc\package-lock.json.
    // This enforces the current directory as the root.
    root: '.',
  },
};

export default nextConfig;

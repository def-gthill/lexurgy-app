import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMdx = createMDX({
  // Add markdown plugins here, as desired
});

export default withMdx(nextConfig);

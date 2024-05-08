import toc from "@jsdevtools/rehype-toc";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

function stableHeadingIds() {
  return function transformer(root) {
    return transformRecursive(root);
  };
}

function transformRecursive(node) {
  if (isHeading(node)) {
    const text = node.children[0];
    if (text.value.includes("|")) {
      const [newText, id] = text.value.split("|");
      return {
        ...node,
        properties: {
          ...node.properties,
          id,
        },
        children: [
          {
            ...text,
            value: newText,
          },
        ],
      };
    } else {
      return node;
    }
  } else if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => transformRecursive(child)),
    };
  } else {
    return node;
  }
}

function isHeading(node) {
  return (
    typeof node === "object" &&
    node.type === "element" &&
    "tagName" in node &&
    typeof node.tagName === "string" &&
    "properties" in node &&
    typeof node.properties === "object" &&
    "children" in node
  );
}

const withMdx = createMDX({
  options: {
    rehypePlugins: [stableHeadingIds, [toc, { headings: ["h2"] }]],
  },
});

export default withMdx(nextConfig);

import toc from "@jsdevtools/rehype-toc";
import createMDX from "@next/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName) &&
    "properties" in node &&
    typeof node.properties === "object" &&
    "children" in node
  );
}

function wrap() {
  return function transformer(root) {
    return {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "main",
          properties: {
            class: "md-main",
          },
          children: root.children,
        },
      ],
    };
  };
}

const withMdx = createMDX({
  options: {
    rehypePlugins: [
      stableHeadingIds,
      wrap,
      [toc, { headings: ["h2", "h3", "h4"], position: "beforebegin" }],
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
});

export default withMdx(nextConfig);

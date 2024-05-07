import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ children, href }) => <Link href={href!}>{children}</Link>,
    ...components,
  };
}

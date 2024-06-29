import Link from "next/link";
import { Fragment } from "react";
import styles from "./Breadcrumb.module.css";

export default function Breadcrumb({
  baseUrl,
  pathComponents,
}: {
  baseUrl: string;
  pathComponents: { name: string; path: string }[];
}) {
  const links = [];
  let base = baseUrl;
  for (const { name, path } of pathComponents) {
    base += "/" + path;
    links.push({ name, url: base });
  }
  return (
    <nav className={styles.root}>
      {links.map(({ name, url }, i) => (
        <Fragment key={name}>
          <Link className={styles.link} href={url}>
            {name}
          </Link>
          {i < links.length - 1 && <div>»</div>}
        </Fragment>
      ))}
    </nav>
  );
}

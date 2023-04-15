import styles from "@/styles/Header.module.css";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { signOut } from "next-auth/react";
import NextLink from "next/link";

export default function Header() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className={styles.NavigationMenuList}>
        <NavigationMenu.Item>
          <Link href="/">Lexurgy</Link>
          {/* <NavigationMenu.Link className={styles.NavigationMenuLink} href="/">
            Lexurgy
          </NavigationMenu.Link> */}
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={styles.NavigationMenuLink}
            href="https://github.com/def-gthill/lexurgy-app"
          >
            GitHub
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={styles.NavigationMenuLink}
            onSelect={() => {
              signOut();
            }}
          >
            Sign Out
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

function Link({ href, ...props }: { href: string; [index: string]: unknown }) {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <NavigationMenu.Link className={styles.NavigationMenuLink} {...props} />
    </NextLink>
  );
}

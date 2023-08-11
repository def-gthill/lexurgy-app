import styles from "@/styles/Header.module.css";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { signOut, useSession } from "next-auth/react";
import NextLink from "next/link";

export default function Header({
  links,
  active,
}: {
  links?: { label: string; url: string }[];
  active?: string;
}) {
  const session = useSession();
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className={styles.NavigationMenuList}>
        <div className={styles.leftGroup}>
          <NavigationMenu.Item>
            <Link href="/">Lexurgy</Link>
          </NavigationMenu.Item>
        </div>
        <div className={styles.centreGroup}>
          {links?.map(({ label, url }) => (
            <NavigationMenu.Item key={label}>
              <Link href={url} active={active === label}>
                {label}
              </Link>
            </NavigationMenu.Item>
          ))}
        </div>
        <div className={styles.rightGroup}>
          <NavigationMenu.Item>
            <NavigationMenu.Link
              className={styles.NavigationMenuLink}
              href="https://github.com/def-gthill/lexurgy-app"
            >
              GitHub
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            {session.data?.user ? (
              <NavigationMenu.Link
                className={styles.NavigationMenuLink}
                href="#"
                onSelect={() => {
                  signOut();
                }}
              >
                {session.data.user.name ??
                  session.data.user.email ??
                  "Sign Out"}
              </NavigationMenu.Link>
            ) : (
              <NavigationMenu.Link
                className={styles.NavigationMenuLink}
                href="/api/auth/signin?callbackUrl=%2Fsc"
              >
                {"Sign In"}
              </NavigationMenu.Link>
            )}
          </NavigationMenu.Item>
        </div>
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

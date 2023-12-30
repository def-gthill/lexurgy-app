import styles from "@/styles/Header.module.css";
import { User } from "@/user/User";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import NextLink from "next/link";
import { useEffect } from "react";
import { v4 as randomUUID } from "uuid";

export default function Header({
  links,
  active,
}: {
  links?: { label: string; url: string }[];
  active?: string;
}) {
  const session = useSession();
  useEffect(() => {
    const username = session.data?.user?.email;
    if (username) {
      axios.get("/api/users", { params: { username } }).then((res) => {
        const users = res.data as User[];
        if (users.length === 0) {
          axios.post("/api/users", { id: randomUUID(), username });
        }
      });
    }
  }, [session]);
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

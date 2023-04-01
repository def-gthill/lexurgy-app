import { signOut } from "next-auth/react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className={styles.NavigationMenuList}>
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

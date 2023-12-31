import getDriver, { execute } from "@/db";

export function register() {
  const driver = getDriver();
  const query = `CREATE CONSTRAINT uniqueUsers IF NOT EXISTS
  FOR (n:User)
  REQUIRE n.username IS UNIQUE
  `;
  execute(driver, query);
}

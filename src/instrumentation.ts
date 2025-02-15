import getDriver, { execute } from "@/db";

export async function register() {
  const driver = await getDriver();
  const query = `CREATE CONSTRAINT uniqueUsers IF NOT EXISTS
  FOR (n:User)
  REQUIRE n.username IS UNIQUE
  `;
  execute(driver, query);
}

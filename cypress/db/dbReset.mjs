import { getDriver, query } from "./setup.mjs";

const driver = getDriver();
query(driver, async (session) => {
  await session.run("MATCH (n) DETACH DELETE n");
});

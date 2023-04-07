import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config({ path: ".env.local" });

export function getDriver() {
  return neo4j.driver(
    process.env.NEO4J_URL || "",
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME || "",
      process.env.NEO4J_PASSWORD || ""
    )
  );
}

export async function query(driver, queryFunction) {
  const session = driver.session();
  try {
    await queryFunction(session);
  } finally {
    await session.close();
    driver.close();
  }
}

import neo4j, { Driver } from "neo4j-driver";

export default function getDriver(): Driver {
  return neo4j.driver(
    process.env.NEO4J_URL || "",
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME || "",
      process.env.NEO4J_PASSWORD || ""
    )
  );
}

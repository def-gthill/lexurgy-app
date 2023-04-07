import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const driver = neo4j.driver(
  process.env.NEO4J_URL || "",
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || "",
    process.env.NEO4J_PASSWORD || ""
  )
);

const session = driver.session();
try {
  const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";
  await session.run(
    `CREATE (:Language {id: $examplishUuid, name: 'Examplish'})`,
    { examplishUuid }
  );
} finally {
  await session.close();
  driver.close();
}

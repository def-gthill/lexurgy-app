import neo4j, { Driver, Neo4jError, Relationship } from "neo4j-driver";

let driver: Driver | null = null;

export default async function getDriver(): Promise<Driver> {
  if (driver) {
    return driver;
  }
  try {
    driver = await connectAndVerify();
    return driver;
  } catch {
    // Retry once, if the second try fails let the error propagate
    driver = await connectAndVerify();
    return driver;
  }
}

async function connectAndVerify(): Promise<Driver> {
  let driver: Driver | null = null;
  try {
    driver = connect();
    const serverInfo = await driver.getServerInfo();
    console.log("Connected to Neo4j");
    console.log(serverInfo);

    await ensureUniqueUserConstraint(driver);

    return driver;
  } catch (error) {
    if (error instanceof Neo4jError) {
      console.error(
        `Error connecting to Neo4j: ${error}\nCause: ${error.cause}`
      );
    } else {
      console.error(`Error connecting to Neo4j: ${error}`);
    }
    if (driver) {
      await driver.close();
    }
    throw error;
  }
}

function connect(): Driver {
  console.log("Creating a Neo4j driver");
  return neo4j.driver(
    process.env.NEO4J_URL || "",
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME || "",
      process.env.NEO4J_PASSWORD || ""
    ),
    { disableLosslessIntegers: true }
  );
}

async function ensureUniqueUserConstraint(driver: Driver) {
  const query = `CREATE CONSTRAINT uniqueUsers IF NOT EXISTS
  FOR (n:User)
  REQUIRE n.username IS UNIQUE
  `;
  await execute(driver, query);
}

export async function execute(
  driver: Driver,
  query: string,
  parameters?: Record<string, unknown>
): Promise<void> {
  const session = driver.session();
  try {
    await session.run(query, parameters);
  } finally {
    await session.close();
  }
}

export async function query<T>(
  driver: Driver,
  query: string,
  parameters?: Record<string, unknown>
): Promise<T[]> {
  const session = driver.session();
  try {
    const rawResult = await session.run(query, parameters);
    const finalResult = rawResult.records.map((record) => {
      if (record.length === 1) {
        return mapSingle(record.get(record.keys[0])) as T;
      } else {
        const result: Record<string, unknown> = {};
        for (const [key, value] of record.entries()) {
          result[key] = mapSingle(value);
        }
        return result as T;
      }
    });
    return finalResult;
  } finally {
    await session.close();
  }

  function mapSingle(record: unknown): unknown {
    if (record && typeof record === "object" && "properties" in record) {
      if (record instanceof Relationship) {
        return { type: record.type, ...record.properties };
      } else {
        return record.properties;
      }
    } else if (record && record instanceof Array) {
      const result = record.map(mapSingle);
      return result;
    } else if (record && typeof record === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(record)) {
        if (value !== null) {
          result[key] = mapSingle(value);
        }
      }
      return result;
    } else {
      return record;
    }
  }
}

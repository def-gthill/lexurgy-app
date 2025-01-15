import neo4j, { Driver, Relationship } from "neo4j-driver";

export default function getDriver(): Driver {
  console.log("Getting a Neo4j driver");
  return neo4j.driver(
    process.env.NEO4J_URL || "",
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME || "",
      process.env.NEO4J_PASSWORD || ""
    ),
    { disableLosslessIntegers: true }
  );
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

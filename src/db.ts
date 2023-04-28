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
    if (rawResult.records[0] && rawResult.records[0].keys.includes("tr")) {
      console.log("Printing now...");
      console.log(rawResult.records[0].get("tr").flatStructure.wordLimbs);
    }
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
      return record.properties;
    } else {
      return record;
    }
  }
}

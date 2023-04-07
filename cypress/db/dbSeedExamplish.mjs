import { getDriver, query } from "./setup.mjs";

const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";

const driver = getDriver();
query(driver, async (session) => {
  await session.run(
    `CREATE (:Language {id: $examplishUuid, name: 'Examplish'})`,
    { examplishUuid }
  );
});

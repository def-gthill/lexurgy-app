import { getDriver, query } from "./setup.mjs";

const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";
const consUuid = "8361bff7-57b8-461f-bb1a-c6109d070205";

const driver = getDriver();
query(driver, async (session) => {
  await session.run(
    `CREATE (lang:Language {id: $examplishUuid, name: 'Examplish'})
    CREATE (
      cons:Construction {
        id: $consUuid,
        name: 'Intransitive Clause',
        children: ['Subject', 'Verb']
      }
    ) -[:IS_IN]-> (lang)`,
    { examplishUuid, consUuid }
  );
});

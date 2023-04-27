import { getDriver, query } from "./setup.mjs";

const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";
const clauseUuid = "8361bff7-57b8-461f-bb1a-c6109d070205";
const phraseUuid = "6bc72dc1-6e25-4f55-acb5-a65678ff71e7";

const driver = getDriver();
query(driver, async (session) => {
  await session.run(
    `CREATE (lang:Language {id: $examplishUuid, name: 'Examplish'})
    CREATE (
      :Construction {
        id: $clauseUuid,
        name: 'Intransitive Clause',
        children: ['Subject', 'Verb']
      }
    ) -[:IS_IN]-> (lang)
    CREATE (
      :Construction {
        id: $phraseUuid,
        name: 'Noun Phrase',
        children: ['Det', 'Noun', 'Modifier']
      }
    ) -[:IS_IN]-> (lang)`,
    { examplishUuid, clauseUuid, phraseUuid }
  );
});

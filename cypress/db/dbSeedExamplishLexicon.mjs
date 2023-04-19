import { getDriver, query } from "./setup.mjs";

const examplishUuid = "b1365a98-00d1-4633-8e04-9c48259dd698";
const catUuid = "9f90fa14-ce68-480a-9d38-7eb0fd87aa81";
const sleepUuid = "0e8e7a3b-4458-4e61-af5a-97386a6076a8";

const driver = getDriver();
query(driver, async (session) => {
  await session.run(
    `MATCH (lang:Language {id: $examplishUuid})
    CREATE (cat:Lexeme {id: $catUuid, romanized: 'sha', pos: 'noun', definitions: ['cat']})
    CREATE (cat) -[:IS_IN]-> (lang)
    CREATE (sleep:Lexeme {id: $sleepUuid, romanized: 'dor', pos: 'verb', definitions: ['sleep']})
    CREATE (sleep) -[:IS_IN]-> (lang)`,
    { examplishUuid, catUuid, sleepUuid }
  );
});

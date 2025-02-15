import { RequestQuery } from "@/api";
import getDriver, { execute, query } from "@/db";
import { SavedLanguage } from "@/language/Language";
import LanguageAccess, { AccessType } from "@/language/LanguageAccess";
import { User } from "@/user/User";

export async function postLanguageAccess(
  access: LanguageAccess
): Promise<LanguageAccess> {
  const driver = await getDriver();
  await execute(
    driver,
    "MATCH (user:User {id: $userId}) -[rel]-> (lang:Language {id: $languageId}) DELETE rel",
    { userId: access.user.id, languageId: access.languageId }
  );
  const dbAccessType = dbAccessTypes.get(access.accessType);
  await execute(
    driver,
    `MATCH (user:User {id: $userId})
    MATCH (lang:Language {id: $languageId})
    CREATE (user) -[:${dbAccessType}]-> (lang)
    `,
    {
      userId: access.user.id,
      languageId: access.languageId,
    }
  );
  return access;
}

export async function getLanguageAccess(
  requestQuery: RequestQuery
): Promise<LanguageAccess[]> {
  const driver = await getDriver();
  const languageId = requestQuery.id as string;
  const queryResult = await query<{
    user: User;
    lang: SavedLanguage;
    rel: { type: string };
  }>(
    driver,
    `MATCH (user:User) -[rel]-> (lang:Language {id: $languageId})
    RETURN user, lang, rel`,
    { languageId }
  );
  return queryResult.map(({ user, lang, rel }) => ({
    user,
    languageId: lang.id,
    accessType: accessTypes.get(rel.type)!,
  }));
}

const accessTypes = new Map<string, AccessType>([
  ["OWNS", "owner"],
  ["CAN_EDIT", "writer"],
  ["CAN_VIEW", "reader"],
]);

const dbAccessTypes = new Map(
  [...accessTypes].map(([dbAccessType, accessType]) => [
    accessType,
    dbAccessType,
  ])
);

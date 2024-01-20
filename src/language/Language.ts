import { RequiredKeys } from "@/models/RequiredKeys";

export default interface Language {
  id?: string;
  worldId?: string;
  name: string;
}

export type SavedLanguage = RequiredKeys<Language, "id">;

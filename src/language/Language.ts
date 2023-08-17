import { RequiredKeys } from "@/models/RequiredKeys";

export default interface Language {
  id?: string;
  name: string;
}

export type SavedLanguage = RequiredKeys<Language, "id">;

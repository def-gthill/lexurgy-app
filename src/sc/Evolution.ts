import { RequiredKeys } from "@/models/RequiredKeys";

export default interface Evolution {
  id?: string;
  languageId?: string;
  soundChanges: string;
  testWords: string[];
}

export type EvolutionWithLanguageId = RequiredKeys<Evolution, "languageId">;

export type SavedEvolution = RequiredKeys<Evolution, "id" | "languageId">;

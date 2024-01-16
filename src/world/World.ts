import { RequiredKeys } from "@/models/RequiredKeys";

export default interface World {
  id?: string;
  name: string;
  description: string;
}

export type SavedWorld = RequiredKeys<World, "id">;

export function emptyWorld() {
  return { name: "", description: "" };
}

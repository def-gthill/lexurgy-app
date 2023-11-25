import { RequiredKeys } from "@/models/RequiredKeys";
import { v4 as randomUUID } from "uuid";

export function dropKeys<T>(object: T, keys: (keyof T)[]): T {
  const result = { ...object };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function addId<T extends { id?: string }>(
  object: T
): RequiredKeys<T, "id"> {
  return { id: object.id ?? randomUUID(), ...object };
}

import { User } from "@/user/User";

export default interface LanguageAccess {
  languageId: string;
  user: User;
  accessType: AccessType;
}

export type AccessType = "owner" | "writer" | "reader";

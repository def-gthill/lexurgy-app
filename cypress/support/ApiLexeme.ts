import { UserLexeme } from "./UserLexeme";

export default interface ApiLexeme extends UserLexeme {
  languageName: string;
}

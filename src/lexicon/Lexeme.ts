export default interface Lexeme {
  id?: string;
  languageId?: string;
  romanized: string;
  pos: string;
  definitions: string[];
}

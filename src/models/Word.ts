export default interface Word {
  id?: string;
  languageId?: string;
  word: string;
  pos: string;
  definitions: string[];
}

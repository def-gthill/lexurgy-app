export default interface UserTranslation {
  structure: UserStructure;
  translation: string;
}

export interface UserStructure {
  construction: string;
  children: [string, UserStructure | string][];
}

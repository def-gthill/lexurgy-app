import UserTranslation from "./UserTranslation";

export default interface ApiTranslation extends UserTranslation {
  languageName: string;
  romanized: string;
}

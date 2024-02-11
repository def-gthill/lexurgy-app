import Evolution from "@/sc/Evolution";

export default interface ScExampleWorld {
  id: string;
  name: string;
  description: string;
  languages: ScExampleLanguage[];
}

export interface ScExampleLanguage {
  id: string;
  name: string;
  evolution: Evolution;
}

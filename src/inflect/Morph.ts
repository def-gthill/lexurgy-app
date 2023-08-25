export interface Morph {
  stem: string;
  categories: string[];
  inflectedForm: string | null;
}

export function emptyMorph(): Morph {
  return {
    stem: "",
    categories: [],
    inflectedForm: null,
  };
}

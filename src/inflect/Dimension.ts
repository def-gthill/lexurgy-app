export interface Dimension {
  name: string;
  categories: string[];
}

export function emptyDimension(): Dimension {
  return {
    name: "",
    categories: [""],
  };
}

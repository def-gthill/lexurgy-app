export default interface InflectRequest {
  rules: InflectRequestRules;
  stemsAndCategories: { stem: string; categories: string[] }[];
}

export type InflectRequestRules = InflectRequestForm | InflectRequestSplit;

export interface InflectRequestForm {
  type: "form";
  form: string;
}

export interface InflectRequestSplit {
  type: "split";
  branches: Record<string, InflectRequestRules>;
}

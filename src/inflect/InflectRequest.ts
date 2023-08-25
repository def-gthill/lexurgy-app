export default interface InflectRequest {
  rules: { type: "form"; form: string };
  stemsAndCategories: { stem: string; categories: string[] }[];
}

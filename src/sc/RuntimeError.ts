export interface RuntimeError {
  rule?: string;
  originalWord?: string;
  currentWord?: string;
  message: string;
}

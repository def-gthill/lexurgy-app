export default interface Scv1Request {
  changes: string;
  inputWords: string[];
  traceWords: string[];
  startAt: string | null;
}

export interface UserSoundChangeInputs {
  inputWords: string[];
  changes: string;
  traceWords?: string[];
  turnOffTracing?: boolean;
  startAt?: string;
  stopBefore?: string;
}

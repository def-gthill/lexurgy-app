export interface UserSoundChangeInputs {
  inputWords: string[];
  changes: string;
  traceWords?: string[];
  turnOffTracing?: boolean;
  startAt?: string;
  turnOffStartAt?: boolean;
  stopBefore?: string;
  turnOffStopBefore?: boolean;
}

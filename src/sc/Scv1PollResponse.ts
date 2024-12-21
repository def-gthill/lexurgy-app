import Scv1Response from "@/sc/Scv1Response";

export type Scv1PollResponse =
  | { status: "working" }
  | { status: "done"; result: Scv1Response };

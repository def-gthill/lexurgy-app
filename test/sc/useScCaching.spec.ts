import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import { ScRun, runScWithCaching } from "@/sc/useScCaching";

describe("the SC cache", () => {
  it("preserves previously traced words if tracing is turned off for other words", async () => {
    const request: Scv1Request = {
      changes: "",
      inputWords: ["foo", "bar"],
      traceWords: ["bar"],
      startAt: null,
      stopBefore: null,
    };
    const result: Scv1Response = {
      ruleNames: ["myrule"],
      outputWords: ["fee"],
    };
    const lastRun: ScRun = {
      request: {
        changes: "",
        inputWords: ["foo", "bar"],
        traceWords: ["foo", "bar"],
        startAt: null,
        stopBefore: null,
      },
      result: {
        ruleNames: ["myrule"],
        outputWords: ["fee", "bir"],
        traces: {
          foo: [{ rule: "myrule", output: "faa" }],
          bar: [{ rule: "myrule", output: "ber" }],
        },
      },
    };

    const newResult = await runScWithCaching(request, lastRun, () =>
      Promise.resolve(result)
    );

    expect(newResult.traces).toEqual({
      bar: [{ rule: "myrule", output: "ber" }],
    });
  });
});

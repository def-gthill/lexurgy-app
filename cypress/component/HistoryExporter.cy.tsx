import { historiesToString } from "@/sc/HistoryExporter";
import { WordHistory, emptyHistory } from "@/sc/WordHistory";

describe("historiesToString", () => {
  it("produces a single newline if there are no histories", () => {
    const histories: WordHistory[] = [];

    const result = historiesToString(histories);

    expect(result).to.equal("\n");
  });

  it("produces lines containing only the input words if the histories are input-only", () => {
    const histories = [emptyHistory("foo"), emptyHistory("bar")];

    const result = historiesToString(histories);

    const lines = result.split("\n");
    expect(lines[0]).to.equal("foo");
    expect(lines[1]).to.equal("bar");
  });

  it("produces a single newline if inputs are turned off and histories are input-only", () => {
    const histories = [emptyHistory("foo"), emptyHistory("bar")];

    const result = historiesToString(histories, { includeInputWords: false });

    expect(result).to.equal("\n");
  });

  it("ends each line with an output word if present", () => {
    const histories = [
      createHistory({ outputWord: "foo" }),
      createHistory({ outputWord: "bar" }),
    ];

    const result = historiesToString(histories);

    const lines = result.split("\n");
    expect(lines[0]).to.match(/foo$/);
    expect(lines[1]).to.match(/bar$/);
  });

  it("puts an arrow in each line if there are output words", () => {
    const histories = [
      createHistory({ outputWord: "foo" }),
      createHistory({ outputWord: "bar" }),
    ];

    const result = historiesToString(histories);

    const lines = result.split("\n");
    expect(lines[0]).to.match(/ => /);
    expect(lines[1]).to.match(/ => /);
  });

  it("lines up the arrows if the input words are different lengths", () => {
    const histories = [
      createHistory({ inputWord: "short", outputWord: "foo" }),
      createHistory({ inputWord: "longlonglong", outputWord: "bar" }),
    ];

    const result = historiesToString(histories);

    const lines = result.split("\n");
    const arrowPositionLine1 = lines[0].indexOf("=>");
    expect(lines[1].indexOf("=>")).to.equal(arrowPositionLine1);
  });

  it("lines up the arrows visually even if input words have combining diacritics", () => {
    const histories = [
      createHistory({ inputWord: "plain", outputWord: "foo" }),
      createHistory({ inputWord: "díācrìtîc", outputWord: "bar" }),
    ];

    const result = historiesToString(histories);

    const lines = result.split("\n");
    const arrowPositionLine1 = lines[0].indexOf("=>");
    expect(lines[1].indexOf("=>")).to.equal(arrowPositionLine1 + 4);
  });

  it("produces lines containing only the input words if outputs are turned off", () => {
    const histories = [
      createHistory({ inputWord: "foo", outputWord: "faa" }),
      createHistory({ inputWord: "bor", outputWord: "bar" }),
    ];

    const result = historiesToString(histories, { includeOutputWords: false });

    const lines = result.split("\n");
    expect(lines[0]).to.equal("foo");
    expect(lines[1]).to.equal("bor");
  });

  it("produces lines containing only the output words if inputs are turned off", () => {
    const histories = [
      createHistory({ outputWord: "foo" }),
      createHistory({ outputWord: "bar" }),
    ];

    const result = historiesToString(histories, { includeInputWords: false });

    const lines = result.split("\n");
    expect(lines[0]).to.equal("foo");
    expect(lines[1]).to.equal("bar");
  });

  it("includes an intermediate stage if present", () => {
    const histories = [
      createHistory({ intermediates: new Map([["stage1", "foo"]]) }),
    ];

    const result = historiesToString(histories, {
      intermediateStageNames: ["stage1"],
    });

    const lines = result.split("\n");
    expect(lines[0]).to.match(/foo/);
  });

  it("includes only intermediate stages specified by intermediateStageNames", () => {
    const histories = [
      createHistory({
        intermediates: new Map([
          ["stage1", "foo"],
          ["stage2", "bar"],
        ]),
      }),
    ];

    const result = historiesToString(histories, {
      intermediateStageNames: ["stage2"],
    });

    const lines = result.split("\n");
    expect(lines[0]).to.match(/bar/);
    expect(lines[0]).not.to.match(/foo/);
  });

  it("leaves gaps where a history doesn't include a given stage", () => {
    const histories = [
      createHistory({
        intermediates: new Map([["stage1", "foo"]]),
        outputWord: "faa",
      }),
      createHistory({ outputWord: "bar" }),
    ];

    const result = historiesToString(histories, {
      intermediateStageNames: ["stage1"],
    });

    const lines = result.split("\n");
    expect(lines[1]).not.to.match(/=>.*?=>/);
  });

  function createHistory({
    inputWord,
    outputWord,
    intermediates,
  }: {
    inputWord?: string;
    outputWord?: string;
    intermediates?: Map<string, string>;
  }): WordHistory {
    return {
      inputWord: inputWord || "myInputWord",
      outputWord: outputWord || null,
      intermediates: intermediates || new Map(),
      tracing: false,
    };
  }
});

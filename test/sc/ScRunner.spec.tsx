import Evolution from "@/sc/Evolution";
import ScRunner from "@/sc/ScRunner";
import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("an SC runner", () => {
  function renderScRunner({
    evolution = { soundChanges: "", testWords: [] },
    importText = "",
    getRuleNames = () => Promise.resolve([]),
    runSoundChanges = () => Promise.resolve({ ruleNames: [], outputWords: [] }),
  }: {
    evolution?: Evolution;
    importText?: string;
    getRuleNames?: (changes: string) => Promise<string[]>;
    runSoundChanges?: (inputs: Scv1Request) => Promise<Scv1Response>;
  } = {}) {
    function MockImportButton({
      ariaLabel,
      sendData,
      text,
    }: {
      ariaLabel: string;
      sendData: (data: string) => void;
      text: string;
    }) {
      return (
        <button onClick={() => sendData(text)} aria-label={ariaLabel}>
          Import
        </button>
      );
    }
    return render(
      <ScRunner
        baseUrl={null}
        evolution={evolution}
        importButton={(ariaLabel, _, sendData) => (
          <MockImportButton
            ariaLabel={ariaLabel}
            sendData={sendData}
            text={importText}
          />
        )}
        getRuleNames={getRuleNames}
        runSoundChanges={runSoundChanges}
        validationIntervalSeconds={0.1}
      ></ScRunner>
    );
  }

  function uppercaser(): jest.Mock<Promise<Scv1Response>, [Scv1Request]> {
    return jest.fn(async (inputs) => ({
      ruleNames: ["foo"],
      outputWords: inputs.inputWords.map((input) => input.toUpperCase()),
    }));
  }

  async function toggleTracingOfWord(word: string) {
    await userEvent.click(
      within(
        screen.getByRole("cell", { name: word }).closest("tr")!
      ).getByLabelText("Trace")
    );
  }

  async function clickApply() {
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
  }

  async function expectRequestSent(
    runSoundChanges: jest.Mock,
    changes: string,
    inputWords: string[],
    { startAt }: { startAt?: string } = {}
  ) {
    const expectedProperties: Partial<Scv1Request> = { changes, inputWords };
    if (startAt) {
      expectedProperties.startAt = startAt;
    }
    expect(runSoundChanges).toHaveBeenCalledWith(
      expect.objectContaining(expectedProperties)
    );
  }

  it("has a sound change panel", () => {
    renderScRunner();
    expect(screen.getByText("Sound Changes")).toBeInTheDocument();
  });

  it("shows sound changes passed in the evolution prop", () => {
    renderScRunner({
      evolution: { soundChanges: "foo:\n  a => b", testWords: [] },
    });
    expect(screen.getByText("foo")).toBeVisible();
  });

  it("shows imported sound changes in the sound change panel", async () => {
    renderScRunner({ importText: "foo:\n  a => b" });
    await userEvent.click(
      screen.getByRole("button", { name: "Import Sound Changes" })
    );
    expect(screen.getByText("foo")).toBeVisible();
  });

  it("sends a sound change request when the user clicks Apply", async () => {
    const runSoundChanges = jest.fn();
    renderScRunner({ runSoundChanges });
    await clickApply();
    expectRequestSent(runSoundChanges, "", []);
  });

  it("remembers previous results instead of sending them again", async () => {
    const runSoundChanges = uppercaser();
    renderScRunner({
      evolution: { soundChanges: "", testWords: ["foo"] },
      runSoundChanges,
    });

    await clickApply();
    expectRequestSent(runSoundChanges, "", ["foo"]);
    await userEvent.type(screen.getByLabelText("Input Words"), "\nbar");
    await clickApply();
    expectRequestSent(runSoundChanges, "", ["bar"]);
    await userEvent.type(screen.getByLabelText("Input Words"), "\nbaz");
    await clickApply();
    expectRequestSent(runSoundChanges, "", ["baz"]);
  });

  it("displays the saved results alongside the new ones", async () => {
    const runSoundChanges = uppercaser();
    renderScRunner({
      evolution: { soundChanges: "", testWords: ["foo"] },
      runSoundChanges,
    });

    await clickApply();
    expectRequestSent(runSoundChanges, "", ["foo"]);
    expect(screen.getByText("FOO")).toBeVisible();
    await userEvent.type(screen.getByLabelText("Input Words"), "\nbar");
    await clickApply();
    expectRequestSent(runSoundChanges, "", ["bar"]);
    expect(screen.getByText("FOO")).toBeVisible();
    expect(screen.getByText("BAR")).toBeVisible();
  });

  it("displays the saved intermediate forms alongside the new ones", async () => {
    const runSoundChanges = jest.fn(
      async (inputs: Scv1Request): Promise<Scv1Response> => ({
        ruleNames: ["foo"],
        outputWords: inputs.inputWords.map((input) => input.toUpperCase()),
        intermediateWords: {
          lowercase: inputs.inputWords.map((input) => input.toLowerCase()),
        },
      })
    );
    renderScRunner({
      evolution: { soundChanges: "", testWords: ["Foo"] },
      runSoundChanges,
    });

    await clickApply();
    expect(screen.getByText("foo")).toBeVisible();
    await userEvent.type(screen.getByLabelText("Input Words"), "\nBar");
    await clickApply();
    expect(screen.getByText("foo")).toBeVisible();
    expect(screen.getByText("bar")).toBeVisible();
  });

  it("displays the saved traces alongside the new ones", async () => {
    const runSoundChanges = jest.fn(
      async (inputs: Scv1Request): Promise<Scv1Response> => ({
        ruleNames: ["foo"],
        outputWords: inputs.inputWords.map((input) => input.toUpperCase()),
        traces: Object.fromEntries(
          inputs.inputWords.map((input) => [
            input,
            [{ rule: "foo", output: input.toLowerCase() }],
          ])
        ),
      })
    );
    renderScRunner({
      evolution: { soundChanges: "", testWords: ["Foo"] },
      runSoundChanges,
    });

    await userEvent.click(screen.getByLabelText("Trace Changes"));
    await toggleTracingOfWord("Foo");
    await clickApply();
    expect(screen.getByText("foo")).toBeVisible();
    await userEvent.type(screen.getByLabelText("Input Words"), "\nBar");
    await toggleTracingOfWord("Bar");
    await clickApply();
    expect(screen.getByText("foo")).toBeVisible();
    expect(screen.getByText("bar")).toBeVisible();
  });

  it("forgets previous results as soon as the sound changes change", async () => {
    const runSoundChanges = uppercaser();
    renderScRunner({
      evolution: { soundChanges: "", testWords: ["foo"] },
      runSoundChanges,
    });

    await clickApply();
    expectRequestSent(runSoundChanges, "", ["foo"]);
    await userEvent.type(screen.getByLabelText("Sound Changes"), "bar");
    await clickApply();
    expectRequestSent(runSoundChanges, "bar", ["foo"]);
  });

  it("forgets previous results if any run settings change", async () => {
    const runSoundChanges = uppercaser();
    renderScRunner({
      evolution: { soundChanges: "", testWords: ["foo"] },
      getRuleNames: () => Promise.resolve(["bar"]),
      runSoundChanges,
    });

    await userEvent.type(screen.getByLabelText("Sound Changes"), "bar");
    await clickApply();
    expectRequestSent(runSoundChanges, "bar", ["foo"]);
    await userEvent.click(screen.getByLabelText("Start At Rule"));
    await waitFor(() =>
      userEvent.selectOptions(
        screen.getByLabelText("Choose Rule to Start At"),
        "Bar"
      )
    );
    await clickApply();
    expectRequestSent(runSoundChanges, "bar", ["foo"], { startAt: "bar" });
  });

  it("forgets specific rows where tracing is toggled", async () => {
    const runSoundChanges = uppercaser();
    renderScRunner({
      evolution: { soundChanges: "", testWords: ["foo", "bar"] },
      runSoundChanges,
    });

    await clickApply();
    expectRequestSent(runSoundChanges, "", ["foo", "bar"]);
    await userEvent.click(screen.getByLabelText("Trace Changes"));
    await toggleTracingOfWord("foo");
    await clickApply();
    expectRequestSent(runSoundChanges, "", ["foo"]);
  });
});

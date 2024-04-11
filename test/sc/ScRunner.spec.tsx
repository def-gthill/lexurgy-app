import ScRunner from "@/sc/ScRunner";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("an SC runner", () => {
  it("has a sound change panel", () => {
    render(
      <ScRunner
        baseUrl={null}
        evolution={{ soundChanges: "", testWords: [] }}
      ></ScRunner>
    );
    expect(screen.getByText("Sound Changes")).toBeInTheDocument();
  });

  it("shows sound changes passed in the evolution prop", () => {
    render(
      <ScRunner
        baseUrl={null}
        evolution={{ soundChanges: "foo:\n  a => b", testWords: [] }}
      ></ScRunner>
    );
    expect(screen.getByText("foo")).toBeVisible();
  });

  it("shows imported sound changes in the sound change panel", async () => {
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
    render(
      <ScRunner
        baseUrl={null}
        evolution={{ soundChanges: "", testWords: [] }}
        importButton={(ariaLabel, _, sendData) => (
          <MockImportButton
            ariaLabel={ariaLabel}
            sendData={sendData}
            text="foo:\n  a => b"
          />
        )}
      ></ScRunner>
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Import Sound Changes" })
    );
    expect(screen.getByText("foo")).toBeVisible();
  });
});

import HistoryTable from "@/sc/HistoryTable";
import { WordHistory, emptyHistory } from "@/sc/WordHistory";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("a history table", () => {
  it("lets the user turn on tracing on all words with one click", async () => {
    const setHistories = jest.fn();
    render(
      <HistoryTable
        histories={["foo", "bar", "baz"].map(emptyHistory)}
        tracing={true}
        setHistories={setHistories}
      />
    );

    await userEvent.click(screen.getByLabelText("Trace All"));
    expect(setHistories).toHaveBeenCalled();
    expect(
      setHistories.mock.calls[0][0].every(
        (history: WordHistory) => history.tracing
      )
    ).toBeTruthy();
  });

  it("lets the user turn off tracing on all words with one click", async () => {
    const setHistories = jest.fn();
    render(
      <HistoryTable
        histories={["foo", "bar", "baz"].map((word) => ({
          ...emptyHistory(word),
          tracing: true,
        }))}
        tracing={true}
        setHistories={setHistories}
      />
    );

    await userEvent.click(screen.getByLabelText("Trace All"));
    expect(setHistories).toHaveBeenCalled();
    expect(
      setHistories.mock.calls[0][0].every(
        (history: WordHistory) => !history.tracing
      )
    ).toBeTruthy();
  });
});

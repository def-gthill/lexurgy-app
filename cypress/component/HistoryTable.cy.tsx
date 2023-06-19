import HistoryTable from "@/sc/HistoryTable";
import { WordHistory, emptyHistory } from "@/sc/WordHistory";

describe("HistoryTable", () => {
  it("displays the input words", () => {
    cy.mount(
      <HistoryTable
        histories={[emptyHistory("foo"), emptyHistory("bar")]}
        setHistories={() => {}}
      />
    );
    cy.scInputWordsAre(["foo", "bar"]);
  });

  it("lets the user edit input words in Free Edit mode", () => {
    let savedHistories: WordHistory[] = [];
    function setHistories(histories: WordHistory[]) {
      savedHistories = histories;
    }
    cy.mount(<HistoryTable histories={[]} setHistories={setHistories} />);
    cy.scEnterFreeInputWords("foo\nbar").then(() => {
      expect(savedHistories.map((history) => history.inputWord)).to.deep.equal([
        "foo",
        "bar",
      ]);
    });
  });
});

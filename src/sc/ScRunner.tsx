import ExportButton from "@/components/ExportButton";
import ImportButton from "@/components/ImportButton";
import LabelledSwitch from "@/components/LabelledSwitch";
import Select from "@/components/Select";
import SplitPane from "@/components/SplitPane";
import Evolution from "@/sc/Evolution";
import HistoryExporter from "@/sc/HistoryExporter";
import HistoryTable from "@/sc/HistoryTable";
import ScCodeEditor from "@/sc/ScCodeEditor";
import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import ShareButton from "@/sc/ShareButton";
import { WordHistory, emptyHistory } from "@/sc/WordHistory";
import * as api from "@/sc/api";
import { toNiceName } from "@/sc/ruleName";
import useScState from "@/sc/useScState";
import useDebounced from "@/useDebounced";
import * as Label from "@radix-ui/react-label";
import { ReactElement, useEffect, useState } from "react";

export default function ScRunner({
  baseUrl,
  evolution,
  onUpdate,
  importButton = defaultImportButton,
  getRuleNames = api.getRuleNames,
  runSoundChanges = api.runSoundChanges,
  validationIntervalSeconds = 1,
}: {
  baseUrl: string | null;
  evolution: Evolution;
  onUpdate?: (evolution: Evolution) => void;
  importButton?: (
    ariaLabel: string,
    expectedFileType: string,
    sendData: (data: string) => void
  ) => ReactElement;
  getRuleNames?: (changes: string) => Promise<string[]>;
  runSoundChanges?: (inputs: Scv1Request) => Promise<Scv1Response>;
  validationIntervalSeconds?: number;
}) {
  const [initialSoundChanges, setInitialSoundChanges] = useState("");
  const [exporting, setExporting] = useState(false);

  const sendEvolution = useDebounced(updateEvolution, 1000);

  const sc = useScState(getRuleNames, runSoundChanges, {
    validationIntervalSeconds,
  });
  const setSoundChanges = sc.setSoundChanges;
  const setHistories = sc.setHistories;

  useEffect(() => {
    setInitialSoundChanges(evolution.soundChanges);
    setSoundChanges(evolution.soundChanges);
  }, [evolution.soundChanges, setSoundChanges]);
  useEffect(() => {
    setHistories(evolution.testWords.map(emptyHistory));
  }, [evolution.testWords, setHistories]);

  const testWords = sc.histories.map((history) => history.inputWord);

  const selectableRules = sc.ruleNames
    .filter((name) => !name.startsWith("<"))
    .map((name) => ({
      name: toNiceName(name),
      value: name,
    }));

  return (
    <div className="card">
      <SplitPane>
        <div
          style={{
            height: "38rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Label.Root style={{ fontWeight: "bold" }}>
              Sound Changes
            </Label.Root>
            <ScCodeEditor
              initialCode={initialSoundChanges}
              onUpdateCode={onEditSoundChanges}
              height="27rem"
            />
            <div id="status">{sc.error ?? sc.status}</div>
          </div>
          <div className="buttons">
            {importButton(
              "Import Sound Changes",
              ".lsc",
              (soundChanges: string) => {
                setInitialSoundChanges(soundChanges);
                onEditSoundChanges(soundChanges);
              }
            )}
            <ExportButton fileName="lexurgy.lsc" data={sc.soundChanges} />
            <a
              href="https://www.meamoria.com/lexurgy/html/sc-tutorial.html"
              target="_blank"
              rel="noopener"
              className="button"
            >
              Help
            </a>
            <a className="button" href="/sc/examples" target="_blank">
              Examples
            </a>
          </div>
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {exporting ? (
            <HistoryExporter
              histories={sc.histories}
              intermediateStageNames={sc.intermediateStageNames}
              onDone={() => setExporting(false)}
            />
          ) : (
            <div
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <HistoryTable
                key={sc.scRunToggle}
                intermediateStageNames={sc.intermediateStageNames}
                histories={sc.histories}
                tracing={sc.tracing}
                errors={sc.runtimeErrors}
                setHistories={onEditHistories}
              />
              <div className="buttons">
                {importButton("Import Input Words", ".wli", (data) => {
                  const inputWords = data.split(/[\r\n]+/);
                  onEditHistories(inputWords.map(emptyHistory));
                })}
                <button onClick={() => setExporting(true)}>Export</button>
              </div>
            </div>
          )}
        </div>
      </SplitPane>
      <hr />
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <div className="buttons">
            <button onClick={sc.runSc} className="big-button">
              Apply
            </button>
            <ShareButton
              baseUrl={baseUrl}
              soundChanges={sc.soundChanges}
              inputWords={testWords}
            />
          </div>
        </div>
        <div style={{ width: "50%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content max-content",
            }}
          >
            <LabelledSwitch
              id="trace-changes"
              label="Trace Changes"
              checked={sc.tracing}
              onCheckedChange={sc.setTracing}
            />
            <div />
            <LabelledSwitch
              id="start-at-enabled"
              label="Start At Rule"
              checked={sc.startAtEnabled}
              onCheckedChange={sc.setStartAtEnabled}
            />
            <Select
              id="start-at"
              ariaLabel="Choose Rule to Start At"
              disabled={!sc.startAtEnabled}
              options={selectableRules}
              currentSelection={sc.startAt ?? undefined}
              onChange={sc.setStartAt}
            ></Select>
            <LabelledSwitch
              id="stop-before-enabled"
              label="Stop Before Rule"
              checked={sc.stopBeforeEnabled}
              onCheckedChange={sc.setStopBeforeEnabled}
            />
            <Select
              id="stop-before"
              ariaLabel="Choose Rule to Stop Before"
              disabled={!sc.stopBeforeEnabled}
              options={selectableRules}
              currentSelection={sc.stopBefore ?? undefined}
              onChange={sc.setStopBefore}
            ></Select>
          </div>
        </div>
      </div>
    </div>
  );

  function onEditSoundChanges(newSoundChanges: string) {
    sc.setSoundChanges(newSoundChanges);
    sendEvolution({
      soundChanges: newSoundChanges,
      testWords,
    });
    sc.requestValidation(newSoundChanges);
  }

  function onEditHistories(newHistories: WordHistory[]) {
    setHistories(newHistories);
    sendEvolution({
      soundChanges: sc.soundChanges,
      testWords: newHistories.map((history) => history.inputWord),
    });
  }

  function updateEvolution(newEvolution: Evolution) {
    if (onUpdate) {
      onUpdate(newEvolution);
    }
  }
}

function defaultImportButton(
  ariaLabel: string,
  expectedFileType: string,
  sendData: (data: string) => void
) {
  return (
    <ImportButton
      ariaLabel={ariaLabel}
      expectedFileType={expectedFileType}
      sendData={sendData}
    />
  );
}

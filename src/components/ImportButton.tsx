import { FormEvent, useRef } from "react";

export default function ImportButton({
  label,
  expectedFileType,
  sendData,
}: {
  label?: string;
  expectedFileType: string;
  sendData: (fileContents: string) => void;
}) {
  const hiddenLoadButtonRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        className="button"
        type="file"
        accept={`text/*,.txt,${expectedFileType}`}
        ref={hiddenLoadButtonRef}
        style={{ display: "none" }}
        onInput={readFile}
      />
      <button className="button" onClick={promptForFile}>
        {label ?? "Import"}
      </button>
    </>
  );

  function promptForFile() {
    hiddenLoadButtonRef.current?.click();
  }

  async function readFile(event: FormEvent) {
    const selectedFiles = (event.target as HTMLInputElement).files;
    if (selectedFiles && selectedFiles.length > 0) {
      sendData(await selectedFiles[0].text());
    }
  }
}

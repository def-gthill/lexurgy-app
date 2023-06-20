export function ExportButton({
  label,
  fileName,
  data,
}: {
  label?: string;
  fileName: string;
  data: string;
}) {
  return (
    <button className="button" onClick={writeFile}>
      {label ?? "Export"}
    </button>
  );

  function writeFile() {
    const a = document.createElement("a");
    const file = new Blob([data], { type: "text/plain" });

    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(a.href);
  }
}

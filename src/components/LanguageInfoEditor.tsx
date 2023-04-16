import Language from "@/models/Language";
import * as Label from "@radix-ui/react-label";

export default function LanguageInfoEditor({
  language,
  onChange,
}: {
  language: Language;
  onChange: (newLanguage: Language) => void;
}) {
  return (
    <>
      <Label.Root htmlFor="name">Language Name</Label.Root>
      <input
        type="text"
        id="name"
        onChange={(event) =>
          onChange({ ...language, name: event.target.value })
        }
        value={language.name}
      ></input>
    </>
  );
}

import Language from "@/models/Language";
import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import Editor from "./Editor";

export default function LanguageInfoEditor({
  saveLanguage,
}: {
  saveLanguage: (language: Language) => void;
}) {
  const [name, setName] = useState("");
  return (
    <Editor
      onSave={() =>
        saveLanguage({
          name: name,
        })
      }
    >
      <Label.Root htmlFor="name">Language Name</Label.Root>
      <input
        type="text"
        id="name"
        onChange={(event) => setName(event.target.value)}
        value={name}
      ></input>
    </Editor>
  );
}

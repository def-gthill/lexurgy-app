import Construction from "@/models/Construction";
import Language from "@/models/Language";
import SyntaxNode from "@/models/SyntaxNode";
import Translation from "@/models/Translation";
import Word from "@/models/Word";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import useSWR from "swr";
import SyntaxTreeEditor from "./SyntaxTreeEditor";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function StructuredTranslationEditor({
  language,
  translation,
  onChange,
}: {
  language: Language;
  translation: Translation;
  onChange: (newTranslation: Translation) => void;
}) {
  const { data: constructions } = useSWR<Construction[], Error>(
    `/api/constructions?language=${language.id}`,
    fetcher
  );
  const syntaxTreeEditor = constructions ? (
    <SyntaxTreeEditor
      constructions={constructions}
      saveTree={(structure) =>
        onChange({
          ...translation,
          romanized: structureToRomanized(structure),
          structure: structure,
        })
      }
    />
  ) : (
    <div>No Constructions</div>
  );
  return (
    <>
      {!translation.structure && syntaxTreeEditor}
      <Label.Root htmlFor="translation">Free Translation</Label.Root>
      <input
        type="text"
        id="translation"
        onChange={(event) =>
          onChange({ ...translation, translation: event.target.value })
        }
        value={translation.translation}
      ></input>
    </>
  );

  function structureToRomanized(structure: SyntaxNode): string {
    const construction = constructions?.find(
      (cons) => cons.id === structure.nodeTypeId
    );
    if (construction) {
      return finishTranslation(
        construction.children
          .map((childName) => childToRomanized(structure.children[childName]))
          .join(" ")
      );
    } else {
      return finishTranslation(
        Object.values(structure.children).map(childToRomanized).join(" ")
      );
    }
  }

  function childToRomanized(child: SyntaxNode | Word): string {
    if ("romanized" in child) {
      return child.romanized;
    } else {
      return structureToRomanized(child);
    }
  }

  function finishTranslation(translation: string): string {
    return translation[0].toLocaleUpperCase() + translation.slice(1) + ".";
  }
}

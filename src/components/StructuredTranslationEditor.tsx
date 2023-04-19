import Construction from "@/models/Construction";
import Language from "@/models/Language";
import { structureToRomanized } from "@/models/SyntaxNode";
import Translation from "@/models/Translation";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import useSWR from "swr";
import Fields, { Field } from "./Fields";
import SyntaxTreeEditor from "./SyntaxTreeEditor";
import SyntaxTreeView from "./SyntaxTreeView";

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
    <div>
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
    </div>
  ) : (
    <div>No Constructions</div>
  );
  return (
    <>
      <Fields>
        <Label.Root htmlFor="structure">Structure</Label.Root>
        {translation.structure ? (
          <SyntaxTreeView root={translation.structure} />
        ) : (
          syntaxTreeEditor
        )}
        <Field
          id="translation"
          name="Free Translation"
          value={translation.translation}
          onChange={(value) => onChange({ ...translation, translation: value })}
        />
      </Fields>
    </>
  );
}

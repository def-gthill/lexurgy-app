import Construction from "@/models/Construction";
import Language from "@/models/Language";
import SyntaxNode from "@/models/SyntaxNode";
import Translation from "@/models/Translation";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";
import SyntaxTreeEditor from "./SyntaxTreeEditor";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function StructuredTranslationEditor({
  language,
  saveTranslation,
}: {
  language: Language;
  saveTranslation: (translation: Translation) => void;
}) {
  const [structure, setStructure] = useState<SyntaxNode | null>(null);
  const [translation, setTranslation] = useState("");
  const { data: constructions } = useSWR<Construction[], Error>(
    `/api/constructions?language=${language.id}`,
    fetcher
  );
  const syntaxTreeEditor = constructions ? (
    <SyntaxTreeEditor constructions={constructions} saveTree={setStructure} />
  ) : (
    <div>No Constructions</div>
  );
  return syntaxTreeEditor;
}

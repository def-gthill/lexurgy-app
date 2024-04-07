import { parser } from "@/sc/scParser";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { LRLanguage, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { classHighlighter, styleTags, tags } from "@lezer/highlight";
import { useEffect, useRef } from "react";

export default function CodeEditor({
  initialCode,
  onUpdateCode,
  height,
}: {
  initialCode?: string;
  onUpdateCode: (newCode: string) => void;
  height?: string;
}) {
  const editor = useRef<HTMLDivElement | null>(null);
  const view = useRef<EditorView | null>(null);
  // Prevents state variables used in onUpdateCode from being captured.
  const onUpdateCodeRef = useRef<(newCode: string) => void>(() => {});

  const createState = useRef((initialCode: string) => {
    const theme = EditorView.theme({
      "&": {
        height: height ?? null,
      },
    });

    const parserWithMetadata = parser.configure({
      props: [
        styleTags({
          Comment: tags.lineComment,
          ElementKw: tags.keyword,
          ClassKw: tags.keyword,
          FeatureKw: tags.keyword,
          FeatureModifier: tags.keyword,
          DiacriticKw: tags.keyword,
          DiacriticModifier: tags.keyword,
          SymbolKw: tags.keyword,
          KeywordPattern: tags.keyword,
          SyllableKw: tags.keyword,
          DeromanizerKw: tags.keyword,
          RomanizerKw: tags.keyword,
          LiteralKw: tags.keyword,
          BlockTypeKw: tags.keyword,
          KeywordModifier: tags.keyword,
          KeywordExpression: tags.keyword,
          Empty: tags.keyword,
          SylBoundary: tags.keyword,
          Boundary: tags.keyword,
          BetweenWords: tags.keyword,
          AnySyllable: tags.keyword,
          "PlusFeatureDecl!": tags.definition(tags.propertyName),
          "FullFeature/Name": tags.typeName,
          "FeatureVariable!": tags.typeName,
          "NullAlias!": tags.definition(tags.propertyName),
          "FullFeature/FeatureValue!": tags.definition(tags.propertyName),
          "PlusFeatureValue!": tags.propertyName,
          "FeatureValue!": tags.propertyName,
          "AbsentFeature!": tags.propertyName,
          "ElementDecl/Name": tags.definition(tags.variableName),
          "ClassDecl/Name": tags.definition(tags.variableName),
          "ElementRef!": tags.variableName,
          "CaptureRef!": tags.local(tags.variableName),
          "RuleName!": tags.className,
          BlockRef: tags.className,
          Anchor: tags.operator,
          InterfixType: tags.operator,
          "RepeaterType!": tags.operator,
          '=> "/" "//" "!"': tags.operator,
          "( ) [ ] { } , :": tags.punctuation,
        }),
      ],
    });

    const language = LRLanguage.define({
      parser: parserWithMetadata,
      languageData: {
        commentTokens: { line: "#" },
      },
    });

    const highlighter = classHighlighter;

    const onUpdate = EditorView.updateListener.of((v) => {
      onUpdateCodeRef.current(v.state.doc.toString());
    });

    return EditorState.create({
      doc: initialCode,
      extensions: [
        history(),
        keymap.of(historyKeymap),
        closeBrackets(),
        keymap.of(closeBracketsKeymap),
        keymap.of(defaultKeymap),
        lineNumbers(),
        language,
        syntaxHighlighting(highlighter),
        onUpdate,
        theme,
      ],
    });
  });

  useEffect(() => {
    onUpdateCodeRef.current = onUpdateCode;
  });

  useEffect(() => {
    if (!editor.current) {
      return;
    }

    const startState = createState.current("");

    view.current = new EditorView({
      state: startState,
      parent: editor.current,
    });

    return () => {
      view.current?.destroy();
    };
  }, []);

  useEffect(() => {
    view.current?.setState(createState.current(initialCode ?? ""));
  }, [initialCode]);

  return <div ref={editor}></div>;
}

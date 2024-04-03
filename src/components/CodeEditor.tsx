import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
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

    const onUpdate = EditorView.updateListener.of((v) => {
      onUpdateCodeRef.current(v.state.doc.toString());
    });

    return EditorState.create({
      doc: initialCode,
      extensions: [
        history(),
        keymap.of(historyKeymap),
        keymap.of(defaultKeymap),
        lineNumbers(),
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

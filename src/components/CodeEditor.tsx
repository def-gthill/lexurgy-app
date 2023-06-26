import { defaultKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { useEffect, useRef } from "react";

export default function CodeEditor({
  initialCode,
  onUpdateCode,
}: {
  initialCode?: string;
  onUpdateCode: (newCode: string) => void;
}) {
  const editor = useRef<HTMLDivElement | null>(null);
  const view = useRef<EditorView | null>(null);

  const onUpdate = useRef(
    EditorView.updateListener.of((v) => {
      onUpdateCode(v.state.doc.toString());
    })
  );

  useEffect(() => {
    if (!editor.current) {
      return;
    }

    const startState = EditorState.create({
      extensions: [keymap.of(defaultKeymap), lineNumbers(), onUpdate.current],
    });

    view.current = new EditorView({
      state: startState,
      parent: editor.current,
      extensions: [lineNumbers()],
    });

    return () => {
      view.current?.destroy();
    };
  }, []);

  useEffect(() => {
    view.current?.setState(
      EditorState.create({
        doc: initialCode,
        extensions: [keymap.of(defaultKeymap), lineNumbers(), onUpdate.current],
      })
    );
  }, [initialCode]);

  return <div ref={editor}></div>;
}

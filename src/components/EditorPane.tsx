import { ReactNode, createContext, useContext } from "react";

const EditorLevel = createContext(1);

export default function EditorPane({
  children,
  ...props
}: {
  children: ReactNode;
  [index: string]: unknown;
}) {
  const editorLevel = useContext(EditorLevel);
  const modLevel = ((editorLevel - 1) % 4) + 1;

  return (
    <div className={`editor editor${modLevel}`} {...props}>
      <EditorLevel.Provider value={editorLevel + 1}>
        {children}
      </EditorLevel.Provider>
    </div>
  );
}

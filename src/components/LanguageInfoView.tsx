import Language from "@/models/Language";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Label from "@radix-ui/react-label";
import Link from "next/link";
import { useState } from "react";
import Editor from "./Editor";
import LanguageInfoEditor from "./LanguageInfoEditor";

export default function LanguageInfoView({
  language,
  onUpdate,
  onDelete,
}: {
  language: Language;
  onUpdate?: (newLanguage: Language) => void;
  onDelete?: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editedLanguage, setEditedLanguage] = useState(language);
  const content = (
    <Link href={`/language/${language.id}`} style={{ flexGrow: 1 }}>
      {language.name}
    </Link>
  );
  if (onUpdate && editing) {
    return (
      <Editor
        component={(value, onChange) => (
          <LanguageInfoEditor language={value} onChange={onChange} />
        )}
        initialValue={editedLanguage}
        onSave={(value) => {
          setEditing(false);
          setEditedLanguage(value);
          onUpdate({ ...value, id: language.id });
        }}
      />
    );
  } else {
    return (
      <li className="card" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flexGrow: 1 }}>{content}</div>
        <div className="buttons">
          {onUpdate && <button onClick={() => setEditing(true)}>Edit</button>}
          {onDelete && (
            <DeleteLanguageConfirmDialog
              language={language}
              onDelete={onDelete}
            />
          )}
        </div>
      </li>
    );
  }
}

function DeleteLanguageConfirmDialog({
  language,
  onDelete,
}: {
  language: Language;
  onDelete: (id: string) => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="danger">Delete</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <AlertDialog.Title className="AlertDialogTitle">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">
            <p>
              This will permanently delete {language.name} and all its data.
              This cannot be undone.
            </p>
            <Label.Root htmlFor="confirm">
              Type the name of the language:
            </Label.Root>
            <input
              type="text"
              id="confirm"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
            />
          </AlertDialog.Description>
          <div className="buttons">
            <AlertDialog.Cancel asChild>
              <button>Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className="danger"
                disabled={
                  confirmText.toLocaleLowerCase() !==
                  language.name.toLocaleLowerCase()
                }
                onClick={() => onDelete(language.id!)}
              >
                Delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

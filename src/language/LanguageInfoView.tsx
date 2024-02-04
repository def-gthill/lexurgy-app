import Buttons from "@/components/Buttons";
import Editor from "@/components/Editor";
import Select from "@/components/Select";
import Language from "@/language/Language";
import World from "@/world/World";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Label from "@radix-ui/react-label";
import Link from "next/link";
import { useState } from "react";
import LanguageInfoEditor from "./LanguageInfoEditor";

export default function LanguageInfoView({
  language,
  worlds,
  onUpdate,
  onDelete,
}: {
  language: Language;
  worlds?: World[];
  onUpdate?: (newLanguage: Language) => void;
  onDelete?: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [moving, setMoving] = useState(false);
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

        {onUpdate && worlds && moving ? (
          <LanguageMover
            worlds={worlds}
            onSave={(world) => {
              setMoving(false);
              onUpdate({
                ...language,
                worldId: world.id,
              });
            }}
            onCancel={() => {
              setMoving(false);
            }}
          />
        ) : (
          <div className="buttons">
            {onUpdate && <button onClick={() => setEditing(true)}>Edit</button>}
            {onUpdate && worlds && worlds.length > 0 && (
              <button onClick={() => setMoving(true)}>Move</button>
            )}
            {onDelete && (
              <DeleteLanguageConfirmDialog
                language={language}
                onDelete={onDelete}
              />
            )}
          </div>
        )}
      </li>
    );
  }
}

function LanguageMover({
  worlds,
  onSave,
  onCancel,
}: {
  worlds: World[];
  onSave: (world: World) => void;
  onCancel: () => void;
}) {
  const [chosenWorld, setChosenWorld] = useState<World | null>(null);
  return (
    <>
      <Label.Root htmlFor="to-world">To World</Label.Root>
      <Select
        id="to-world"
        options={worlds.map((world) => ({
          name: world.name,
          value: world,
        }))}
        currentSelection={chosenWorld}
        onChange={setChosenWorld}
      />
      <Buttons
        buttons={[
          { label: "Save", onClick: () => onSave(chosenWorld!) },
          { label: "Cancel", onClick: onCancel },
        ]}
      />
    </>
  );
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

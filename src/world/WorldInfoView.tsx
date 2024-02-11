import Editor from "@/components/Editor";
import LabelledSwitch from "@/components/LabelledSwitch";
import World from "@/world/World";
import WorldInfoEditor from "@/world/WorldInfoEditor";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Label from "@radix-ui/react-label";
import Link from "next/link";
import { useState } from "react";

export default function WorldInfoView({
  world,
  onUpdate,
  onDelete,
  exampleSwitchEnabled = false,
}: {
  world: World;
  onUpdate?: (newWorld: World) => void;
  onDelete?: (id: string) => void;
  exampleSwitchEnabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editedWorld, setEditedWorld] = useState(world);
  const content = (
    <Link href={`/world/${world.id}`} style={{ flexGrow: 1 }}>
      {world.name}
    </Link>
  );
  if (onUpdate && editing) {
    return (
      <Editor
        component={(value, onChange) => (
          <WorldInfoEditor world={value} onChange={onChange} />
        )}
        initialValue={editedWorld}
        onSave={(value) => {
          setEditing(false);
          setEditedWorld(value);
          onUpdate({ ...value, id: world.id });
        }}
      />
    );
  } else {
    return (
      <li className="card" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flexGrow: 1 }}>{content}</div>
        {onUpdate && exampleSwitchEnabled && (
          <LabelledSwitch
            id="example"
            label="Example"
            checked={world.isExample ?? false}
            onCheckedChange={() => onUpdate({ ...world, isExample: true })}
          />
        )}
        <div className="buttons">
          {onUpdate && <button onClick={() => setEditing(true)}>Edit</button>}
          {onDelete && (
            <DeleteWorldConfirmDialog world={world} onDelete={onDelete} />
          )}
        </div>
      </li>
    );
  }
}

function DeleteWorldConfirmDialog({
  world,
  onDelete,
}: {
  world: World;
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
              This will permanently delete {world.name} and all its data. This
              cannot be undone.
            </p>
            <Label.Root htmlFor="confirm">
              Type the name of the world:
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
                  world.name.toLocaleLowerCase()
                }
                onClick={() => onDelete(world.id!)}
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

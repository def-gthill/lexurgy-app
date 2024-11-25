import FeatureHider from "@/components/FeatureHider";
import HiddenEditor from "@/components/HiddenEditor";
import Language, { SavedLanguage } from "@/language/Language";
import LanguageList from "@/language/LanguageList";
import usePersistentCollection from "@/usePersistentCollection";
import World, { SavedWorld, emptyWorld } from "@/world/World";
import WorldInfoEditor from "@/world/WorldInfoEditor";
import WorldInfoView from "@/world/WorldInfoView";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import axios from "axios";

export function Workspace() {
  const worldCollection = usePersistentCollection<World, SavedWorld>(
    "/api/worlds"
  );
  const languageCollection = usePersistentCollection<Language, SavedLanguage>(
    "/api/languages",
    "/api/languages?world=none"
  );

  const worldContent = worldCollection.fold({
    onLoading: () => <div>Loading worlds...</div>,
    onError: () => <div>Error loading worlds</div>,
    onReady: (worlds) => {
      worlds.sort((a, b) => a.name.localeCompare(b.name));
      return (
        <>
          <h2>Worlds</h2>
          <HiddenEditor
            showButtonLabel="New World"
            component={(value, onChange) => (
              <WorldInfoEditor world={value} onChange={onChange} />
            )}
            initialValue={emptyWorld()}
            onSave={(value) => worldCollection.save(value)}
          />
          {worlds.map((world) => (
            <FeatureHider
              key={world.id}
              getVisibleChild={async () => {
                const userType = (await axios.get("/api/userType")).data;
                return userType.hasAdminAccess ? 1 : 0;
              }}
            >
              <WorldInfoView world={world} onUpdate={worldCollection.save} />
              <WorldInfoView
                world={world}
                onUpdate={worldCollection.save}
                exampleSwitchEnabled
              />
            </FeatureHider>
          ))}
        </>
      );
    },
  });

  const languageContent = languageCollection.fold({
    onLoading: () => <div>Loading languages...</div>,
    onError: () => <div>Error loading languages</div>,
    onReady: (languages) => {
      languages.sort((a, b) => a.name.localeCompare(b.name));
      return (
        <LanguageList
          languages={languages}
          worlds={worldCollection.getOrEmpty()}
          onSave={languageCollection.save}
          onDelete={languageCollection.delete}
        />
      );
    },
  });

  return (
    <>
      <Disclaimer />
      <h1>My Workspace</h1>
      {worldContent}
      {languageContent}
    </>
  );
}

function Disclaimer() {
  return (
    <AlertDialog.Root defaultOpen={true}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <AlertDialog.Title className="AlertDialogTitle">
            Welcome to your Lexurgy workspace!
          </AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">
            <p>
              Now that you&apos;re signed in, you can save your sound changes in
              the cloud and access them from anywhere.
            </p>
            <p>
              <strong>
                This feature is experimental. Use it at your own risk. Be sure
                to make frequent backups.
              </strong>
            </p>
            <p>
              <strong>
                The developer can see anything you store here. This information
                will only be used to troubleshoot the application itself, but
                don&apos;t save anything you need to keep secret.
              </strong>
            </p>
          </AlertDialog.Description>
          <AlertDialog.Cancel asChild>
            <button>Accept</button>
          </AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

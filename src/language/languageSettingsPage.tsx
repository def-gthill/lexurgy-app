import EditorPane from "@/components/EditorPane";
import Fields, { Field } from "@/components/Fields";
import ListCard from "@/components/ListCard";
import { SavedLanguage } from "@/language/Language";
import LanguageAccess, { AccessType } from "@/language/LanguageAccess";
import LanguagePage from "@/language/LanguagePage";
import useDebounced from "@/useDebounced";
import usePersistentCollection from "@/usePersistentCollection";
import { User } from "@/user/User";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LanguageSettingsPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const accessCollection = usePersistentCollection<
    LanguageAccess,
    LanguageAccess
  >(`/api/languages/${id}/access`);

  const accessList = accessCollection.getOrEmpty();

  return (
    <LanguagePage
      activeLink="Settings"
      content={(language: SavedLanguage) => (
        <>
          <Head>
            <title>Lexurgy - {language.name} Settings</title>
            <meta
              name="description"
              content={`Settings for "${language.name}, a constructed language"`}
            />
          </Head>
          <main>
            <h1>{language.name} Settings</h1>
            <section>
              <h2>Access Control</h2>
              <GiveAccessEditor
                language={language}
                saveAccess={(access) => accessCollection.save(access)}
              />
              {accessList.map((access) => (
                <ListCard key={access.user.id}>
                  <div style={{ width: "20rem" }}>{access.user.username}</div>
                  <div style={{ textTransform: "uppercase" }}>
                    {accessTypeDisplay.get(access.accessType)}
                  </div>
                </ListCard>
              ))}
            </section>
          </main>
        </>
      )}
    />
  );
}

function GiveAccessEditor({
  language,
  saveAccess,
}: {
  language: SavedLanguage;
  saveAccess: (access: LanguageAccess) => void;
}) {
  const showButtonLabel = "Give Access";
  const initialValue = null;
  const [showing, setShowing] = useState(false);
  const [username, setUsername] = useState("");
  const [access, setAccess] = useState<LanguageAccess | null>(initialValue);
  const requestUser = useDebounced(getUser, 500);

  return showing ? (
    <EditorPane>
      <h4 style={{ marginTop: 0 }}>{showButtonLabel}</h4>
      <Fields>
        <Field
          id="username"
          name="Username"
          value={username ?? ""}
          onChange={async (newUsername) => {
            setUsername(newUsername);
            requestUser(newUsername);
          }}
        />
      </Fields>
      <div className="buttons">
        <button
          onClick={() => {
            saveAccess(access!);
            setShowing(false);
            setAccess(initialValue);
          }}
          disabled={!access}
        >
          Save
        </button>
        <button
          onClick={() => {
            setShowing(false);
          }}
        >
          Cancel
        </button>
      </div>
    </EditorPane>
  ) : (
    <div style={{ margin: "4px 0" }}>
      <button onClick={() => setShowing(true)}>{showButtonLabel}</button>
    </div>
  );

  async function getUser(username: string) {
    const users = await axios.get<User[]>("/api/users", {
      params: { username },
    });
    const user = users.data[0] ?? null;
    if (user) {
      if (access) {
        setAccess({ ...access, user });
      } else {
        setAccess({
          languageId: language.id,
          user,
          accessType: "owner",
        });
      }
    }
  }
}

const accessTypeDisplay = new Map<AccessType, string>([
  ["owner", "Owner"],
  ["writer", "Can Edit"],
  ["reader", "Can View"],
]);

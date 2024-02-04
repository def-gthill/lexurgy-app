import HiddenEditor from "@/components/HiddenEditor";
import Language, { SavedLanguage } from "@/language/Language";
import LanguageInfoEditor from "@/language/LanguageInfoEditor";
import LanguageInfoView from "@/language/LanguageInfoView";
import { SavedWorld } from "@/world/World";

export default function LanguageList({
  languages,
  worlds,
  onSave,
  onDelete,
}: {
  languages: SavedLanguage[];
  worlds?: SavedWorld[];
  onSave?: (newLanguage: Language) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <>
      <h2>Languages</h2>
      {onSave && (
        <HiddenEditor
          showButtonLabel="New Language"
          component={(value, onChange) => (
            <LanguageInfoEditor language={value} onChange={onChange} />
          )}
          initialValue={{ name: "" }}
          onSave={onSave}
        />
      )}
      {languages.map((language) => (
        <LanguageInfoView
          key={language.id}
          language={language}
          worlds={worlds}
          onUpdate={onSave}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

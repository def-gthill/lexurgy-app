import HiddenEditor from "@/components/HiddenEditor";
import Language, { SavedLanguage } from "@/language/Language";
import LanguageInfoEditor from "@/language/LanguageInfoEditor";
import LanguageInfoView from "@/language/LanguageInfoView";

export default function LanguageList({
  languages,
  onSave,
  onDelete,
}: {
  languages: SavedLanguage[];
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
          onUpdate={onSave}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

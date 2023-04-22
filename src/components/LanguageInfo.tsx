import Language from "@/models/Language";
import useLanguageInfo from "./useLanguageInfo";

export default function LanguageInfo({
  content,
}: {
  content: (language: Language) => JSX.Element;
}) {
  const { language, error } = useLanguageInfo();
  if (language !== undefined) {
    return content(language);
  } else if (error !== undefined) {
    return <div>Language not found</div>;
  } else {
    return <div>Loading language...</div>;
  }
}

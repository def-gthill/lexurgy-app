import Header from "./Header";

export type LanguageLink = "Main" | "Lexicon" | "Syntax";

export default function LanguageHeader({
  id,
  active,
}: {
  id: string;
  active: LanguageLink;
}) {
  return (
    <Header
      links={[
        { label: "Main", url: `/language/${id}` },
        { label: "Lexicon", url: `/language/${id}/lexicon` },
        { label: "Syntax", url: `/language/${id}/syntax` },
      ]}
      active={active}
    />
  );
}

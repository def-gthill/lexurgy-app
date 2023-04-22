import Header from "./Header";

export type LanguageLink = "Main" | "Lexicon";

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
      ]}
      active={active}
    />
  );
}

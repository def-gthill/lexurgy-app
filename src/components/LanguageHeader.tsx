import Header from "./Header";

export default function LanguageHeader({
  id,
  active,
}: {
  id: string;
  active: "Main" | "Lexicon";
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

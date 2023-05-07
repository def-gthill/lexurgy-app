import Header from "./Header";

export type LanguageLink = "Main" | "Lexicon" | "Syntax";

export default function LanguageHeader({
  id,
  active,
  glitchCount,
}: {
  id: string;
  active: LanguageLink;
  glitchCount?: number;
}) {
  const links = [
    { label: "Main", url: `/language/${id}` },
    { label: "Lexicon", url: `/language/${id}/lexicon` },
    { label: "Syntax", url: `/language/${id}/syntax` },
  ];
  if (glitchCount) {
    links.push({
      label: glitchCountLabel(glitchCount),
      url: `/language/${id}/breaches`,
    });
  }
  return <Header links={links} active={active} />;
}

function glitchCountLabel(breachCount: number): string {
  if (breachCount === 0) {
    return "No Breaches";
  } else if (breachCount === 1) {
    return "1 Breach";
  } else {
    return `${breachCount} Breaches`;
  }
}

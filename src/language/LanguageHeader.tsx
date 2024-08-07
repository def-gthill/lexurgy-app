import Header from "../components/Header";

export type LanguageLink =
  | "Main"
  | "Lexicon"
  | "Syntax"
  | "Evolution"
  | "Settings"
  | "Glitches";

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
    { label: "Evolution", url: `/language/${id}/sc` },
    { label: "Settings", url: `/language/${id}/settings` },
  ];
  if (glitchCount) {
    links.push({
      label: glitchCountLabel(glitchCount),
      url: `/language/${id}/glitches`,
    });
  }
  return <Header links={links} active={active} />;
}

export function glitchCountLabel(glitchCount: number): string {
  if (glitchCount === 0) {
    return "No Glitches";
  } else if (glitchCount === 1) {
    return "1 Glitch";
  } else {
    return `${glitchCount} Glitches`;
  }
}

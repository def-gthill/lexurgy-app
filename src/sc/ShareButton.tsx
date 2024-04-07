import copy from "copy-to-clipboard";
import { encode } from "js-base64";

export default function ShareButton({
  baseUrl,
  soundChanges,
  inputWords,
}: {
  baseUrl: string | null;
  soundChanges: string;
  inputWords: string[];
}) {
  return (
    <button onClick={share} className="big-button">
      Share
    </button>
  );

  function share() {
    const inputWordsEncoded = encode(inputWords.join("\n"), true);
    const soundChangesEncoded = encode(soundChanges, true);
    const url = `${
      baseUrl ?? "www.lexurgy.com"
    }/sc?changes=${soundChangesEncoded}&input=${inputWordsEncoded}`;
    copy(url);
    alert("Link copied to clipboard!");
  }
}

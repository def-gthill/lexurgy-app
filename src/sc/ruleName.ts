export function toNiceName(name: string): string {
  const [nameWithoutDetail, ...detail] = name.split("/");
  const words = nameWithoutDetail.split("-");
  words[0] = removeAngleBrackets(words[0]);
  if (words[0] === "cleanup") {
    return `${detail[1]
      .split("-")
      .map(uppercaseFirstLetter)
      .join(" ")} (Cleanup)`;
  } else {
    const result = words.map(uppercaseFirstLetter).join(" ");
    return result;
  }
}

function removeAngleBrackets(word: string): string {
  if (word.startsWith("<") && word.endsWith(">")) {
    return word.slice(1, -1);
  } else {
    return word;
  }
}

function uppercaseFirstLetter(word: string): string {
  return word.slice(0, 1).toLocaleUpperCase() + word.slice(1);
}

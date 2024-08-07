import { keys } from "@/map";
import { useEffect } from "react";

export default function Select<T>({
  id,
  ariaLabel,
  options,
  currentSelection,
  disabled,
  onChange,
  onOpen,
}: {
  id?: string;
  ariaLabel?: string;
  options: Option<T>[];
  currentSelection?: T;
  disabled?: boolean;
  onChange: (option: T) => void;
  onOpen?: () => void;
}) {
  const optionPairs: [string, T][] = options.map((option) =>
    typeof option === "string"
      ? [option, option as T]
      : [option.name, option.value as T]
  );
  const optionMap = new Map(optionPairs);
  const selected = currentSelection ?? optionPairs[0]?.[1];

  useEffect(() => {
    if (currentSelection === undefined || currentSelection === null) {
      onChange(selected);
    }
  });

  return (
    <select
      id={id}
      aria-label={ariaLabel}
      disabled={disabled}
      value={optionPairs.find(([_, option]) => option === selected)?.[0]}
      onChange={(event) => onChange(optionMap.get(event.target.value)!)}
      onFocus={onOpen}
    >
      {keys(optionMap).map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

type Option<T> = string | { name: string; value: T };

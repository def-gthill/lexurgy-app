import { keys } from "@/map";

export default function Select<T>({
  id,
  options,
  currentSelection,
  disabled,
  onChange,
  onOpen,
}: {
  id?: string;
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
  return (
    <select
      id={id}
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

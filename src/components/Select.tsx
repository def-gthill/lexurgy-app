import { keys } from "@/map";

export default function Select<T>({
  id,
  options,
  disabled,
  onChange,
  onOpen,
}: {
  id?: string;
  options: Option<T>[];
  disabled?: boolean;
  onChange: (option: T) => void;
  onOpen?: () => void;
}) {
  const optionMap = new Map(
    options.map((option) =>
      typeof option === "string"
        ? [option, option as T]
        : [option.name, option.value as T]
    )
  );
  return (
    <select
      id={id}
      disabled={disabled}
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

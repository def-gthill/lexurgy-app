import * as Schema from "@/components/Schema";

export default function SchematicEditor<T>({
  schema,
  value,
  onChange,
}: {
  schema: Schema.Schema<T>;
  value: T;
  onChange: (value: T) => void;
}) {
  return schema.editor(value, onChange);
}
